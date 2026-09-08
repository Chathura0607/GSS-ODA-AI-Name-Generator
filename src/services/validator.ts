import { CONTAINER_TYPES, ContainerType } from '../constants/containerTypes';
import { ProductAttributes } from '../types';

/**
 * Normalizes text to ensure alphanumeric characters and single spaces.
 */
export function sanitizeAlphanumeric(text: string): string {
  if (!text) return '';
  // Replace non-alphanumeric (except standard spaces and safe punctuation like hyphen)
  return text
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Assembles the standard GSS ODA English Product Name according to official rules:
 * Formula:
 * [Brand] [Sub-Brand] [Item] [Attributes / Flavor] [Additional Wordings / Value Pack] [Container Type] [Sub Packages] [Size and Measurement Unit]
 */
export function assembleStandardName(attr: ProductAttributes): string {
  const parts: string[] = [];

  const brand = (attr.brand || '').trim();
  const subBrand = (attr.subBrand || '').trim();
  const item = (attr.item || '').trim();
  const flavor = (attr.flavorOrVariant || '').trim();
  const additional = (attr.additionalWordings || '').trim();
  const container = (attr.containerType || '').trim();
  const subPackages = (attr.subPackages || '').trim();
  const size = (attr.size || '').trim();
  const unit = (attr.measurementUnit || '').trim();
  const valuePack = (attr.valuePacksDescription || '').trim();

  // Rule 1: If Sub-Brand contains Brand Name, Brand isn't mandatory
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

  // Item (Product Type, e.g. Hand Wash, Creaming Soda)
  if (item && !parts.some(p => p.toLowerCase().includes(item.toLowerCase()))) {
    parts.push(item);
  }

  // Flavor / Variant (e.g. Cucumber and Green Tea Scent, Orange)
  if (flavor) {
    parts.push(flavor);
  }

  // Additional wordings (e.g. Refill, No Sugar, Genuine Refreshments)
  if (additional) {
    parts.push(additional);
  }

  // Container Type (strictly from allowed list if given)
  if (container && container.toLowerCase() !== 'none') {
    parts.push(container);
  }

  // Sub packages (e.g. 12 Pack, 4 Pack, 8 Mini Cans)
  if (subPackages) {
    parts.push(subPackages);
  }

  // Size + Unit (e.g. 750 ml, 300 ml)
  if (size) {
    if (unit) {
      parts.push(`${size} ${unit}`);
    } else {
      parts.push(size);
    }
  }

  // Value Pack description (e.g. Special Edition, 3x eco-refill)
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
