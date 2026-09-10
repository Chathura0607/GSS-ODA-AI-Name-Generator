import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ProcessedProduct, AppSettings, BrandManufacturerInfo } from '../types';

interface GssOdaDB extends DBSchema {
  products: {
    key: string;
    value: ProcessedProduct;
    indexes: {
      'by-created': number;
      'by-status': string;
    };
  };
  brands: {
    key: string;
    value: BrandManufacturerInfo;
    indexes: {
      'by-searched': number;
      'by-brand': string;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'gss_oda_db';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<GssOdaDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<GssOdaDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('by-created', 'createdAt');
          productStore.createIndex('by-status', 'status');
        }
        // Brands store
        if (!db.objectStoreNames.contains('brands')) {
          const brandStore = db.createObjectStore('brands', { keyPath: 'id' });
          brandStore.createIndex('by-searched', 'searchedAt');
          brandStore.createIndex('by-brand', 'brandName');
        }
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}


/**
 * Save or update a single product
 */
export async function saveProduct(product: ProcessedProduct): Promise<void> {
  const db = await getDB();
  await db.put('products', product);
}

/**
 * Bulk save or update products
 */
export async function saveProducts(products: ProcessedProduct[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('products', 'readwrite');
  await Promise.all(products.map(p => tx.store.put(p)));
  await tx.done;
}

/**
 * Retrieve all products ordered by creation time descending
 */
export async function getAllProducts(): Promise<ProcessedProduct[]> {
  const db = await getDB();
  const products = await db.getAllFromIndex('products', 'by-created');
  return products.reverse(); // newest first
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('products', id);
}

/**
 * Clear all products
 */
export async function clearAllProducts(): Promise<void> {
  const db = await getDB();
  await db.clear('products');
}

/**
 * Save or update brand info
 */
export async function saveBrandInfo(brand: BrandManufacturerInfo): Promise<void> {
  const db = await getDB();
  await db.put('brands', brand);
}

/**
 * Bulk save brand infos
 */
export async function saveBrandInfos(brands: BrandManufacturerInfo[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('brands', 'readwrite');
  await Promise.all(brands.map(b => tx.store.put(b)));
  await tx.done;
}

/**
 * Retrieve all searched brands ordered by search timestamp descending
 */
export async function getAllBrands(): Promise<BrandManufacturerInfo[]> {
  const db = await getDB();
  const brands = await db.getAllFromIndex('brands', 'by-searched');
  return brands.reverse();
}

/**
 * Delete a brand entry
 */
export async function deleteBrand(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('brands', id);
}

/**
 * Clear all brand entries
 */
export async function clearAllBrands(): Promise<void> {
  const db = await getDB();
  await db.clear('brands');
}


/**
 * Purge records older than the retention period (default 7 days).
 * Returns the count of purged items.
 */
export async function purgeOldRecords(retentionDays: number = 7): Promise<number> {
  const db = await getDB();
  const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  const tx = db.transaction('products', 'readwrite');
  let cursor = await tx.store.index('by-created').openCursor();
  let purgedCount = 0;

  while (cursor) {
    if (cursor.value.createdAt < cutoffTime) {
      await cursor.delete();
      purgedCount++;
    }
    cursor = await cursor.continue();
  }
  await tx.done;
  return purgedCount;
}

/**
 * Save application settings
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, 'app_settings');
}

/**
 * Load application settings with fallback defaults
 */
export async function loadSettings(): Promise<AppSettings> {
  const defaultSettings: AppSettings = {
    geminiApiKey: localStorage.getItem('gss_gemini_key') || '',
    geminiModel: 'gemini-3.6-flash',
    retentionDays: 7,
    autoProcessOnUpload: true,
    strictContainerCheck: true,
  };

  try {
    const db = await getDB();
    const stored = await db.get('settings', 'app_settings');
    if (stored) {
      return { ...defaultSettings, ...stored };
    }
  } catch (err) {
    console.warn('Could not read settings from DB, using defaults', err);
  }
  return defaultSettings;
}

/**
 * Export full backup as JSON
 */
export async function exportBackupJSON(): Promise<string> {
  const products = await getAllProducts();
  const brands = await getAllBrands();
  const settings = await loadSettings();
  const backup = {
    appName: 'GSS ODA Product Name Standardizer',
    version: '1.1.0',
    exportTimestamp: Date.now(),
    exportDateISO: new Date().toISOString(),
    totalRecords: products.length,
    totalBrands: brands.length,
    retentionPolicy: `${settings.retentionDays} days`,
    products,
    brands,
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Import backup JSON
 */
export async function importBackupJSON(jsonContent: string): Promise<number> {
  const data = JSON.parse(jsonContent);
  if (!data || (!Array.isArray(data.products) && !Array.isArray(data.brands))) {
    throw new Error('Invalid backup file format. Expected a valid GSS ODA backup.');
  }

  let count = 0;
  if (Array.isArray(data.products) && data.products.length > 0) {
    const validProducts: ProcessedProduct[] = data.products.map((p: any) => ({
      ...p,
      id: p.id || `imported_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: p.createdAt || Date.now(),
      updatedAt: Date.now(),
    }));
    await saveProducts(validProducts);
    count += validProducts.length;
  }

  if (Array.isArray(data.brands) && data.brands.length > 0) {
    const validBrands: BrandManufacturerInfo[] = data.brands.map((b: any) => ({
      ...b,
      id: b.id || `imported_brand_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      searchedAt: b.searchedAt || Date.now(),
    }));
    await saveBrandInfos(validBrands);
    count += validBrands.length;
  }

  return count;
}

