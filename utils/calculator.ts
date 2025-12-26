import { CalculationRule, CalculatedResult, MaterialItem } from '../types';

export const calculateMaterials = (
  length: number, 
  width: number, 
  isEnclosed: boolean,
  rules: CalculationRule[]
): CalculatedResult => {
  // Ensure L and W are positive integers and at least 1
  const L = Math.max(1, Math.floor(Number(length) || 1));
  const W = Math.max(1, Math.floor(Number(width) || 1));
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
      const context = { ...baseContext, ...results };

      // Filter valid JS identifiers
      const validEntries = Object.entries(context).filter(([key]) => 
        /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
      );
      
      const keys = validEntries.map(([k]) => k);
      const values = validEntries.map(([, v]) => v);

      const func = new Function(...keys, `return ${rule.formula};`);
      
      let value = func(...values);
      
      // Ensure result is a valid number and at least 0
      value = typeof value === 'number' && !isNaN(value) ? value : 0;
      results[rule.id] = Math.max(0, value); 
      
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