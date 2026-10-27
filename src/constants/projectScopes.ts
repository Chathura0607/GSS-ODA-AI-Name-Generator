export interface ProjectScopeRule {
  id: string;
  scopeCategory: string; // 1st Column / Scope Group (e.g. Feinkost & Ketchup)
  traxCategory: string;  // 2nd Column / Trax Category (e.g. Sauces & Condiment)
  clientCategory: string;// 3rd Column / Client Category (e.g. Sauces & Ketchup)
  smartL1List: string[]; // 4th Column / Smart L1 options (e.g. Aioli Sauce, BBQ Sauce, Ketchup, etc.)
  notes?: string;
  inScopeProducts?: string[];
  outOfScopeProducts?: string[];
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

export const UNILEVER_PT_SCOPE: ProjectScope = {
  id: 'unilever-pt',
  name: 'Unilever PT Project Scope',
  clientName: 'Unilever PT',
  country: 'Portugal',
  description: 'Official Project Scope Matrix for Unilever Portugal (Personal Care, Home Care, Foods, Refreshments & Ice Cream).',
  isDefault: true,
  smartPaletteChoices: [
    'APDO',
    'Hair Care',
    'Bath Care',
    'Bar Soap',
    'Face / Body Care',
    'Lip Balm',
    'Fabric Cleaning',
    'Fabric Enhancer',
    'Salt & Spices & Seasoning',
    'Dry Cooking Ingredients',
    'Prepared Meals & Soups',
    'Sauces & Condiments',
    'RTD Tea',
    'Tea',
    'Household Care',
    'Ice Cream & Ice Pops',
  ],
  specialNotes: [
    'Scope covers 16 core categories across Unilever PT (Personal Care, Home Care, Foods, Refreshments, and Ice Cream).',
    'Skin Care branches into two distinct Trax Categories & Smart L1s: "Face / Body Care" and "Lip Balm".',
    'Pallet display formats for Fabric Cleaning, Fabric Enhancer, and RTD ("Fabric Cleaning-Pallets", "Fabric Enhancer-Pallets", "RTD-Pallets") map to their primary categories.',
    'Ice Cream covers both "Ice Cream Horizontal Coolers" and "Ice Cream Vertical Coolers" under Client Category "Ice Cream" and Trax Category / Smart L1 "Ice Cream & Ice Pops".',
    'Strict Out-of-Scope exclusions apply: Foot Deodorants, Perfumes, Deodorant Wipes, Hair Coloring/Dyes, Styling Products, Baby Care, Intimate Hygiene, Hand Wash Laundry Detergents, Specialist Wool/Silk Detergents, Stain Removers, Bleach/Disinfectants, Machine Descalers, Ironing Waters, Ready Meals, Liquid/Canned Soups, Cooking/Pasta Sauces (Pesto, Bolognese, Francesinha), Tomato Purees, Asian Sauces, Hot/Piri-piri Sauces, Soft Drinks, Juices, Sangria, Coffee, and Air Fresheners.',
  ],
  inScopeList: [
    'Deodorant: Body Sprays (Female/Male), Deodorants (Female/Male), Deodorant Creams -> APDO',
    'Hair Care: All purpose Shampoo (Pre, Dry, Solid Etc. - for Hair/Beard/Face), Hair conditioner, Hair Treatment products (Masks, Oil, Serum, Spray, Cream, Ampoules) -> Hair Care',
    'Skin Cleansing: Shower Gel/ Shower Oil, Bath Foams, Body and Hair Washes (Head to Toe) -> Bath Care',
    'Soap: Solid soap, Liquid soap, Face + Body soap, Hand wash -> Bar Soap',
    'Skin Care: Body Creams / Lotions / Milk / Gel / Body, Body Oil / Body Serum, Multi-purpose Creams, Hand Cream/ Oil, Hand & Nail Cream/Oil, Face + Hand + Body Cream, Anti-cellulite; slimming, Vaseline -> Face / Body Care',
    'Lip Balm: Lip Balm, Lip Cream -> Lip Balm',
    'Fabric Cleaning: Laundry Detergent (Powder, Liquid, Capsules, Leaves) -> Fabric Cleaning',
    'Fabric Enhancer: Fabric Softeners, Perfume Enhancer / Perfume Spray -> Fabric Enhancer',
    'SCA - Bouillons: Broths (cube, powder, jelly), Seasonings (cube, powder, jelly), Sauces (cube, powder, jelly) -> Salt & Spices & Seasoning',
    'Snacking / Mini Meal: Rice, Noodles, Pasta, Mashed Potatoes (Pots / Blocks) -> Dry Cooking Ingredients',
    'SCA - Soups: Dehydrated soups (powder) -> Prepared Meals & Soups',
    'Dressing / Condiment: Mayonnaise, Ketchup, Mustard, Garlic Sauce, Barbecue Sauce, Burger Sauce, Cocktail Sauce, 3 Peppers Sauce, Caesar Sauce, Yogurt Sauce, Sweet Sauce, Sour Sauce -> Sauces & Condiments',
    'RTD: Ice Teas (core, zero, green) -> RTD Tea',
    'Leaf Tea: Tea (bags/loose leaf), Infusion (bags/loose leaf) -> Tea',
    'House Hold Cleaning: Kitchen sprays (degreasers, vitroceramic, ovens, stainless steel), Bathroom Cleaning Sprays, Multipurpose/Multisurface Cleaning Sprays, Glass Cleaner sprays, Furniture Cleaning Sprays, Perfumed liquid detergents for floor/multi surface cleaning, Bleach sprays -> Household Care',
    'Ice Cream: Ice Cream, Ice Pops, Ice Cream Cookie Sandwich, Ice Cream Cake & Tart -> Ice Cream & Ice Pops',
  ],
  outOfScopeList: [
    'Deodorant Exclusions: Foot Deodorant, Perfume, Deodorant Wipes',
    'Hair Care Exclusions: Colored shampoo/Hair coloring / Bleaching, Styling Foam/Mousse/Cream/Gel/Wax/Paste/Styling/Texturizing/Clasp/Spray, Child/Baby, Appliances and accessories',
    'Skin Cleansing Exclusions: Body Scrub, Intimate Hygiene Gel, Child/Baby Products',
    'Soap Exclusions: Intimate Hygiene Soap, Child/Baby Products, Appliances and accessories',
    'Skin Care Exclusions: Foot Cream / Mask / Treatment Foot & Leg, Cream / Mask / Treatment Nail & Cuticle Cream /Oil, Treatment Intimate Hygiene Cream Sunscreens, Hair Removal (cream/gel/razors), Makeup (face, eyes, lips, nails), Acetone/Barba, Body Scrub, Baby Cream/Lotion, Aftershave, Body colognes and fragrances',
    'Lip Balm Exclusions: Alcohol Gel',
    'Fabric Cleaning Exclusions: Hand Laundry Detergent, Specialist Laundry Detergent (Wool & Silk, Woolite, Soflan), Additives and Auxiliaries: Stain Remover, Color Protection Wipes, Bleach/ Disinfectant / Percarbonate/ Whiteners/Dyes, Machine Treatment: Anti-limescale, Descaling, Machine Cleaner, Dry Wash Spray, Easy Glue',
    'Fabric Enhancer Exclusions: Fabric Ironing Water, Perfumed Water, Textile Air Freshener',
    'SCA - Bouillons Exclusions: Spices / Seasonings Sachet, Potato Flake, Canned meal',
    'Snacking Exclusions: Ready Meals',
    'SCA - Soups Exclusions: Liquid soup, Miso soup, Spices/Seasonings (sachet)',
    'Dressing Exclusions: Spices / Seasonings (sachet), Tomato (sauce, pieces, pulp, crushed), Milk / Coconut Cream, Soy Sauce/Worcestershire Sauce/Teriyaki Sauce/Oyster Sauce/Hoisin Sauce, Wok / Wasabi, Tabasco / Piri-piri / Spicy / Jindungo Garlic, Paste / Pepper / Ginger, Seasoning Lemon/Lime Juice, Spreadable Sauce (Guacamole/Tahini/Cheese Sauce/Hummus), Vinaigrette, Chutney, Cooking Sauce (Basil/Pesto/Bolognese/Neapolitan/Arrabbiata/Francesinha)',
    'RTD Exclusions: Herbal teas, Kombucha, Soft drink (with/without gas)/Ginger ale/Tonic water, Nectars/Fruit Juices, Concentrated juices/powder, Sangria (Bloodletting), Water/Flavored water/Vitamin, Juices',
    'Leaf Tea Exclusions: Tea Capsules, Cafe (Coffee), Soluble Chocolate, Cereal Beverages, Juices',
    'House Hold Cleaning Exclusions: Air Freshener Sprays/Insecticide sprays/Shoe sprays/Sanitary Abrasive Sprays, Furniture Cleaner Aerosols/Ammoniacal all-purpose cleaner, Cleaning vinegars/Lixivias, Refrigerator Cleaning Sprays/Vitroceramic Cleaning Creams, Floor Cleaning Capsules/Carpet Cleaning Detergents, Specific floor cleaning products: waxes, strippers, washes & waxes, wood floor restorers, etc., Wash Everything Gel',
  ],
  rules: [
    {
      id: 'unilever-pt-deodorant',
      scopeCategory: 'Deodorant',
      traxCategory: 'APDO',
      clientCategory: 'Deodorant',
      smartL1List: [
        'APDO',
        'Body Sprays (Female/Male)',
        'Deodorants (Female/Male)',
        'Deodorant Creams',
      ],
      inScopeProducts: [
        'Body Sprays (Female/Male)',
        'Deodorants (Female/Male)',
        'Deodorant Creams',
      ],
      outOfScopeProducts: [
        'Foot Deodorant',
        'Perfume',
        'Deodorant Wipes',
      ],
      notes: 'In-Scope: Body Sprays (Female/Male), Deodorants (Female/Male), Deodorant Creams. Excluded: Foot Deodorant, Perfume, Deodorant Wipes.',
    },
    {
      id: 'unilever-pt-hair-care',
      scopeCategory: 'Hair Care',
      traxCategory: 'Hair Care',
      clientCategory: 'Hair Care',
      smartL1List: [
        'Hair Care',
        'All purpose Shampoo',
        'Hair conditioner',
        'Hair Treatment products',
      ],
      inScopeProducts: [
        'All purpose Shampoo (Pre, Dry, Solid Etc. - for Hair/Beard/Face)',
        'Hair conditioner',
        'Hair Treatment products (Masks, Oil, Serum, Spray, Cream, Ampoules)',
      ],
      outOfScopeProducts: [
        'Colored shampoo/Hair coloring / Bleaching',
        'Styling Foam/Mousse/Cream/Gel/Wax/Paste/Styling/Texturizing/Clasp/Spray',
        'Child/Baby',
        'Appliances and accessories',
      ],
      notes: 'In-Scope: Shampoos, conditioners, and hair treatments (masks, oils, serums, ampoules). Excluded: Hair coloring/bleaching, styling foams/gels/sprays, baby hair care, appliances.',
    },
    {
      id: 'unilever-pt-skin-cleansing',
      scopeCategory: 'Skin Cleansing',
      traxCategory: 'Bath Care',
      clientCategory: 'Skin Cleansing',
      smartL1List: [
        'Bath Care',
        'Shower Gel / Shower Oil',
        'Bath Foams',
        'Body and Hair Washes',
      ],
      inScopeProducts: [
        'Shower Gel/ Shower Oil',
        'Bath Foams',
        'Body and Hair Washes (Head to Toe)',
      ],
      outOfScopeProducts: [
        'Body Scrub',
        'Intimate Hygiene Gel',
        'Child/Baby Products',
      ],
      notes: 'In-Scope: Shower Gels, Shower Oils, Bath Foams, Body & Hair Washes (Head to Toe). Excluded: Body Scrubs, Intimate Hygiene Gels, Child/Baby Products.',
    },
    {
      id: 'unilever-pt-soap',
      scopeCategory: 'Soap',
      traxCategory: 'Bar Soap',
      clientCategory: 'SOAP',
      smartL1List: [
        'Bar Soap',
        'Solid soap',
        'Liquid soap',
        'Face + Body soap',
        'Hand wash',
      ],
      inScopeProducts: [
        'Solid soap',
        'Liquid soap',
        'Face + Body soap',
        'Hand wash',
      ],
      outOfScopeProducts: [
        'Intimate Hygiene Soap',
        'Child/Baby Products',
        'Appliances and accessories',
      ],
      notes: 'In-Scope: Solid soap, Liquid soap, Face + Body soap, Hand wash. Excluded: Intimate Hygiene Soap, Baby soap, Soap accessories.',
    },
    {
      id: 'unilever-pt-skin-care',
      scopeCategory: 'Skin Care',
      traxCategory: 'Face / Body Care',
      clientCategory: 'Skin Care',
      smartL1List: [
        'Face / Body Care',
        'Body Creams / Lotions / Milk / Gel',
        'Body Oil / Body Serum',
        'Multi-purpose Creams',
        'Hand Cream/ Oil',
        'Hand & Nail Cream/Oil',
        'Face + Hand + Body Cream',
        'Anti-cellulite; slimming',
        'Vaseline',
      ],
      inScopeProducts: [
        'Body Creams / Lotions / Milk / Gel / Body',
        'Body Oil / Body Serum',
        'Multi-purpose Creams',
        'Hand Cream/ Oil',
        'Hand & Nail Cream/Oil',
        'Face + Hand + Body Cream',
        'Anti-cellulite; slimming',
        'Vaseline',
      ],
      outOfScopeProducts: [
        'Foot Cream / Mask / Treatment Foot & Leg',
        'Cream / Mask / Treatment Nail & Cuticle Cream /Oil',
        'Treatment Intimate Hygiene Cream Sunscreens',
        'Hair Removal (cream/gel/razors)',
        'Makeup (face, eyes, lips, nails)',
        'Acetone/Barba',
        'Body Scrub',
        'Baby Cream/Lotion',
        'Aftershave',
        'Body colognes and fragrances',
      ],
      notes: 'In-Scope: Body creams/lotions/milks, body oils/serums, multi-purpose creams, hand & nail creams, anti-cellulite, Vaseline. Excluded: Foot creams, cuticle treatments, sunscreens, hair removal, makeup, aftershave, fragrances.',
    },
    {
      id: 'unilever-pt-lip-balm',
      scopeCategory: 'Skin Care',
      traxCategory: 'Lip Balm',
      clientCategory: 'Skin Care',
      smartL1List: [
        'Lip Balm',
        'Lip Cream',
      ],
      inScopeProducts: [
        'Lip Balm',
        'Lip Cream',
      ],
      outOfScopeProducts: [
        'Alcohol Gel',
      ],
      notes: 'In-Scope: Lip Balm, Lip Cream. Excluded: Alcohol Gel.',
    },
    {
      id: 'unilever-pt-fabric-cleaning',
      scopeCategory: 'Fabric Cleaning',
      traxCategory: 'Fabric Cleaning',
      clientCategory: 'Fabric Cleaning',
      smartL1List: [
        'Fabric Cleaning',
        'Laundry Detergent (Powder, Liquid, Capsules, Leaves)',
      ],
      inScopeProducts: [
        'Laundry Detergent (Powder, Liquid, Capsules, Leaves)',
      ],
      outOfScopeProducts: [
        'Hand Laundry Detergent',
        'Specialist Laundry Detergent (Wool & Silk, Woolite, Soflan)',
        'Additives and Auxiliaries: Stain Remover, Color Protection Wipes',
        'Bleach/ Disinfectant / Percarbonate/ Whiteners/Dyes',
        'Machine Treatment: Anti-limescale, Descaling, Machine Cleaner',
        'Dry Wash Spray',
        'Easy Glue',
      ],
      notes: 'In-Scope: Laundry Detergent (Powder, Liquid, Capsules, Leaves). Excluded: Hand laundry, specialist wool/silk detergents, stain removers, bleach/dyes, machine descalers, dry wash spray, easy glue.',
    },
    {
      id: 'unilever-pt-fabric-cleaning-pallets',
      scopeCategory: 'Fabric Cleaning-Pallets',
      traxCategory: 'Fabric Cleaning',
      clientCategory: 'Fabric Cleaning',
      smartL1List: [
        'Fabric Cleaning',
        'Laundry Detergent (Powder, Liquid, Capsules, Leaves)',
      ],
      inScopeProducts: [
        'Laundry Detergent (Powder, Liquid, Capsules, Leaves) - Pallet Displays',
      ],
      outOfScopeProducts: [
        'Hand Laundry Detergent',
        'Specialist Laundry Detergent (Wool & Silk, Woolite, Soflan)',
        'Additives and Auxiliaries: Stain Remover, Color Protection Wipes',
        'Bleach/ Disinfectant / Percarbonate/ Whiteners/Dyes',
        'Machine Treatment: Anti-limescale, Descaling, Machine Cleaner',
        'Dry Wash Spray',
        'Easy Glue',
      ],
      notes: 'Pallet display formats for Fabric Cleaning.',
    },
    {
      id: 'unilever-pt-fabric-enhancer',
      scopeCategory: 'Fabric Enhancer',
      traxCategory: 'Fabric Enhancer',
      clientCategory: 'Fabric Enhancer',
      smartL1List: [
        'Fabric Enhancer',
        'Fabric Softeners',
        'Perfume Enhancer / Perfume Spray',
      ],
      inScopeProducts: [
        'Fabric Softeners',
        'Perfume Enhancer / Perfume Spray',
      ],
      outOfScopeProducts: [
        'Fabric Ironing Water',
        'Perfumed Water',
        'Textile Air Freshener',
      ],
      notes: 'In-Scope: Fabric Softeners, Perfume Enhancers, Perfume Spray. Excluded: Fabric Ironing Water, Perfumed Water, Textile Air Fresheners.',
    },
    {
      id: 'unilever-pt-fabric-enhancer-pallets',
      scopeCategory: 'Fabric Enhancer-Pallets',
      traxCategory: 'Fabric Enhancer',
      clientCategory: 'Fabric Enhancer',
      smartL1List: [
        'Fabric Enhancer',
        'Fabric Softeners',
        'Perfume Enhancer / Perfume Spray',
      ],
      inScopeProducts: [
        'Fabric Softeners, Perfume Enhancers - Pallet Displays',
      ],
      outOfScopeProducts: [
        'Fabric Ironing Water',
        'Perfumed Water',
        'Textile Air Freshener',
      ],
      notes: 'Pallet display formats for Fabric Enhancers.',
    },
    {
      id: 'unilever-pt-sca-bouillons',
      scopeCategory: 'SCA - Bouillons',
      traxCategory: 'Salt & Spices & Seasoning',
      clientCategory: 'SCA - Bouillons',
      smartL1List: [
        'Salt & Spices & Seasoning',
        'Broths (cube, powder, jelly)',
        'Seasonings (cube, powder, jelly)',
        'Sauces (cube, powder, jelly)',
      ],
      inScopeProducts: [
        'Broths (cube, powder, jelly)',
        'Seasonings (cube, powder, jelly)',
        'Sauces (cube, powder, jelly)',
      ],
      outOfScopeProducts: [
        'Spices / Seasonings Sachet',
        'Potato Flake',
        'Canned meal',
      ],
      notes: 'In-Scope: Broths (cube, powder, jelly), Seasonings (cube, powder, jelly), Sauces (cube, powder, jelly). Excluded: Spices/Seasoning sachets, Potato flakes, Canned meals.',
    },
    {
      id: 'unilever-pt-snacking',
      scopeCategory: 'Snacking',
      traxCategory: 'Dry Cooking Ingredients',
      clientCategory: 'Mini Meal',
      smartL1List: [
        'Dry Cooking Ingredients',
        'Rice',
        'Noodles',
        'Pasta',
        'Mashed Potatoes (Pots / Blocks)',
      ],
      inScopeProducts: [
        'Rice',
        'Noodles',
        'Pasta',
        'Mashed Potatoes (Pots / Blocks)',
      ],
      outOfScopeProducts: [
        'Ready Meals',
      ],
      notes: 'In-Scope: Instant/dry rice, instant noodles, dry pasta meals, instant mashed potatoes (pots/blocks). Excluded: Ready Meals.',
    },
    {
      id: 'unilever-pt-sca-soups',
      scopeCategory: 'SCA - Soups',
      traxCategory: 'Prepared Meals & Soups',
      clientCategory: 'SCA - Soups',
      smartL1List: [
        'Prepared Meals & Soups',
        'Dehydrated soups (powder)',
      ],
      inScopeProducts: [
        'Dehydrated soups (powder)',
      ],
      outOfScopeProducts: [
        'Liquid soup',
        'Miso soup',
        'Spices/Seasonings (sachet)',
      ],
      notes: 'In-Scope: Dehydrated packet soups (powder). Excluded: Liquid soups, Miso soups, Spices/Seasonings sachets.',
    },
    {
      id: 'unilever-pt-dressing',
      scopeCategory: 'Dressing',
      traxCategory: 'Sauces & Condiments',
      clientCategory: 'Condiment',
      smartL1List: [
        'Sauces & Condiments',
        'Mayonnaise',
        'Ketchup',
        'Mustard',
        'Garlic Sauce',
        'Barbecue Sauce',
        'Burger Sauce',
        'Cocktail Sauce',
        '3 Peppers Sauce',
        'Caesar Sauce',
        'Yogurt Sauce',
        'Sweet Sauce',
        'Sour Sauce',
      ],
      inScopeProducts: [
        'Mayonnaise',
        'Ketchup',
        'Mustard',
        'Garlic Sauce',
        'Barbecue Sauce',
        'Burger Sauce',
        'Cocktail Sauce',
        '3 Peppers Sauce',
        'Caesar Sauce',
        'Yogurt Sauce',
        'Sweet Sauce',
        'Sour Sauce',
      ],
      outOfScopeProducts: [
        'Spices / Seasonings (sachet)',
        'Tomato (sauce, pieces, pulp, crushed)',
        'Milk / Coconut Cream',
        'Soy Sauce/Worcestershire Sauce/Teriyaki Sauce/Oyster Sauce/Hoisin Sauce',
        'Wok / Wasabi',
        'Tabasco / Piri-piri / Spicy / Jindungo Garlic',
        'Paste / Pepper / Ginger',
        'Seasoning Lemon/Lime Juice',
        'Spreadable Sauce (Guacamole/Tahini/Cheese Sauce/Hummus)',
        'Vinaigrette',
        'Chutney',
        'Cooking Sauce (Basil/Pesto/Bolognese/Neapolitan/Arrabbiata/Francesinha)',
      ],
      notes: 'In-Scope: Table condiments (Mayonnaise, Ketchup, Mustard, Garlic Sauce, BBQ, Burger Sauce, Cocktail Sauce, 3 Peppers, Caesar, Yogurt, Sweet, Sour Sauce). Excluded: Tomato sauces/pastes/purees, Milk/Coconut cream, Asian sauces (Soy, Teriyaki, Wasabi), Hot sauces (Piri-piri, Tabasco, Jindungo), Guacamole/Hummus, Vinaigrettes, Chutneys, Cooking pasta sauces (Pesto, Bolognese, Francesinha).',
    },
    {
      id: 'unilever-pt-rtd',
      scopeCategory: 'RTD',
      traxCategory: 'RTD Tea',
      clientCategory: 'RTD',
      smartL1List: [
        'RTD Tea',
        'Ice Teas (core, zero, green)',
      ],
      inScopeProducts: [
        'Ice Teas (core, zero, green)',
      ],
      outOfScopeProducts: [
        'Herbal teas',
        'Kombucha',
        'Soft drink(with/without gas)/Ginger ale/Tonic water',
        'Nectars/Fruit Juices',
        'Concentrated juices/powder',
        'Sangria / Bloodletting',
        'Water/Flavored water/Vitamin',
        'Juices',
      ],
      notes: 'In-Scope: Ready to Drink Ice Teas (core, zero, green - e.g. Lipton Ice Tea). Excluded: Herbal teas, Kombucha, Carbonated soft drinks, Ginger ale, Tonic water, Fruit juices, Nectars, Sangria, Flavored waters.',
    },
    {
      id: 'unilever-pt-rtd-pallets',
      scopeCategory: 'RTD-Pallets',
      traxCategory: 'RTD Tea',
      clientCategory: 'RTD',
      smartL1List: [
        'RTD Tea',
        'Ice Teas (core, zero, green)',
      ],
      inScopeProducts: [
        'Ice Teas (core, zero, green) - Pallet Displays',
      ],
      outOfScopeProducts: [
        'Herbal teas',
        'Kombucha',
        'Soft drink(with/without gas)/Ginger ale/Tonic water',
        'Nectars/Fruit Juices',
        'Concentrated juices/powder',
        'Sangria / Bloodletting',
        'Water/Flavored water/Vitamin',
        'Juices',
      ],
      notes: 'Pallet display formats for RTD Ice Teas.',
    },
    {
      id: 'unilever-pt-leaf-tea',
      scopeCategory: 'Leaf Tea',
      traxCategory: 'Tea',
      clientCategory: 'Leaf Tea',
      smartL1List: [
        'Tea',
        'Tea (bags/loose leaf)',
        'Infusion (bags/loose leaf)',
      ],
      inScopeProducts: [
        'Tea (bags/loose leaf)',
        'Infusion (bags/loose leaf)',
      ],
      outOfScopeProducts: [
        'Tea Capsules',
        'Cafe (Coffee)',
        'Soluble Chocolate',
        'Cereal Beverages',
        'Juices',
      ],
      notes: 'In-Scope: Tea (bags/loose leaf) and Infusions (bags/loose leaf). Excluded: Tea capsules, Coffee/Cafe, Soluble chocolate, Cereal beverages, Juices.',
    },
    {
      id: 'unilever-pt-household-cleaning',
      scopeCategory: 'House Hold Cleaning',
      traxCategory: 'Household Care',
      clientCategory: 'House Hold Cleaning',
      smartL1List: [
        'Household Care',
        'Kitchen sprays (degreasers, vitroceramic, ovens, stainless steel)',
        'Bathroom Cleaning Sprays',
        'Multipurpose/Multisurface Cleaning Sprays',
        'Glass Cleaner sprays',
        'Furniture Cleaning Sprays',
        'Perfumed liquid detergents for floor/multi surface cleaning',
        'Bleach sprays',
      ],
      inScopeProducts: [
        'Kitchen sprays (degreasers, vitroceramic, ovens, stainless steel)',
        'Bathroom Cleaning Sprays',
        'Multipurpose/Multisurface Cleaning Sprays',
        'Glass Cleaner sprays',
        'Furniture Cleaning Sprays',
        'Perfumed liquid detergents for floor/multi surface cleaning',
        'Bleach sprays',
      ],
      outOfScopeProducts: [
        'Air Freshener Sprays/Insecticide sprays/Shoe sprays/Sanitary Abrasive Sprays',
        'Furniture Cleaner Aerosols/Ammoniacal all-purpose cleaner',
        'Cleaning vinegars/Lixivias',
        'Refrigerator Cleaning Sprays/Vitroceramic Cleaning Creams',
        'Floor Cleaning Capsules/Carpet Cleaning Detergents',
        'Specific floor cleaning products: waxes,strippers,washes & waxes,wood floor restorers, etc.',
        'Wash Everything Gel',
      ],
      notes: 'In-Scope: Cleaning sprays (kitchen degreasers, bathroom, multi-surface, glass, furniture), floor perfumed liquids, and bleach sprays. Excluded: Air fresheners, Insecticides, Shoe sprays, Furniture aerosols, Cleaning vinegars/Lixivias, Refrigerator sprays, Carpet detergents, Floor waxes/strippers, Wash Everything Gel.',
    },
    {
      id: 'unilever-pt-ice-cream-horizontal',
      scopeCategory: 'Ice Cream Horizontal Coolers',
      traxCategory: 'Ice Cream & Ice Pops',
      clientCategory: 'Ice Cream',
      smartL1List: [
        'Ice Cream & Ice Pops',
        'Ice Cream',
        'Ice Pops',
        'Ice Cream Cookie Sandwich',
        'Ice Cream Cake & Tart',
      ],
      inScopeProducts: [
        'Ice Cream',
        'Ice Pops',
        'Ice Cream Cookie Sandwich',
        'Ice Cream Cake & Tart',
      ],
      outOfScopeProducts: [],
      notes: 'In-Scope: Ice Cream, Ice Pops, Ice Cream Cookie Sandwich, Ice Cream Cake & Tart (Horizontal Coolers).',
    },
    {
      id: 'unilever-pt-ice-cream-vertical',
      scopeCategory: 'Ice Cream Vertical Coolers',
      traxCategory: 'Ice Cream & Ice Pops',
      clientCategory: 'Ice Cream',
      smartL1List: [
        'Ice Cream & Ice Pops',
        'Ice Cream',
        'Ice Pops',
        'Ice Cream Cookie Sandwich',
        'Ice Cream Cake & Tart',
      ],
      inScopeProducts: [
        'Ice Cream',
        'Ice Pops',
        'Ice Cream Cookie Sandwich',
        'Ice Cream Cake & Tart',
      ],
      outOfScopeProducts: [],
      notes: 'In-Scope: Ice Cream, Ice Pops, Ice Cream Cookie Sandwich, Ice Cream Cake & Tart (Vertical Coolers).',
    },
  ],
};

export const DEFAULT_PROJECT_SCOPES: ProjectScope[] = [
  UNILEVER_PT_SCOPE,
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
    if (r.inScopeProducts && r.inScopeProducts.length > 0) {
      output += `  * In-Scope Products: ${r.inScopeProducts.join(', ')}\n`;
    }
    if (r.outOfScopeProducts && r.outOfScopeProducts.length > 0) {
      output += `  * Out-of-Scope Exclusions: ${r.outOfScopeProducts.join(', ')}\n`;
    }
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
