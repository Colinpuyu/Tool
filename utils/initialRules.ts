import { CalculationRule } from '../types';

export const INITIAL_RULES: CalculationRule[] = [
  { 
    id: "plate", 
    label: "洞洞板1", 
    formula: "D ? (L+W)*2-2 : (L+W)*2-MAX(L,W)" 
  },
  { 
    id: "pole1", 
    label: "竖杆1", 
    formula: "D ? 4 : 2" 
  },
  { 
    id: "midPole", 
    label: "中间杆", 
    formula: "(L>3 ? INT((L-1)/2)*2 : 0) + (W>3 ? INT((W-1)/2)*2 : 0) - (D ? 0 : INT((MAX(L,W)-1)/2))" 
  },
  { 
    id: "openPole", 
    label: "开放立杆", 
    formula: "D ? 0 : 1" 
  },
  { 
    id: "doorFrame", 
    label: "门框", 
    formula: "D ? 1 : 0" 
  },
  { 
    id: "wall", 
    label: "一体墙", 
    formula: "1" 
  },
  { 
    id: "rib1", 
    label: "加强筋", 
    formula: "D ? ((L+W-2)*2 - midPole - doorFrame) : ((L+W-2)*2 - midPole - (MAX(L,W)-1))" 
  },
  { 
    id: "rib2", 
    label: "加强筋2", 
    formula: "midPole" 
  },
  { 
    id: "ribL", 
    label: "L型筋", 
    formula: "D ? 3 : 2" 
  },
  { 
    id: "bolt40", 
    label: "M10*40", 
    formula: "pole1 * 8" 
  },
  { 
    id: "bolt60", 
    label: "M10*60", 
    formula: "D ? ((L+W-2)*2 - midPole)*4 : ((L+W-2)*2 - MAX(L,W) + 1 - midPole)*4" 
  },
  { 
    id: "bolt100", 
    label: "M10*100", 
    formula: "midPole * 4" 
  },
  { 
    id: "nut", 
    label: "螺母", 
    formula: "bolt40 + bolt60 + bolt100" 
  },
  { 
    id: "screw", 
    label: "燕尾丝", 
    formula: "(rib1 + rib2 + ribL) * 6" 
  }
];