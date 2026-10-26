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
4. **Google Gemini Vision AI Engine with Simple Google Search AI**:
   - **Google AI Studio Free Tier Optimized**: Direct integration with Google Gemini (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`).
   - **Simple Google Search AI**: Zero tool quota exhaustion! Extracts GSS attributes and generates precision Google Search & Google Shopping SKU links for instant 1-click web verification.
   - **Live Knowledge Grounding**: Integrated with live Wikipedia brand intelligence API and direct corporate parent search.
   - **Zero server leakage**: API keys are securely kept in client-side storage only.
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

## 🎯 Project Scope & Scope Matrix Hub

The suite comes with official pre-configured FMCG and Liquor project templates, fully mapped into the 4-column Trax/Client matrix:

### 1. Diageo GR (Greece) Project Scope (NEW)
Tailored for the **Diageo Greece** cataloguing workflow:
- **Client Category vs Trax Category Matrix**:
  | 1st Col: Scope Group | 2nd Col: Trax Category | 3rd Col: Client Category | Last Col: Smart L1 (Trax Palette) |
  | :--- | :--- | :--- | :--- |
  | **Spirits** | Spirits | Spirit | Spirits, MENU, Whisky, Vodka, Gin, Rum, Tequila, Brandy |
  | **Non-Alcoholic Spirits** | Spirits | Spirit | Spirits, Non-Alcoholic Spirits |
  | **Alcoholic Pre-Mix Drink** | Alcoholic Ready to Drink | Alcoholic Pre-Mix Drink | Alcoholic Ready to Drink, RTD, Hard Seltzer |
  | **Champagne** | Champagne/Spirits | Champagne | Champagne, Sparkling Wine |
  | **MENU** | Spirits / General | Spirit / General | MENU |
- **Smart Palette Rule**: In Trax Smart Palette, there are strictly **04 Smart Level1** options:
  1. `Spirits`
  2. `Alcoholic Ready to Drink`
  3. `Champagne`
  4. `MENU`
- **Special Mandates**:
  - *"Non-alcoholic spirits"* (e.g. Tanqueray 0.0%, Gordon's 0.0%, Seedlip) & *"MENU"* products MUST be categorized under the **"Spirit"** client category.
- **In-Scope Products**:
  - All types of spirits (Whisky, Scotch, Vodka, Gin, Rum, Tequila, Mezcal, Brandy, Cognac, Liqueurs, Greek local spirits: Metaxa, Ouzo, Tsipouro).
  - Non-Alcoholic spirits (0.0% spirits and non-alcoholic botanicals).
  - All types of RTD / Pre-mix drinks (Smirnoff Ice, canned cocktails, hard seltzers).
  - All types of Champagne & Champagne/Spirits.
  - Bar menus & tasting kits.
- **Strict Out-of-Scope Products (7 Categories - Flagged Automatically)**:
  1. **Beer & Cider products** (Heineken, Mythos, Fix, Amstel, Guinness, Somersby, Strongbow, etc.)
  2. **Energy Items** (Red Bull, Monster, Hell, etc.)
  3. **All food Items** (Snacks, chips, nuts, chocolates, confectionery, biscuits, meals, sauces)
  4. **Tea Products** (Hot tea, iced tea, herbal infusions, Lipton, Nestea)
  5. **Soft Drinks** (Coca-Cola, Pepsi, Sprite, Fanta, standalone soda & tonic waters)
  6. **Juice Products** (Fruit juices, nectars, purees)
  7. **Medicines and Treatments** (Pharmaceuticals, remedies, medicated items)

### 2. Diageo IE (Ireland) Project Scope
- In Scope: Spirits, Beer & Cider, and Alcoholic Ready to Drink (RTD).

### 3. Kraft Heinz Germany Project Scope
- Official FMCG Matrix for Sauces, Ketchup, Mayonnaise, Spices (Gewürzdosen), Tomato Paste, and Baked Beans.

---

## 📖 Sinhala Quick Guide (සිංහල මාර්ගෝපදේශය)

### භාවිතා කරන්නේ කෙසේද:
1. **API Key ඇතුලත් කිරීම**: ඉහළ දකුණු කෙලවරේ ඇති Settings (⚙️) icon එක click කර ඔබගේ **Google Gemini API Key** එක ඇතුලත් කරන්න (Google AI Studio වෙතින් නොමිලේ ලබාගත හැක). Simple Google Search AI තාක්ෂණය මඟින් නොමිලේ ලබාගත් Gemini key එකකින් කිසිදු rate limit හෝ tool quota ගැටලුවකින් තොරව ක්‍රියාත්මක වේ.
2. **Project Scope එක තේරීම (Diageo GR / Diageo IE / Kraft Heinz)**:
   - ඉහළ Navbar එකේ ඇති **"Project Scope"** button එක click කරන්න.
   - **Diageo GR Project Scope** එක තෝරා "Use This Project Scope" click කරන්න.
   - එවිට uploaded image එකක් analyze කරන විට Diageo GR සඳහා වන Trax Category (Col 2), Client Category (Col 3), සහ Smart Level1 (Col 4) ස්වයංක්‍රීයව AI මඟින් නිවැරදිව තෝරාගනී.
   - Beer, Cider, Soft Drink, Energy Drink, Food හෝ Juice වැනි Out-of-Scope නිෂ්පාදනයක් upload වුවහොත්, පද්ධතිය එය ක්ෂණිකව **"OUT OF SCOPE"** ලෙස red warning එකක් සහිතව හඳුනාගනී.
3. **Images / Files Upload කිරීම**:
   - තනි image එකක් හෝ images ගොඩක් එකවර drag & drop කරන්න.
   - ZIP file හෝ PDF file එකක් upload කළ විට, app එක විසින් ස්වයංක්‍රීයව images extract කර එකින් එක AI හරහා analyze කර සම්මත English නම සාදයි.
   - "Load All 3 Samples" click කර GSS සාම්පල images සමඟ ක්ෂණිකව test කළ හැක.
4. **GSS Rules & 49 Container Types**:
   - GSS ODA formula එකට අනුකූලව Container types 49 පමණක් භාවිතයට ගැනීමට Dropdown එක සකසා ඇත.
   - නමේ උපරිම අකුරු ගණන 150 ඉක්මවා යන්නේද යන්න live check වේ.
5. **Excel Export & 7-Day Backup**:
   - සාදන ලද නම් සියල්ල Excel (.xlsx) හෝ CSV ලෙස download කරගත හැක (Scope Columns Col 1, Col 2, Col 3, Col 4 ඇතුලත්ව).
   - දත්ත IndexedDB හරහා අවම දින 7ක් ඔබගේ පරිගණකයේ සුරක්ෂිතව තබාගත හැකි අතර JSON Backup / Restore පහසුකමද ඇත.

---

## 🛡️ Security & Privacy
- **Zero Server Key Leakage**: API Key සහ upload කරන සියලුම images ඔබගේ browser එක තුළ පමණක් ක්‍රියාත්මක වන අතර කිසිදු third-party server එකකට යවනු නොලැබේ.
- **Client-Side Extraction**: ZIP සහ PDF extraction සම්පූර්ණයෙන්ම browser එක තුළ (`jszip` සහ `pdfjs-dist`) මඟින් සිදුවේ.
