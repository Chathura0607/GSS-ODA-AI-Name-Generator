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
  description: 'Official Project Scope Matrix for Diageo GR / Greece (Spirits, Non-Alcoholic Spirits, Alcoholic Ready to Drink / RTD, and Champagne). Beer & Cider, Energy Items, Food, Tea, Soft Drinks, Juice, and Medicines are strictly Out of Scope.',
  isDefault: true,
  specialNotes: [
    'Special Note : “Non-alcoholic spirits” & “MENU” products should be added under “Spirits” client category.',
    'Special Note : Only “Seedlip” brand should exists as non-alcoholic spirits (all other non-alcoholic spirit brands are strictly Out of Scope).',
    'SMART PALETTE : There are only 04 Smart Level1 ; 1. Spirits, 2. Alcoholic Ready to Drink, 3. Champagne, 4. MENU.',
    'Out of Scope Products: 1. Beer & Cider products, 2. Energy Items, 3. All food Items, 4. Tea Products, 5. Soft Drinks, 6. Juice Products, 7. Medicines and Treatments.',
    'Project Page Link regarding non-alcoholic spirits: https://confluence.trax-cloud.com/display/OPS/Diageo+Non-Alcoholic+Products',
  ],
  smartPaletteChoices: [
    'Spirits',
    'Alcoholic Ready to Drink',
    'Champagne',
    'MENU',
  ],
  inScopeList: [
    'All type of spirits (Vodka / Tequila / Rum / Whiskey / Gin..etc) -> Client Category: Spirits, Smart L1: Spirits',
    'Non-alcoholic spirits: Special Note: Only “Seedlip” brand should exists as non-alcoholic spirits -> Client Category: Spirits, Smart L1: Spirits',
    'Alcoholic Ready to Drink: All type of RTD products (Smirnoff Ice, Gordon\'s Sin Alcohol RTD, Tanqueray Gin & Tonic, canned/bottled cocktails) -> Client Category: Alcoholic Pre-Mix Drink, Smart L1: Alcoholic Ready to Drink',
    'Champagne: All type of champagne products (Veuve Clicquot, Moët & Chandon, Dom Pérignon, etc.) -> Client Category: Champagne, Smart L1: Champagne',
    'MENU products: Bar cocktail menus and spirit lists -> Client Category: Spirits, Smart L1: MENU',
  ],
  outOfScopeList: [
    '1. Beer & Cider products (All beer and cider products: Heineken, Bedele, Sofi malt, Walia, Fix, Alfa, Amstel, Guinness, Somersby, Strongbow, etc.)',
    '2. Energy Items (Energy Drinks: Red Bull, Monster, Rockstar, Hell, etc.)',
    '3. All food Items (Snacks, chips, nuts, chocolates, confectionery, biscuits, meals, sauces, condiments, etc.)',
    '4. Tea Products (Tea Items: Hot tea, iced tea, Nestea, Lipton, herbal teas, etc.)',
    '5. Soft Drinks (Soft Drinks: Coca-Cola, Pepsi, Sprite, Fanta, standalone soda & tonic waters, etc.)',
    '6. Juice Products (Juice Products: Orange juice, apple juice, fruit juices, nectars, purees, Lucozade, etc.)',
    '7. Medicines and Treatments (Pharmaceuticals, medicinal remedies, health treatments)',
    '8. Non-alcoholic spirits of any brand OTHER than "Seedlip" (e.g. Tanqueray 0.0%, Gordon\'s 0.0%, Captain Morgan 0.0% - Only Seedlip is permitted in Diageo GR scope)',
  ],
  rules: [
    {
      id: 'diageo-gr-spirits',
      scopeCategory: 'Spirits',
      traxCategory: 'Spirits',
      clientCategory: 'Spirits',
      smartL1List: [
        'Spirits',
      ],
      notes: 'In-Scope: All type of spirits (Vodka / Tequila / Rum / Whiskey / Gin..etc). Trax Category: Spirits. Client Category: Spirits. Smart L1: Spirits.',
    },
    {
      id: 'diageo-gr-non-alcoholic-spirits',
      scopeCategory: 'Non-Alcoholic Spirits',
      traxCategory: 'Spirits',
      clientCategory: 'Spirits',
      smartL1List: [
        'Spirits',
      ],
      notes: 'Special Note: Only “Seedlip” brand should exists as non-alcoholic spirits. Added under “Spirits” client category. Trax Category: Spirits. Smart L1: Spirits. Confluence: https://confluence.trax-cloud.com/display/OPS/Diageo+Non-Alcoholic+Products',
    },
    {
      id: 'diageo-gr-rtd',
      scopeCategory: 'Alcoholic Pre-Mix Drink',
      traxCategory: 'Alcoholic Ready to Drink',
      clientCategory: 'Alcoholic Pre-Mix Drink',
      smartL1List: [
        'Alcoholic Ready to Drink',
      ],
      notes: 'In-Scope: All type of RTD products (Smirnoff Ice, Gordon\'s Sin Alcohol RTD, Tanqueray Gin & Tonic). Trax Category: Alcoholic Ready to Drink. Client Category: Alcoholic Pre-Mix Drink. Smart L1: Alcoholic Ready to Drink.',
    },
    {
      id: 'diageo-gr-champagne',
      scopeCategory: 'Champagne',
      traxCategory: 'Champagne',
      clientCategory: 'Champagne',
      smartL1List: [
        'Champagne',
      ],
      notes: 'In-Scope: All type of champagne products (Veuve Clicquot, etc.). Trax Category: Champagne. Client Category: Champagne. Smart L1: Champagne.',
    },
    {
      id: 'diageo-gr-menu',
      scopeCategory: 'MENU',
      traxCategory: 'Spirits',
      clientCategory: 'Spirits',
      smartL1List: [
        'MENU',
      ],
      notes: 'Special Note: “MENU” products should be added under “Spirits” client category with Smart L1 “MENU”. Trax Category: Spirits. Client Category: Spirits. Smart L1: MENU.',
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

export function getSmartL1Options(
  scope: ProjectScope,
  traxCategory?: string,
  clientCategory?: string
): string[] {
  if (traxCategory?.toLowerCase() === 'out of scope' || clientCategory?.toLowerCase() === 'out of scope') {
    return ['Out of Scope'];
  }
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
  const unique = Array.from(new Set(allSmartL1s));
  if (unique.length > 0) return unique;
  if (scope.smartPaletteChoices && scope.smartPaletteChoices.length > 0) {
    return scope.smartPaletteChoices;
  }
  return [];
}
