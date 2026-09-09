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
  const subPackages = (attr.subPackages || '').trim();
  const size = (attr.size || '').trim();
  const unit = normalizeMeasurementUnit(attr.measurementUnit || '');
  let valuePack = (attr.valuePacksDescription || '').trim();

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

  // Item (Product Type, e.g. Single Malt Scotch Whisky, Hand Wash, Creaming Soda, Gum, Strips)
  if (item && !parts.some(p => p.toLowerCase().includes(item.toLowerCase()))) {
    parts.push(item);
  }

  // Flavor / Variant (e.g. Cucumber and Green Tea Scent, Wild Cherry Flavoured, Peppermint)
  if (flavor) {
    parts.push(flavor);
  }

  // Additional wordings (e.g. Flexible Fabric Breathable Water Repellent, Refill, No Sugar)
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
