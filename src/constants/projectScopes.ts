export interface ProjectScopeRule {
  id: string;
  scopeCategory: string; // 1st Column / Scope Group (e.g. Feinkost & Ketchup)
  traxCategory: string;  // 2nd Column / Trax Category (e.g. Sauces & Condiment)
  clientCategory: string;// 3rd Column / Client Category (e.g. Sauces & Ketchup)
  smartL1List: string[]; // 4th Column / Smart L1 options (e.g. Aioli Sauce, BBQ Sauce, Ketchup, etc.)
  notes?: string;
}

export interface ProjectScope {
  id: string;
  name: string;
  clientName: string;
  country: string;
  description?: string;
  isDefault?: boolean;
  rules: ProjectScopeRule[];
  smartPaletteChoices?: string[];
  specialNotes?: string[];
  inScopeList?: string[];
  outOfScopeList?: string[];
}

export const DIAGEO_GR_SCOPE: ProjectScope = {
  id: 'diageo-gr',
  name: 'Diageo GR Project Scope',
  clientName: 'Diageo GR',
  country: 'Greece',
  description: 'Official Project Scope Matrix for Diageo GR / Greece (Spirits, Non-Alcoholic Spirits, Alcoholic Ready to Drink / RTD, and Champagne). Beer, Cider, Food, Energy & Soft Drinks are strictly Out of Scope.',
  isDefault: true,
  specialNotes: [
    'Special Note : "Non-alcoholic spirits" & "MENU" products should be added under "Spirit" client category.',
    'SMART PALETTE: There are only 04 Smart Level1 choices in Trax: 1. Spirits, 2. Alcoholic Ready to Drink, 3. Champagne, 4. MENU.',
    'Out of Scope Products: Beer & Cider, Energy Items, All food Items, Tea Products, Soft Drinks, Juice Products, Medicines and Treatments.',
  ],
  smartPaletteChoices: [
    'Spirits',
    'Alcoholic Ready to Drink',
    'Champagne',
    'MENU',
  ],
  inScopeList: [
    'All types of Spirits: Whisky / Whiskey (Scotch, Single Malt, Blended, Bourbon, Irish), Vodka, Gin, Rum, Tequila, Mezcal, Brandy, Cognac, Liqueurs, Greek local specialties (Ouzo, Tsipouro, Tsikoudia, Metaxa), Cocktail Mixers',
    'Non-Alcoholic Spirits: Alcohol-free 0.0% spirits (Tanqueray 0.0%, Gordon\'s 0.0%, Captain Morgan 0.0%, Seedlip range, alcohol-free botanicals)',
    'All types of Alcoholic Ready to Drink (RTD) / Pre-Mix Products: Pre-mixed spirit drinks, canned cocktails, hard seltzers, Smirnoff Ice, Gordon\'s & Tonic, Captain Morgan & Cola',
    'All types of Champagne products: Champagne (Moët & Chandon, Veuve Clicquot, Dom Pérignon, Ruinart, Krug), Champagne/Spirits, Sparkling Wine, Prosecco, Cava',
    'MENU Products: Bar cocktail menus, spirit lists, tasting menu packs (Client Category: Spirit, Smart L1: MENU)',
  ],
  outOfScopeList: [
    'Beer & Cider products (e.g. Heineken, Mythos, Fix, Alfa, Amstel, Guinness, Somersby, Strongbow)',
    'Energy Items (e.g. Red Bull, Monster, Hell, Rockstar)',
    'All food Items (e.g. Snacks, chips, nuts, chocolates, confectionery, biscuits, meals, sauces, condiments)',
    'Tea Products (e.g. Hot tea bags, iced tea, Nestea, Lipton, herbal teas)',
    'Soft Drinks (e.g. Coca-Cola, Pepsi, Sprite, Fanta, standalone soda water, tonic water sold as soft drinks)',
    'Juice Products (e.g. Orange juice, apple juice, fruit juices, nectars, purees)',
    'Medicines and Treatments (e.g. Pharmaceuticals, medicinal remedies, health treatments)',
  ],
  rules: [
    {
      id: 'diageo-gr-spirits',
      scopeCategory: 'Spirits',
      traxCategory: 'Spirits',
      clientCategory: 'Spirit',
      smartL1List: [
        'Spirits',
        'MENU',
        'Whisky',
        'Scotch Whisky',
        'Single Malt Scotch Whisky',
        'Blended Scotch Whisky',
        'Bourbon',
        'Irish Whiskey',
        'Vodka',
        'Gin',
        'Rum',
        'Tequila',
        'Mezcal',
        'Liqueurs',
        'Brandy',
        'Cognac',
        'Ouzo',
        'Tsipouro',
        'Metaxa',
        'Non-Alcoholic Spirits',
        'Cocktail Mixers',
      ],
      notes: 'In Scope: All spirit types. Trax Category: Spirits. Client Category: Spirit. Smart Level1 in Trax: Spirits (or MENU for menus).',
    },
    {
      id: 'diageo-gr-non-alcoholic-spirits',
      scopeCategory: 'Non-Alcoholic Spirits',
      traxCategory: 'Spirits',
      clientCategory: 'Spirit',
      smartL1List: [
        'Spirits',
        'Non-Alcoholic Spirits',
        '0.0% Spirits',
      ],
      notes: 'Special Note: "Non-alcoholic spirits" products must be added under "Spirit" client category and "Spirits" Trax Category.',
    },
    {
      id: 'diageo-gr-rtd',
      scopeCategory: 'Alcoholic Pre-Mix Drink',
      traxCategory: 'Alcoholic Ready to Drink',
      clientCategory: 'Alcoholic Pre-Mix Drink',
      smartL1List: [
        'Alcoholic Ready to Drink',
        'Alcoholic Pre-Mix Drink',
        'RTD',
        'Hard Seltzer',
        'Canned Cocktail',
      ],
      notes: 'In Scope: All RTD and pre-mix drinks. Trax Category: Alcoholic Ready to Drink. Client Category: Alcoholic Pre-Mix Drink. Smart Level1: Alcoholic Ready to Drink.',
    },
    {
      id: 'diageo-gr-champagne',
      scopeCategory: 'Champagne',
      traxCategory: 'Champagne/Spirits',
      clientCategory: 'Champagne',
      smartL1List: [
        'Champagne',
        'Champagne/Spirits',
        'Sparkling Wine',
        'Prosecco',
        'Cava',
      ],
      notes: 'In Scope: All champagne and sparkling wine products. Trax Category: Champagne/Spirits. Client Category: Champagne. Smart Level1: Champagne.',
    },
    {
      id: 'diageo-gr-menu-spirits',
      scopeCategory: 'MENU',
      traxCategory: 'Spirits',
      clientCategory: 'Spirit',
      smartL1List: [
        'MENU',
        'Spirits',
      ],
      notes: 'Special Note: MENU products should be added under "Spirit" client category with Smart Level1 "MENU".',
    },
    {
      id: 'diageo-gr-general',
      scopeCategory: 'General',
      traxCategory: 'General',
      clientCategory: 'General',
      smartL1List: [
        'General',
        'MENU',
      ],
      notes: 'General products and auxiliary bar items. Trax Category: General. Client Category: General.',
    },
  ],
};

export const KRAFT_HEINZ_GERMANY_SCOPE: ProjectScope = {
  id: 'kraft-heinz-germany',
  name: 'Kraft Heinz Germany Project Scope',
  clientName: 'Kraft Heinz',
  country: 'Germany',
  description: 'Official FMCG Scope Matrix for Kraft Heinz Germany (Feinkost, Ketchup, Mayonnaise, Spices, Pasta Sauce & Beanz).',
  isDefault: true,
  rules: [
    {
      id: 'kh-de-feinkost-ketchup',
      scopeCategory: 'Feinkost & Ketchup (incl Curry Gewürz Ketchup)',
      traxCategory: 'Sauces & Condiment',
      clientCategory: 'Sauces & Ketchup',
      smartL1List: [
        'Aioli Sauce',
        'BBQ Sauce',
        'Cheese Sauce',
        'Chili Sauce',
        'Cocktail Sauce',
        'Curry Sauce',
        'Guacamole Sauce',
        'Hamburger/Burger/Hotdog Sauce',
        'Ketchup',
        'Knoblauch (Garlic) Sauce',
        'Paprika Sauce',
        'Ranch Sauce',
        'Schaschlik Sauce (A traditional German/Eastern European style)',
        'Senf Sauce (Mustard Sauce)',
        'Sour Cream Sauce',
        'Steak Sauce',
        'Suss-Saur (Sweet-Sour) Sauce',
        'Tahini Sauce',
        'Tartare Sauce',
        'Tex-Mex (Refers to a flavor style/cuisine)',
        'Karibik (Caribbean) Sauce',
        'Sauce for Veggies',
        "Sauce does not fall under the categories of 'Mayonnaise' or 'Tomato Sauce/Paste'.",
      ],
      notes: 'Includes all special German condiment sauces, curry sauces, and table ketchup.',
    },
    {
      id: 'kh-de-mayo-remoulade',
      scopeCategory: 'Mayonnaise & Remoulade',
      traxCategory: 'Sauces & Condiments',
      clientCategory: 'Mayonnaise',
      smartL1List: [
        'Mayonnaise, Remoulade – herbed mayonnaise-based sauce for fish or fries, Frites (fries) Sauce and Pommes Sauce',
        'Mayonnaise',
        'Remoulade',
        'Frites Sauce',
        'Pommes Sauce',
      ],
      notes: 'Mayonnaise and remoulade preparations for fries and fish.',
    },
    {
      id: 'kh-de-spices-gewurzdosen',
      scopeCategory: 'Spices (Gewürzdosen)',
      traxCategory: 'Salt & Spices & Seasoning',
      clientCategory: 'Spices & Seasoning',
      smartL1List: [
        'Spices, Seasoning Mix',
        'Spices',
        'Seasoning Mix',
      ],
      notes: 'Gewürzdosen, dry herbs, salt, spice blends, and seasonings.',
    },
    {
      id: 'kh-de-tomato-pasta',
      scopeCategory: 'Tomato Base & Pasta Sauce',
      traxCategory: 'Sauces & Condiments',
      clientCategory: 'Tomato Sauce/Paste',
      smartL1List: [
        'Tomato Sauce',
        'Tomato Paste',
        'Tomato Sauce / Tomato Paste',
      ],
      notes: 'Tomato purees, passata, tomato pastes, and prepared pasta sauces.',
    },
    {
      id: 'kh-de-beanz-canned',
      scopeCategory: 'Beanz',
      traxCategory: 'Canned Food',
      clientCategory: 'Beans',
      smartL1List: [
        'Canned Baked Beans',
        'Baked Beans',
      ],
      notes: 'Traditional canned Heinz baked beans in tomato sauce.',
    },
    {
      id: 'kh-de-beanz-instant',
      scopeCategory: 'Beanz',
      traxCategory: 'Instant Meals',
      clientCategory: 'Beans',
      smartL1List: [
        'Baked Beans (Bottles, Pouches, etc.)',
        'Baked Beans (Pouches)',
        'Baked Beans (Bottles)',
      ],
      notes: 'Baked beans packaged in non-can formats (pouches, microwaveable tubs, bottles).',
    },
  ],
};

export const DIAGEO_IE_SCOPE: ProjectScope = {
  id: 'diageo-ie',
  name: 'Diageo IE Project Scope',
  clientName: 'Diageo IE',
  country: 'Ireland',
  description: 'Official Project Scope Matrix for Diageo IE (Spirits, Beer & Cider, and Alcoholic Ready to Drink / RTD).',
  isDefault: true,
  rules: [
    {
      id: 'diageo-ie-spirits',
      scopeCategory: 'Spirits',
      traxCategory: 'Spirits',
      clientCategory: 'Spirits',
      smartL1List: [
        'Spirits',
        'Brandy',
        'Gin',
        'Liqueurs',
        'Rum',
        'Tequila',
        'Vodka',
        'Whisky',
        'Non-Alcoholic Spirits',
        'Cocktail Mixers',
      ],
      notes: 'In Scope Products: Brandy, Gin, Liqueurs, Rum, Tequila, Vodka, Whisky, Non-Alcoholic Spirits, Cocktail Mixers.',
    },
    {
      id: 'diageo-ie-beer',
      scopeCategory: 'Beer',
      traxCategory: 'Beer & Cider',
      clientCategory: 'Beer',
      smartL1List: [
        'Beer & Cider',
        'Beer',
        'Cider',
        'Non-Alcoholic Beers',
      ],
      notes: 'In Scope Products: Beer, Cider, Non-Alcoholic Beers.',
    },
    {
      id: 'diageo-ie-rtd',
      scopeCategory: 'RTD',
      traxCategory: 'Alcoholic Ready to Drink',
      clientCategory: 'RTD',
      smartL1List: [
        'RTD',
        'Alcoholic Ready to Drink',
        'Alcoholic Pre-Mix Drink',
        'Non-Alcoholic RTDs',
      ],
      notes: 'In Scope Products: Alcoholic Pre-Mix Drink, RTD, Non-Alcoholic RTDs.',
    },
  ],
};

export const DEFAULT_PROJECT_SCOPES: ProjectScope[] = [
  DIAGEO_GR_SCOPE,
  DIAGEO_IE_SCOPE,
  KRAFT_HEINZ_GERMANY_SCOPE,
  {
    id: 'general-fmcg-global',
    name: 'General FMCG (Standard Global Scope)',
    clientName: 'General FMCG',
    country: 'Global',
    description: 'Standard retail FMCG classification across all consumer categories.',
    isDefault: false,
    rules: [
      {
        id: 'gen-beverages',
        scopeCategory: 'Beverages & Soft Drinks',
        traxCategory: 'Beverages',
        clientCategory: 'Soft Drinks & Juices',
        smartL1List: ['Carbonated Soft Drink', 'Energy Drink', 'Mineral Water', 'Fruit Juice', 'Ready to Drink Tea', 'Coffee Drink'],
      },
      {
        id: 'gen-snacks',
        scopeCategory: 'Snacks & Confectionery',
        traxCategory: 'Snack Food',
        clientCategory: 'Biscuits & Chocolate',
        smartL1List: ['Chocolate Bar', 'Biscuits', 'Crackers', 'Potato Chips', 'Gummy Candy', 'Chewing Gum'],
      },
      {
        id: 'gen-personal-care',
        scopeCategory: 'Personal Care & Hygiene',
        traxCategory: 'Personal Care',
        clientCategory: 'Bath & Body',
        smartL1List: ['Body Wash', 'Shower Gel', 'Hand Wash', 'Shampoo', 'Toothpaste', 'Deodorant'],
      },
    ],
  },
];

/**
 * Format project scope rules into a clean markdown/text guide for LLM prompt injection
 */
export function formatScopeForPrompt(scope: ProjectScope): string {
  let output = `### PROJECT SCOPE: ${scope.name} (Client: ${scope.clientName}, Country: ${scope.country})\n`;
  if (scope.description) {
    output += `Description: ${scope.description}\n`;
  }

  if (scope.specialNotes && scope.specialNotes.length > 0) {
    output += `\nSPECIAL SCOPE RULES & MANDATES:\n`;
    scope.specialNotes.forEach(note => {
      output += `- ${note}\n`;
    });
  }

  if (scope.smartPaletteChoices && scope.smartPaletteChoices.length > 0) {
    output += `\nTRAX SMART PALETTE (Only ${scope.smartPaletteChoices.length} valid Smart Level1 options in Trax):\n`;
    scope.smartPaletteChoices.forEach((choice, i) => {
      output += `  ${i + 1}. "${choice}"\n`;
    });
  }

  if (scope.inScopeList && scope.inScopeList.length > 0) {
    output += `\nIN-SCOPE PRODUCTS (Must be classified using the scope matrix below):\n`;
    scope.inScopeList.forEach(item => {
      output += `- IN-SCOPE: ${item}\n`;
    });
  }

  if (scope.outOfScopeList && scope.outOfScopeList.length > 0) {
    output += `\nOUT-OF-SCOPE PRODUCTS (STRICT MANDATE - If the uploaded product falls into ANY of these categories, you MUST set scopeCategory: "Out of Scope", traxCategory: "Out of Scope", clientCategory: "Out of Scope", smartL1: "Out of Scope", and in notes explain why it is out of scope):\n`;
    scope.outOfScopeList.forEach(item => {
      output += `- OUT OF SCOPE: ${item}\n`;
    });
  }

  output += `\nRules Matrix (Column Mapping):\n`;
  scope.rules.forEach((r, idx) => {
    output += `Rule #${idx + 1}:\n`;
    output += `- Scope Group / 1st Column: "${r.scopeCategory}"\n`;
    output += `- Trax Category / 2nd Column: "${r.traxCategory}"\n`;
    output += `- Client Category / 3rd Column: "${r.clientCategory}"\n`;
    output += `- Smart L1 Options / Last Column:\n`;
    r.smartL1List.forEach(s => {
      output += `  * "${s}"\n`;
    });
    if (r.notes) output += `  (Note: ${r.notes})\n`;
  });

  return output;
}

/**
 * Helper to get unique Trax Categories for a given scope
 */
export function getUniqueTraxCategories(scope: ProjectScope): string[] {
  return Array.from(new Set(scope.rules.map(r => r.traxCategory)));
}

/**
 * Helper to get Client Categories corresponding to a Trax Category
 */
export function getClientCategoriesForTrax(scope: ProjectScope, traxCategory?: string): string[] {
  if (!traxCategory) {
    return Array.from(new Set(scope.rules.map(r => r.clientCategory)));
  }
  return Array.from(
    new Set(
      scope.rules
        .filter(r => r.traxCategory.toLowerCase() === traxCategory.toLowerCase())
        .map(r => r.clientCategory)
    )
  );
}

/**
 * Helper to get Smart L1 options corresponding to Trax and Client Categories
 */
export function getSmartL1Options(
  scope: ProjectScope,
  traxCategory?: string,
  clientCategory?: string
): string[] {
  let matchedRules = scope.rules;
  if (traxCategory) {
    matchedRules = matchedRules.filter(
      r => r.traxCategory.toLowerCase() === traxCategory.toLowerCase()
    );
  }
  if (clientCategory) {
    matchedRules = matchedRules.filter(
      r => r.clientCategory.toLowerCase() === clientCategory.toLowerCase()
    );
  }

  const allSmartL1s = matchedRules.flatMap(r => r.smartL1List);
  return Array.from(new Set(allSmartL1s));
}
