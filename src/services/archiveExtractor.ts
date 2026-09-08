import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export interface ExtractedImageFile {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string; // Base64 data URL
  archiveSource?: string;
  sizeBytes: number;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif'];

function isImageFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
}

function getMimeTypeFromFileName(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.bmp')) return 'image/bmp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

/**
 * Reads a normal image File into base64 data URL
 */
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts all images from a ZIP archive
 */
export async function extractImagesFromZip(
  zipFile: File,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractedImageFile[]> {
  const jszip = new JSZip();
  const loadedZip = await jszip.loadAsync(zipFile);
  const entries = Object.values(loadedZip.files);
  const imageEntries = entries.filter(e => !e.dir && isImageFile(e.name));

  const extracted: ExtractedImageFile[] = [];
  let processed = 0;

  for (const entry of imageEntries) {
    // Skip macOS hidden __MACOSX files
    if (entry.name.includes('__MACOSX') || entry.name.startsWith('.')) {
      continue;
    }

    const mime = getMimeTypeFromFileName(entry.name);
    const base64Data = await entry.async('base64');
    const dataUrl = `data:${mime};base64,${base64Data}`;

    extracted.push({
      id: `zip_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: entry.name.split('/').pop() || entry.name,
      mimeType: mime,
      dataUrl,
      archiveSource: zipFile.name,
      sizeBytes: base64Data.length * 0.75, // approx byte size
    });

    processed++;
    if (onProgress) {
      onProgress(processed, imageEntries.length);
    }
  }

  return extracted;
}

/**
 * Extracts pages from a PDF file as images
 */
export async function extractImagesFromPdf(
  pdfFile: File,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractedImageFile[]> {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const extracted: ExtractedImageFile[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const scale = 2.0; // High resolution rendering for crisp OCR/Vision
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (context) {
      // White background
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      // @ts-ignore pdfjs-dist typing compatibility
      await page.render(renderContext).promise;

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const cleanBaseName = pdfFile.name.replace(/\.[^/.]+$/, '');

      extracted.push({
        id: `pdf_${Date.now()}_p${pageNum}_${Math.random().toString(36).substring(2, 7)}`,
        name: `${cleanBaseName}_Page_${pageNum}.jpg`,
        mimeType: 'image/jpeg',
        dataUrl,
        archiveSource: pdfFile.name,
        sizeBytes: dataUrl.length * 0.75,
      });
    }

    if (onProgress) {
      onProgress(pageNum, numPages);
    }
  }

  return extracted;
}

/**
 * Unified file processor: accepts standard image, ZIP, PDF, or RAR.
 * Returns an array of ExtractedImageFile objects ready for AI analysis.
 */
export async function processUploadedFile(
  file: File,
  onProgress?: (msg: string) => void
): Promise<ExtractedImageFile[]> {
  const fileName = file.name.toLowerCase();

  // 1. Regular image
  if (isImageFile(fileName) || file.type.startsWith('image/')) {
    onProgress?.(`Processing image ${file.name}...`);
    const dataUrl = await fileToDataUrl(file);
    return [
      {
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        name: file.name,
        mimeType: file.type || getMimeTypeFromFileName(file.name),
        dataUrl,
        sizeBytes: file.size,
      },
    ];
  }

  // 2. ZIP Archive
  if (fileName.endsWith('.zip') || file.type.includes('zip')) {
    onProgress?.(`Extracting images from ZIP archive: ${file.name}...`);
    const extracted = await extractImagesFromZip(file, (curr, total) => {
      onProgress?.(`Extracted ${curr} of ${total} images from ${file.name}...`);
    });
    if (extracted.length === 0) {
      throw new Error(`No supported image files (.png, .jpg, .webp) found inside "${file.name}".`);
    }
    return extracted;
  }

  // 3. PDF Document
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    onProgress?.(`Rendering PDF pages to images: ${file.name}...`);
    const extracted = await extractImagesFromPdf(file, (curr, total) => {
      onProgress?.(`Rendered page ${curr} of ${total} from ${file.name}...`);
    });
    return extracted;
  }

  // 4. RAR Archive warning / handling
  if (fileName.endsWith('.rar')) {
    throw new Error(
      `RAR file detected: "${file.name}". For maximum browser speed and security, please extract the RAR folder or convert it to a standard .ZIP archive before uploading.`
    );
  }

  throw new Error(`Unsupported file type: "${file.name}". Please upload images (PNG, JPG, WEBP), ZIP archives, or PDF files.`);
}
