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

  rules.forEach(rule => {
    try {
      // Create a function that has access to variables and previous results
      // We pass 'results' so formulas can reference previous calculated fields by id (e.g. 'midPole')
      
      // We construct a context object with all variables
      const context = {
        L, W, D,
        MAX, MIN, INT, CEIL, ABS, ROUND,
        ...results // Allow referencing previously calculated values
      };

      const keys = Object.keys(context);
      const values = Object.values(context);

      // Safe evaluation using Function constructor
      // Note: In a real untrusted env this is risky, but for a local tool it's acceptable
      const func = new Function(...keys, `return ${rule.formula};`);
      
      const value = func(...values);
      results[rule.id] = typeof value === 'number' && !isNaN(value) ? value : 0;
      
    } catch (error) {
      console.error(`Error calculating rule ${rule.id}:`, error);
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