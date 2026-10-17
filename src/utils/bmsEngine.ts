import {
  UOM,
  MasterIngredient,
  RecipeIngredientRow,
  OverheadExpense,
  Recipe,
  CalculationBreakdown,
} from '../types';

export const UOM_OPTIONS: { value: UOM; label: string; symbol: string }[] = [
  { value: 'kg', label: 'Kilograms (kg)', symbol: 'kg' },
  { value: 'g', label: 'Grams (g)', symbol: 'g' },
  { value: 'liters', label: 'Litres (liters)', symbol: 'L' },
  { value: 'ml', label: 'Millilitres (ml)', symbol: 'ml' },
  { value: 'pieces', label: 'Pieces (pcs / eggs)', symbol: 'pcs' },
  { value: 'packets', label: 'Packets (pkts)', symbol: 'pkts' },
];

export function getUomLabel(uom: UOM): string {
  switch (uom) {
    case 'kg':
      return 'kg';
    case 'g':
      return 'g';
    case 'liters':
      return 'L';
    case 'ml':
      return 'ml';
    case 'pieces':
      return 'piece';
    case 'packets':
      return 'packet';
    default:
      return uom;
  }
}

/**
 * Calculates unit price: (Total Bulk Price / Bulk Package Quantity)
 */
export function calculateMasterUnitPrice(bulkPrice: number, bulkQuantity: number): number {
  if (!bulkQuantity || bulkQuantity <= 0) return 0;
  return (bulkPrice || 0) / bulkQuantity;
}

/**
 * Converts quantity needed into master inventory's bulk UOM
 * e.g., if Master is in 'kg' and recipe enters 500 'g', conversion ratio is 0.001
 */
export function calculateIngredientCost(
  neededQty: number,
  neededUom: UOM,
  master: MasterIngredient
): {
  masterUnitPrice: number;
  effectiveQtyInMasterUom: number;
  baseCost: number;
} {
  const masterUnitPrice = calculateMasterUnitPrice(master.bulkPrice, master.bulkQuantity);

  let conversionFactor = 1;
  if (master.uom === 'kg') {
    if (neededUom === 'g') conversionFactor = 0.001;
    else if (neededUom === 'kg') conversionFactor = 1;
  } else if (master.uom === 'g') {
    if (neededUom === 'kg') conversionFactor = 1000;
    else if (neededUom === 'g') conversionFactor = 1;
  } else if (master.uom === 'liters') {
    if (neededUom === 'ml') conversionFactor = 0.001;
    else if (neededUom === 'liters') conversionFactor = 1;
  } else if (master.uom === 'ml') {
    if (neededUom === 'liters') conversionFactor = 1000;
    else if (neededUom === 'ml') conversionFactor = 1;
  }

  const effectiveQtyInMasterUom = (neededQty || 0) * conversionFactor;
  const baseCost = effectiveQtyInMasterUom * masterUnitPrice;

  return {
    masterUnitPrice,
    effectiveQtyInMasterUom,
    baseCost,
  };
}

export function formatRs(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return 'Rs 0.00';
  const isNeg = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absVal);
  return `${isNeg ? '- ' : ''}Rs ${formatted}`;
}

export function formatNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(decimals).replace(/\.?0+$/, '');
}

export function formatPercent(percent: number): string {
  if (isNaN(percent) || !isFinite(percent)) return '0.0%';
  return `${percent.toFixed(1)}%`;
}

export const DEFAULT_MASTER_INVENTORY: MasterIngredient[] = [
  {
    id: 'ing-flour-mill',
    name: 'Wheat Flour Mill',
    bulkQuantity: 50,
    uom: 'kg',
    bulkPrice: 9750,
    category: 'Flour & Starches',
  },
  {
    id: 'ing-flour-hammer',
    name: 'Wheat Flour Hammer',
    bulkQuantity: 50,
    uom: 'kg',
    bulkPrice: 8830,
    category: 'Flour & Starches',
  },
  {
    id: 'ing-sugar',
    name: 'Sugar',
    bulkQuantity: 50,
    uom: 'kg',
    bulkPrice: 11600,
    category: 'Sweeteners',
  },
  {
    id: 'ing-margarine',
    name: 'Beehive Margarine',
    bulkQuantity: 20,
    uom: 'kg',
    bulkPrice: 20400,
    category: 'Fats & Oils',
  },
  {
    id: 'ing-hycho',
    name: 'Hycho',
    bulkQuantity: 20,
    uom: 'kg',
    bulkPrice: 10750,
    category: 'Fats & Oils',
  },
  {
    id: 'ing-egg',
    name: 'Egg',
    bulkQuantity: 1,
    uom: 'pieces',
    bulkPrice: 40,
    category: 'Dairy & Eggs',
  },
  {
    id: 'ing-bread-yeast',
    name: 'Bread Yeast',
    bulkQuantity: 500,
    uom: 'g',
    bulkPrice: 950,
    category: 'Leavening',
  },
  {
    id: 'ing-bun-yeast',
    name: 'Bun Yeast',
    bulkQuantity: 500,
    uom: 'g',
    bulkPrice: 950,
    category: 'Leavening',
  },
  {
    id: 'ing-vanilla',
    name: 'Vanilla Essence',
    bulkQuantity: 500,
    uom: 'ml',
    bulkPrice: 1500,
    category: 'Flavorings',
  },
  {
    id: 'ing-cocoa',
    name: 'Cocoa Powder',
    bulkQuantity: 1,
    uom: 'kg',
    bulkPrice: 2500,
    category: 'Flavorings',
  },
  {
    id: 'ing-colouring',
    name: 'Colouring',
    bulkQuantity: 500,
    uom: 'ml',
    bulkPrice: 850,
    category: 'Coloring & Additives',
  },
  {
    id: 'ing-dry-fruits',
    name: 'Dry Fruits',
    bulkQuantity: 1,
    uom: 'kg',
    bulkPrice: 2400,
    category: 'Fruits & Nuts',
  },
  {
    id: 'ing-baking-powder',
    name: 'Baking Powder',
    bulkQuantity: 1,
    uom: 'kg',
    bulkPrice: 1200,
    category: 'Leavening',
  },
];

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'recipe-cake-6kg',
    name: 'Butter Cake 6kg Batch',
    batchMultiplier: 1.0,
    ingredients: [
      { id: 'r-ing-1', masterIngredientId: 'ing-flour-mill', quantityNeeded: 1.5, uom: 'kg' },
      { id: 'r-ing-2', masterIngredientId: 'ing-sugar', quantityNeeded: 1.5, uom: 'kg' },
      { id: 'r-ing-3', masterIngredientId: 'ing-margarine', quantityNeeded: 1.5, uom: 'kg' },
      { id: 'r-ing-4', masterIngredientId: 'ing-egg', quantityNeeded: 30, uom: 'pieces' },
      { id: 'r-ing-5', masterIngredientId: 'ing-baking-powder', quantityNeeded: 30, uom: 'g' },
      { id: 'r-ing-6', masterIngredientId: 'ing-vanilla', quantityNeeded: 25, uom: 'ml' },
      { id: 'r-ing-7', masterIngredientId: 'ing-colouring', quantityNeeded: 5, uom: 'ml' },
    ],
    overheads: [
      { id: 'ovh-1', name: 'Electricity (Ovens & Planetary Mixer)', cost: 200, isVariable: true },
      { id: 'ovh-2', name: 'LPG Gas (Baking Oven)', cost: 150, isVariable: true },
      { id: 'ovh-3', name: 'Baker Salary & Labor Allocation', cost: 300, isVariable: false },
      { id: 'ovh-4', name: 'Packaging Box & Cake Board', cost: 100, isVariable: true },
    ],
    rawBatterWeight: 6.5,
    finishedProductWeight: 6.0,
    outcomeQuantity: 6,
    outcomeUnitType: 'kg',
    sellingPricePerUnit: 1200,
  },
  {
    id: 'recipe-sweet-bun',
    name: 'Sweet Bun (50 pcs Batch)',
    batchMultiplier: 1.0,
    ingredients: [
      { id: 'r-sb-1', masterIngredientId: 'ing-flour-mill', quantityNeeded: 2.0, uom: 'kg' },
      { id: 'r-sb-2', masterIngredientId: 'ing-sugar', quantityNeeded: 400, uom: 'g' },
      { id: 'r-sb-3', masterIngredientId: 'ing-margarine', quantityNeeded: 250, uom: 'g' },
      { id: 'r-sb-4', masterIngredientId: 'ing-egg', quantityNeeded: 4, uom: 'pieces' },
      { id: 'r-sb-5', masterIngredientId: 'ing-bun-yeast', quantityNeeded: 30, uom: 'g' },
      { id: 'r-sb-6', masterIngredientId: 'ing-vanilla', quantityNeeded: 10, uom: 'ml' },
    ],
    overheads: [
      { id: 'ovh-sb-1', name: 'Electricity (Spiral Mixer & Proofer)', cost: 180, isVariable: true },
      { id: 'ovh-sb-2', name: 'LPG Gas (Deck Oven)', cost: 140, isVariable: true },
      { id: 'ovh-sb-3', name: 'Baker Labor Wage', cost: 250, isVariable: false },
    ],
    rawBatterWeight: 4.2,
    finishedProductWeight: 3.8,
    outcomeQuantity: 50,
    outcomeUnitType: 'pieces',
    sellingPricePerUnit: 45,
  },
  {
    id: 'recipe-curry-bun',
    name: 'Curry Bun (40 pcs Batch)',
    batchMultiplier: 1.0,
    ingredients: [
      { id: 'r-cb-1', masterIngredientId: 'ing-flour-hammer', quantityNeeded: 1.8, uom: 'kg' },
      { id: 'r-cb-2', masterIngredientId: 'ing-sugar', quantityNeeded: 150, uom: 'g' },
      { id: 'r-cb-3', masterIngredientId: 'ing-hycho', quantityNeeded: 200, uom: 'g' },
      { id: 'r-cb-4', masterIngredientId: 'ing-bread-yeast', quantityNeeded: 25, uom: 'g' },
      { id: 'r-cb-5', masterIngredientId: 'ing-egg', quantityNeeded: 2, uom: 'pieces' },
    ],
    overheads: [
      { id: 'ovh-cb-1', name: 'Electricity (Mixing & Lighting)', cost: 150, isVariable: true },
      { id: 'ovh-cb-2', name: 'LPG Gas (Baking Heat)', cost: 130, isVariable: true },
      { id: 'ovh-cb-3', name: 'Baker & Shaping Labor', cost: 280, isVariable: false },
      { id: 'ovh-cb-4', name: 'Wax Paper & Bag Packaging', cost: 80, isVariable: true },
    ],
    rawBatterWeight: 4.5,
    finishedProductWeight: 4.1,
    outcomeQuantity: 40,
    outcomeUnitType: 'pieces',
    sellingPricePerUnit: 120,
  },
  {
    id: 'recipe-chocolate-fruit-cake',
    name: 'Chocolate & Dry Fruit Cake (10 pcs Batch)',
    batchMultiplier: 1.0,
    ingredients: [
      { id: 'r-cfc-1', masterIngredientId: 'ing-flour-mill', quantityNeeded: 1.5, uom: 'kg' },
      { id: 'r-cfc-2', masterIngredientId: 'ing-sugar', quantityNeeded: 1.2, uom: 'kg' },
      { id: 'r-cfc-3', masterIngredientId: 'ing-margarine', quantityNeeded: 1.0, uom: 'kg' },
      { id: 'r-cfc-4', masterIngredientId: 'ing-egg', quantityNeeded: 20, uom: 'pieces' },
      { id: 'r-cfc-5', masterIngredientId: 'ing-cocoa', quantityNeeded: 150, uom: 'g' },
      { id: 'r-cfc-6', masterIngredientId: 'ing-dry-fruits', quantityNeeded: 300, uom: 'g' },
      { id: 'r-cfc-7', masterIngredientId: 'ing-vanilla', quantityNeeded: 20, uom: 'ml' },
      { id: 'r-cfc-8', masterIngredientId: 'ing-baking-powder', quantityNeeded: 25, uom: 'g' },
    ],
    overheads: [
      { id: 'ovh-cfc-1', name: 'Electricity (Ovens & Mixer)', cost: 220, isVariable: true },
      { id: 'ovh-cfc-2', name: 'LPG Gas (Baking)', cost: 180, isVariable: true },
      { id: 'ovh-cfc-3', name: 'Cake Decorator Labor', cost: 350, isVariable: false },
      { id: 'ovh-cfc-4', name: 'Premium Cake Boxes', cost: 200, isVariable: true },
    ],
    rawBatterWeight: 5.8,
    finishedProductWeight: 5.2,
    outcomeQuantity: 10,
    outcomeUnitType: 'pieces',
    sellingPricePerUnit: 850,
  },
];

export function calculateRecipeFinancials(
  recipe: Recipe,
  inventory: MasterIngredient[]
): CalculationBreakdown {
  const mult = recipe.batchMultiplier > 0 ? recipe.batchMultiplier : 1;
  const inventoryMap = new Map(inventory.map((item) => [item.id, item]));

  // 1. Base and Scaled Direct Ingredient Cost
  let baseDirectCost = 0;
  recipe.ingredients.forEach((row) => {
    const master = inventoryMap.get(row.masterIngredientId);
    if (master) {
      const calc = calculateIngredientCost(row.quantityNeeded, row.uom, master);
      baseDirectCost += calc.baseCost;
    }
  });
  const scaledDirectCost = baseDirectCost * mult;

  // 2. Base and Scaled Indirect Overhead Cost
  // Variable scales with multiplier, Fixed stays constant
  let baseIndirectCost = 0;
  let scaledIndirectCost = 0;
  recipe.overheads.forEach((ovh) => {
    const cost = Number(ovh.cost) || 0;
    baseIndirectCost += cost;
    if (ovh.isVariable) {
      scaledIndirectCost += cost * mult;
    } else {
      scaledIndirectCost += cost; // Fixed constant
    }
  });

  // 3. Total Production Cost = Direct + Indirect
  const totalProductionCost = scaledDirectCost + scaledIndirectCost;

  // 4. Shrinkage / Evaporation Loss
  const rawWeight = Number(recipe.rawBatterWeight) || 0;
  const finishedWeight = Number(recipe.finishedProductWeight) || 0;
  const shrinkagePercent =
    rawWeight > 0 && finishedWeight < rawWeight
      ? ((rawWeight - finishedWeight) / rawWeight) * 100
      : 0;

  // 5. Total Outcome Quantity & Revenue
  const baseOutcomeQty = Number(recipe.outcomeQuantity) || 0;
  const scaledOutcomeQty = baseOutcomeQty * mult;
  const pricePerUnit = Number(recipe.sellingPricePerUnit) || 0;
  const totalRevenue = scaledOutcomeQty * pricePerUnit;

  // 6. Cost per Unit/Kg
  const costPerUnit = scaledOutcomeQty > 0 ? totalProductionCost / scaledOutcomeQty : 0;

  // 7. Net Profit
  const netProfit = totalRevenue - totalProductionCost;

  // 8. Profit per Unit
  const profitPerUnit = scaledOutcomeQty > 0 ? netProfit / scaledOutcomeQty : 0;

  // 9. Gross Profit Margin %
  const grossMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return {
    multiplier: mult,
    rawBatterWeight: rawWeight * mult,
    finishedProductWeight: finishedWeight * mult,
    shrinkagePercent,
    baseDirectCost,
    scaledDirectCost,
    baseIndirectCost,
    scaledIndirectCost,
    totalProductionCost,
    scaledOutcomeQty,
    totalRevenue,
    costPerUnit,
    netProfit,
    grossMarginPercent,
    profitPerUnit,
  };
}
