import { ContainerType, MeasurementUnit } from '../constants/containerTypes';

export interface ProductAttributes {
  brand: string;
  subBrand: string;
  item: string; // Product type (e.g. Hand Wash, Creaming Soda, Dry Ginger Ale)
  flavorOrVariant: string; // Flavor, scent or variant (e.g. Cucumber and Green Tea Scent, Orange)
  additionalWordings: string; // e.g. Refill, No Sugar, Genuine Refreshments
  containerType: ContainerType | string;
  subPackages: string; // e.g. 12 Pack, 4x, 8 Mini Cans
  size: string; // e.g. 750, 300, 200
  measurementUnit: MeasurementUnit | string; // e.g. ml, l, g
  valuePacksDescription: string; // e.g. 3x eco-refill, Special Edition
}

export type ProcessingStatus = 'queued' | 'extracting' | 'analyzing' | 'completed' | 'error';

export interface ProcessedProduct {
  id: string;
  sourceFileName: string;
  originalFileType: string; // e.g. 'image/png', 'application/pdf', 'application/zip'
  archiveSource?: string; // If extracted from a zip/pdf, shows archive name
  thumbnailUrl: string; // base64 thumbnail for preview and audit
  attributes: ProductAttributes;
  standardName: string;
  characterCount: number;
  isAlphanumericValid: boolean;
  isContainerValid: boolean;
  isLengthValid: boolean;
  confidenceScore: number; // 0 - 100
  notes?: string;
  status: ProcessingStatus;
  errorMessage?: string;
  createdAt: number; // UTC timestamp ms
  updatedAt: number;
}

export interface AppSettings {
  geminiApiKey: string;
  geminiModel: string;
  retentionDays: number; // default 7
  autoProcessOnUpload: boolean;
  strictContainerCheck: boolean;
}

export interface ExtractionProgress {
  totalFiles: number;
  extractedFiles: number;
  currentFileName: string;
}
