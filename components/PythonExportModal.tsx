import React from 'react';
import { X, Download, Copy, Terminal, ShieldCheck } from 'lucide-react';
import { getPythonSource } from '../utils/pythonTemplate';
import { CalculationRule } from '../types';

interface PythonExportModalProps {
  rules: CalculationRule[];
  onClose: () => void;
}

const PythonExportModal: React.FC<PythonExportModalProps> = ({ rules, onClose }) => {
  // Pass current web rules to Python as default configuration
  const pythonCode = getPythonSource(JSON.stringify(rules, null, 2));

  const handleDownload = () => {
    const blob = new Blob([pythonCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portable_calculator.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    alert('代码已复制到剪贴板');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-indigo-900 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={20} className="text-indigo-300" />
            <h2 className="text-lg font-bold">移植到 Python 桌面版</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-indigo-800 rounded text-xs text-indigo-200">
               <ShieldCheck size={14} /> 核心逻辑已同步
            </div>
            <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
          
          {/* Instructions Column */}
          <div className="md:w-80 bg-slate-50 p-6 border-r border-slate-200 overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Download size={18} className="text-indigo-600" />
              本地运行指引
            </h3>
            
            <div className="space-y-5 text-sm text-slate-600">
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-indigo-800 font-semibold mb-1">为什么使用 Python 版？</p>
                <p className="text-xs leading-relaxed">完全离线运行、支持本地保存配置文件、无浏览器内存占用，适合工地现场无网环境。</p>
              </div>

              <div className="step">
                <div className="font-bold text-slate-800 mb-1">1. 下载源码</div>
                <p>获得 <code className="bg-slate-200 px-1 rounded">portable_calculator.py</code> 文件。</p>
              </div>

              <div className="step">
                <div className="font-bold text-slate-800 mb-1">2. 环境检查</div>
                <p>只需安装标准 Python 3.x 即可，无需任何第三方库。</p>
              </div>

              <div className="step">
                <div className="font-bold text-slate-800 mb-1">3. 运行程序</div>
                <p>在终端运行：</p>
                <div className="bg-slate-800 text-indigo-300 p-2 rounded mt-1 font-mono text-xs select-all">
                  python portable_calculator.py
                </div>
              </div>

              <div className="step">
                <div className="font-bold text-slate-800 mb-1">4. 打包为 EXE (可选)</div>
                <div className="bg-slate-800 text-indigo-300 p-2 rounded mt-1 font-mono text-xs select-all">
                  pip install pyinstaller<br/>
                  pyinstaller --onefile -w portable_calculator.py
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleDownload}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                <Download size={18} />
                下载 Python 源码
              </button>
            </div>
          </div>

          {/* Code Preview Column */}
          <div className="flex-grow bg-[#1e1e1e] overflow-hidden flex flex-col relative group">
            <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={handleCopy}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-xl flex items-center gap-2 transition-all"
              >
                <Copy size={14} /> 复制代码
              </button>
            </div>
            <div className="px-4 py-2 bg-[#252526] text-xs text-slate-400 font-mono flex items-center gap-2 border-b border-[#333]">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              portable_calculator.py (已同步当前 {rules.length} 条计算规则)
            </div>
            <pre className="flex-grow p-6 overflow-auto font-mono text-[13px] leading-relaxed text-indigo-100/90 selection:bg-indigo-500/30">
              <code>{pythonCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonExportModal;