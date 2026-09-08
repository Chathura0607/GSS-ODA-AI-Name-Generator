# 🚀 GSS ODA AI Product Name Standardizer & Analysis Suite

A modern, high-performance web platform purpose-built for the **Operational Data Analyst (ODA)** team at **GSS**. This tool automates FMCG and retail product naming by analyzing packaging images, multi-page PDFs, and ZIP archives using Multimodal AI Vision, enforcing official GSS naming formulas and strict container classifications.

---

## 🌟 Key Features

1. **Official GSS ODA Naming Formula**:
   ```
   [Brand] [Sub-Brand] [Item] [Attributes / Flavor] [Additional Wordings] [Container Type] [Sub Packages] [Size and Measurement Unit] [Value Pack]
   ```
2. **Strict 49 Container Types Dictionary**:
   - Enforces the exact 49 container types specified by GSS guidelines (e.g. `Aluminum`, `Bottle`, `Can`, `Carton`, `Pack Plastic`, `Pack Carton`, `Pouch`, `Sachet`, `Tube`, etc.).
   - Interactive searchable container dropdown with real-time compliance validation.
3. **Multi-Format Ingestion**:
   - **Normal Images**: JPG, PNG, WEBP, BMP.
   - **PDF Documents**: High-resolution page extraction so product catalog sheets can be ingested directly.
   - **ZIP Archives**: Extracts all images inside compressed archives in the browser.
   - **Clipboard**: Direct paste support via `Ctrl + V`.
4. **Google Gemini Vision AI Engine**:
   - Powered by `gemini-2.0-flash` (or `gemini-1.5-flash` / `gemini-1.5-pro`).
   - Extracts Brand, Sub-Brand, Item, Flavor/Variant, Size, Pack Count, and matches container types accurately.
   - Zero server leakage: API keys are securely kept in client-side storage only.
5. **7-Day Retention Vault & Backup**:
   - Automatic local persistence using browser `IndexedDB`.
   - Guaranteed minimum 7-day retention (configurable up to 30 days) with automated cleanup.
   - 1-Click **JSON Full Backup & Restore** and **Excel (.xlsx) / CSV Export**.
6. **Live Rule Compliance & Inspection**:
   - Live character counter (Max 150 characters warning).
   - Alphanumeric validator.
   - Side-by-side zoomable image inspection modal for analysts to cross-check packaging details with editable fields.
7. **Free Cloud Deployment Ready**:
   - Native support for **Vercel** (`vercel.json` included).
   - Automated deployment to **GitHub Pages** (`.github/workflows/deploy.yml` included).

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser: http://localhost:3000
```

### Build for Production
```bash
npm run build
```

---

## 🌐 Free Hosting Deployment Guide

### Option 1: Deploy to Vercel (Recommended - 1 Click)
1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** and import your GitHub repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Click **"Deploy"**. Your site will be live on a free `.vercel.app` domain in under 1 minute!

### Option 2: Deploy to GitHub Pages
1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings > Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Push to `main` or trigger the workflow under the **Actions** tab. The pre-configured `.github/workflows/deploy.yml` will automatically build and publish your site!

---

## 📖 Sinhala Quick Guide (සිංහල මාර්ගෝපදේශය)

### භාවිතා කරන්නේ කෙසේද:
1. **API Key ඇතුලත් කිරීම**: ඉහළ දකුණු කෙලවරේ ඇති Settings (⚙️) icon එක click කර ඔබගේ Google Gemini API Key එක ඇතුලත් කරන්න (Google AI Studio එකෙන් නොමිලේ ලබාගත හැක).
2. **Images / Files Upload කිරීම**:
   - තනි image එකක් හෝ images ගොඩක් එකවර drag & drop කරන්න.
   - ZIP file හෝ PDF file එකක් upload කළ විට, app එක විසින් ස්වයංක්‍රීයව images extract කර එකින් එක AI හරහා analyze කර සම්මත English නම සාදයි.
   - "Load All 3 Samples" click කර GSS සාම්පල images සමඟ ක්ෂණිකව test කළ හැක.
3. **GSS Rules & 49 Container Types**:
   - GSS ODA formula එකට අනුකූලව Container types 49 පමණක් භාවිතයට ගැනීමට Dropdown එක සකසා ඇත.
   - නමේ උපරිම අකුරු ගණන 150 ඉක්මවා යන්නේද යන්න live check වේ.
4. **Excel Export & 7-Day Backup**:
   - සාදන ලද නම් සියල්ල Excel (.xlsx) හෝ CSV ලෙස download කරගත හැක.
   - දත්ත IndexedDB හරහා අවම දින 7ක් ඔබගේ පරිගණකයේ සුරක්ෂිතව තබාගත හැකි අතර JSON Backup / Restore පහසුකමද ඇත.

---

## 🛡️ Security & Privacy
- **Zero Server Key Leakage**: API Key සහ upload කරන සියලුම images ඔබගේ browser එක තුළ පමණක් ක්‍රියාත්මක වන අතර කිසිදු third-party server එකකට යවනු නොලැබේ.
- **Client-Side Extraction**: ZIP සහ PDF extraction සම්පූර්ණයෙන්ම browser එක තුළ (`jszip` සහ `pdfjs-dist`) මඟින් සිදුවේ.
