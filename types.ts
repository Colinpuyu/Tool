export interface InputParams {
  type: string;
  length: number;
  width: number;
  isEnclosed: boolean;
}

export interface CalculationRule {
  id: string;
  label: string;
  formula: string; // JavaScript expression string
}

export type CalculatedResult = Record<string, number>;

export interface MaterialItem extends InputParams {
  id: string;
  results: CalculatedResult;
}

export interface AppConfig {
  rules: CalculationRule[];
}