import { CONTAINER_TYPES } from '../constants/containerTypes';
import { ProductAttributes, BrandManufacturerInfo } from '../types';
import { ProjectScope, formatScopeForPrompt } from '../constants/projectScopes';
import {
  assembleStandardName,
  cleanPackAndSize,
  standardizeManufacturerName,
} from './validator';
import {
  AnalysisResult,
  ModelOption,
  SYSTEM_PROMPT,
  BRAND_MANUFACTURER_PROMPT,
  extractDomainFromUrl,
  fetchWikipediaBrandData,
} from './gemini';

export const DEFAULT_KIE_BASE_URL = 'https://api.kie.ai/openai/v1';

export const DEFAULT_KIE_MODELS: ModelOption[] = [
  { id: 'gpt-4o', name: 'GPT-4o (Multimodal Vision - High Precision)', description: 'Flagship OpenAI Vision model' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Ultra Fast & Efficient)', description: 'Lightweight OpenAI Vision model' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (via KIE AI)', description: 'High speed Google Vision' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (via KIE AI)', description: 'Deep reasoning Google Vision' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (via KIE AI)', description: 'Anthropic Vision model' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat (via KIE AI)', description: 'DeepSeek LLM' },
];

export function cleanKieBaseUrl(baseUrl?: string): string {
  const url = (baseUrl || '').trim() || DEFAULT_KIE_BASE_URL;
  return url.replace(/\/+$/, '');
}

/**
 * Fetch available models for the given KIE AI API key directly from KIE AI endpoint
 */
export async function fetchKieModels(
  apiKey: string,
  baseUrl: string = DEFAULT_KIE_BASE_URL
): Promise<ModelOption[]> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) return [];

  const root = cleanKieBaseUrl(baseUrl);
  try {
    const res = await fetch(`${root}/models`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`Could not list models from KIE AI (${res.status}): ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    if (list.length === 0) {
      return [];
    }

    return list.map((m: any) => {
      const id = m.id || m.name || String(m);
      return {
        id,
        name: id,
        description: m.owned_by ? `Owner: ${m.owned_by}` : 'KIE AI Model',
      };
    });
  } catch (err) {
    console.warn('Error fetching models from KIE AI:', err);
    return [];
  }
}

/**
 * Test a KIE AI API Key and discover supported models
 */
export async function testKieApiKey(
  apiKey: string,
  model: string = 'gpt-4o',
  baseUrl: string = DEFAULT_KIE_BASE_URL
): Promise<{ success: boolean; activeModel: string; availableModels: ModelOption[]; message: string }> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new Error('Please enter a KIE AI API Key first.');
  }

  const root = cleanKieBaseUrl(baseUrl);

  // 1. Fetch live models registered for this key
  const availableModels = await fetchKieModels(cleanKey, root);

  // Determine which model to test
  let targetModel = model.trim();
  if (availableModels.length > 0) {
    const exists = availableModels.some(m => m.id === targetModel);
    if (!exists) {
      // Pick first or a preferred vision model
      const preferred = availableModels.find(m =>
        /gpt-4o|gemini|vision|claude/i.test(m.id)
      );
      targetModel = preferred ? preferred.id : availableModels[0].id;
    }
  }

  // 2. Perform a test completion request
  const testPayload = {
    model: targetModel,
    messages: [
      {
        role: 'user',
        content: 'Say "OK" to verify API connection.',
      },
    ],
    max_tokens: 5,
  };

  const res = await fetch(`${root}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cleanKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testPayload),
  });

  const responseJson = await res.json().catch(() => ({}));

  if (!res.ok || responseJson?.error || (responseJson?.code && responseJson.code !== 200 && responseJson.code !== 0)) {
    const errMessage =
      responseJson?.error?.message ||
      responseJson?.msg ||
      responseJson?.message ||
      `HTTP ${res.status}: ${res.statusText}`;

    if (res.status === 401 || errMessage.toLowerCase().includes('unauthorized') || errMessage.toLowerCase().includes('key')) {
      throw new Error('Invalid KIE AI API Key. Please verify your key from kie.ai/api-key.');
    }
    if (res.status === 402 || errMessage.toLowerCase().includes('balance') || errMessage.toLowerCase().includes('quota') || errMessage.toLowerCase().includes('credit')) {
      throw new Error('KIE AI balance or credits exhausted. Please top up your account at kie.ai.');
    }
    throw new Error(`KIE AI verification failed: ${errMessage}`);
  }

  const modelCount = availableModels.length > 0 ? `${availableModels.length} models available` : 'Connected';
  return {
    success: true,
    activeModel: targetModel,
    availableModels,
    message: `KIE AI Key is valid! (${modelCount}, using: ${targetModel})`,
  };
}

/**
 * Execute chat completion with KIE AI with retry and fallback for response_format
 */
async function callKieChat(
  apiKey: string,
  root: string,
  payload: any
): Promise<Response> {
  let res = await fetch(`${root}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // If response_format error, retry without response_format
  if (!res.ok && payload.response_format) {
    const text = await res.clone().text().catch(() => '');
    if (text.includes('response_format') || text.includes('schema') || text.includes('not supported') || res.status === 400) {
      const fallbackPayload = { ...payload };
      delete fallbackPayload.response_format;
      res = await fetch(`${root}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackPayload),
      });
    }
  }

  return res;
}

/**
 * Analyze FMCG Product Image using KIE AI Multimodal Vision
 */
export async function analyzeProductImageWithKie(
  dataUrl: string,
  apiKey: string,
  modelName: string = 'gpt-4o',
  projectScope?: ProjectScope | null,
  baseUrl: string = DEFAULT_KIE_BASE_URL
): Promise<AnalysisResult> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new Error('KIE AI API Key is missing. Please configure your key in Settings.');
  }

  const root = cleanKieBaseUrl(baseUrl);

  let promptText = SYSTEM_PROMPT;
  if (projectScope && projectScope.rules && projectScope.rules.length > 0) {
    promptText += `\n\n### MANDATORY ACTIVE PROJECT SCOPE CLASSIFICATION:
Active Project Scope: "${projectScope.name}" (Client: ${projectScope.clientName}, Country: ${projectScope.country})
${formatScopeForPrompt(projectScope)}

CRITICAL PROJECT SCOPE INSTRUCTIONS:
Based on this product image and FMCG classification, you MUST match and assign the exact category attributes from this project scope:
1. "scopeCategory": Choose the matching 1st column Scope Category (e.g. "${projectScope.rules[0].scopeCategory}") or "Out of Scope" if none match.
2. "traxCategory": EXACT match for the 2nd column Trax Category from the matching rule (e.g. "${projectScope.rules[0].traxCategory}").
3. "clientCategory": EXACT match for the 3rd column Client Category from the matching rule (e.g. "${projectScope.rules[0].clientCategory}").
4. "smartL1": Choose the most specific and accurate Smart L1 item from the allowed Smart L1 list for the selected category (e.g. "${projectScope.rules[0].smartL1List[0]}").
5. "projectScopeName": "${projectScope.name}"`;
  }

  const requestPayload: any = {
    model: modelName,
    messages: [
      {
        role: 'system',
        content: promptText,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this product image according to the GSS ODA rules. Output ONLY the valid JSON object adhering strictly to the required schema:',
          },
          {
            type: 'image_url',
            image_url: {
              url: dataUrl,
            },
          },
        ],
      },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  };

  const response = await callKieChat(cleanKey, root, requestPayload);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message ||
      errorData?.msg ||
      errorData?.message ||
      `HTTP ${response.status}: ${response.statusText}`;

    if (response.status === 401 || message.includes('API_KEY') || message.includes('Unauthorized')) {
      throw new Error('Invalid KIE AI API Key. Please verify your key in Settings.');
    }
    if (response.status === 429) {
      throw new Error('KIE AI rate limit reached. Please wait a few seconds and try again.');
    }
    throw new Error(`KIE AI Vision Error: ${message}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error('No analysis generated from KIE AI Vision API.');
  }

  // Parse JSON response
  let parsed: any;
  try {
    const cleanJson = rawContent
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    throw new Error('Failed to parse KIE AI output into structured JSON format.');
  }

  // Normalize container type against allowed 49 GSS list
  let containerType = (parsed.containerType || 'None').trim();
  const matchedContainer = CONTAINER_TYPES.find(
    c => c.toLowerCase() === containerType.toLowerCase()
  );
  if (matchedContainer) {
    containerType = matchedContainer;
  } else {
    const partial = CONTAINER_TYPES.find(c =>
      containerType.toLowerCase().includes(c.toLowerCase())
    );
    containerType = partial || 'None';
  }

  const cleanedPackSize = cleanPackAndSize(
    parsed.subPackages,
    parsed.size,
    parsed.measurementUnit
  );

  let exactProductUrl = (parsed.exactProductUrl || '').trim();
  if (exactProductUrl && !/^https?:\/\//i.test(exactProductUrl)) {
    exactProductUrl = '';
  }

  // Project scope fields extraction and normalization
  let scopeCategory = (parsed.scopeCategory || '').trim();
  let traxCategory = (parsed.traxCategory || '').trim();
  let clientCategory = (parsed.clientCategory || '').trim();
  let smartL1 = (parsed.smartL1 || '').trim();
  let projectScopeName = (parsed.projectScopeName || (projectScope ? projectScope.name : '')).trim();

  // Normalize categories if a project scope is active
  if (projectScope && projectScope.rules && projectScope.rules.length > 0) {
    projectScopeName = projectScope.name;
    const ruleMatch =
      projectScope.rules.find(
        r =>
          (scopeCategory && r.scopeCategory.toLowerCase() === scopeCategory.toLowerCase()) ||
          (traxCategory &&
            clientCategory &&
            r.traxCategory.toLowerCase() === traxCategory.toLowerCase() &&
            r.clientCategory.toLowerCase() === clientCategory.toLowerCase()) ||
          (clientCategory && r.clientCategory.toLowerCase() === clientCategory.toLowerCase())
      ) ||
      projectScope.rules.find(r =>
        r.smartL1List.some(
          s =>
            smartL1 &&
            (s.toLowerCase() === smartL1.toLowerCase() ||
              smartL1.toLowerCase().includes(s.toLowerCase()))
        )
      );

    if (ruleMatch) {
      if (!scopeCategory || scopeCategory.toLowerCase() === 'out of scope') {
        scopeCategory = ruleMatch.scopeCategory;
      }
      traxCategory = ruleMatch.traxCategory;
      clientCategory = ruleMatch.clientCategory;

      const smartL1Match = ruleMatch.smartL1List.find(
        s =>
          smartL1 &&
          (s.toLowerCase() === smartL1.toLowerCase() ||
            smartL1.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(smartL1.toLowerCase()))
      );
      if (smartL1Match) {
        smartL1 = smartL1Match;
      }
    }
  }

  const attributes: ProductAttributes = {
    brand: (parsed.brand || '').trim(),
    subBrand: (parsed.subBrand || '').trim(),
    item: (parsed.item || '').trim(),
    flavorOrVariant: (parsed.flavorOrVariant || '').trim(),
    additionalWordings: (parsed.additionalWordings || '').trim(),
    containerType,
    subPackages: cleanedPackSize.subPackages,
    size: cleanedPackSize.size,
    measurementUnit: cleanedPackSize.measurementUnit,
    valuePacksDescription: (parsed.valuePacksDescription || '').trim(),
    exactProductUrl: exactProductUrl || undefined,
    projectScopeName: projectScopeName || undefined,
    scopeCategory: scopeCategory || undefined,
    traxCategory: traxCategory || undefined,
    clientCategory: clientCategory || undefined,
    smartL1: smartL1 || undefined,
  };

  const standardName = assembleStandardName(attributes);

  return {
    attributes,
    standardName,
    confidenceScore: parsed.confidenceScore ?? 94,
    exactProductUrl: exactProductUrl || undefined,
    projectScopeName: projectScopeName || undefined,
    scopeCategory: scopeCategory || undefined,
    traxCategory: traxCategory || undefined,
    clientCategory: clientCategory || undefined,
    smartL1: smartL1 || undefined,
    notes: parsed.notes || `Processed via KIE AI Vision (${modelName})`,
  };
}

/**
 * Searches for a brand's manufacturer and logo resources using KIE AI
 */
export async function lookupBrandWithKie(
  brandName: string,
  apiKey: string,
  modelName: string = 'gpt-4o',
  baseUrl: string = DEFAULT_KIE_BASE_URL
): Promise<BrandManufacturerInfo> {
  const cleanBrand = brandName.trim();
  if (!cleanBrand) {
    throw new Error('Please enter a Brand Name to search.');
  }

  const cleanKey = apiKey.trim();
  const root = cleanKieBaseUrl(baseUrl);

  // Fetch Wikipedia live knowledge base
  const wikiData = await fetchWikipediaBrandData(cleanBrand);
  const wikiContext = wikiData?.extract
    ? `\n[Live Reference from Wikipedia for "${cleanBrand}"]: ${wikiData.extract}`
    : '';

  const messages = [
    {
      role: 'system',
      content: `${BRAND_MANUFACTURER_PROMPT}${wikiContext}`,
    },
    {
      role: 'user',
      content: `Identify the Ultimate Parent Manufacturer and Logo resources for Brand: "${cleanBrand}". Return ONLY the required JSON object.`,
    },
  ];

  const response = await callKieChat(cleanKey, root, {
    model: modelName,
    messages,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message ||
      errorData?.msg ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`KIE AI Brand Intelligence Error: ${message}`);
  }

  const data = await response.json();
  const textOutput = data?.choices?.[0]?.message?.content;

  if (!textOutput) {
    throw new Error('No brand intelligence received from KIE AI.');
  }

  let parsed: any = {};
  try {
    const cleanJson = textOutput
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    throw new Error('Failed to parse KIE AI Brand response into structured JSON.');
  }

  const parentCompanyCandidate = (parsed.parentCompany || '').trim();
  const rawManufacturerCandidate = (parsed.rawManufacturerName || parsed.manufacturer || '').trim();

  let finalRawManufacturer = cleanBrand;
  if (parentCompanyCandidate && parentCompanyCandidate.toLowerCase() !== 'unknown') {
    finalRawManufacturer = parentCompanyCandidate;
  } else if (rawManufacturerCandidate && rawManufacturerCandidate.toLowerCase() !== 'unknown') {
    finalRawManufacturer = rawManufacturerCandidate;
  } else if (wikiData?.parentCompanyGuess) {
    finalRawManufacturer = wikiData.parentCompanyGuess;
  }

  const validationResult = standardizeManufacturerName(finalRawManufacturer);
  const standardizedManufacturerName =
    validationResult.standardized ||
    (parsed.standardizedManufacturerName || finalRawManufacturer).trim();
  const clarificationRuleApplied = validationResult.ruleApplied;

  const brandWebsite = parsed.brandWebsite || '';
  const manufacturerWebsite = parsed.manufacturerWebsite || '';
  const domainFromBrand = extractDomainFromUrl(brandWebsite);
  const domainFromMfg = extractDomainFromUrl(manufacturerWebsite);
  const primaryDomain =
    domainFromBrand ||
    domainFromMfg ||
    `${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  let logoUrl = (parsed.logoUrl || '').trim();
  if (!logoUrl || !/^https?:\/\//i.test(logoUrl) || logoUrl.includes('/v1/AUTH_mw/')) {
    logoUrl = wikiData?.imageUrl || `https://logo.clearbit.com/${primaryDomain}`;
  }

  let logoDownloadPageUrl = (parsed.logoDownloadPageUrl || '').trim();
  if (!logoDownloadPageUrl || !/^https?:\/\//i.test(logoDownloadPageUrl)) {
    logoDownloadPageUrl =
      wikiData?.pageUrl ||
      `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(cleanBrand + ' logo')}`;
  }

  const sources: Array<{ title: string; url: string }> = [
    {
      title: `Google Parent Search: ${cleanBrand}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(
        cleanBrand + ' parent company manufacturer'
      )}`,
    },
  ];

  if (wikiData?.pageUrl) {
    sources.push({
      title: `Wikipedia: ${wikiData.title || cleanBrand}`,
      url: wikiData.pageUrl,
    });
  }

  if (brandWebsite && /^https?:\/\//i.test(brandWebsite)) {
    sources.push({
      title: `Official Brand Site (${extractDomainFromUrl(brandWebsite)})`,
      url: brandWebsite,
    });
  }

  if (manufacturerWebsite && /^https?:\/\//i.test(manufacturerWebsite)) {
    sources.push({
      title: `Corporate Manufacturer Site (${extractDomainFromUrl(manufacturerWebsite)})`,
      url: manufacturerWebsite,
    });
  }

  return {
    id: `brand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    brandName: cleanBrand,
    rawManufacturerName: finalRawManufacturer,
    standardizedManufacturerName,
    clarificationRuleApplied,
    logoUrl,
    logoDownloadPageUrl,
    brandWebsite: brandWebsite || undefined,
    manufacturerWebsite: manufacturerWebsite || undefined,
    country: parsed.country || 'Global',
    industry: parsed.industry || 'Consumer Goods',
    parentCompany: parsed.parentCompany || finalRawManufacturer,
    description: parsed.description || wikiData?.extract || undefined,
    confidenceScore: parsed.confidenceScore ?? 96,
    notes: parsed.notes || `Grounded via KIE AI (${modelName}) & Wikipedia Live API`,
    sources,
    searchQueries: [
      `${cleanBrand} parent company manufacturer`,
      `${cleanBrand} brand owner`,
      `${cleanBrand} logo vector`,
    ],
    searchedAt: Date.now(),
  };
}
