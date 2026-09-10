import { CONTAINER_TYPES, ContainerType } from '../constants/containerTypes';
import { ProductAttributes } from '../types';

/**
 * Normalizes measurement units:
 * - Count-based items (pieces, strips, tablets, capsules, wipes, bags, etc.) are standardized to 'Units'.
 * - Metric/Volume/Mass units (ml, l, g, kg, cl, oz) are standardized to clean lowercase.
 */
export function normalizeMeasurementUnit(rawUnit: string): string {
  if (!rawUnit) return '';
  const trimmed = rawUnit.trim();
  const lower = trimmed.toLowerCase();

  // Count items / Non-volume / Non-mass units -> strictly "Units"
  if (
    /^(pieces?|pcs|strips?|tablets?|capsules?|wipes?|sheets?|bags?|tea\s*bags?|pods?|units?|count|ct|chews?|lozenges?|sticks?|rolls?|items?|pills?)$/i.test(
      lower
    )
  ) {
    return 'Units';
  }

  // Volume and Weight units
  if (/^(ml|milliliters?|millilitres?)$/i.test(lower)) return 'ml';
  if (/^(l|liters?|litres?)$/i.test(lower)) return 'l';
  if (/^(g|grams?)$/i.test(lower)) return 'g';
  if (/^(kg|kilograms?|kilos?)$/i.test(lower)) return 'kg';
  if (/^(cl|centiliters?|centilitres?)$/i.test(lower)) return 'cl';
  if (/^(fl\s*oz|fluid\s*ounces?)$/i.test(lower)) return 'fl oz';
  if (/^(oz|ounces?)$/i.test(lower)) return 'oz';
  if (/^(lb|lbs|pounds?)$/i.test(lower)) return 'lb';

  return trimmed;
}

/**
 * Intelligently cleans and normalizes multi-pack and size attributes:
 * - Formats multi-packs: subPackages = "6 Pack", size = "250", unit = "ml"
 * - Handles cases where AI places "6 Pack x 250 ml" or "10 x 375 ml" into size or subPackages
 * - Normalizes standalone counts to "N Pack"
 * - Standardizes count items (pieces, strips, tablets, capsules) to "Units"
 */
export function cleanPackAndSize(
  rawSubPackages?: string,
  rawSize?: string,
  rawUnit?: string
): { subPackages: string; size: string; measurementUnit: string } {
  let subPackages = (rawSubPackages || '').trim();
  let size = (rawSize || '').trim();
  let unit = normalizeMeasurementUnit(rawUnit || '');

  // 1. Check if size contains a multi-pack expression (e.g. "6 Pack x 250 ml", "10 x 375 ml", "6x250ml", "10 Pack 375 ml")
  const multiPackInSize =
    size.match(/^([0-9]+)\s*(?:Pack|Pk|Cans?|Bottles?|Bags?|Tins?|x|X|×)?\s*(?:[xX×])\s*([0-9.]+)\s*([a-zA-Z]+)?$/i) ||
    size.match(/^([0-9]+)\s+(?:Pack|Pk|Cans?|Bottles?)\s+([0-9.]+)\s*([a-zA-Z]+)?$/i);

  if (multiPackInSize) {
    const packCount = multiPackInSize[1];
    const unitSize = multiPackInSize[2];
    const unitName = multiPackInSize[3] ? normalizeMeasurementUnit(multiPackInSize[3]) : unit;

    subPackages = `${packCount} Pack`;
    size = unitSize;
    if (unitName) unit = unitName;
  }

  // 2. Check if subPackages contains a multi-pack expression (e.g. "6 Pack x 250 ml", "10 x 375 ml")
  const multiPackInSub =
    subPackages.match(/^([0-9]+)\s*(?:Pack|Pk|Cans?|Bottles?|Bags?|Tins?|x|X|×)?\s*(?:[xX×])\s*([0-9.]+)\s*([a-zA-Z]+)?$/i) ||
    subPackages.match(/^([0-9]+)\s+(?:Pack|Pk|Cans?|Bottles?)\s+([0-9.]+)\s*([a-zA-Z]+)?$/i);

  if (multiPackInSub) {
    const packCount = multiPackInSub[1];
    const unitSize = multiPackInSub[2];
    const unitName = multiPackInSub[3] ? normalizeMeasurementUnit(multiPackInSub[3]) : unit;

    subPackages = `${packCount} Pack`;
    if (!size || size === packCount) {
      size = unitSize;
    }
    if (unitName) unit = unitName;
  }

  // 3. Normalize subPackages: "6" -> "6 Pack", "10 Pk" -> "10 Pack", "6x" -> "6 Pack"
  if (/^[0-9]+$/.test(subPackages)) {
    subPackages = `${subPackages} Pack`;
  } else if (/^([0-9]+)\s*(?:Pk|Packs?|Cans?|Bottles?|Tins?|[xX×])$/i.test(subPackages)) {
    const m = subPackages.match(/^([0-9]+)/);
    if (m) subPackages = `${m[1]} Pack`;
  }

  // 4. Clean standalone size if it has unit inside (e.g. "250 ml", "700ml", "60 Pieces", "100 Strips")
  const singleSizeWithUnit = size.match(/^([0-9.]+)\s*([a-zA-Z\s]+)$/);
  if (singleSizeWithUnit) {
    size = singleSizeWithUnit[1];
    const parsedUnit = normalizeMeasurementUnit(singleSizeWithUnit[2]);
    if (parsedUnit && (!unit || unit === 'None')) {
      unit = parsedUnit;
    }
  }

  return { subPackages, size, measurementUnit: unit };
}

/**
 * Normalizes text to ensure alphanumeric characters and single spaces.
 */
export function sanitizeAlphanumeric(text: string): string {
  if (!text) return '';
  return text
    .replace(/[^a-zA-Z0-9\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Assembles the standard GSS ODA English Product Name according to official rules:
 * Formula:
 * [Brand] [Sub-Brand] [Item] [Attributes / Flavor] [Additional Wordings] [Container Type] [Sub Packages x Size Unit] [Value Packs description]
 * 
 * Note: Value Pack Description / Special Editions (e.g. 18 Year Old Limited Edition, Value Pack, 3x Eco Refill)
 * MUST ALWAYS BE PLACED AT THE VERY END OF THE PRODUCT NAME.
 */
export function assembleStandardName(attr: ProductAttributes): string {
  const parts: string[] = [];

  const brand = (attr.brand || '').trim();
  const subBrand = (attr.subBrand || '').trim();
  const item = (attr.item || '').trim();
  const flavor = (attr.flavorOrVariant || '').trim();
  let additional = (attr.additionalWordings || '').trim();
  const container = (attr.containerType || '').trim();
  let valuePack = (attr.valuePacksDescription || '').trim();

  // Clean subPackages and size with intelligent pack-and-size parser
  const cleaned = cleanPackAndSize(attr.subPackages, attr.size, attr.measurementUnit);
  const subPackages = cleaned.subPackages;
  const size = cleaned.size;
  const unit = cleaned.measurementUnit;

  // If additionalWordings contains edition / value pack phrases (e.g. "18 Year Old Limited Edition", "Limited Edition", "Special Edition", "Value Pack", "3x eco-refill")
  // move them to valuePack so they are guaranteed to appear at the very end!
  const valuePackRegex = /\b(?:\d+\s*(?:Year|Yr)\s*Old\s*)?(?:Limited|Special|Collector|Anniversary|Festive|Seasonal|Exclusive|Promo|Value|Bonus|Eco-Refill|\d+x\s*Eco-Refill)\s*(?:Edition|Pack|Set|Design|Series|Release)?\b/i;
  
  if (valuePackRegex.test(additional)) {
    const match = additional.match(valuePackRegex);
    if (match) {
      const matchedPhrase = match[0].trim();
      if (!valuePack) {
        valuePack = matchedPhrase;
      } else if (!valuePack.toLowerCase().includes(matchedPhrase.toLowerCase())) {
        valuePack = `${valuePack} ${matchedPhrase}`;
      }
      additional = additional.replace(matchedPhrase, '').replace(/\s+/g, ' ').trim();
    }
  }

  // Rule 1: If Sub-Brand contains Brand Name, Brand isn't duplicated
  if (brand) {
    if (subBrand && subBrand.toLowerCase().includes(brand.toLowerCase())) {
      parts.push(subBrand);
    } else {
      parts.push(brand);
      if (subBrand) parts.push(subBrand);
    }
  } else if (subBrand) {
    parts.push(subBrand);
  }

  // Item (Product Type, e.g. Single Malt Scotch Whisky, Hand Wash, Creaming Soda, Gum, Strips, Soft Drink)
  if (item && !parts.some(p => p.toLowerCase().includes(item.toLowerCase()))) {
    parts.push(item);
  }

  // Flavor / Variant (e.g. Cucumber and Green Tea Scent, Wild Cherry Flavoured, Peppermint, Lemon Lime And Bitters)
  if (flavor) {
    parts.push(flavor);
  }

  // Additional wordings (e.g. Australian Family Owned, Flexible Fabric Breathable Water Repellent, Refill, No Sugar)
  if (additional) {
    parts.push(additional);
  }

  // Container Type (strictly from allowed list if given)
  if (container && container.toLowerCase() !== 'none') {
    parts.push(container);
  }

  // Sub packages + Size Unit formatting
  // Multi-pack with size: "6 Pack x 250 ml", "10 Pack x 375 ml"
  // Single size: "700 ml", "60 Units", "100 Units"
  const sizeFormatted = size ? (unit ? `${size} ${unit}` : size) : '';

  if (subPackages && sizeFormatted) {
    // If subPackages already has 'x' or 'X' or '×' at the end
    if (/(\s[xX×]$|^[0-9]+\s*[xX×]$)/.test(subPackages)) {
      parts.push(`${subPackages} ${sizeFormatted}`);
    } else {
      parts.push(`${subPackages} x ${sizeFormatted}`);
    }
  } else if (subPackages) {
    parts.push(subPackages);
  } else if (sizeFormatted) {
    parts.push(sizeFormatted);
  }

  // Value Pack description / Editions (e.g. 18 Year Old Limited Edition, Special Edition, Value Pack, 3x eco-refill)
  // MUST ALWAYS APPEAR AT THE VERY END AFTER CONTAINER & SIZE/UNIT
  if (valuePack && !parts.some(p => p.toLowerCase().includes(valuePack.toLowerCase()))) {
    parts.push(valuePack);
  }

  // Combine and clean
  let combined = parts.filter(Boolean).join(' ');
  // Clean multiple spaces
  combined = combined.replace(/\s+/g, ' ').trim();
  return combined;
}

export interface ValidationResult {
  isValid: boolean;
  length: number;
  isLengthValid: boolean;
  isContainerValid: boolean;
  isAlphanumericValid: boolean;
  warnings: string[];
}

/**
 * Validates a generated name against GSS ODA rules.
 */
export function validateStandardName(
  name: string,
  containerType?: string
): ValidationResult {
  const warnings: string[] = [];
  const length = name.length;
  const isLengthValid = length > 0 && length <= 150;

  if (length > 150) {
    warnings.push(`Exceeds maximum character limit of 150 chars (currently ${length} chars).`);
  } else if (length === 0) {
    warnings.push('Product name cannot be empty.');
  }

  // Check container type
  let isContainerValid = true;
  if (containerType && containerType.toLowerCase() !== 'none') {
    isContainerValid = CONTAINER_TYPES.includes(containerType as ContainerType);
    if (!isContainerValid) {
      warnings.push(`Container type "${containerType}" is not in the official GSS allowed list.`);
    }
  }

  // Check alphanumeric rule (Rule 4: "Names will be combined of numbers and letters (Alphanumeric Values) only")
  // Allow spaces, letters, numbers, and basic hyphen/period for decimal sizes like 1.5 L
  const alphanumericRegex = /^[a-zA-Z0-9\s.-]+$/;
  const isAlphanumericValid = alphanumericRegex.test(name);
  if (!isAlphanumericValid) {
    warnings.push('Name contains non-alphanumeric characters. GSS rules specify numbers and letters only.');
  }

  const isValid = isLengthValid && isContainerValid && isAlphanumericValid;

  return {
    isValid,
    length,
    isLengthValid,
    isContainerValid,
    isAlphanumericValid,
    warnings,
  };
}

export interface SkuLinkInfo {
  url: string | null;
  isDirectProductPage: boolean;
  domainName: string;
}

/**
 * Generates an exact Product Page URL or high-precision Google Search URL matching Brand, Item, Flavor, Size, and Pack count.
 * Returns null if essential SKU identifiers (Brand and Item/Flavor) are missing.
 */
export function generateGoogleSkuUrl(
  productOrAttr: { attributes?: ProductAttributes; skuSearchQuery?: string; exactProductUrl?: string; googleSkuUrl?: string } | ProductAttributes,
  customQueryOrUrl?: string
): string | null {
  if (customQueryOrUrl && customQueryOrUrl.trim()) {
    const trimmed = customQueryOrUrl.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  }

  // 1. Direct exact product URL from product / attributes (e.g. https://snackje.com/products/... or https://toongabbie...)
  if ('exactProductUrl' in productOrAttr && productOrAttr.exactProductUrl && /^https?:\/\//i.test(productOrAttr.exactProductUrl.trim())) {
    return productOrAttr.exactProductUrl.trim();
  }

  const attr: ProductAttributes =
    'attributes' in productOrAttr && productOrAttr.attributes
      ? productOrAttr.attributes
      : (productOrAttr as ProductAttributes);

  if (attr.exactProductUrl && /^https?:\/\//i.test(attr.exactProductUrl.trim())) {
    return attr.exactProductUrl.trim();
  }

  // 2. Custom SKU query if specified
  if ('skuSearchQuery' in productOrAttr && productOrAttr.skuSearchQuery) {
    return `https://www.google.com/search?q=${encodeURIComponent(productOrAttr.skuSearchQuery.trim())}`;
  }

  const brand = (attr.brand || '').trim();
  const subBrand = (attr.subBrand || '').trim();
  const item = (attr.item || '').trim();
  const flavor = (attr.flavorOrVariant || '').trim();
  const subPackages = (attr.subPackages || '').trim();
  const size = (attr.size || '').trim();
  const unit = normalizeMeasurementUnit(attr.measurementUnit || '');

  // If brand is empty or placeholder (e.g. "Image 1") or no identifying product type/flavor
  if (!brand || /^image\s*\d+$/i.test(brand) || (!item && !flavor)) {
    return null;
  }

  const queryParts = [
    brand,
    subBrand && !subBrand.toLowerCase().includes(brand.toLowerCase()) ? subBrand : '',
    item,
    flavor,
    subPackages,
    size ? (unit && unit !== 'None' ? `${size} ${unit}` : size) : '',
  ].filter(Boolean);

  if (queryParts.length < 2) {
    return null;
  }

  const query = queryParts.join(' ').replace(/\s+/g, ' ').trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Returns metadata about the SKU link (e.g. whether it's a direct product page on snackje.com, etc., or Google Search)
 */
export function getSkuLinkInfo(
  productOrAttr: { attributes?: ProductAttributes; skuSearchQuery?: string; exactProductUrl?: string; googleSkuUrl?: string } | ProductAttributes,
  customQueryOrUrl?: string
): SkuLinkInfo {
  const url = generateGoogleSkuUrl(productOrAttr, customQueryOrUrl);
  if (!url) {
    return { url: null, isDirectProductPage: false, domainName: '' };
  }

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./i, '');
    const isGoogleSearch = host.includes('google.') && parsedUrl.pathname.includes('/search');
    return {
      url,
      isDirectProductPage: !isGoogleSearch,
      domainName: isGoogleSearch ? 'Google Search' : host,
    };
  } catch {
    return {
      url,
      isDirectProductPage: false,
      domainName: 'Product Link',
    };
  }
}
/**
 * Official GSS Manufacturer Clarification Rules & Short Forms (Step 01):
 * - Incorporated -> Inc
 * - Limited Liability Company -> LLC
 * - Limited Company -> LC
 * - Company -> Co
 * - Corporation -> Corp
 * - Cooperatives -> Coop
 * - Proprietary Limited -> Pty Ltd
 * - Licensed Taxi Drivers' Association -> LTDA
 * - (P) Ltd -> Pvt Ltd
 * - S.P.A / Spa -> SPA
 * - B.V. -> BV
 * - S.A. -> SA
 * - S.A. DE C.V. -> SA De CV
 * - A/S -> AS
 * - Srl -> SRL
 * - Gmbh -> GMBH
 * - PDTS -> Products
 * - MFG. CO -> Mfg Co
 * - L.P(Limited Partnership) -> LP
 * - If no company suffix exists (e.g. "Pets' Kitchen"), full original name is preserved.
 */
export interface ManufacturerStandardizationResult {
  raw: string;
  standardized: string;
  ruleApplied: string;
  isModified: boolean;
}

export const MANUFACTURER_RULE_MAPPINGS = [
  { full: 'Incorporated', short: 'Inc', pattern: /\bIncorporated\b|\bInc\.?\b/gi },
  { full: 'Limited Liability Company', short: 'LLC', pattern: /\bLimited Liability Company\b|\bL\.?L\.?C\.?\b/gi },
  { full: 'Limited Company', short: 'LC', pattern: /\bLimited Company\b/gi },
  { full: 'Proprietary Limited', short: 'Pty Ltd', pattern: /\bProprietary Limited\b|\bPty\.?\s*Ltd\.?\b/gi },
  { full: 'Licensed Taxi Drivers\' Association', short: 'LTDA', pattern: /\bLicensed Taxi Drivers'? Association\b/gi },
  { full: 'Corporation', short: 'Corp', pattern: /\bCorporation\b|\bCorp\.?\b/gi },
  { full: 'Cooperatives', short: 'Coop', pattern: /\bCooperatives?\b|\bCoop\.?\b/gi },
  { full: '(P) Ltd / Pvt Ltd', short: 'Pvt Ltd', pattern: /\(?P\)?\s*Ltd\.?|\(?Pvt\)?\.?\s*Ltd\.?/gi },
  { full: 'Company', short: 'Co', pattern: /\bCompany\b|\bCo\.?\b/gi },
  { full: 'S.P.A', short: 'SPA', pattern: /\bS\.?P\.?A\.?\b|\bSpa\b/gi },
  { full: 'B.V.', short: 'BV', pattern: /\bB\.?V\.?\b|\bBv\b/gi },
  { full: 'S.A.', short: 'SA', pattern: /\bS\.?A\.?\b(?!\s*DE\s*C\.?V\.?)/gi },
  { full: 'S.A. DE C.V.', short: 'SA De CV', pattern: /\bS\.?A\.?\s*DE\s*C\.?V\.?\b|\bS\.?A\.?\s*de\s*C\.?V\.?\b/gi },
  { full: 'A/S', short: 'AS', pattern: /\bA\/S\b/gi },
  { full: 'Srl', short: 'SRL', pattern: /\bS\.?R\.?L\.?\b|\bSrl\b/gi },
  { full: 'Gmbh', short: 'GMBH', pattern: /\bG\.?m\.?b\.?H\.?\b|\bGmbh\b|\bGMBH\b/gi },
  { full: 'PDTS', short: 'Products', pattern: /\bPDTS\b|\bPdts\b/gi },
  { full: 'MFG. CO', short: 'Mfg Co', pattern: /\bMFG\.?\s*CO\.?\b|\bMfg\.?\s*Co\.?\b/gi },
  { full: 'Limited Partnership', short: 'LP', pattern: /\bL\.?P\.?\s*\(Limited Partnership\)|\bL\.?P\.?\b/gi },
];

/**
 * Standardizes a manufacturer name according to official GSS Manufacturer Clarification Step 01 guidelines.
 */
export function standardizeManufacturerName(rawName: string): ManufacturerStandardizationResult {
  if (!rawName || !rawName.trim()) {
    return { raw: '', standardized: '', ruleApplied: 'None', isModified: false };
  }

  const raw = rawName.trim();
  let result = raw;
  const appliedRules: string[] = [];

  // 1. Convert ALL-CAPS strings into readable Title Case while protecting standard acronyms
  const isAllCaps = result.length > 3 && result === result.toUpperCase() && /[A-Z]/.test(result);
  if (isAllCaps) {
    // Replace hyphen in uppercase brand compounds (e.g. QUEEN-ANN -> Queen Ann)
    result = result.replace(/([A-Z]+)-([A-Z]+)/g, '$1 $2');

    result = result
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (!word) return '';
        // preserve specific short acronyms / short initialisms
        if (/^(llc|inc|corp|co|sa|spa|bv|gmbh|srl|as|lp|mfg|pdts|cv|rp)$/i.test(word)) {
          return word.toUpperCase();
        }
        if (/^ltd$/i.test(word)) {
          return 'Ltd';
        }
        if (/^de$/i.test(word)) {
          return 'De';
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }


  // 2. Specific multi-word / complex replacements
  // Licensed Taxi Drivers' Association -> LTDA
  if (/Licensed Taxi Drivers'? Association/i.test(result)) {
    result = result.replace(/Licensed Taxi Drivers'? Association/gi, 'LTDA');
    appliedRules.push("Licensed Taxi Drivers' Association → LTDA");
  }

  // Limited Liability Company / LLC
  if (/Limited Liability Company/i.test(result)) {
    result = result.replace(/Limited Liability Company/gi, 'LLC');
    appliedRules.push('Limited Liability Company → LLC');
  }

  // Proprietary Limited / Pty Ltd
  if (/Proprietary Limited/i.test(result) || /Pty\.?\s*Ltd\.?/i.test(result)) {
    result = result.replace(/Proprietary Limited/gi, 'Pty Ltd').replace(/Pty\.?\s*Ltd\.?/gi, 'Pty Ltd');
    appliedRules.push('Proprietary Limited → Pty Ltd');
  }

  // Limited Partnership: L.P(Limited Partnership) / L.P. -> LP
  if (/L\.?P\.?\s*\(Limited Partnership\)/i.test(result) || /,\s*L\.?P\.?\b/i.test(result)) {
    result = result
      .replace(/,\s*L\.?P\.?\s*\(Limited Partnership\)/gi, ' LP')
      .replace(/L\.?P\.?\s*\(Limited Partnership\)/gi, 'LP')
      .replace(/,\s*L\.?P\.?/gi, ' LP')
      .replace(/\bL\.?P\.?\b/g, 'LP');
    appliedRules.push('L.P(Limited Partnership) → LP');
  }

  // (P) Ltd / (Pvt) Ltd / Pvt. Ltd. -> Pvt Ltd
  if (/\(?P\)?\s*Ltd\.?/i.test(result) || /\(?Pvt\)?\.?\s*Ltd\.?/i.test(result)) {
    result = result.replace(/\(?P\)?\s*Ltd\.?/gi, 'Pvt Ltd').replace(/\(?Pvt\)?\.?\s*Ltd\.?/gi, 'Pvt Ltd');
    appliedRules.push('(P) Ltd → Pvt Ltd');
  }

  // S.A. DE C.V. / S.A. de C.V. -> SA De CV
  if (/S\.?A\.?\s*(?:DE|de)\s*C\.?V\.?/i.test(result)) {
    result = result.replace(/S\.?A\.?\s*(?:DE|de)\s*C\.?V\.?/gi, 'SA De CV');
    appliedRules.push('S.A. DE C.V. → SA De CV');
  }

  // S.P.A / Spa -> SPA
  if (/\bS\.?P\.?A\.?\b/i.test(result) || /\bSpa\b/i.test(result)) {
    result = result.replace(/\bS\.?P\.?A\.?\b/gi, 'SPA').replace(/\bSpa\b/g, 'SPA');
    appliedRules.push('S.P.A → SPA');
  }

  // B.V. -> BV
  if (/\bB\.?V\.?\b/i.test(result)) {
    result = result.replace(/\bB\.?V\.?\b/gi, 'BV');
    appliedRules.push('B.V. → BV');
  }

  // S.A. -> SA
  if (/\bS\.?A\.?\b/i.test(result) && !/SA De CV/i.test(result)) {
    result = result.replace(/\bS\.?A\.?\b/gi, 'SA');
    appliedRules.push('S.A. → SA');
  }

  // A/S -> AS
  if (/\bA\/S\b/i.test(result) || /\bA\s*\/\s*S\b/i.test(result)) {
    result = result.replace(/\bA\s*\/\s*S\b/gi, 'AS');
    appliedRules.push('A/S → AS');
  }

  // Srl / S.R.L. -> SRL
  if (/\bS\.?R\.?L\.?\b/i.test(result) || /\bSrl\b/i.test(result)) {
    result = result.replace(/\bS\.?R\.?L\.?\b/gi, 'SRL').replace(/\bSrl\b/gi, 'SRL');
    appliedRules.push('Srl → SRL');
  }

  // Gmbh / GmbH / G.M.B.H. -> GMBH
  if (/\bG\.?m\.?b\.?H\.?\b/i.test(result) || /\bGmbh\b/i.test(result) || /\bGMBH\b/i.test(result)) {
    result = result.replace(/\bG\.?m\.?b\.?H\.?\b/gi, 'GMBH').replace(/\bGmbh\b/gi, 'GMBH');
    appliedRules.push('Gmbh → GMBH');
  }

  // PDTS -> Products
  if (/\bPDTS\b/i.test(result) || /\bPdts\b/i.test(result)) {
    result = result.replace(/\bPDTS\b/gi, 'Products').replace(/\bPdts\b/gi, 'Products');
    appliedRules.push('PDTS → Products');
  }

  // MFG. CO / MFG CO -> Mfg Co
  if (/\bMFG\.?\s*CO\.?\b/i.test(result) || /\bMfg\.?\s*Co\.?\b/i.test(result)) {
    result = result.replace(/\bMFG\.?\s*CO\.?\b/gi, 'Mfg Co').replace(/\bMfg\.?\s*Co\.?\b/gi, 'Mfg Co');
    appliedRules.push('MFG. CO → Mfg Co');
  }

  // Limited Company -> LC
  if (/\bLimited Company\b/i.test(result)) {
    result = result.replace(/\bLimited Company\b/gi, 'LC');
    appliedRules.push('Limited Company → LC');
  }

  // & Company Inc / & Company -> & Co Inc / & Co
  if (/&\s*Company\s+Inc/i.test(result) || /and\s+Company\s+Inc/i.test(result)) {
    result = result.replace(/(&|and)\s*Company\s+Inc/gi, '& Co Inc');
    appliedRules.push('& Company Inc → & Co Inc');
  } else if (/&\s*Company\b/i.test(result) || /and\s+Company\b/i.test(result)) {
    result = result.replace(/(&|and)\s*Company\b/gi, '& Co');
    appliedRules.push('& Company → & Co');
  }

  // Co Incorporated -> Co Inc
  if (/\bCo\.?\s+Incorporated\b/i.test(result)) {
    result = result.replace(/\bCo\.?\s+Incorporated\b/gi, 'Co Inc');
    appliedRules.push('Co Incorporated → Co Inc');
  }

  // Incorporated -> Inc
  if (/\bIncorporated\b/i.test(result) || /\bInc\.\b/i.test(result)) {
    result = result.replace(/\bIncorporated\b/gi, 'Inc').replace(/\bInc\.\b/gi, 'Inc');
    if (!appliedRules.includes('Incorporated → Inc')) appliedRules.push('Incorporated → Inc');
  }

  // Corporation -> Corp
  if (/\bCorporation\b/i.test(result) || /\bCorp\.\b/i.test(result)) {
    result = result.replace(/\bCorporation\b/gi, 'Corp').replace(/\bCorp\.\b/gi, 'Corp');
    if (!appliedRules.includes('Corporation → Corp')) appliedRules.push('Corporation → Corp');
  }

  // Cooperatives / Cooperative -> Coop
  if (/\bCooperatives?\b/i.test(result) || /\bCoop\.\b/i.test(result)) {
    result = result.replace(/\bCooperatives?\b/gi, 'Coop').replace(/\bCoop\.\b/gi, 'Coop');
    if (!appliedRules.includes('Cooperatives → Coop')) appliedRules.push('Cooperatives → Coop');
  }

  // Company -> Co (standalone company word at boundary)
  if (/\bCompany\b/i.test(result) && !appliedRules.some(r => r.includes('Company'))) {
    result = result.replace(/\bCompany\b/gi, 'Co');
    appliedRules.push('Company → Co');
  }

  // Co. -> Co
  if (/\bCo\.\b/i.test(result)) {
    result = result.replace(/\bCo\.\b/gi, 'Co');
  }

  // Clean specific symbols / domains from guide examples (e.g. 1-800-Flowers.com Inc -> 1-800 Flowers Com Inc)
  if (/1-800-Flowers\.com/i.test(result)) {
    result = result.replace(/1-800-Flowers\.com/gi, '1-800 Flowers Com');
    appliedRules.push('1-800-Flowers.com → 1-800 Flowers Com');
  }

  // Clean hyphen in Seven-Eleven -> Seven Eleven
  if (/Seven-Eleven/i.test(result)) {
    result = result.replace(/Seven-Eleven/gi, 'Seven Eleven');
    appliedRules.push('Seven-Eleven → Seven Eleven');
  }

  // Norton Bros. -> Norton Bros
  if (/Bros\./i.test(result)) {
    result = result.replace(/Bros\./gi, 'Bros');
  }

  // Mr Bey / Mr. Bey formatting
  if (/\bMr\s+Bey\b/i.test(result)) {
    result = result.replace(/\bMr\s+Bey\b/gi, 'Mr.Bey');
  }

  // Clean dangling commas or double spaces (e.g. "Management, LP" -> "Management LP")
  result = result.replace(/,\s*/g, ' ').replace(/\s+/g, ' ').trim();

  // Strip trailing period if at end of shortened words like Inc. or Corp. or Ltd.
  result = result.replace(/\b(Inc|Corp|Co|Ltd|Pvt Ltd|Pty Ltd|LC|LLC|AS|SPA|BV|SA|SRL|GMBH|LP|LTDA)\.$/i, '$1');

  const ruleApplied = appliedRules.length > 0 ? appliedRules.join(', ') : 'Direct Full Name (No company suffix)';
  const isModified = result !== raw;

  return {
    raw,
    standardized: result,
    ruleApplied,
    isModified,
  };
}
