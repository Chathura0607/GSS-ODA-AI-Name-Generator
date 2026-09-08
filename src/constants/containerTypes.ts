/**
 * Official GSS ODA Container Types
 * Extracted directly from GSS Operational Data Analyst Container Type Specification.
 */
export const CONTAINER_TYPES = [
  'Aluminum',
  'Aluminum Keg',
  'Bag Plastic',
  'Bottle',
  'Bottle Can',
  'Box Round',
  'Can',
  'Capsule',
  'Cardboard Box',
  'Carton',
  'Carton Pack',
  'Case',
  'Coffee Box',
  'Coffee Bag',
  'Coffee Pod',
  'Container Aluminum',
  'Container Carton',
  'Container Glass',
  'Container Plastic',
  'Cup',
  'Glass',
  'Glass Bottle',
  'Keg',
  'Metal Box',
  'Pack',
  'Pack Plastic',
  'Pack Aluminum',
  'Pack Carton',
  'Pack Glass',
  'Pack Pet',
  'Pack Soft',
  'Pallet',
  'Pot',
  'Plastic',
  'Plastic Round Box',
  'Plastic Tube',
  'Plastic Bag',
  'Plastic Box',
  'Plastic Container',
  'Plastic Wrap',
  'Pouch',
  'Round Box',
  'Sachet',
  'Tetra',
  'Tube',
  'Vacuum',
  'Vap',
  'Wrap Aluminum',
  'Wrap Carton',
  'Wrap Paper',
  'Wrap Plastic',
  'None',
] as const;

export type ContainerType = typeof CONTAINER_TYPES[number];

/**
 * Standard measurement units per GSS ODA guidelines
 */
export const MEASUREMENT_UNITS = [
  'ml',
  'l',
  'g',
  'kg',
  'cl',
  'oz',
  'fl oz',
  'lb',
  'pack',
  'pcs',
  'sheets',
  'capsules',
  'tablets',
  'wipes',
  'tea bags',
] as const;

export type MeasurementUnit = typeof MEASUREMENT_UNITS[number];
