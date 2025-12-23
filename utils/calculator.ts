import { CalculationRule, CalculatedResult, MaterialItem } from '../types';

export const calculateMaterials = (
  length: number, 
  width: number, 
  isEnclosed: boolean,
  rules: CalculationRule[]
): CalculatedResult => {
  const L = Number(length) || 0;
  const W = Number(width) || 0;
  const D = isEnclosed ? 1 : 0;
  
  const results: Record<string, number> = {};

  // Helper functions exposed to formulas
  const MAX = Math.max;
  const MIN = Math.min;
  const INT = Math.floor;
  const CEIL = Math.ceil;
  const ABS = Math.abs;
  const ROUND = Math.round;

  // Base context with static helpers and inputs
  const baseContext = {
    L, W, D,
    MAX, MIN, INT, CEIL, ABS, ROUND
  };

  rules.forEach(rule => {
    try {
      // Combine base context with accumulated results
      // We must spread results so subsequent formulas can reference previous values
      const context = { ...baseContext, ...results };

      // CRITICAL FIX: Filter keys to ensure they are valid JavaScript identifiers.
      // If 'results' contains a key like "invalid-id" or "123", passing it to new Function()
      // as an argument name throws a SyntaxError (Invalid token) before execution starts.
      const validEntries = Object.entries(context).filter(([key]) => 
        /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
      );
      
      const keys = validEntries.map(([k]) => k);
      const values = validEntries.map(([, v]) => v);

      // Safe evaluation using Function constructor
      // If the formula references a variable that was filtered out (due to invalid ID),
      // it will throw a ReferenceError (caught below) instead of crashing with SyntaxError.
      const func = new Function(...keys, `return ${rule.formula};`);
      
      const value = func(...values);
      results[rule.id] = typeof value === 'number' && !isNaN(value) ? value : 0;
      
    } catch (error) {
      console.warn(`Error calculating rule ${rule.id} (${rule.label}):`, error);
      results[rule.id] = 0;
    }
  });

  return results;
};

export const generateCSV = (items: MaterialItem[], rules: CalculationRule[], totals: CalculatedResult) => {
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
  
  // Headers
  const ruleLabels = rules.map(r => r.label).join(",");
  csvContent += `工种,长,宽,封闭,${ruleLabels}\n`;
  
  // Data rows
  items.forEach(item => {
      const resultValues = rules.map(r => item.results[r.id] || 0).join(",");
      const row = [
          item.type, 
          item.length, 
          item.width, 
          item.isEnclosed ? '是' : '否',
          resultValues
      ].join(",");
      csvContent += row + "\n";
  });
  
  // Totals row
  const totalValues = rules.map(r => totals[r.id] || 0).join(",");
  const totalRow = [
      '合计', '', '', '',
      totalValues
  ].join(",");
  csvContent += totalRow + "\n";

  return encodeURI(csvContent);
};