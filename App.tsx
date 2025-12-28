import React, { useState, useEffect } from 'react';
import { HardHat, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import InputForm from './components/InputForm';
import MaterialTable from './components/MaterialTable';
import SettingsModal from './components/SettingsModal';
import { InputParams, MaterialItem, CalculationRule } from './types';
import { calculateMaterials } from './utils/calculator';
import { INITIAL_RULES } from './utils/initialRules';

const App: React.FC = () => {
  const [list, setList] = useState<MaterialItem[]>([]);
  const [rules, setRules] = useState<CalculationRule[]>(INITIAL_RULES);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Re-calculate list when rules change to ensure data consistency
  useEffect(() => {
    setList(prevList => prevList.map(item => ({
      ...item,
      results: calculateMaterials(item.length, item.width, item.isEnclosed, rules)
    })));
  }, [rules]);

  const handleAddItem = (params: InputParams) => {
    if (params.length === 0 && params.width === 0) return;

    const results = calculateMaterials(params.length, params.width, params.isEnclosed, rules);
    const newItem: MaterialItem = {
      id: uuidv4(),
      ...params,
      results,
    };

    setList((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearList = () => {
    if (window.confirm('确定清空所有数据吗？')) {
      setList([]);
    }
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                <HardHat className="text-white" size={24} />
             </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">围挡清单计算系统</h1>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">施工材料精准计算工具</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setShowSettingsModal(true)}
               className="flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg border border-indigo-200 transition-all active:scale-95"
             >
               <Settings size={18} />
               <span>计算规则配置</span>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
             <InputForm onAdd={handleAddItem} rules={rules} />
          </div>

          {/* Right Column: Table */}
          <div className="lg:col-span-3 h-full">
            <MaterialTable 
              items={list} 
              rules={rules}
              onRemove={handleRemoveItem} 
              onClear={handleClearList}
            />
          </div>

        </div>
      </main>
      
      {showSettingsModal && (
        <SettingsModal 
          rules={rules} 
          onSave={setRules} 
          onClose={() => setShowSettingsModal(false)} 
        />
      )}
      
      <footer className="max-w-7xl mx-auto text-center py-8 text-gray-400 text-sm">
         &copy; {new Date().getFullYear()} Construction Enclosure Calculator | 专业施工计算工具
      </footer>
    </div>
  );
};

export default App;