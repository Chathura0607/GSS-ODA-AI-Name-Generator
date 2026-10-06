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
}

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

export const DEFAULT_PROJECT_SCOPES: ProjectScope[] = [
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
  output += `Rules Matrix:\n`;
  
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
