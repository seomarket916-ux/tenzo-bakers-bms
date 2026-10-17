import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MasterInventoryTab } from './components/MasterInventoryTab';
import { RecipeCostingTab } from './components/RecipeCostingTab';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { MasterIngredient, Recipe, RecipeIngredientRow, OverheadExpense } from './types';
import {
  DEFAULT_MASTER_INVENTORY,
  DEFAULT_RECIPES,
  calculateRecipeFinancials,
  calculateIngredientCost,
  formatRs,
  formatNumber,
  formatPercent,
  getUomLabel,
} from './utils/bmsEngine';

const STORAGE_KEY_INVENTORY = 'tenzo_bms_master_inventory_v3';
const STORAGE_KEY_RECIPES = 'tenzo_bms_recipes_v3';
const STORAGE_KEY_ACTIVE_RECIPE = 'tenzo_bms_active_recipe_id_v3';

export default function App() {
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<'inventory' | 'recipes'>('inventory');

  // Master Inventory State with LocalStorage Persistence
  const [inventory, setInventory] = useState<MasterIngredient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVENTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load inventory from localStorage', e);
    }
    return DEFAULT_MASTER_INVENTORY;
  });

  // Recipes State with LocalStorage Persistence
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECIPES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load recipes from localStorage', e);
    }
    return DEFAULT_RECIPES;
  });

  // Currently Selected Recipe ID
  const [activeRecipeId, setActiveRecipeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_RECIPE);
      if (saved) return saved;
    } catch (e) {}
    return DEFAULT_RECIPES[0]?.id || 'recipe-cake-6kg';
  });

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to save inventory to localStorage', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(recipes));
    } catch (e) {
      console.error('Failed to save recipes to localStorage', e);
    }
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_RECIPE, activeRecipeId);
    } catch (e) {}
  }, [activeRecipeId]);

  // Current Active Recipe
  const activeRecipe = useMemo(() => {
    return recipes.find((r) => r.id === activeRecipeId) || recipes[0] || DEFAULT_RECIPES[0];
  }, [recipes, activeRecipeId]);

  // Financial Calculations for the active recipe linked with current inventory
  const calculations = useMemo(() => {
    return calculateRecipeFinancials(activeRecipe, inventory);
  }, [activeRecipe, inventory]);

  // Tab 1: Master Inventory Handlers
  const handleAddMasterIngredient = () => {
    const newId = `ing-${Date.now()}`;
    const newItem: MasterIngredient = {
      id: newId,
      name: '',
      bulkQuantity: 10,
      uom: 'kg',
      bulkPrice: 2000,
    };
    setInventory((prev) => [...prev, newItem]);
  };

  const handleUpdateMasterIngredient = (
    id: string,
    field: keyof MasterIngredient,
    value: any
  ) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveMasterIngredient = (id: string) => {
    if (inventory.length <= 1) {
      alert('Master inventory must contain at least 1 ingredient.');
      return;
    }
    // Check if ingredient is used in current recipe
    const isUsed = recipes.some((r) => r.ingredients.some((i) => i.masterIngredientId === id));
    if (isUsed) {
      if (!confirm('This ingredient is currently used in one or more recipes. Deleting it may affect their cost calculations. Proceed?')) {
        return;
      }
    }
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetCatalog = () => {
    if (confirm('Reset Master Inventory to Tenzo standard default catalog?')) {
      setInventory(DEFAULT_MASTER_INVENTORY);
    }
  };

  // Tab 2: Recipe Costing Handlers
  const handleSelectRecipe = (id: string) => {
    setActiveRecipeId(id);
  };

  const handleCreateNewRecipe = () => {
    const newId = `recipe-${Date.now()}`;
    const newRecipe: Recipe = {
      id: newId,
      name: `Custom Recipe ${recipes.length + 1}`,
      batchMultiplier: 1.0,
      ingredients: [
        {
          id: `r-ing-${Date.now()}-1`,
          masterIngredientId: inventory[0]?.id || '',
          quantityNeeded: 1,
          uom: inventory[0]?.uom || 'kg',
        },
      ],
      overheads: [
        { id: `ovh-${Date.now()}-1`, name: 'Electricity', cost: 150, isVariable: true },
        { id: `ovh-${Date.now()}-2`, name: 'Gas', cost: 120, isVariable: true },
        { id: `ovh-${Date.now()}-3`, name: 'Baker Labor Wage', cost: 250, isVariable: false },
      ],
      rawBatterWeight: 5.0,
      finishedProductWeight: 4.5,
      outcomeQuantity: 10,
      outcomeUnitType: 'pcs',
      sellingPricePerUnit: 150,
    };
    setRecipes((prev) => [...prev, newRecipe]);
    setActiveRecipeId(newId);
  };

  const handleUpdateRecipeField = (field: keyof Recipe, value: any) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === activeRecipe.id ? { ...r, [field]: value } : r))
    );
  };

  const handleUpdateIngredientRow = (
    rowId: string,
    field: keyof RecipeIngredientRow,
    value: any
  ) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== activeRecipe.id) return r;
        return {
          ...r,
          ingredients: r.ingredients.map((ing) => {
            if (ing.id !== rowId) return ing;
            // If user changes master ingredient, automatically default UOM to that master ingredient's UOM
            if (field === 'masterIngredientId') {
              const master = inventory.find((m) => m.id === value);
              return {
                ...ing,
                masterIngredientId: value,
                uom: master ? master.uom : ing.uom,
              };
            }
            return { ...ing, [field]: value };
          }),
        };
      })
    );
  };

  const handleAddIngredientRow = () => {
    const newRowId = `r-ing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const defaultMaster = inventory[0];
    const newRow: RecipeIngredientRow = {
      id: newRowId,
      masterIngredientId: defaultMaster?.id || '',
      quantityNeeded: 1,
      uom: defaultMaster?.uom || 'kg',
    };

    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== activeRecipe.id) return r;
        return { ...r, ingredients: [...r.ingredients, newRow] };
      })
    );
  };

  const handleRemoveIngredientRow = (rowId: string) => {
    if (activeRecipe.ingredients.length <= 1) {
      alert('Recipe requires at least 1 ingredient row.');
      return;
    }
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== activeRecipe.id) return r;
        return {
          ...r,
          ingredients: r.ingredients.filter((ing) => ing.id !== rowId),
        };
      })
    );
  };

  const handleUpdateOverheadRow = (
    rowId: string,
    field: keyof OverheadExpense,
    value: any
  ) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== activeRecipe.id) return r;
        return {
          ...r,
          overheads: r.overheads.map((ovh) =>
            ovh.id === rowId ? { ...ovh, [field]: value } : ovh
          ),
        };
      })
    );
  };

  const handleAddOverheadRow = () => {
    const newRowId = `ovh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newRow: OverheadExpense = {
      id: newRowId,
      name: '',
      cost: 100,
      isVariable: true,
    };
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== activeRecipe.id) return r;
        return { ...r, overheads: [...r.overheads, newRow] };
      })
    );
  };

  const handleRemoveOverheadRow = (rowId: string) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== activeRecipe.id) return r;
        return {
          ...r,
          overheads: r.overheads.filter((ovh) => ovh.id !== rowId),
        };
      })
    );
  };

  // Global Reset
  const handleResetDemo = () => {
    if (confirm('Reset both Master Inventory and Recipes to Tenzo default settings?')) {
      setInventory(DEFAULT_MASTER_INVENTORY);
      setRecipes(DEFAULT_RECIPES);
      setActiveRecipeId(DEFAULT_RECIPES[0].id);
      localStorage.removeItem(STORAGE_KEY_INVENTORY);
      localStorage.removeItem(STORAGE_KEY_RECIPES);
      localStorage.removeItem(STORAGE_KEY_ACTIVE_RECIPE);
    }
  };

  // Download Standalone Single-File HTML
  const handleDownloadStandalone = () => {
    const link = document.createElement('a');
    link.href = '/tenzo-bakers-standalone.html';
    link.download = 'Tenzo_Cafe_and_Bakers_BMS_Standalone.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inventoryMap = new Map<string, MasterIngredient>(inventory.map((item) => [item.id, item]));

  return (
    <div className="min-h-screen bg-[#faf7f2] py-6 sm:py-8 px-3 sm:px-6 font-['Plus_Jakarta_Sans',sans-serif] text-stone-800 antialiased">
      <div className="max-w-6xl mx-auto">
        {/* PRIMARY BRAND & 2-TAB HEADER */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          inventoryCount={inventory.length}
          currentRecipeName={activeRecipe.name}
          netProfit={calculations.netProfit}
          grossMargin={calculations.grossMarginPercent}
          onResetDemo={handleResetDemo}
          onPrint={() => window.print()}
          onDownloadStandalone={() => setIsExportModalOpen(true)}
        />

        {/* TAB 1: MASTER INGREDIENT INVENTORY */}
        {activeTab === 'inventory' && (
          <MasterInventoryTab
            inventory={inventory}
            onAddIngredient={handleAddMasterIngredient}
            onUpdateIngredient={handleUpdateMasterIngredient}
            onRemoveIngredient={handleRemoveMasterIngredient}
            onResetDefaultCatalog={handleResetCatalog}
          />
        )}

        {/* TAB 2: RECIPE COSTING & PROFIT CALCULATOR */}
        {activeTab === 'recipes' && (
          <RecipeCostingTab
            recipe={activeRecipe}
            recipesList={recipes}
            activeRecipeId={activeRecipeId}
            inventory={inventory}
            calculations={calculations}
            onSelectRecipe={handleSelectRecipe}
            onCreateNewRecipe={handleCreateNewRecipe}
            onUpdateRecipeField={handleUpdateRecipeField}
            onUpdateIngredientRow={handleUpdateIngredientRow}
            onAddIngredientRow={handleAddIngredientRow}
            onRemoveIngredientRow={handleRemoveIngredientRow}
            onUpdateOverheadRow={handleUpdateOverheadRow}
            onAddOverheadRow={handleAddOverheadRow}
            onRemoveOverheadRow={handleRemoveOverheadRow}
          />
        )}

        {/* PRINT PRODUCTION SHEET (TRIGGERED VIA CTRL+P OR PRINT BUTTON) */}
        <div className="hidden print:block p-8 bg-white border border-stone-300 rounded-lg mt-6">
          <div className="border-b-2 border-stone-900 pb-4 mb-4">
            <h2 className="text-2xl font-black text-stone-900">TENZO CAFE AND BAKERS</h2>
            <p className="text-sm font-bold text-stone-600">
              Commercial Bakery Kitchen Production Sheet • {activeRecipe.name} ({activeRecipe.batchMultiplier}x Batch)
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-2">
              Scaled Direct Ingredients Checklist:
            </h3>
            <table className="w-full text-xs text-left border border-stone-300">
              <thead>
                <tr className="bg-stone-100">
                  <th className="p-2 border">Check</th>
                  <th className="p-2 border">Ingredient Name</th>
                  <th className="p-2 border">Master Unit Rate</th>
                  <th className="p-2 border">Batch Quantity Needed</th>
                  <th className="p-2 border">Scaled Line Cost</th>
                </tr>
              </thead>
              <tbody>
                {activeRecipe.ingredients.map((row) => {
                  const master = inventoryMap.get(row.masterIngredientId);
                  const calc = master
                    ? calculateIngredientCost(row.quantityNeeded, row.uom, master)
                    : { masterUnitPrice: 0, effectiveQtyInMasterUom: 0, baseCost: 0 };
                  const scaledQty = row.quantityNeeded * activeRecipe.batchMultiplier;
                  const scaledCost = calc.baseCost * activeRecipe.batchMultiplier;

                  return (
                    <tr key={row.id} className="border">
                      <td className="p-2 border text-center">☐</td>
                      <td className="p-2 border font-bold">{master?.name || 'Unknown Item'}</td>
                      <td className="p-2 border font-mono">{formatRs(calc.masterUnitPrice)} / {master ? getUomLabel(master.uom) : ''}</td>
                      <td className="p-2 border font-bold">
                        {formatNumber(scaledQty, 2)} {row.uom}
                      </td>
                      <td className="p-2 border font-mono font-bold">{formatRs(scaledCost)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-4 border-t border-stone-300">
            <div>
              <p>Raw Batter Weight: {formatNumber(calculations.rawBatterWeight, 2)} kg</p>
              <p>Finished Baked Weight: {formatNumber(calculations.finishedProductWeight, 2)} kg</p>
              <p>Evaporation Loss: {formatPercent(calculations.shrinkagePercent)}</p>
            </div>
            <div>
              <p>Target Yield: {formatNumber(calculations.scaledOutcomeQty, 2)} {activeRecipe.outcomeUnitType}</p>
              <p>Total Production Cost: {formatRs(calculations.totalProductionCost)}</p>
              <p>Selling Price: {formatRs(activeRecipe.sellingPricePerUnit)} / {activeRecipe.outcomeUnitType}</p>
              <p className="font-bold text-stone-900">
                Expected Net Profit: {formatRs(calculations.netProfit)} ({formatPercent(calculations.grossMarginPercent)})
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 pt-5 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium print:hidden">
          <div>
            Tenzo Cafe and Bakers • Enterprise Bakery Management System (BMS) • 2-Tab Engine
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-amber-800 hover:underline cursor-pointer font-bold"
            >
              Get Standalone HTML
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab(activeTab === 'inventory' ? 'recipes' : 'inventory')}
              className="hover:text-amber-800 hover:underline cursor-pointer"
            >
              Switch to {activeTab === 'inventory' ? 'Recipe Costing' : 'Master Inventory'}
            </button>
            <span>•</span>
            <button
              onClick={() => window.print()}
              className="hover:text-amber-800 hover:underline cursor-pointer"
            >
              Print Sheet
            </button>
          </div>
        </footer>
      </div>

      {/* Standalone HTML File Export Modal */}
      <StandaloneExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onDownload={handleDownloadStandalone}
      />
    </div>
  );
}
