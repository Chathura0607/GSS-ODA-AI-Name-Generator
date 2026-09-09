import { CONTAINER_TYPES } from '../constants/containerTypes';
import { ProductAttributes } from '../types';
import { assembleStandardName, normalizeMeasurementUnit, cleanPackAndSize } from './validator';

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

You MUST return ONLY a valid JSON object with this exact structure:
{
  "brand": "Brand name, e.g. Dove, Cascade, Fanta, Mentos, Anchor, Stimorol, Elastoplast, Glenfiddich",
  "subBrand": "Sub-brand if applicable, e.g. Moisturising, Ceda, Waves",
  "item": "Product type, e.g. Hand Wash, Creaming Soda, Gum, Strips, Soft Drink, Single Malt Scotch Whisky",
  "flavorOrVariant": "Flavor or scent, e.g. Wild Cherry Flavoured, Peppermint, Lemon Lime And Bitters",
  "additionalWordings": "Functional words, e.g. Sugarfree, Flexible Fabric Breathable Water Repellent, Refill, No Sugar",
  "containerType": "EXACT match from the 49 allowed GSS container types e.g. Plastic Container, Cardboard Box, Bottle, Can",
  "subPackages": "Pack count e.g. 6 Pack, 10 Pack, 12 Pack, 4 Pack, or empty",
  "size": "Number only e.g. 60, 21, 100, 250, 375, 700, 1.5",
  "measurementUnit": "ml, l, g, kg, or Units (for pieces/strips/capsules/tablets)",
  "valuePacksDescription": "e.g. 18 Year Old Limited Edition, Value Pack, Special Edition, 3x eco-refill, or empty",
  "confidenceScore": integer between 0 and 100,
  "notes": "Brief reason for chosen container type and extracted fields"
}`;

export interface AnalysisResult {
  attributes: ProductAttributes;
  standardName: string;
  confidenceScore: number;
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
 * Call Google Gemini Vision API to analyze product image with automatic model resolution and fallback
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

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: SYSTEM_PROMPT + '\n\nPlease analyze this product image and output the JSON result now:',
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
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  // Primary attempt
  let response = await callGeminiVision(modelName, apiKey, requestBody);

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
        response = await callGeminiVision(fallbackModel, apiKey, requestBody);
      } else {
        // Try candidate models in sequence
        for (const candidate of CANDIDATE_MODELS) {
          if (candidate === modelName.trim().replace(/^models\//, '')) continue;
          const retryRes = await callGeminiVision(candidate, apiKey, requestBody);
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
  };

  const standardName = assembleStandardName(attributes);

  return {
    attributes,
    standardName,
    confidenceScore: parsed.confidenceScore ?? 92,
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
