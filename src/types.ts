export type UOM = 'kg' | 'g' | 'liters' | 'ml' | 'pieces' | 'packets';

export interface MasterIngredient {
  id: string;
  name: string;
  bulkQuantity: number;
  uom: UOM;
  bulkPrice: number; // in Rs
  category?: string;
  updatedAt?: string;
}

export interface RecipeIngredientRow {
  id: string;
  masterIngredientId: string;
  quantityNeeded: number;
  uom: UOM;
}

export interface OverheadExpense {
  id: string;
  name: string;
  cost: number; // in Rs
  isVariable: boolean; // true: scales with batch multiplier, false: fixed constant
}

export interface Recipe {
  id: string;
  name: string;
  batchMultiplier: number;
  ingredients: RecipeIngredientRow[];
  overheads: OverheadExpense[];
  rawBatterWeight: number; // in kg
  finishedProductWeight: number; // in kg
  outcomeQuantity: number;
  outcomeUnitType: string; // 'kg' | 'pieces' | 'loaves' | 'boxes'
  sellingPricePerUnit: number; // in Rs
}

export interface CalculationBreakdown {
  multiplier: number;
  rawBatterWeight: number;
  finishedProductWeight: number;
  shrinkagePercent: number;
  baseDirectCost: number;
  scaledDirectCost: number;
  baseIndirectCost: number;
  scaledIndirectCost: number;
  totalProductionCost: number;
  scaledOutcomeQty: number;
  totalRevenue: number;
  costPerUnit: number;
  netProfit: number;
  grossMarginPercent: number;
  profitPerUnit: number;
}

// Backward-compatibility interfaces for legacy subcomponents
export interface IngredientItem {
  id: string;
  name: string;
  baseQty: string;
  baseCost: number;
}

export interface IndirectCostItem {
  id: string;
  type: string;
  description: string;
  baseCost: number;
}

export interface BatchOutcomeConfig {
  unitType: string;
  baseQuantity: number;
  pricePerUnit: number;
}

export interface RecipePreset {
  id: string;
  name: string;
  category: string;
  ingredients: IngredientItem[];
  indirectCosts: IndirectCostItem[];
  outcome: BatchOutcomeConfig;
}


