import React, { useState, useEffect } from 'react';
import { HardHat, Code, Settings, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import InputForm from './components/InputForm';
import MaterialTable from './components/MaterialTable';
import PythonExportModal from './components/PythonExportModal';
import SettingsModal from './components/SettingsModal';
import { InputParams, MaterialItem, CalculationRule } from './types';
import { calculateMaterials } from './utils/calculator';
import { INITIAL_RULES } from './utils/initialRules';
import { downloadPRD } from './utils/productDocs';

const App: React.FC = () => {
  const [list, setList] = useState<MaterialItem[]>([]);
  const [rules, setRules] = useState<CalculationRule[]>(INITIAL_RULES);
  const [showPythonModal, setShowPythonModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Re-calculate list when rules change
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
    <div className="min-h-screen pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <HardHat className="text-white" size={24} />
             </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">围挡清单计算系统</h1>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">可自定义模版 / 实时预览</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
             <button 
               onClick={downloadPRD}
               className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-200 transition-all shadow-sm"
               title="下载项目需求文档 (PRD)"
             >
               <FileText size={16} />
               <span className="hidden lg:inline">需求文档</span>
             </button>
             <button 
               onClick={() => setShowSettingsModal(true)}
               className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-700 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-200 transition-all shadow-sm"
             >
               <Settings size={16} />
               <span className="hidden sm:inline">设置模版</span>
             </button>
             <button 
               onClick={() => setShowPythonModal(true)}
               className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-200 transition-all"
             >
               <Code size={16} />
               <span>获取桌面版</span>
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
             {/* Mobile only button */}
             <button 
               onClick={() => setShowPythonModal(true)}
               className="md:hidden w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
             >
               <Code size={16} />
               <span>下载 Python 源码 / Exe 指引</span>
             </button>
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
      
      {showPythonModal && (
        <PythonExportModal onClose={() => setShowPythonModal(false)} />
      )}
      
      <footer className="max-w-7xl mx-auto text-center py-6 text-gray-400 text-sm">
         &copy; {new Date().getFullYear()} Construction Enclosure Calculator
      </footer>
    </div>
  );
};

export default App;