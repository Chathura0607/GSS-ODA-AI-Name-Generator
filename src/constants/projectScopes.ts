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

export const UNILEVER_IT_SCOPE: ProjectScope = {
  id: 'unilever-it',
  name: 'Unilever IT Project Scope',
  clientName: 'Unilever IT',
  country: 'Italy',
  description:
    'Official Project Scope Matrix for Unilever IT / Italy (Deo, Oral, Hair Care, Bath - shower, Soap, Skin Care).',
  isDefault: true,
  smartPaletteChoices: [
    'APDO',
    'Dental Accessories',
    'Toothbrush and Toothpaste',
    'Mouthwash & Mouth Freshener',
    'Hair Care and Hair Styling',
    'Bath Care',
    'Soap and Hand Wash',
    'Face / Body Care',
  ],
  specialNotes: [
    'Scope covers 6 core Client Categories across Unilever IT: Deo, Oral, Hair Care, Bath - shower, Soap, and Skin Care.',
    'TRAX SMART PALETTE: There are only 8 valid Smart Level1 options in this scope: 1. APDO, 2. Dental Accessories, 3. Toothbrush and Toothpaste, 4. Mouthwash & Mouth Freshener, 5. Hair Care and Hair Styling, 6. Bath Care, 7. Soap and Hand Wash, 8. Face / Body Care.',
    'Trax Category "Bath Care" branches into two distinct scopes: Smart L1 "Hair Care and Hair Styling" under Client Category "Hair Care" (for Shampoo & Conditioner), and Smart L1 "Bath Care" under Client Category "Bath - shower" (for Body Wash, Shower Gel, etc.).',
    'Trax Category "Face / Body Care" branches into two distinct scopes: Smart L1 "Soap and Hand Wash" under Client Category "Soap" (for Hand Wash, Hand Cleansing Gel & Spray), and Smart L1 "Face / Body Care" under Client Category "Skin Care" (for Body Butter, Lotions, Face Creams, Sunscreen, etc.).',
    'Perfume is explicitly In-Scope under Client Category "Deo", Trax Category "APDO", Smart L1 "APDO".',
    'Deodorant Wipes and Wet Tissues are explicitly In-Scope under Client Category "Skin Care", Trax Category "Face / Body Care", Smart L1 "Face / Body Care".',
    'Foam Bath and Bath Soak are explicitly In-Scope under Client Category "Skin Care", Trax Category "Face / Body Care", Smart L1 "Face / Body Care".',
    'Head to Toe Products (Shower Gel + Body Wash + Shampoo) are In-Scope under Client Category "Bath - shower", Trax Category "Bath Care", Smart L1 "Bath Care".',
    'Strict Out-of-Scope exclusions: Food & Refreshments (Ice Cream, Condiments, Sauces, Bouillons, Soups, Tea, Coffee, Juices, Soft Drinks), Home Care & Laundry (Laundry Detergents, Softeners, Surface Cleaners, Bleach), and Medicines/Appliances.',
  ],
  inScopeList: [
    'Deo: Perfume, Body Sprays (Female&Male), Female Deodorant, Men\'s Deodorant -> Trax Category: APDO, Smart L1: APDO',
    'Oral - Dental Accessories: Dental Accessories -> Trax Category: Dental Accessories, Smart L1: Dental Accessories',
    'Oral - Toothbrush: Electric Toothbrush, Manual Toothbrushes -> Trax Category: Toothbrush, Smart L1: Toothbrush and Toothpaste',
    'Oral - Toothpaste: Toothpaste -> Trax Category: Toothpaste, Smart L1: Toothbrush and Toothpaste',
    'Oral - Mouthwash & Denture Cleansers: Denture Cleanser, Mouthwash -> Trax Category: Mouthwash & Denture Cleansers, Smart L1: Mouthwash & Mouth Freshener',
    'Oral - Mouth Freshener: Mouth Sprays, Mouth Fresh Tablets -> Trax Category: Mouth Freshener, Smart L1: Mouthwash & Mouth Freshener',
    'Hair Care - Hair Care: Hair Mask, Hair Cream, Hair Treatments, Serum & Oil, Kids Hair Care -> Trax Category: Hair Care, Smart L1: Hair Care and Hair Styling',
    'Hair Care - Hair Styling: Hair Styling sprays/water/Mousse, Hair Styling, Men\'s Hair Styling -> Trax Category: Hair Styling, Smart L1: Hair Care and Hair Styling',
    'Hair Care - Bath Care: Shampoo, Conditioner, Men\'s Shampoo -> Trax Category: Bath Care, Smart L1: Hair Care and Hair Styling',
    'Bath - shower: Body wash, Men\'s Shower Gel, Shower Cream, Shower Gel, Shower Mousse, Head to Toe Products (Shower Gel + Body Wash + Shampoo) -> Trax Category: Bath Care, Smart L1: Bath Care',
    'Soap - Bar Soap: Beauty Soap Bars, Soap bars -> Trax Category: Bar Soap, Smart L1: Soap and Hand Wash',
    'Soap - Hand Wash: Hand Wash, Hand Cleansing Gel, Hand Cleansing Spray -> Trax Category: Face / Body Care, Smart L1: Soap and Hand Wash',
    'Skin Care: Body Butter, Body Moisturizing Lotion, Body Oil, Foam Bath, Make up Removing sheets, Talcum Powder, Body Shaving Gel, Bath Soak, Body Scrub, Face Cleansing, Eye Cream, Face Cream, Face Mask, Face Serum, Facial Fillers, Facial Sunscreen, Facial Toner, Facial Wash & Scrub, Wet Tissues/ wipes, Deodorant Wipes, Men\'s Face Wash, Men\'s Moisturizer, Night Face Cream, Hand Cream -> Trax Category: Face / Body Care, Smart L1: Face / Body Care',
  ],
  outOfScopeList: [
    'Food Items & Confectionery (Snacks, chips, chocolates, biscuits, cakes, meals, etc.)',
    'Sauces & Condiments (Mayonnaise, ketchup, mustard, pasta sauces, tomato sauce, seasonings)',
    'Soups & Bouillons (Broths, dehydrated soups, bouillon cubes, instant noodles)',
    'Ice Cream & Ice Pops (Tubs, popsicles, cones, ice cream cakes)',
    'Beverages & Soft Drinks (Colas, sodas, juices, nectars, energy drinks, mineral water)',
    'Tea & Coffee (Hot tea, iced tea, tea bags, coffee beans, ground coffee, capsules)',
    'Home Care & Laundry (Laundry detergents, fabric softeners, surface cleaners, bleach)',
    'Medicines & Pharmaceuticals (Medicines, pharmaceutical remedies, medical devices)',
  ],
  rules: [
    // Deo
    {
      id: 'unilever-it-deo',
      scopeCategory: 'Deo',
      traxCategory: 'APDO',
      clientCategory: 'Deo',
      smartL1List: ['APDO', 'Perfume', 'Body Sprays (Female&Male)', 'Female Deodorant', "Men's Deodorant"],
      inScopeProducts: [
        'Perfume',
        'Body Sprays (Female&Male)',
        'Female Deodorant',
        "Men's Deodorant",
      ],
      notes: 'In-Scope: Perfume, Body Sprays (Female&Male), Female Deodorant, Men\'s Deodorant.',
    },
    // Oral - Dental Accessories
    {
      id: 'unilever-it-oral-dental-accessories',
      scopeCategory: 'Oral',
      traxCategory: 'Dental Accessories',
      clientCategory: 'Oral',
      smartL1List: ['Dental Accessories'],
      inScopeProducts: [
        'Dental Accessories',
      ],
      notes: 'In-Scope: Dental Accessories.',
    },
    // Oral - Toothbrush
    {
      id: 'unilever-it-oral-toothbrush',
      scopeCategory: 'Oral',
      traxCategory: 'Toothbrush',
      clientCategory: 'Oral',
      smartL1List: ['Toothbrush and Toothpaste', 'Electric Toothbrush', 'Manual Toothbrushes', 'Maunal Toothbrushes'],
      inScopeProducts: [
        'Electric Toothbrush',
        'Manual Toothbrushes',
        'Maunal Toothbrushes',
      ],
      notes: 'In-Scope: Electric Toothbrush, Manual Toothbrushes.',
    },
    // Oral - Toothpaste
    {
      id: 'unilever-it-oral-toothpaste',
      scopeCategory: 'Oral',
      traxCategory: 'Toothpaste',
      clientCategory: 'Oral',
      smartL1List: ['Toothbrush and Toothpaste', 'Toothpaste'],
      inScopeProducts: [
        'Toothpaste',
      ],
      notes: 'In-Scope: Toothpaste.',
    },
    // Oral - Mouthwash & Denture Cleansers
    {
      id: 'unilever-it-oral-mouthwash-denture-cleansers',
      scopeCategory: 'Oral',
      traxCategory: 'Mouthwash & Denture Cleansers',
      clientCategory: 'Oral',
      smartL1List: ['Mouthwash & Mouth Freshener', 'Denture Cleanser', 'Mouthwash'],
      inScopeProducts: [
        'Denture Cleanser',
        'Mouthwash',
      ],
      notes: 'In-Scope: Denture Cleanser, Mouthwash.',
    },
    // Oral - Mouth Freshener
    {
      id: 'unilever-it-oral-mouth-freshener',
      scopeCategory: 'Oral',
      traxCategory: 'Mouth Freshener',
      clientCategory: 'Oral',
      smartL1List: ['Mouthwash & Mouth Freshener', 'Mouth Sprays', 'Mouth Fresh Tablets'],
      inScopeProducts: [
        'Mouth Sprays',
        'Mouth Fresh Tablets',
      ],
      notes: 'In-Scope: Mouth Sprays, Mouth Fresh Tablets.',
    },
    // Hair Care - Hair Care
    {
      id: 'unilever-it-hair-care',
      scopeCategory: 'Hair Care',
      traxCategory: 'Hair Care',
      clientCategory: 'Hair Care',
      smartL1List: ['Hair Care and Hair Styling', 'Hair Mask', 'Hair Cream', 'Hair Treatments, Serum & Oil', 'Kids Hair Care'],
      inScopeProducts: [
        'Hair Mask',
        'Hair Cream',
        'Hair Treatments, Serum & Oil',
        'Kids Hair Care',
      ],
      notes: 'In-Scope: Hair Mask, Hair Cream, Hair Treatments, Serum & Oil, Kids Hair Care.',
    },
    // Hair Care - Hair Styling
    {
      id: 'unilever-it-hair-styling',
      scopeCategory: 'Hair Care',
      traxCategory: 'Hair Styling',
      clientCategory: 'Hair Care',
      smartL1List: ['Hair Care and Hair Styling', 'Hair Styling sprays/water/Mousse', 'Hair Styling', "Men's Hair Styling"],
      inScopeProducts: [
        'Hair Styling sprays/water/Mousse',
        'Hair Styling',
        "Men's Hair Styling",
      ],
      notes: 'In-Scope: Hair Styling sprays/water/Mousse, Hair Styling, Men\'s Hair Styling.',
    },
    // Hair Care - Bath Care (Shampoo & Conditioner)
    {
      id: 'unilever-it-hair-bath-care',
      scopeCategory: 'Hair Care',
      traxCategory: 'Bath Care',
      clientCategory: 'Hair Care',
      smartL1List: ['Hair Care and Hair Styling', 'Shampoo', 'Conditioner', "Men's Shampoo"],
      inScopeProducts: [
        'Shampoo',
        'Conditioner',
        "Men's Shampoo",
      ],
      notes: 'In-Scope: Shampoo, Conditioner, Men\'s Shampoo.',
    },
    // Bath - shower
    {
      id: 'unilever-it-bath-shower',
      scopeCategory: 'Bath - shower',
      traxCategory: 'Bath Care',
      clientCategory: 'Bath - shower',
      smartL1List: ['Bath Care', 'Body wash', "Men's Shower Gel", 'Shower Cream', 'Shower Gel', 'Shower Mousse', 'Head to Toe Products (Shower Gel + Body Wash + Shampoo)'],
      inScopeProducts: [
        'Body wash',
        "Men's Shower Gel",
        'Shower Cream',
        'Shower Gel',
        'Shower Mousse',
        'Head to Toe Products (Shower Gel + Body Wash + Shampoo)',
      ],
      notes: 'In-Scope: Body wash, Men\'s Shower Gel, Shower Cream, Shower Gel, Shower Mousse, Head to Toe Products (Shower Gel + Body Wash + Shampoo).',
    },
    // Soap - Bar Soap
    {
      id: 'unilever-it-soap-bar',
      scopeCategory: 'Soap',
      traxCategory: 'Bar Soap',
      clientCategory: 'Soap',
      smartL1List: ['Soap and Hand Wash', 'Beauty Soap Bars', 'Soap bars'],
      inScopeProducts: [
        'Beauty Soap Bars',
        'Soap bars',
      ],
      notes: 'In-Scope: Beauty Soap Bars, Soap bars.',
    },
    // Soap - Face / Body Care (Hand Wash & Cleansers)
    {
      id: 'unilever-it-soap-hand-wash',
      scopeCategory: 'Soap',
      traxCategory: 'Face / Body Care',
      clientCategory: 'Soap',
      smartL1List: ['Soap and Hand Wash', 'Hand Wash', 'Hand Cleansing Gel', 'Hand Cleansing Spray'],
      inScopeProducts: [
        'Hand Wash',
        'Hand Cleansing Gel',
        'Hand Cleansing Spray',
      ],
      notes: 'In-Scope: Hand Wash, Hand Cleansing Gel, Hand Cleansing Spray.',
    },
    // Skin Care
    {
      id: 'unilever-it-skin-care',
      scopeCategory: 'Skin Care',
      traxCategory: 'Face / Body Care',
      clientCategory: 'Skin Care',
      smartL1List: [
        'Face / Body Care',
        'Body Butter',
        'Body Moisturizing Lotion',
        'Body Oil',
        'Foam Bath',
        'Make up Removing sheets',
        'Talcum Powder',
        'Body Shaving Gel',
        'Bath Soak',
        'Body Scrub',
        'Face Cleansing',
        'Eye Cream',
        'Face Cream',
        'Face Mask',
        'Face Serum',
        'Facial Fillers',
        'Facial Sunscreen',
        'Facial Toner',
        'Facial Wash & Scrub',
        'Wet Tissues/ wipes',
        'Deodorant Wipes',
        "Men's Face Wash",
        "Men's Moisturizer",
        'Night Face Cream',
        'Hand Cream',
      ],
      inScopeProducts: [
        'Body Butter',
        'Body Moisturizing Lotion',
        'Body Oil',
        'Foam Bath',
        'Make up Removing sheets',
        'Talcum Powder',
        'Body Shaving Gel',
        'Bath Soak',
        'Body Scrub',
        'Face Cleansing',
        'Eye Cream',
        'Face Cream',
        'Face Mask',
        'Face Serum',
        'Facial Fillers',
        'Facial Sunscreen',
        'Facial Toner',
        'Facial Wash & Scrub',
        'Wet Tissues/ wipes',
        'Deodorant Wipes',
        "Men's Face Wash",
        "Men's Moisturizer",
        'Night Face Cream',
        'Hand Cream',
      ],
      notes:
        'In-Scope: Body Butter, Body Moisturizing Lotion, Body Oil, Foam Bath, Make up Removing sheets, Talcum Powder, Body Shaving Gel, Bath Soak, Body Scrub, Face Cleansing, Eye Cream, Face Cream, Face Mask, Face Serum, Facial Fillers, Facial Sunscreen, Facial Toner, Facial Wash & Scrub, Wet Tissues/ wipes, Deodorant Wipes, Men\'s Face Wash, Men\'s Moisturizer, Night Face Cream, Hand Cream.',
    },
  ],
};

export const PNG_PT_SCOPE: ProjectScope = {
  id: 'png-pt',
  name: 'P&G Portugal (PNG_PT) Project Scope',
  clientName: 'P&G (Procter & Gamble)',
  country: 'Portugal',
  description:
    'Official Project Scope Matrix for Procter & Gamble Portugal / PNG_PT (Adult Incontinence, Baby Care, Feminine Care, Dish Care, Epilation, Male Grooming, Fabric Enhancers, Bath & Shower gels, Hair Care, Oral Care, Deodorants).',
  isDefault: true,
  smartPaletteChoices: [
    'Adult Incontinence',
    'Baby Care',
    'Feminine Care',
    'Dish Care',
    'Female Razors & Blades',
    'Female Shaving Gel & Foam',
    'Men Razors & Blades',
    'Men Shaving Gel & Foam',
    'Fabric care',
    'Bath Care',
    'Hair Care',
    'Mouthwash & Floss',
    'Toothbrush',
    'Toothpaste',
    'Multi Category',
    'APDO',
  ],
  specialNotes: [
    'Scope covers 11 Plano Segments across P&G Portugal (PNG_PT): Adult Incontinence, Baby Care, Feminine Care, Dish Care, Epilation, Male Grooming, Fabric Enhancers, Bath & Shower gels, Hair Care, Oral Care, and Deodorants.',
    'STRICT EXCLUSION: Female APDO, Female Deodorant, and Female Body Spray are strictly Out of Scope! Under Deodorants, ONLY Men\'s products (Men APDO, Men Perfume, Men Body Sprays, Men\'s Deodorant, Men Deodorant Cream) are In-Scope.',
    'STRICT EXCLUSION: For Hair Care, Hair Gel, Hair Mousse, Hair Fixing Cream, and Hair Styling Cream are strictly Out of Scope. In-Scope: Hair Oil, Hair Serum, Hair Mask, Hair Treatment, Hair Cream, Styling cream (non-fixing), Hair Toner, Dry shampoo, Conditioner, and Shampoo (Man, Female, Baby).',
    'Epilation vs Male Grooming: Razors & Blades and Shaving Gel & Foam are divided by gender. Female products map to Plano Segment "Epilation" with Smart L1 "Female Razors & Blades" or "Female Shaving Gel & Foam". Men\'s products map to Plano Segment "Male Grooming" with Smart L1 "Men Razors & Blades" or "Men Shaving Gel & Foam".',
    'Oral Care Multi Category: Products containing more than one oral category (e.g. toothbrush + toothpaste combo) map to Trax Category "General" with Smart L1 "Multi Category". Dental Floss maps to Trax Category "Mouthwash & Denture Cleansers" with Smart L1 "Mouthwash & Floss". Dental fixing cream maps to Trax Category "Toothpaste" with Smart L1 "Toothpaste".',
    'General Out-of-Scope: Food items, Snacks, Beverages, Juices, Coffee, Tea, Alcohol, Household cleaners (except Dish Care and Fabric Enhancers), and Pharmaceuticals are Out of Scope.',
  ],
  inScopeList: [
    'Adult Incontinence: Adult diapers, Pants, Others/Wipes, Bed Pads, Barrier Cream, Period Pants -> Smart L1: Adult Incontinence',
    'Baby Care: Baby Wipes, Pants & Swimming pants, Diapers, Baby mats, Baby feeder -> Smart L1: Baby Care',
    'Feminine Care: Pads, Pantiliners, Sanitary towels, Tampons, Menstrual Cup -> Smart L1: Feminine Care',
    'Dish Care: Dishwashing Products Auto, Dishwashing Products Hand, Dishwasher cleaning products, Regenerating salts -> Trax Category: Dishwashing Products, Smart L1: Dish Care',
    'Epilation: Female regular Razors & Blades -> Trax: Razors & Blades, Smart L1: Female Razors & Blades',
    'Epilation: Female Shaving Cream & Gel, Hair removal products -> Trax: Shaving Gel & Foam, Smart L1: Female Shaving Gel & Foam',
    'Male Grooming: Men\'s Razors & Blades, Beard Scissors, Beard comb, Beard cream/oil/serum/cleanser/balm, Beard Trimmer, Shaving Brush -> Trax: Razors & Blades, Smart L1: Men Razors & Blades',
    'Male Grooming: Men\'s Shaving Gel Foam, After shave products -> Trax: Shaving Gel & Foam, Smart L1: Men Shaving Gel & Foam',
    'Fabric Enhancers: Fabric Conditioners, Laundry Washing Liquid -> Trax: Laundry Washing Liquids Fabric Conditioners, Smart L1: Fabric care',
    'Bath & Shower gels: Body wash, Men\'s Shower Gel, Shower Cream, Shower Gel, Shower Mousse -> Trax: Bath Care, Smart L1: Bath Care',
    'Hair Care: Hair Oil, Hair Serum, Hair Mask, Hair Treatment, Hair Cream, Styling cream, Hair Toner, Dry shampoo, Conditioner, Shampoo (Man, Female, Baby) -> Trax: Hair Care, Smart L1: Hair Care',
    'Oral Care: Mouthwash, Dental Floss -> Trax: Mouthwash & Denture Cleansers, Smart L1: Mouthwash & Floss',
    'Oral Care: Electric Toothbrush, Manual Toothbrushes -> Trax: Toothbrush, Smart L1: Toothbrush',
    'Oral Care: Toothpaste, Dental fixing cream -> Trax: Toothpaste, Smart L1: Toothpaste',
    'Oral Care: Multi-category bundles (toothbrush + toothpaste) -> Trax: General, Smart L1: Multi Category',
    'Deodorants: Men APDO, Men Perfume, Men Body Sprays, Men\'s Deodorant, Men Deodorant Cream -> Trax: APDO, Smart L1: APDO',
  ],
  outOfScopeList: [
    'Female APDO, Female Deodorant, Female Body Spray (Deodorant scope covers MEN only; female deodorants are strictly Out of Scope)',
    'Hair Gel, Hair Mousse, Hair Fixing Cream, Hair Styling Cream (Strictly excluded from Hair Care scope)',
    'Food Items & Confectionery (Snacks, chips, chocolate, biscuits, etc.)',
    'Beverages & Soft Drinks (Sodas, juices, tea, coffee, mineral water, alcohol)',
    'Home Cleaning & Disinfectants (Bleach, all-purpose cleaners, toilet cleaners, floor cleaners - only Dish Care & Fabric Enhancers are in scope)',
    'Medicines & Pharmaceuticals (Prescription medicines, pharmaceutical syrups, pills)',
  ],
  rules: [
    // 1. Adult Incontinence
    {
      id: 'png-pt-adult-incontinence-diapers',
      scopeCategory: 'Adult Incontinence',
      traxCategory: 'Adult Diapers',
      clientCategory: 'Adult Incontinence',
      smartL1List: ['Adult Incontinence', 'Adult diapers', 'Pants', 'Others/Wipes', 'Period Pants'],
      inScopeProducts: ['Adult diapers', 'Pants', 'Others/Wipes', 'Period Pants'],
      notes: 'In-Scope: Adult diapers, Pants, Others/Wipes, Period Pants.',
    },
    {
      id: 'png-pt-adult-incontinence-pads',
      scopeCategory: 'Adult Incontinence',
      traxCategory: 'Pads & Liners',
      clientCategory: 'Adult Incontinence',
      smartL1List: ['Adult Incontinence', 'Bed Pads', 'Period Pants'],
      inScopeProducts: ['Bed Pads', 'Period Pants'],
      notes: 'In-Scope: Bed Pads, Period Pants.',
    },
    {
      id: 'png-pt-adult-incontinence-barrier-cream',
      scopeCategory: 'Adult Incontinence',
      traxCategory: 'Face / Body Care',
      clientCategory: 'Adult Incontinence',
      smartL1List: ['Adult Incontinence', 'Barrier Cream'],
      inScopeProducts: ['Barrier Cream'],
      notes: 'In-Scope: Barrier Cream.',
    },
    // 2. Baby Care
    {
      id: 'png-pt-baby-care-diapers',
      scopeCategory: 'Baby Care',
      traxCategory: 'Diapers',
      clientCategory: 'Baby Care',
      smartL1List: ['Baby Care', 'Diapers', 'Pants & Swimming pants'],
      inScopeProducts: ['Diapers', 'Pants & Swimming pants'],
      notes: 'In-Scope: Diapers, Pants & Swimming pants.',
    },
    {
      id: 'png-pt-baby-care-wipes',
      scopeCategory: 'Baby Care',
      traxCategory: 'Baby Wipes',
      clientCategory: 'Baby Care',
      smartL1List: ['Baby Care', 'Baby Wipes'],
      inScopeProducts: ['Baby Wipes'],
      notes: 'In-Scope: Baby Wipes.',
    },
    {
      id: 'png-pt-baby-care-accessories',
      scopeCategory: 'Baby Care',
      traxCategory: 'Baby Accessories',
      clientCategory: 'Baby Care',
      smartL1List: ['Baby Care', 'Baby mats', 'Baby feeder'],
      inScopeProducts: ['Baby mats', 'Baby feeder'],
      notes: 'In-Scope: Baby mats, Baby feeder.',
    },
    // 3. Feminine Care
    {
      id: 'png-pt-feminine-care-pads',
      scopeCategory: 'Feminine Care',
      traxCategory: 'Pads & Liners',
      clientCategory: 'Feminine Care',
      smartL1List: ['Feminine Care', 'Pads, Pantiliners, Sanitary towels'],
      inScopeProducts: ['Pads, Pantiliners, Sanitary towels', 'Sanitory towels'],
      notes: 'In-Scope: Pads, Pantiliners, Sanitary towels.',
    },
    {
      id: 'png-pt-feminine-care-tampons',
      scopeCategory: 'Feminine Care',
      traxCategory: 'Tampons',
      clientCategory: 'Feminine Care',
      smartL1List: ['Feminine Care', 'Tampons', 'Menstrual Cup'],
      inScopeProducts: ['Tampons', 'Menstrual Cup'],
      notes: 'In-Scope: Tampons, Menstrual Cup.',
    },
    // 4. Dish Care
    {
      id: 'png-pt-dish-care',
      scopeCategory: 'Dish Care',
      traxCategory: 'Dishwashing Products',
      clientCategory: 'Dish Care',
      smartL1List: [
        'Dish Care',
        'Dishwashing Products Auto',
        'Dishwashing Products Hand',
        'Dishwasher cleaning products',
        'Regenerating salts',
      ],
      inScopeProducts: [
        'Dishwashing Products Auto',
        'Dishwashing Products Hand',
        'Dishwasher cleaning products',
        'Regenerating salts',
      ],
      notes:
        'In-Scope: Dishwashing Products Auto, Dishwashing Products Hand, Dishwasher cleaning products, Regenerating salts.',
    },
    // 5. Epilation
    {
      id: 'png-pt-epilation-razors',
      scopeCategory: 'Epilation',
      traxCategory: 'Razors & Blades',
      clientCategory: 'Epilation',
      smartL1List: ['Female Razors & Blades', 'Female regular Razors & Blades'],
      inScopeProducts: ['Female regular Razors & Blades'],
      notes: 'In-Scope: Female regular Razors & Blades.',
    },
    {
      id: 'png-pt-epilation-shaving',
      scopeCategory: 'Epilation',
      traxCategory: 'Shaving Gel & Foam',
      clientCategory: 'Epilation',
      smartL1List: ['Female Shaving Gel & Foam', 'Female Shaving Cream & Gel', 'Hair removal products'],
      inScopeProducts: ['Female Shaving Cream & Gel', 'Hair removal products'],
      notes: 'In-Scope: Female Shaving Cream & Gel, Hair removal products.',
    },
    // 6. Male Grooming
    {
      id: 'png-pt-male-grooming-razors',
      scopeCategory: 'Male Grooming',
      traxCategory: 'Razors & Blades',
      clientCategory: 'Male Grooming',
      smartL1List: [
        'Men Razors & Blades',
        "Men's Razors & Blades",
        'Beard Scissors',
        'Beard comb',
        'Beard cream/oil/serum/cleanser/balm',
        'Beard Trimmer',
        'Shaving Brush',
      ],
      inScopeProducts: [
        "Men's Razors & Blades",
        'Beard Scissors',
        'Beard comb',
        'Beard cream/oil/serum/cleanser/balm',
        'Beard Trimmer',
        'Shaving Brush',
      ],
      notes:
        'In-Scope: Men\'s Razors & Blades, Beard Scissors, Beard comb, Beard cream/oil/serum/cleanser/balm, Beard Trimmer, Shaving Brush.',
    },
    {
      id: 'png-pt-male-grooming-shaving',
      scopeCategory: 'Male Grooming',
      traxCategory: 'Shaving Gel & Foam',
      clientCategory: 'Male Grooming',
      smartL1List: ['Men Shaving Gel & Foam', "Men's Shaving Gel Foam", 'After shave products'],
      inScopeProducts: ["Men's Shaving Gel Foam", 'After shave products'],
      notes: 'In-Scope: Men\'s Shaving Gel Foam, After shave products.',
    },
    // 7. Fabric Enhancers
    {
      id: 'png-pt-fabric-enhancers',
      scopeCategory: 'Fabric Enhancers',
      traxCategory: 'Laundry Washing Liquids Fabric Conditioners',
      clientCategory: 'Fabric Enhancers',
      smartL1List: ['Fabric care', 'Fabric Conditioners', 'Laundry Washing Liquid'],
      inScopeProducts: ['Fabric Conditioners', 'Laundry Washing Liquid'],
      notes: 'In-Scope: Fabric Conditioners, Laundry Washing Liquid.',
    },
    // 8. Bath & Shower gels
    {
      id: 'png-pt-bath-shower',
      scopeCategory: 'Bath & Shower gels',
      traxCategory: 'Bath Care',
      clientCategory: 'Bath & Shower gels',
      smartL1List: ['Bath Care', 'Body wash', "Men's Shower Gel", 'Shower Cream', 'Shower Gel', 'Shower Mousse'],
      inScopeProducts: ['Body wash', "Men's Shower Gel", 'Shower Cream', 'Shower Gel', 'Shower Mousse'],
      notes: 'In-Scope: Body wash, Men\'s Shower Gel, Shower Cream, Shower Gel, Shower Mousse.',
    },
    // 9. Hair Care
    {
      id: 'png-pt-hair-care',
      scopeCategory: 'Hair Care',
      traxCategory: 'Hair Care',
      clientCategory: 'Hair Care',
      smartL1List: [
        'Hair Care',
        'Hair Oil',
        'Hair Serum',
        'Hair Mask',
        'Hair Trearment',
        'Hair Cream',
        'Styling cream',
        'Hair Toner',
        'Dry shampoo',
        'Conditioner',
        'Shampoo ( Man, Female, Baby)',
      ],
      inScopeProducts: [
        'Hair Oil',
        'Hair Serum',
        'Hair Mask',
        'Hair Trearment',
        'Hair Cream',
        'Styling cream',
        'Hair Toner',
        'Dry shampoo',
        'Conditioner',
        'Shampoo ( Man, Female, Baby)',
      ],
      outOfScopeProducts: ['Hair Gel', 'Hair Mousse', 'Hair Fixing Cream', 'Hair Styling Cream'],
      notes:
        'In-Scope: Hair Oil, Hair Serum, Hair Mask, Hair Treatment, Hair Cream, Styling cream, Hair Toner, Dry shampoo, Conditioner, Shampoo (Man, Female, Baby). STRICTLY OUT OF SCOPE: Hair Gel, Hair Mousse, Hair Fixing Cream, Hair Styling Cream.',
    },
    // 10. Oral Care
    {
      id: 'png-pt-oral-mouthwash-floss',
      scopeCategory: 'Oral Care',
      traxCategory: 'Mouthwash & Denture Cleansers',
      clientCategory: 'Oral Care',
      smartL1List: ['Mouthwash & Floss', 'Mouthwash', 'Dental Floss'],
      inScopeProducts: ['Mouthwash', 'Dental Floss'],
      notes: 'In-Scope: Mouthwash, Dental Floss.',
    },
    {
      id: 'png-pt-oral-toothbrush',
      scopeCategory: 'Oral Care',
      traxCategory: 'Toothbrush',
      clientCategory: 'Oral Care',
      smartL1List: ['Toothbrush', 'Electric Toothbrush', 'Manual Toothbrushes', 'Maunal Toothbrushes'],
      inScopeProducts: ['Electric Toothbrush', 'Manual Toothbrushes', 'Maunal Toothbrushes'],
      notes: 'In-Scope: Electric Toothbrush, Manual Toothbrushes.',
    },
    {
      id: 'png-pt-oral-toothpaste',
      scopeCategory: 'Oral Care',
      traxCategory: 'Toothpaste',
      clientCategory: 'Oral Care',
      smartL1List: ['Toothpaste', 'Dental fixing cream'],
      inScopeProducts: ['Toothpaste', 'Dental fixing cream'],
      notes: 'In-Scope: Toothpaste, Dental fixing cream.',
    },
    {
      id: 'png-pt-oral-multi-category',
      scopeCategory: 'Oral Care',
      traxCategory: 'General',
      clientCategory: 'Oral Care',
      smartL1List: ['Multi Category', 'All products that contained more than one category'],
      inScopeProducts: ['All products that contained more than one category'],
      notes: 'In-Scope: All products that contained more than one category (e.g. combo toothbrush + paste).',
    },
    // 11. Deodorants
    {
      id: 'png-pt-deodorants',
      scopeCategory: 'Deodorants',
      traxCategory: 'APDO',
      clientCategory: 'Deodorants',
      smartL1List: ['APDO', 'Men APDO', 'Men Perfume', 'Men Body Sprays', "Men's Deodorant", 'Men Deodorant Cream'],
      inScopeProducts: ['Men APDO', 'Men Perfume', 'Men Body Sprays', "Men's Deodorant", 'Men Deodorant Cream'],
      outOfScopeProducts: ['Female APDO', 'Female Deodorant', 'Female Body Spray'],
      notes:
        'In-Scope: Men APDO, Men Perfume, Men Body Sprays, Men\'s Deodorant, Men Deodorant Cream. STRICTLY OUT OF SCOPE: Female APDO, Female Deodorant, Female Body Spray.',
    },
  ],
};

export const PEPSI_DE_SCOPE: ProjectScope = {
  id: 'pepsi-de',
  name: 'Pepsi Germany (Pepsi DE) Project Scope',
  clientName: 'PepsiCo Germany',
  country: 'Germany',
  description:
    'Official Project Scope Matrix for PepsiCo Germany / Pepsi DE. Covers 3 Client Categories (Juices, Savory Snacks, Social Beverages) across 6 Trax Categories: Juices, Crisps & Snacks, Dips & Spreads, RTD Tea, Energy Drinks, and Soft Drinks.',
  isDefault: true,
  smartPaletteChoices: [
    'Fruit Juices',
    'Vegetable Juice',
    'Cheese Snacks',
    'Corn Snacks',
    'Crisps/Chips',
    'Peanuts Snacks',
    'Popcorn',
    'Pretzels',
    'Tortilla Snacks',
    'Fruit Snacks',
    'Meat Snacks',
    'Deli Spreads',
    'Dips',
    'Ice Tea',
    'Energy Drinks',
    'Carbonated Drinks',
    'Flavored Malt Beverages',
    'Root Beer',
    'Soda Water',
  ],
  specialNotes: [
    'Scope covers 3 Client Categories across PepsiCo Germany (Pepsi DE): Juices, Savory Snacks, and Social Beverages.',
    'Trax Categories (6 total): Juices, Crisps & Snacks, Dips & Spreads, RTD Tea, Energy Drinks, and Soft Drinks.',
    'Trax Sub Categories (19 total): Fruit Juices, Vegetable Juice, Cheese Snacks, Corn Snacks, Crisps/Chips, Peanuts Snacks, Popcorn, Pretzels, Tortilla Snacks, Fruit Snacks, Meat Snacks, Deli Spreads, Dips, Ice Tea, Energy Drinks, Carbonated Drinks, Flavored Malt Beverages, Root Beer, Soda Water.',
    'Savory Snacks branches into two Trax Categories: "Crisps & Snacks" (Chips, Popcorn, Pretzels, Tortilla Snacks, Nuts, Meat/Fruit Snacks) and "Dips & Spreads" (Deli Spreads, Dips).',
    'Social Beverages branches into three Trax Categories: "RTD Tea" (Ice Tea), "Energy Drinks" (Energy Drinks), and "Soft Drinks" (Carbonated Drinks, Flavored Malt Beverages, Root Beer, Soda Water).',
    'Strict Out-of-Scope exclusions: Personal Care & Hygiene, Home Care & Cleaning, Dairy, Fresh Meat, Alcohol (Beer/Wine/Spirits), Hot Tea/Coffee, Sweet Confectionery (Candies, Chocolate), and Medicines.',
  ],
  inScopeList: [
    'Juices: Fruit Juices, Vegetable Juice (Punica, Tropicana, Naked Juice) -> Trax Category: Juices',
    'Savory Snacks - Crisps & Snacks: Cheese Snacks (Cheetos), Corn Snacks, Crisps/Chips (Lay\'s, Walkers), Peanuts Snacks (Duyvis), Popcorn, Pretzels, Tortilla Snacks (Doritos), Fruit Snacks, Meat Snacks -> Trax Category: Crisps & Snacks',
    'Savory Snacks - Dips & Spreads: Deli Spreads, Dips (Doritos dips, salsa, cheese dips) -> Trax Category: Dips & Spreads',
    'Social Beverages - RTD Tea: Ice Tea (Lipton Ice Tea, Pure Leaf) -> Trax Category: RTD Tea, Trax Sub Category: Ice Tea',
    'Social Beverages - Energy Drinks: Energy Drinks (Rockstar Energy, Sting) -> Trax Category: Energy Drinks, Trax Sub Category: Energy Drinks',
    'Social Beverages - Soft Drinks: Carbonated Drinks (Pepsi, Pepsi Max, 7UP, Mirinda, Schwip Schwap, Mountain Dew), Flavored Malt Beverages, Root Beer, Soda Water -> Trax Category: Soft Drinks',
  ],
  outOfScopeList: [
    'Personal Care & Hygiene (Shampoo, soap, shower gel, deodorant, skin care, oral care, hair care, razors, diapers)',
    'Home Care & Cleaning (Laundry detergents, fabric softeners, household cleaners, dishwashing liquid, bleach)',
    'Dairy & Fresh Grocery (Milk, cheese blocks, yogurt, butter, fresh meat, eggs)',
    'Alcoholic Beverages (Beer, wine, spirits, champagne, cider - except non-alcoholic flavored malt beverages)',
    'Hot Coffee & Hot Tea (Hot coffee beans, ground coffee, tea bags - only RTD Ice Tea is in scope)',
    'Confectionery & Sweet Baked Goods (Chocolate bars, gummy candy, sweet biscuits, pastries, cakes - only savory snacks are in scope)',
    'Tobacco, Cigarettes & Vapes',
    'Medicines & Pharmaceuticals (Medicines, pharmaceutical supplements, medical devices)',
  ],
  rules: [
    // 1. Juices
    {
      id: 'pepsi-de-juices',
      scopeCategory: 'Juices',
      traxCategory: 'Juices',
      clientCategory: 'Juices',
      smartL1List: ['Fruit Juices', 'Vegetable Juice', 'Juices'],
      inScopeProducts: ['Fruit Juices', 'Vegetable Juice'],
      notes: 'In-Scope: Fruit Juices, Vegetable Juice (e.g. Punica, Tropicana, Naked Juice).',
    },
    // 2. Savory Snacks - Crisps & Snacks
    {
      id: 'pepsi-de-crisps-snacks',
      scopeCategory: 'Savory Snacks',
      traxCategory: 'Crisps & Snacks',
      clientCategory: 'Savory Snacks',
      smartL1List: [
        'Crisps/Chips',
        'Cheese Snacks',
        'Corn Snacks',
        'Peanuts Snacks',
        'Popcorn',
        'Pretzels',
        'Tortilla Snacks',
        'Fruit Snacks',
        'Meat Snacks',
        'Crisps & Snacks',
      ],
      inScopeProducts: [
        'Cheese Snacks',
        'Corn Snacks',
        'Crisps/Chips',
        'Peanuts Snacks',
        'Popcorn',
        'Pretzels',
        'Tortilla Snacks',
        'Fruit Snacks',
        'Meat Snacks',
      ],
      notes:
        'In-Scope: Cheese Snacks (Cheetos), Corn Snacks, Crisps/Chips (Lay\'s, Walkers), Peanuts Snacks (Duyvis), Popcorn, Pretzels, Tortilla Snacks (Doritos), Fruit Snacks, Meat Snacks.',
    },
    // 3. Savory Snacks - Dips & Spreads
    {
      id: 'pepsi-de-dips-spreads',
      scopeCategory: 'Savory Snacks',
      traxCategory: 'Dips & Spreads',
      clientCategory: 'Savory Snacks',
      smartL1List: ['Deli Spreads', 'Dips', 'Dips & Spreads'],
      inScopeProducts: ['Deli Spreads', 'Dips'],
      notes: 'In-Scope: Deli Spreads, Dips (Doritos Dips, salsa, cheese dips, guacamole dips).',
    },
    // 4. Social Beverages - RTD Tea
    {
      id: 'pepsi-de-rtd-tea',
      scopeCategory: 'Social Beverages',
      traxCategory: 'RTD Tea',
      clientCategory: 'Social Beverages',
      smartL1List: ['Ice Tea', 'RTD Tea'],
      inScopeProducts: ['Ice Tea'],
      notes: 'In-Scope: Ice Tea (Lipton Ice Tea, Pure Leaf).',
    },
    // 5. Social Beverages - Energy Drinks
    {
      id: 'pepsi-de-energy-drinks',
      scopeCategory: 'Social Beverages',
      traxCategory: 'Energy Drinks',
      clientCategory: 'Social Beverages',
      smartL1List: ['Energy Drinks'],
      inScopeProducts: ['Energy Drinks'],
      notes: 'In-Scope: Energy Drinks (Rockstar Energy, Sting, etc.).',
    },
    // 6. Social Beverages - Soft Drinks
    {
      id: 'pepsi-de-soft-drinks',
      scopeCategory: 'Social Beverages',
      traxCategory: 'Soft Drinks',
      clientCategory: 'Social Beverages',
      smartL1List: ['Carbonated Drinks', 'Flavored Malt Beverages', 'Root Beer', 'Soda Water', 'Soft Drinks'],
      inScopeProducts: ['Carbonated Drinks', 'Flavored Malt Beverages', 'Root Beer', 'Soda Water'],
      notes:
        'In-Scope: Carbonated Drinks (Pepsi, Pepsi Max, 7UP, Mirinda, Schwip Schwap, Mountain Dew), Flavored Malt Beverages, Root Beer, Soda Water.',
    },
  ],
};

export const COCA_COLA_ISRAEL_SCOPE: ProjectScope = {
  id: 'coca-cola-israel',
  name: 'Coca-Cola Israel (CBC_IL) Project Scope',
  clientName: 'Coca-Cola Israel (CBC)',
  country: 'Israel',
  description:
    'Official Project Scope Matrix for Central Bottling Company / Coca-Cola Israel (CBC_IL). Covers 12 beverage categories: Beer & Cider, Energy Drinks, RTD Coffee, Soft Drinks, Tea, Juices, Isotonic & Sports Drinks, Water, Spirits, Wine, Alcoholic Ready to Drink, Champagne. Non-beverage items (Food, Dairy, Personal Care, Household Care, Tobacco, Medicines) are strictly Out of Scope.',
  isDefault: true,
  specialNotes: [
    'CBC_IL Project Scope encompasses Central Bottling Company (Coca-Cola Israel) beverage categories.',
    'TRAX SMART PALETTE: Exactly 12 valid Smart Level 1 choices: 1. Beer, 2. Energy Drinks, 3. RTD Coffee, 4. Flavored Sparkling, 5. Ice Tea, 6. Juice, 7. Sports Drinks, 8. Water, 9. Spirit, 10. Wine, 11. RTD, 12. Champagne.',
    'Flavored Sparkling / Soft Drinks: In-scope includes Black Sparkling, Fruit Sparkling, Lemon Sparkling, Soda, Soft Drink, and Sparkling.',
    'Beer & Cider: In-scope includes Beer, Malt Beer, and White Beer. Client category may be recorded as "Beer" or "Spirit".',
    'Juices: In-scope includes Cranberries, Freshy Squeezed, Nectar, and Juice.',
    'Water: In-scope includes Bottle Water, Flavourd Water, Near Water, and Sparkling Water.',
    'Spirits: In-scope includes Spirits, Non-Alcoholic Spirits, Rum, Brandy, Cocktail Mixers, Gin, Liqueurs, Vodka, Tequila, Whisky.',
    'Wine: In-scope includes Desert Wine, Red Wine, Sparkling Wine, Rose Wine, and White Wine.',
    'RTD / Alcoholic Ready to Drink: In-scope includes Alcoholic Pre-Mix Drink and RTD.',
    'Out of Scope: All non-beverage consumer goods (Food, Snacks, Confectionery, Dairy, Sauces/Condiments, Personal Care, Household Care, Tobacco, Medicines).',
  ],
  smartPaletteChoices: [
    'Beer',
    'Energy Drinks',
    'RTD Coffee',
    'Flavored Sparkling',
    'Ice Tea',
    'Juice',
    'Sports Drinks',
    'Water',
    'Spirit',
    'Wine',
    'RTD',
    'Champagne',
  ],
  inScopeList: [
    'Beer & Cider: Beer, Malt Beer, White Beer -> Trax Category: Beer & Cider, Client Category: Beer (or Spirit), Smart L1: Beer',
    'Energy Drinks: Energy Drinks (Red Bull, Monster, XL, BLU, etc.) -> Trax Category: Energy Drinks, Client Category: Energy Drinks, Smart L1: Energy Drinks',
    'RTD Coffee: Ready-to-drink canned/bottled iced coffees -> Trax Category: RTD Coffee, Client Category: RTD Coffee, Smart L1: RTD Coffee',
    'Soft Drinks / Flavored Sparkling: Black Sparkling (Cola), Fruit Sparkling, Lemon Sparkling, Soda, Soft Drink, Sparkling -> Trax Category: Soft Drinks, Client Category: Flavored Sparkling, Smart L1: Flavored Sparkling',
    'Tea: Ice Tea (Fuze Tea, Nestea, Lipton Ice Tea, etc.) -> Trax Category: Tea, Client Category: Ice Tea, Smart L1: Ice Tea',
    'Juices: Cranberries, Freshy Squeezed, Nectar, Juice (Prigat, etc.) -> Trax Category: Juices, Client Category: Juice / Juices, Smart L1: Juice',
    'Isotonic & Sports Drinks: Sports Drinks (Isotonic beverages, Powerade, etc.) -> Trax Category: Isotonic & Sports Drinks, Client Category: Sports Drinks, Smart L1: Sports Drinks',
    'Water: Bottle Water, Flavourd Water, Near Water, Sparkling Water (Neviot, Kinley Soda, etc.) -> Trax Category: Water, Client Category: Water, Smart L1: Water',
    'Spirits: Spirits, Non-Alcoholic Spirits, Rum, Brandy, Cocktail Mixers, Gin, Liqueurs, Vodka, Tequila, Whisky -> Trax Category: Spirits, Client Category: Spirit, Smart L1: Spirit',
    'Wine: Desert Wine, Red Wine, Sparkling Wine, Rose Wine, White Wine -> Trax Category: Wine, Client Category: Wine, Smart L1: Wine',
    'Alcoholic Ready to Drink: Alcoholic Pre-Mix Drink, RTD -> Trax Category: Alcoholic Ready to Drink, Client Category: RTD (or Spirit), Smart L1: RTD',
    'Champagne: Champagne products -> Trax Category: Champagne, Client Category: Champagne (or Spirit), Smart L1: Champagne',
  ],
  outOfScopeList: [
    '1. Food & Snacks (Chips, pretzels, nuts, confectionery, chocolates, cookies, biscuits, candy, gums, etc.)',
    '2. Grocery, Condiments & Sauces (Mayonnaise, ketchup, mustard, sauces, dressings, seasonings, soups, canned food, cooking oils)',
    '3. Dairy & Milk Products (Fluid milk, cheese, yogurt, dairy desserts, butter)',
    '4. Tobacco & Vaping Products (Cigarettes, cigars, electronic cigarettes, pods)',
    '5. Personal Care & Cosmetics (Soaps, shampoos, deodorants, skincare, oral care)',
    '6. Household Care & Cleaning Products (Laundry detergents, fabric softeners, surface cleaners, dishwashing)',
    '7. Medicines & Pharmaceuticals (Over-the-counter medicines, treatments, health supplements)',
  ],
  rules: [
    {
      id: 'cbc-il-beer-cider',
      scopeCategory: 'Beer & Cider',
      traxCategory: 'Beer & Cider',
      clientCategory: 'Beer',
      smartL1List: ['Beer'],
      inScopeProducts: ['Beer', 'Malt Beer', 'White Beer'],
      notes: 'Client category may also appear as Spirit in raw matrix; SMART L1 is Beer.',
    },
    {
      id: 'cbc-il-beer-cider-spirit',
      scopeCategory: 'Beer & Cider',
      traxCategory: 'Beer & Cider',
      clientCategory: 'Spirit',
      smartL1List: ['Beer'],
      inScopeProducts: ['Beer', 'Malt Beer', 'White Beer'],
    },
    {
      id: 'cbc-il-energy-drinks',
      scopeCategory: 'Energy Drinks',
      traxCategory: 'Energy Drinks',
      clientCategory: 'Energy Drinks',
      smartL1List: ['Energy Drinks'],
      inScopeProducts: ['Energy Drinks'],
    },
    {
      id: 'cbc-il-rtd-coffee',
      scopeCategory: 'RTD Coffee',
      traxCategory: 'RTD Coffee',
      clientCategory: 'RTD Coffee',
      smartL1List: ['RTD Coffee'],
      inScopeProducts: ['RTD Coffee'],
    },
    {
      id: 'cbc-il-soft-drinks',
      scopeCategory: 'Soft Drinks',
      traxCategory: 'Soft Drinks',
      clientCategory: 'Flavored Sparkling',
      smartL1List: ['Flavored Sparkling'],
      inScopeProducts: ['Black Sparkling', 'Fruit Sparkling', 'Lemon Sparkling', 'Soda', 'Soft Drink', 'Sparkling'],
      notes: 'Includes Colas (Black Sparkling), Fruit Sparklings, Lemon Sparklings, Soda, and regular Soft Drinks.',
    },
    {
      id: 'cbc-il-tea',
      scopeCategory: 'Tea',
      traxCategory: 'Tea',
      clientCategory: 'Ice Tea',
      smartL1List: ['Ice Tea'],
      inScopeProducts: ['Ice Tea'],
    },
    {
      id: 'cbc-il-juices',
      scopeCategory: 'Juices',
      traxCategory: 'Juices',
      clientCategory: 'Juice / Juices',
      smartL1List: ['Juice'],
      inScopeProducts: ['Cranberries', 'Freshy Squeezed', 'Nectar', 'Juice'],
    },
    {
      id: 'cbc-il-juices-alt',
      scopeCategory: 'Juices',
      traxCategory: 'Juices',
      clientCategory: 'Juice',
      smartL1List: ['Juice'],
      inScopeProducts: ['Cranberries', 'Freshy Squeezed', 'Nectar', 'Juice'],
    },
    {
      id: 'cbc-il-isotonic-sports',
      scopeCategory: 'Isotonic & Sports Drinks',
      traxCategory: 'Isotonic & Sports Drinks',
      clientCategory: 'Sports Drinks',
      smartL1List: ['Sports Drinks'],
      inScopeProducts: ['Sports Drinks'],
    },
    {
      id: 'cbc-il-water',
      scopeCategory: 'Water',
      traxCategory: 'Water',
      clientCategory: 'Water',
      smartL1List: ['Water'],
      inScopeProducts: ['Bottle Water', 'Flavourd Water', 'Near Water', 'Sparkling Water'],
    },
    {
      id: 'cbc-il-spirits',
      scopeCategory: 'Spirits',
      traxCategory: 'Spirits',
      clientCategory: 'Spirit',
      smartL1List: ['Spirit'],
      inScopeProducts: [
        'Spirits',
        'Non-Alcoholic Spirits',
        'Rum',
        'Brandy',
        'Cocktail Mixers',
        'Gin',
        'Liqueurs',
        'Vodka',
        'Tequila',
        'Whisky',
      ],
    },
    {
      id: 'cbc-il-wine',
      scopeCategory: 'Wine',
      traxCategory: 'Wine',
      clientCategory: 'Wine',
      smartL1List: ['Wine'],
      inScopeProducts: ['Desert Wine', 'Red Wine', 'Sparkling Wine', 'Rose Wine', 'White Wine'],
    },
    {
      id: 'cbc-il-alcoholic-rtd',
      scopeCategory: 'Alcoholic Ready to Drink',
      traxCategory: 'Alcoholic Ready to Drink',
      clientCategory: 'RTD',
      smartL1List: ['RTD'],
      inScopeProducts: ['Alcoholic Pre-Mix Drink', 'RTD'],
    },
    {
      id: 'cbc-il-alcoholic-rtd-spirit',
      scopeCategory: 'Alcoholic Ready to Drink',
      traxCategory: 'Alcoholic Ready to Drink',
      clientCategory: 'Spirit',
      smartL1List: ['RTD'],
      inScopeProducts: ['Alcoholic Pre-Mix Drink', 'RTD'],
    },
    {
      id: 'cbc-il-champagne',
      scopeCategory: 'Champagne',
      traxCategory: 'Champagne',
      clientCategory: 'Champagne',
      smartL1List: ['Champagne'],
      inScopeProducts: ['Champagne'],
    },
    {
      id: 'cbc-il-champagne-spirit',
      scopeCategory: 'Champagne',
      traxCategory: 'Champagne',
      clientCategory: 'Spirit',
      smartL1List: ['Champagne'],
      inScopeProducts: ['Champagne'],
    },
  ],
};

export const DEFAULT_PROJECT_SCOPES: ProjectScope[] = [
  PEPSI_DE_SCOPE,
  PNG_PT_SCOPE,
  COCA_COLA_ISRAEL_SCOPE,
  UNILEVER_PT_SCOPE,
  UNILEVER_IT_SCOPE,
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
