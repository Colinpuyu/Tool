import React from 'react';
import { X, Download, Copy, Terminal } from 'lucide-react';
import { getPythonSource } from '../utils/pythonTemplate';

interface PythonExportModalProps {
  onClose: () => void;
}

const PythonExportModal: React.FC<PythonExportModalProps> = ({ onClose }) => {
  const pythonCode = getPythonSource();

  const handleDownload = () => {
    const blob = new Blob([pythonCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculator.py';
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={20} className="text-green-400" />
            <h2 className="text-lg font-bold">获取桌面版 (Python/Exe)</h2>
          </div>
          <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
          
          {/* Instructions Column */}
          <div className="md:w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">如何制作 .exe 程序？</h3>
            
            <div className="space-y-6 text-sm text-gray-600">
              <div className="step">
                <div className="font-bold text-blue-600 mb-1">第一步：下载代码</div>
                <p>点击下方按钮下载 <code className="bg-gray-200 px-1 rounded">calculator.py</code> 文件。</p>
              </div>

              <div className="step">
                <div className="font-bold text-blue-600 mb-1">第二步：安装 Python</div>
                <p>确保电脑已安装 Python (推荐 3.8+)。</p>
              </div>

              <div className="step">
                <div className="font-bold text-blue-600 mb-1">第三步：安装打包工具</div>
                <p>打开终端 (CMD 或 PowerShell) 运行：</p>
                <div className="bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono text-xs select-all">
                  pip install pyinstaller
                </div>
              </div>

              <div className="step">
                <div className="font-bold text-blue-600 mb-1">第四步：打包成 exe</div>
                <p>在文件所在目录运行：</p>
                <div className="bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono text-xs select-all">
                  pyinstaller --onefile --windowed calculator.py
                </div>
              </div>

              <div className="step">
                <div className="font-bold text-blue-600 mb-1">完成</div>
                <p>生成的 exe 文件会在 <code className="bg-gray-200 px-1 rounded">dist</code> 文件夹中。</p>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow transition-all"
              >
                <Download size={18} />
                下载 Python 源码
              </button>
            </div>
          </div>

          {/* Code Preview Column */}
          <div className="md:w-2/3 bg-gray-900 overflow-hidden flex flex-col relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={handleCopy}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded backdrop-blur-md border border-white/10"
                title="复制代码"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="p-2 bg-gray-800 text-xs text-gray-400 font-mono border-b border-gray-700">
              preview: calculator.py
            </div>
            <pre className="flex-grow p-4 overflow-auto font-mono text-xs text-blue-100 selection:bg-blue-500/30">
              <code>{pythonCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonExportModal;