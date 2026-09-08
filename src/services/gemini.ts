import { CONTAINER_TYPES } from '../constants/containerTypes';
import { ProductAttributes } from '../types';
import { assembleStandardName } from './validator';

const SYSTEM_PROMPT = `You are an expert AI Operational Data Analyst (ODA) specialized in standardized Fast-Moving Consumer Goods (FMCG) and retail product cataloguing for GSS.

Analyze the uploaded product image and extract attributes to generate the Standard English Product Name according to the official GSS ODA rules:

### GSS ODA Product Naming Formula:
[Brand] [Sub-Brand] [Item] [Attributes / Flavor] [Additional Wordings] [Container Type] [Sub Packages] [Size and Measurement Unit(s)] [Value Packs description]

### Critical Business Rules:
1. Sub-Brand Duplication: If the Sub-Brand contains the Brand Name, do not duplicate the Brand in the final name.
2. Item: Indicates product type (e.g. Hand Wash, Creaming Soda, Dry Ginger Ale, Chocolate).
3. Value Packs / Additional Wordings: Specific attribute (e.g. "Special edition", "3x eco-refill", "No Sugar", "Genuine Refreshments", "Refill").
4. Characters: English letters and numbers (Alphanumeric) only. Do NOT use special symbols like #, $, %, @, &.
5. Length limit: Maximum 150 characters total.
6. Container Type: MUST be chosen STRICTLY from this exact list of 49 official GSS container types:
${CONTAINER_TYPES.join(', ')}
If none matches or it's unidentifiable, use "None" or the closest match like "Bottle", "Can", "Pack", "Pack Plastic", "Pack Carton", or "Pouch".
7. Measurement Units: Normalize units consistently (e.g. "ml", "l", "g", "kg", "cl", "oz").

You MUST return ONLY a valid JSON object with this exact structure:
{
  "brand": "Brand name, e.g. Dove, Cascade, Fanta, Mentos",
  "subBrand": "Sub-brand if applicable, e.g. Moisturising, Ceda",
  "item": "Product type, e.g. Hand Wash, Creaming Soda, Ginger Ale, Chocolate",
  "flavorOrVariant": "Flavor or scent, e.g. Cucumber and Green Tea Scent, Orange, Mint",
  "additionalWordings": "Additional words on packaging, e.g. Refill, No Sugar, Refreshing",
  "containerType": "EXACT match from the 49 allowed GSS container types",
  "subPackages": "Pack count e.g. 12 Pack, 4 Pack, 8 Mini Cans, or empty",
  "size": "Number only or combined e.g. 750, 300, 200",
  "measurementUnit": "Standardized unit e.g. ml, l, g, kg",
  "valuePacksDescription": "e.g. 3x eco-refill, Value Pack, Special Edition, or empty",
  "confidenceScore": integer between 0 and 100,
  "notes": "Brief reason for chosen container type and extracted fields"
}`;

export interface AnalysisResult {
  attributes: ProductAttributes;
  standardName: string;
  confidenceScore: number;
  notes: string;
}

/**
 * Call Google Gemini Vision API to analyze product image
 */
export async function analyzeProductImage(
  dataUrl: string,
  apiKey: string,
  modelName: string = 'gemini-2.0-flash'
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

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;

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

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

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
    // Strip markdown code fences if present
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
    // Fallback search
    const partial = CONTAINER_TYPES.find(c =>
      containerType.toLowerCase().includes(c.toLowerCase())
    );
    containerType = partial || 'None';
  }

  const attributes: ProductAttributes = {
    brand: (parsed.brand || '').trim(),
    subBrand: (parsed.subBrand || '').trim(),
    item: (parsed.item || '').trim(),
    flavorOrVariant: (parsed.flavorOrVariant || '').trim(),
    additionalWordings: (parsed.additionalWordings || '').trim(),
    containerType,
    subPackages: (parsed.subPackages || '').trim(),
    size: (parsed.size || '').trim(),
    measurementUnit: (parsed.measurementUnit || '').trim(),
    valuePacksDescription: (parsed.valuePacksDescription || '').trim(),
  };

  const standardName = assembleStandardName(attributes);

  return {
    attributes,
    standardName,
    confidenceScore: parsed.confidenceScore ?? 90,
    notes: parsed.notes || '',
  };
}

/**
 * Quick validation of an API Key
 */
export async function testGeminiApiKey(apiKey: string, model: string = 'gemini-2.0-flash'): Promise<boolean> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Hello, reply with OK if alive.' }] }],
      generationConfig: { maxOutputTokens: 5 },
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Validation failed (${response.status})`);
  }
  return true;
}
