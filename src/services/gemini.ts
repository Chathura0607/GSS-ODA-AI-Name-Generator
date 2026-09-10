import { CONTAINER_TYPES } from '../constants/containerTypes';
import { ProductAttributes, BrandManufacturerInfo } from '../types';
import { assembleStandardName, normalizeMeasurementUnit, cleanPackAndSize, standardizeManufacturerName } from './validator';


const SYSTEM_PROMPT = `You are an expert AI Operational Data Analyst (ODA) specialized in standardized Fast-Moving Consumer Goods (FMCG) and retail product cataloguing for GSS.

Analyze the uploaded product image and extract attributes with highest precision to generate the official Standard English Product Name according to the GSS ODA formula:

### GSS ODA Product Naming Formula:
[Brand] [Sub-Brand] [Item] [Attributes / Flavor] [Additional Wordings] [Container Type] [Sub Packages x Size Unit] [Value Packs description]

### Critical Business Rules:
1. Sub-Brand Duplication: If the Sub-Brand contains the Brand Name, do not duplicate the Brand in the final name.
2. Item (Product Type): Primary category (e.g. Hand Wash, Creaming Soda, Dry Ginger Ale, Chocolate, Biscuits, Toothpaste, Fruit Cordial, Gum, Strips, Single Malt Scotch Whisky).
3. Flavor / Variant / Scent: (e.g. Cucumber and Green Tea Scent, Wild Cherry Flavoured, Peppermint, Orange, Mint, Vanilla, Lemon, Original).
4. Additional Wordings: Functional packaging claims (e.g. "Flexible Fabric Breathable Water Repellent", "Sugarfree", "Refill", "No Sugar", "Antibacterial", "Zero Calories").
5. Characters: English letters and numbers (Alphanumeric) only. Do NOT use special symbols like #, $, %, @, &, -, /, +.
6. Length limit: Maximum 150 characters total.
7. Container Type: MUST be chosen STRICTLY from this exact list of 49 official GSS container types:
${CONTAINER_TYPES.join(', ')}
If none matches or it's unidentifiable, use "None" or the closest match like "Bottle", "Can", "Pack", "Pack Plastic", "Pack Carton", "Plastic Container", or "Cardboard Box".
8. Measurement Units (CRITICAL):
   - Metric volume & weight: Standardize to "ml", "l", "g", "kg", "cl", "oz".
   - Count-based items (pieces, strips, tablets, capsules, wipes, sheets, bags, pods, count): STRICTLY use "Units" (e.g. "60 Units", "21 Units", "100 Units", "50 Units").
9. Multi-Packs: If the product is a multi-pack (e.g. 6 cans of 250ml, 10 bottles of 375ml), set subPackages to "6 Pack" or "10 Pack", size to "250" or "375", and measurementUnit to "ml". The standard name will automatically format as "6 Pack x 250 ml", "10 Pack x 375 ml".
10. Value Packs & Limited Editions (MUST BE AT THE VERY END):
   - Any age statements, edition descriptors, or value pack claims (e.g. "18 Year Old Limited Edition", "Limited Edition", "Special Edition", "Collector Edition", "Value Pack", "3x Eco Refill", "Bonus Pack", "Buy 1 Get 1 Free") MUST be placed in "valuePacksDescription".
   - Example output: "Glenfiddich Single Malt Scotch Whisky Cardboard Box 700 ml 18 Year Old Limited Edition".
11. Cleanliness: Remove trailing packaging punctuation, marketing slogans, and ensure words are properly capitalized.
12. Exact Direct Product Web URL (CRITICAL REQUIREMENT):
   - Search the web for this exact product image (matching brand, variant, flavor, size, and packaging).
   - You MUST return the real, direct product listing web page URL where this exact product is hosted or sold online (e.g., https://snackje.com/products/monster-energy-ultra-vice-guava-500ml, https://onlinekade.lk/product/monster-energy-nas-ultra-fantasy-ruby-red-500ml/, https://www.liquorland.co.nz/smirnoff-vodka-crush-lemon-lime-57-4-pack-cans-440ml-857476, https://toongabbie.shop.supercellars.com.au/lines/cruiser-vanilla-cola-4-6-bottles, https://www.amazon.com.au/Coca-Cola-Drink-Multipack-Bottles-1-25L/dp/B07D8FP1YY, https://www.woolworths.com.au/shop/productdetails/938941/fanta-grape-zero-sugar-bottle, https://www.amazon.co.uk/Bic-Flex-3-Sensit-Blister-Unit/dp/B0B4WHHV8D, https://www.walmart.com/ip/Bic-Soleil-Bella-Disposable-Shavers-3-ea-Pack-of-6/378927583, https://www.tommy.hr/en-GB/proizvodi/pampers-sensitive-baby-wipes-80-pcs, https://gshop.lv/product/latviesu-lenor-professional-purple-bloom-velas-mikstinatajs-4-l/, or official brand/retailer shop link).
   - Place the full URL directly in "exactProductUrl".
   - Do NOT return a Google search link (such as https://www.google.com/search?q=...). Return the direct store/product page link.

You MUST return ONLY a valid JSON object with this exact structure:
{
  "brand": "Brand name, e.g. Dove, Cascade, Fanta, Mentos, Anchor, Stimorol, Elastoplast, Glenfiddich, Monster Energy, Vodka Cruiser, Coca-Cola",
  "subBrand": "Sub-brand if applicable, e.g. Moisturising, Ceda, Waves, Ultra",
  "item": "Product type, e.g. Hand Wash, Creaming Soda, Gum, Strips, Soft Drink, Energy Drink, Flavoured Vodka, Single Malt Scotch Whisky",
  "flavorOrVariant": "Flavor or scent, e.g. Vice Guava, Vanilla Cola, Wild Cherry Flavoured, Peppermint, Lemon Lime And Bitters",
  "additionalWordings": "Functional words, e.g. Sugarfree, Flexible Fabric Breathable Water Repellent, Refill, No Sugar",
  "containerType": "EXACT match from the 49 allowed GSS container types e.g. Plastic Container, Cardboard Box, Bottle, Can",
  "subPackages": "Pack count e.g. 6 Pack, 10 Pack, 12 Pack, 4 Pack, or empty",
  "size": "Number only e.g. 60, 21, 100, 250, 375, 500, 700, 1.5",
  "measurementUnit": "ml, l, g, kg, or Units (for pieces/strips/capsules/tablets)",
  "valuePacksDescription": "e.g. 18 Year Old Limited Edition, Value Pack, Special Edition, 3x eco-refill, or empty",
  "exactProductUrl": "Direct URL to the exact matching product page on the web (e.g. https://snackje.com/products/monster-energy-ultra-vice-guava-500ml or https://toongabbie.shop.supercellars.com.au/lines/cruiser-vanilla-cola-4-6-bottles)",
  "confidenceScore": integer between 0 and 100,
  "notes": "Brief reason for chosen container type and extracted fields"
}`;

export interface AnalysisResult {
  attributes: ProductAttributes;
  standardName: string;
  confidenceScore: number;
  exactProductUrl?: string;
  notes: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
}

// Fallback priority order of Gemini models
export const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.6-flash-latest',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
  'gemini-2.0-flash-exp',
];

/**
 * Fetch list of valid Gemini models directly from Google AI Studio API for the given key
 */
export async function fetchAvailableModels(apiKey: string): Promise<ModelOption[]> {
  if (!apiKey.trim()) return [];
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const models = data.models || [];
    return models
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => ({
        id: m.name.replace(/^models\//, ''),
        name: m.displayName || m.name.replace(/^models\//, ''),
        description: m.description || '',
      }));
  } catch (err) {
    console.warn('Could not list models from Google API:', err);
    return [];
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Execute Gemini Vision generateContent
 */
async function callGeminiVision(
  model: string,
  apiKey: string,
  requestBody: any
): Promise<Response> {
  const cleanModel = model.trim().replace(/^models\//, '');
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey.trim()}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
}

/**
 * Executes callGeminiVision with automatic exponential backoff on 429 Rate Limits
 */
async function callWithRetry(
  model: string,
  apiKey: string,
  requestBody: any,
  maxRetries: number = 3
): Promise<Response> {
  let delay = 2500;
  for (let i = 0; i <= maxRetries; i++) {
    const res = await callGeminiVision(model, apiKey, requestBody);
    if (res.status !== 429 || i === maxRetries) {
      return res;
    }
    console.warn(`Hit Gemini 429 (Rate Limit / Quota). Waiting ${delay}ms before retry ${i + 1}/${maxRetries}...`);
    await sleep(delay);
    delay = Math.min(delay * 2, 8000);
  }
  return callGeminiVision(model, apiKey, requestBody);
}

/**
 * Call Google Gemini Vision API to analyze product image with automatic model resolution, rate limit backoff, and fallback
 */
export async function analyzeProductImage(
  dataUrl: string,
  apiKey: string,
  modelName: string = 'gemini-3.6-flash'
): Promise<AnalysisResult> {
  if (!apiKey) {
    throw new Error(
      'Gemini API Key is missing. Please click the Settings icon in the top right to configure your Google Gemini API Key (it is free to obtain from Google AI Studio).'
    );
  }

  // Extract base64 and mime type from dataUrl
  const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid image format: must be a base64 image.');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  const buildRequestBody = (includeTools: boolean) => ({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text:
              SYSTEM_PROMPT +
              '\n\nPlease search for this exact product image online, identify the exact direct product URL, and output the JSON result now:',
          },
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    ...(includeTools ? { tools: [{ google_search: {} }] } : {}),
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  });

  // Primary attempt with Google Search grounding and retry on 429
  let requestBody = buildRequestBody(true);
  let response = await callWithRetry(modelName, apiKey, requestBody);

  // If tools or grounding returned an error (e.g. 400 or 429 grounding quota limit), retry without tools
  if (!response.ok && (response.status === 400 || response.status === 429)) {
    requestBody = buildRequestBody(false);
    response = await callWithRetry(modelName, apiKey, requestBody);
  }

  // If model is not found or deprecated, auto-discover working models from Google API
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || '';

    if (
      response.status === 404 ||
      message.includes('not found') ||
      message.includes('no longer available') ||
      message.includes('ListModels') ||
      message.includes('not supported')
    ) {
      // Auto-fetch models available for this API Key
      const available = await fetchAvailableModels(apiKey);
      const fallbackModel =
        available.find(m => m.id.includes('3.6') || m.id.includes('flash') || m.id.includes('gemini'))?.id ||
        (available.length > 0 ? available[0].id : null);

      if (fallbackModel && fallbackModel !== modelName.trim().replace(/^models\//, '')) {
        console.info(`Switching from ${modelName} to available model: ${fallbackModel}`);
        response = await callWithRetry(fallbackModel, apiKey, requestBody);
      } else {
        // Try candidate models in sequence
        for (const candidate of CANDIDATE_MODELS) {
          if (candidate === modelName.trim().replace(/^models\//, '')) continue;
          const retryRes = await callWithRetry(candidate, apiKey, requestBody);
          if (retryRes.ok) {
            response = retryRes;
            break;
          }
        }
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `API error (${response.status}: ${response.statusText})`;
    if (response.status === 400 && message.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API Key. Please verify your key in Settings.');
    }
    if (response.status === 429) {
      throw new Error('Google Free Tier rate limit reached (Too Many Requests). Please wait 5 seconds and click Retry.');
    }
    throw new Error(`Gemini API Error: ${message}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('No analysis generated from Gemini Vision API.');
  }

  // Parse JSON response
  let parsed: any;
  try {
    const cleanJson = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    throw new Error('Failed to parse AI output into structured JSON format.');
  }

  // Normalize container type against allowed list
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

  const cleanedPackSize = cleanPackAndSize(parsed.subPackages, parsed.size, parsed.measurementUnit);

  // Extract exact product URL from AI response or grounding metadata if available
  let exactProductUrl = (parsed.exactProductUrl || '').trim();
  const isGoogleSearchUrl = /google\.[a-z.]+\/search/i.test(exactProductUrl);

  if (!exactProductUrl || !/^https?:\/\//i.test(exactProductUrl) || isGoogleSearchUrl) {
    const groundingChunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(groundingChunks) && groundingChunks.length > 0) {
      // Prioritize direct retail store / brand product pages (non-google domain)
      const storeChunk = groundingChunks.find(
        (c: any) => c?.web?.uri && /^https?:\/\//i.test(c.web.uri) && !/google\.[a-z.]+/i.test(c.web.uri)
      );
      if (storeChunk?.web?.uri) {
        exactProductUrl = storeChunk.web.uri;
      } else {
        const firstWeb = groundingChunks.find((c: any) => c?.web?.uri && /^https?:\/\//i.test(c.web.uri));
        if (firstWeb?.web?.uri) {
          exactProductUrl = firstWeb.web.uri;
        }
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
  };

  const standardName = assembleStandardName(attributes);

  return {
    attributes,
    standardName,
    confidenceScore: parsed.confidenceScore ?? 92,
    exactProductUrl: exactProductUrl || undefined,
    notes: parsed.notes || '',
  };
}

/**
 * Quick validation of an API Key with model discovery and automatic fallback
 */
export async function testGeminiApiKey(
  apiKey: string,
  model: string = 'gemini-3.6-flash'
): Promise<{ success: boolean; activeModel: string; availableModels: ModelOption[] }> {
  const models = await fetchAvailableModels(apiKey);
  const cleanModel = model.trim().replace(/^models\//, '');

  let targetModel = cleanModel;
  if (models.length > 0 && !models.some(m => m.id === cleanModel)) {
    // Pick the best match from available models
    targetModel =
      models.find(m => m.id.includes('3.6') || m.id.includes('flash'))?.id || models[0].id;
  }

  const tryTest = async (modelToTest: string) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTest}:generateContent?key=${apiKey.trim()}`;
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });
  };

  let response = await tryTest(targetModel);

  // If failed with 404 or not found, try other candidate models
  if (!response.ok) {
    for (const candidate of CANDIDATE_MODELS) {
      if (candidate === targetModel) continue;
      const res = await tryTest(candidate);
      if (res.ok) {
        response = res;
        targetModel = candidate;
        break;
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Validation failed (${response.status})`);
  }

  return { success: true, activeModel: targetModel, availableModels: models };
}

const BRAND_MANUFACTURER_PROMPT = `You are a world-class Global FMCG, Retail, and Brand Intelligence expert for GSS Operational Data Analysts (ODA).

Analyze the requested Brand Name and identify its **Ultimate Parent Corporation / Parent Manufacturing Entity**, official Brand website, corporate Manufacturer website, and official high-resolution Logo download resources.

### CRITICAL RULE - ULTIMATE PARENT COMPANY:
- Always identify and return the **Ultimate Parent Company / Corporate Owner** as the primary Manufacturer entity.
- Do NOT return operating subsidiaries, local bottling units, sub-divisions, or distributor shell companies when an ultimate corporate parent owner exists.
- Canonical Examples:
  - "Glacéau" / "Smartwater" / "Vitaminwater" -> Parent: "The Coca-Cola Company" -> Standardized: "The Coca-Cola Co"
  - "Doritos" / "Lay's" / "Cheetos" / "Quaker" -> Parent: "PepsiCo Inc" -> Standardized: "PepsiCo Inc"
  - "Dove" / "Axe" / "Knorr" / "Hellmann's" / "Ben & Jerry's" -> Parent: "Unilever PLC" -> Standardized: "Unilever PLC"
  - "Cascade" / "Tide" / "Pampers" / "Gillette" / "Oral-B" -> Parent: "The Procter & Gamble Company" -> Standardized: "The Procter & Gamble Co"
  - "KitKat" / "Nescafe" / "Milo" / "Maggi" / "Purina" -> Parent: "Nestle SA" -> Standardized: "Nestle SA"
  - "Oreo" / "Cadbury" / "Ritz" / "Milka" / "Toblerone" -> Parent: "Mondelez International Inc" -> Standardized: "Mondelez International Inc"
  - "Monster Energy" -> Parent: "Monster Beverage Corporation" -> Standardized: "Monster Beverage Corp"
  - "Tru Blu" -> Parent: "Tru Blu Beverages Pty Ltd" -> Standardized: "Tru Blu Beverages Pty Ltd"
  - "Cargill Meat Solutions" -> Parent: "Cargill Meat Solutions Corporation" -> Standardized: "Cargill Meat Solutions Corp"
  - "Pets' Kitchen" -> Parent: "Pets' Kitchen" (no suffix -> "Pets' Kitchen")

### GSS Manufacturer Clarification (Step 01 Short Form) Rules:
- "Incorporated" -> "Inc"
- "Limited Liability Company" -> "LLC"
- "Limited Company" -> "LC"
- "Company" -> "Co"
- "Corporation" -> "Corp"
- "Cooperatives" / "Cooperative" -> "Coop"
- "Proprietary Limited" -> "Pty Ltd"
- "(P) Ltd" -> "Pvt Ltd"
- "S.P.A" / "Spa" -> "SPA"
- "B.V." -> "BV"
- "S.A." -> "SA"
- "S.A. DE C.V." -> "SA De CV"
- "A/S" -> "AS"
- "Srl" -> "SRL"
- "Gmbh" -> "GMBH"
- "PDTS" -> "Products"
- "MFG. CO" -> "Mfg Co"
- "L.P(Limited Partnership)" -> "LP"
- "Licensed Taxi Drivers' Association" -> "LTDA"
- If no company suffix exists (e.g. "Pets' Kitchen", "Norton Bros Fruit Farm"), keep the clean full original name.

### Logo & Download Website Requirements:
- "logoUrl": Direct high-resolution image URL (SVG or transparent PNG vector logo) of this brand from official CDN, brand website, or reliable asset library.
- "logoDownloadPageUrl": Direct website link where the logo or brand can be downloaded or viewed (e.g. Wikimedia Commons file/search page, WorldVectorLogo, Brands of the World, or official brand press/media kit).
- "brandWebsite": Official brand homepage URL (e.g. https://www.drinkglaceau.com, https://www.coca-cola.com, https://www.monsterenergy.com).
- "manufacturerWebsite": Official corporate parent manufacturer homepage URL (e.g. https://www.coca-colacompany.com, https://www.unilever.com).

You MUST return ONLY a valid JSON object with this exact format:
{
  "brandName": "Brand Name",
  "rawManufacturerName": "Full unshortened ultimate parent company legal entity name (e.g. The Coca-Cola Company)",
  "standardizedManufacturerName": "Standardized GSS name applying Step 01 rules (e.g. The Coca-Cola Co)",
  "logoUrl": "Direct high quality SVG or PNG logo image URL",
  "logoDownloadPageUrl": "Website link to download or view the logo",
  "brandWebsite": "https://...",
  "manufacturerWebsite": "https://...",
  "country": "Country of origin or headquarters",
  "industry": "Industry or FMCG category (e.g. Beverages, Confectionery, Personal Care)",
  "parentCompany": "Ultimate parent corporation (e.g. The Coca-Cola Company)",
  "operatingSubsidiary": "Operating subsidiary if applicable (e.g. Energy Brands)",
  "description": "1 concise sentence about the brand, products, and parent company",
  "confidenceScore": 95,
  "notes": "Context on parent manufacturer"
}`;

/**
 * Extracts the primary domain name from a URL (e.g. https://www.monsterenergy.com/en-us -> monsterenergy.com)
 */
export function extractDomainFromUrl(url?: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return '';
  }
}

/**
 * Searches for a brand's manufacturer and logo resources with automatic Google Search grounding and GSS clarification validation.
 */
export async function lookupBrandManufacturerAndLogo(
  brandName: string,
  apiKey: string,
  modelName: string = 'gemini-3.6-flash'
): Promise<BrandManufacturerInfo> {
  const cleanBrand = brandName.trim();
  if (!cleanBrand) {
    throw new Error('Please enter a Brand Name to search.');
  }

  if (!apiKey) {
    // Return offline mock/standardized result if API key is not configured
    const localClarification = standardizeManufacturerName(cleanBrand);
    const domainGuess = `${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    return {
      id: `brand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      brandName: cleanBrand,
      rawManufacturerName: cleanBrand,
      standardizedManufacturerName: localClarification.standardized,
      clarificationRuleApplied: localClarification.ruleApplied,
      logoUrl: `https://logo.clearbit.com/${domainGuess}`,
      logoDownloadPageUrl: `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(cleanBrand + ' logo')}`,
      brandWebsite: `https://www.${domainGuess}`,
      manufacturerWebsite: `https://www.${domainGuess}`,
      country: 'Global',
      industry: 'Consumer Goods',
      description: `Brand record for ${cleanBrand}`,
      confidenceScore: 70,
      notes: 'Generated offline. Configure Gemini API Key in Settings for live AI intelligence & direct logo downloads.',
      searchedAt: Date.now(),
    };
  }

  const buildRequestBody = (includeTools: boolean) => ({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${BRAND_MANUFACTURER_PROMPT}\n\nIdentify the Ultimate Parent Manufacturer and Logo resources for Brand: "${cleanBrand}"\nReturn JSON now:`,
          },
        ],
      },
    ],
    ...(includeTools ? { tools: [{ google_search: {} }] } : {}),
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  });

  let requestBody = buildRequestBody(true);
  let response = await callWithRetry(modelName, apiKey, requestBody);

  if (!response.ok && (response.status === 400 || response.status === 429)) {
    requestBody = buildRequestBody(false);
    response = await callWithRetry(modelName, apiKey, requestBody);
  }

  // Auto-discover model if 404
  if (!response.ok && response.status === 404) {
    const available = await fetchAvailableModels(apiKey);
    const fallbackModel =
      available.find(m => m.id.includes('3.6') || m.id.includes('flash') || m.id.includes('gemini'))?.id ||
      (available.length > 0 ? available[0].id : null);

    if (fallbackModel && fallbackModel !== modelName.trim().replace(/^models\//, '')) {
      response = await callWithRetry(fallbackModel, apiKey, requestBody);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `API error (${response.status}: ${response.statusText})`;
    throw new Error(`Gemini Brand Intelligence Error: ${message}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('No brand intelligence received from Gemini API.');
  }

  let parsed: any = {};
  try {
    const cleanJson = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    throw new Error('Failed to parse Brand AI output into structured format.');
  }

  // Priority: Always choose Ultimate Parent Company if present and valid
  const parentCompanyCandidate = (parsed.parentCompany || '').trim();
  const rawManufacturerCandidate = (parsed.rawManufacturerName || parsed.manufacturer || '').trim();

  let finalRawManufacturer = cleanBrand;
  if (parentCompanyCandidate && parentCompanyCandidate.toLowerCase() !== 'unknown') {
    finalRawManufacturer = parentCompanyCandidate;
  } else if (rawManufacturerCandidate && rawManufacturerCandidate.toLowerCase() !== 'unknown') {
    finalRawManufacturer = rawManufacturerCandidate;
  }

  // Run through our strict local GSS Manufacturer Clarification validator
  const validationResult = standardizeManufacturerName(finalRawManufacturer);
  const standardizedManufacturerName =
    validationResult.standardized || (parsed.standardizedManufacturerName || finalRawManufacturer).trim();
  const clarificationRuleApplied = validationResult.ruleApplied;

  // Domain resolution for logo fallback
  const brandWebsite = parsed.brandWebsite || '';
  const manufacturerWebsite = parsed.manufacturerWebsite || '';
  const domainFromBrand = extractDomainFromUrl(brandWebsite);
  const domainFromMfg = extractDomainFromUrl(manufacturerWebsite);
  const primaryDomain = domainFromBrand || domainFromMfg || `${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  // Determine logo URL with multi-source fallback
  let logoUrl = (parsed.logoUrl || '').trim();
  // Filter out unstable or problematic raw wikimedia upload URLs that tend to 404
  if (!logoUrl || !/^https?:\/\//i.test(logoUrl) || logoUrl.includes('/v1/AUTH_mw/')) {
    logoUrl = `https://logo.clearbit.com/${primaryDomain}`;
  }

  // Determine logo download page URL
  let logoDownloadPageUrl = (parsed.logoDownloadPageUrl || '').trim();
  if (!logoDownloadPageUrl || !/^https?:\/\//i.test(logoDownloadPageUrl)) {
    logoDownloadPageUrl = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(cleanBrand + ' logo')}`;
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
    description: parsed.description || undefined,
    confidenceScore: parsed.confidenceScore ?? 95,
    notes: parsed.notes || undefined,
    searchedAt: Date.now(),
  };
}


