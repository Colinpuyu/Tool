import React from 'react';
import { Trash2, Download, Table as TableIcon } from 'lucide-react';
import { MaterialItem, CalculatedResult, CalculationRule } from '../types';
import { generateCSV } from '../utils/calculator';

interface MaterialTableProps {
  items: MaterialItem[];
  rules: CalculationRule[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({ items, rules, onRemove, onClear }) => {
  
  // Calculate totals
  const totals: CalculatedResult = items.reduce((acc, item) => {
    rules.forEach(rule => {
      acc[rule.id] = (acc[rule.id] || 0) + (item.results[rule.id] || 0);
    });
    return acc;
  }, {} as CalculatedResult);

  const handleExport = () => {
    if (items.length === 0) return alert("列表中没有数据");
    const encodedUri = generateCSV(items, rules, totals);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `围挡计算清单_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
        <div className="flex items-center gap-2">
          <TableIcon className="text-gray-500" size={20} />
          <h2 className="text-xl font-bold text-gray-700">材料清单明细</h2>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           {items.length > 0 && (
             <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
               共 {items.length} 项
             </span>
           )}
          <button 
            onClick={onClear}
            disabled={items.length === 0}
            className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            清空
          </button>
          <button 
            onClick={handleExport}
            disabled={items.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <Download size={16} />
            导出 Excel/CSV
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto relative min-h-[400px]">
        <table className="w-full text-sm text-left text-gray-600 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-20 shadow-sm">
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-gray-200 w-12 text-center">#</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-gray-200 min-w-[120px]">工种</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-gray-200 text-center bg-yellow-50">长</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-gray-200 text-center bg-yellow-50">宽</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-gray-200 text-center bg-yellow-50">封闭</th>
              {rules.map(rule => (
                <th 
                  key={rule.id}
                  scope="col" 
                  className="px-4 py-3 whitespace-nowrap border-b border-gray-200"
                  title={`Formula: ${rule.formula}`}
                >
                  {rule.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-gray-200 text-center sticky right-0 bg-gray-100 z-30">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr key={item.id} className="bg-white hover:bg-blue-50 transition-colors group">
                <td className="px-4 py-3 text-center text-gray-400 font-mono">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{item.type}</td>
                <td className="px-4 py-3 text-center bg-yellow-50/50">{item.length}</td>
                <td className="px-4 py-3 text-center bg-yellow-50/50">{item.width}</td>
                <td className="px-4 py-3 text-center bg-yellow-50/50">
                  <span className={`px-2 py-0.5 rounded text-xs ${item.isEnclosed ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.isEnclosed ? '是' : '否'}
                  </span>
                </td>
                
                {rules.map(rule => (
                  <td key={rule.id} className="px-4 py-3 tabular-nums font-medium text-gray-700">
                    {item.results[rule.id]}
                  </td>
                ))}

                <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-blue-50 border-l border-transparent group-hover:border-blue-100 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                  <button 
                    onClick={() => onRemove(item.id)} 
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                    title="删除"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5 + rules.length + 1} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                           <TableIcon size={32} className="opacity-50"/>
                        </div>
                        <p className="text-base font-medium">暂无数据</p>
                        <p className="text-sm">请在左侧面板输入参数并添加</p>
                    </div>
                </td>
              </tr>
            )}
          </tbody>
          {items.length > 0 && (
            <tfoot className="bg-gray-800 text-white font-bold text-xs sticky bottom-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
              <tr>
                <td colSpan={5} className="px-4 py-3 text-right text-sm tracking-wide">合计：</td>
                {rules.map(rule => (
                  <td key={rule.id} className="px-4 py-3 tabular-nums text-yellow-300">
                    {totals[rule.id] || 0}
                  </td>
                ))}
                <td className="px-4 py-3 bg-gray-800"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default MaterialTable;