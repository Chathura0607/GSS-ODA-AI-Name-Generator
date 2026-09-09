import * as XLSX from 'xlsx';
import { ProcessedProduct } from '../types';
import { generateGoogleSkuUrl } from './validator';

/**
 * Format products into tabular rows suitable for Excel / CSV
 */
function prepareProductRows(products: ProcessedProduct[]) {
  return products.map((p, index) => {
    const googleSkuLink = generateGoogleSkuUrl(p);

    return {
      'No.': index + 1,
      'Standard Product Name': p.standardName,
      'Character Count': p.characterCount,
      'Length Valid (<=150)': p.isLengthValid ? 'YES' : 'NO',
      'Container Valid': p.isContainerValid ? 'YES' : 'NO',
      'Alphanumeric Valid': p.isAlphanumericValid ? 'YES' : 'NO',
      'Google SKU Reference Link': googleSkuLink || "Can't find proper SKU",
      'Brand': p.attributes.brand || '',
      'Sub-Brand': p.attributes.subBrand || '',
      'Item (Product Type)': p.attributes.item || '',
      'Flavor / Variant': p.attributes.flavorOrVariant || '',
      'Additional Wordings': p.attributes.additionalWordings || '',
      'Container Type': p.attributes.containerType || '',
      'Sub Packages': p.attributes.subPackages || '',
      'Size': p.attributes.size || '',
      'Unit': p.attributes.measurementUnit || '',
      'Value Pack Description': p.attributes.valuePacksDescription || '',
      'Confidence (%)': `${p.confidenceScore}%`,
      'Status': p.status.toUpperCase(),
      'Source File': p.sourceFileName,
      'Archive Source': p.archiveSource || 'Direct Upload',
      'Date Processed': new Date(p.createdAt).toLocaleString(),
      'Notes': p.notes || '',
    };
  });
}

/**
 * Export products to formatted Excel (.xlsx) file
 */
export function exportToExcel(products: ProcessedProduct[], fileNamePrefix: string = 'GSS_ODA_Products') {
  if (products.length === 0) {
    alert('No products to export.');
    return;
  }

  const rows = prepareProductRows(products);
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths for readability
  const colWidths = [
    { wch: 6 },  // No.
    { wch: 45 }, // Standard Product Name
    { wch: 14 }, // Char Count
    { wch: 18 }, // Length Valid
    { wch: 16 }, // Container Valid
    { wch: 18 }, // Alphanumeric Valid
    { wch: 50 }, // Google SKU Reference Link
    { wch: 16 }, // Brand
    { wch: 18 }, // Sub-Brand
    { wch: 20 }, // Item
    { wch: 25 }, // Flavor
    { wch: 20 }, // Additional Wordings
    { wch: 18 }, // Container Type
    { wch: 14 }, // Sub Packages
    { wch: 10 }, // Size
    { wch: 10 }, // Unit
    { wch: 22 }, // Value Pack
    { wch: 14 }, // Confidence
    { wch: 12 }, // Status
    { wch: 25 }, // Source File
    { wch: 20 }, // Archive Source
    { wch: 22 }, // Date Processed
    { wch: 25 }, // Notes
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'GSS ODA Standardized');

  const timestamp = new Date().toISOString().slice(0, 10);
  const fullFileName = `${fileNamePrefix}_${timestamp}.xlsx`;
  XLSX.writeFile(workbook, fullFileName);
}

/**
 * Export products to CSV file
 */
export function exportToCSV(products: ProcessedProduct[], fileNamePrefix: string = 'GSS_ODA_Products') {
  if (products.length === 0) {
    alert('No products to export.');
    return;
  }

  const rows = prepareProductRows(products);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${fileNamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
