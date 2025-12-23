import React, { useState, useRef } from 'react';
import { X, Save, Upload, Download, RotateCcw, Plus, Trash2, HelpCircle } from 'lucide-react';
import { CalculationRule } from '../types';
import { INITIAL_RULES } from '../utils/initialRules';

interface SettingsModalProps {
  rules: CalculationRule[];
  onSave: (newRules: CalculationRule[]) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ rules, onSave, onClose }) => {
  const [localRules, setLocalRules] = useState<CalculationRule[]>(JSON.parse(JSON.stringify(rules)));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRuleChange = (index: number, field: keyof CalculationRule, value: string) => {
    const newRules = [...localRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setLocalRules(newRules);
  };

  const addRule = () => {
    setLocalRules([...localRules, { id: `field_${Date.now()}`, label: '新项目', formula: '0' }]);
  };

  const removeRule = (index: number) => {
    if (confirm('确定删除此项目吗？')) {
      const newRules = localRules.filter((_, i) => i !== index);
      setLocalRules(newRules);
    }
  };

  const handleReset = () => {
    if (confirm('确定恢复到系统默认模版吗？')) {
      setLocalRules(JSON.parse(JSON.stringify(INITIAL_RULES)));
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localRules, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "围挡计算模版.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0 && imported[0].id && imported[0].formula) {
          setLocalRules(imported);
          alert('模版导入成功！');
        } else {
          alert('文件格式不正确，请上传有效的模版 JSON 文件。');
        }
      } catch (err) {
        alert('解析文件失败。');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveAndClose = () => {
    onSave(localRules);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">设置 / 模版管理</h2>
          </div>
          <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button onClick={addRule} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors">
              <Plus size={16} /> 添加列
            </button>
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors">
              <RotateCcw size={16} /> 恢复默认
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              accept=".json" 
              className="hidden" 
            />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Upload size={16} /> 导入模版
            </button>
            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Download size={16} /> 导出模版
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-auto p-4 bg-gray-100">
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
             <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b font-semibold text-sm text-gray-700">
                <div className="col-span-1 text-center">ID</div>
                <div className="col-span-2">显示名称 (Label)</div>
                <div className="col-span-8 flex items-center gap-1">
                  计算公式 (JavaScript Expression)
                  <div className="group relative">
                    <HelpCircle size={14} className="text-gray-400 cursor-help"/>
                    <div className="absolute left-0 bottom-full mb-2 w-80 p-3 bg-gray-800 text-white text-xs rounded shadow-lg hidden group-hover:block z-50">
                      <p className="font-bold mb-1">可用变量:</p>
                      <ul className="list-disc pl-4 space-y-1 mb-2">
                         <li>L: 长, W: 宽, D: 1(封闭)或0(不封闭)</li>
                         <li>MAX(a,b), MIN(a,b), INT(a)</li>
                      </ul>
                      <p>可引用上方已定义的ID，例如 `bolt40`</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 text-center">操作</div>
             </div>
             
             <div className="divide-y divide-gray-100">
               {localRules.map((rule, index) => (
                 <div key={index} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-blue-50/50 transition-colors">
                    <div className="col-span-1">
                      <input 
                        type="text" 
                        value={rule.id}
                        onChange={(e) => handleRuleChange(index, 'id', e.target.value)}
                        className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-500 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        value={rule.label}
                        onChange={(e) => handleRuleChange(index, 'label', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                        placeholder="列名"
                      />
                    </div>
                    <div className="col-span-8">
                      <input 
                        type="text" 
                        value={rule.formula}
                        onChange={(e) => handleRuleChange(index, 'formula', e.target.value)}
                        className="w-full font-mono text-sm border border-gray-300 rounded px-2 py-1.5 text-blue-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                        placeholder="例如: (L+W)*2"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button 
                        onClick={() => removeRule(index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
            取消
          </button>
          <button onClick={saveAndClose} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
            <Save size={18} />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;