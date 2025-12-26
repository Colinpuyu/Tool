import React, { useState, useMemo } from 'react';
import { Plus, Info } from 'lucide-react';
import { InputParams, CalculationRule, CalculatedResult } from '../types';
import { calculateMaterials } from '../utils/calculator';

interface InputFormProps {
  onAdd: (params: InputParams) => void;
  rules: CalculationRule[];
}

const InputForm: React.FC<InputFormProps> = ({ onAdd, rules }) => {
  const [form, setForm] = useState<InputParams>({
    type: '熔化焊接K11',
    length: 6,
    width: 4,
    isEnclosed: true
  });

  const previewResult: CalculatedResult = useMemo(() => {
    return calculateMaterials(form.length, form.width, form.isEnclosed, rules);
  }, [form.length, form.width, form.isEnclosed, rules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Force integer conversion before adding
    onAdd({ 
      ...form, 
      length: Math.max(1, Math.floor(form.length)),
      width: Math.max(1, Math.floor(form.width))
    });
  };

  const previewRules = rules.slice(0, 5); 
  const mainRule = previewRules[0];
  const subRules = previewRules.slice(1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
          <Info size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">参数录入</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            工种 / 区域名称
          </label>
          <input
            type="text"
            required
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            placeholder="例如：熔化焊接K11"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              长 (m) <span className="text-gray-400 text-xs font-normal">[正整数]</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={form.length}
              onChange={(e) => setForm({ ...form, length: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              宽 (m) <span className="text-gray-400 text-xs font-normal">[正整数]</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={form.width}
              onChange={(e) => setForm({ ...form, width: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
          <span className="text-sm font-semibold text-gray-700">
            是否封闭 <span className="text-gray-400 font-normal">[D]</span>
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isEnclosed}
              onChange={(e) => setForm({ ...form, isEnclosed: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 w-12 text-right">
              {form.isEnclosed ? '是 (1)' : '否 (0)'}
            </span>
          </label>
        </div>

        {mainRule && (
          <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-indigo-900 font-bold text-sm uppercase tracking-wide">预览: {mainRule.label}</h3>
              <span className="text-2xl font-bold text-indigo-600 tabular-nums">{previewResult[mainRule.id]}</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 mb-4">
              {subRules.map(rule => (
                <div key={rule.id} className="flex justify-between border-b border-indigo-100 pb-1">
                  <span className="truncate pr-2" title={rule.label}>{rule.label}</span>
                  <span className="font-semibold">{previewResult[rule.id]}</span>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <Plus size={18} className="group-hover:scale-110 transition-transform" />
              <span>添加到清单</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default InputForm;