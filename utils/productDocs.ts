export const PRD_CONTENT = `# 项目需求文档：项目围挡清单计算系统 (Construction Enclosure Calculator)

**版本号**: 1.1 (Python 重构版)
**更新日期**: 2023-10-27
**设计目标**: 提升系统移植性，确保离线环境下的逻辑一致性。

---

## 1. 项目概述 (Project Overview)

### 1.1 产品背景
本系统致力于解决建筑施工围挡建材的精准计算问题。针对工地现场可能存在的网络波动，系统通过“Web + Python 桌面版”双端同步的模式，实现计算逻辑的无缝移植。

### 1.2 重构要点
*   **逻辑移植性**: Web 端公式逻辑与 Python \`eval\` 引擎深度对齐。
*   **零依赖设计**: Python 桌面版仅依赖标准库 (\`tkinter\`)，保证在任何 OS 平台（Win/Mac/Linux）一键运行。
*   **配置共享**: 支持通过 JSON 导出/导入计算规则，实现跨端配置同步。

---

## 2. 核心架构设计 (System Architecture)

### 2.1 跨语言计算模型 (Calculated Model)
系统采用“Context-based Dynamic Evaluation”模型：
1.  **输入层**: 捕捉 $L$ (长), $W$ (宽), $D$ (封闭)。
2.  **引擎层**: 
    *   JS 使用 \`new Function\` 作用域执行。
    *   Python 使用 \`eval()\` 配合特定的 \`globals\` 执行。
3.  **函数支持**: 确保 \`INT\`, \`MAX\`, \`MIN\`, \`CEIL\`, \`ABS\`, \`ROUND\` 在两端表现完全一致。

### 2.2 数据持久化 (Storage)
*   **Web**: 本地内存。
*   **Python**: 本地 \`enclosure_config.json\` 自动保存最后一次使用的规则。

---

## 3. 功能需求 (Functional Requirements)

### 3.1 规则管理 (Rule Management)
*   ID 命名规范: 必须符合变量命名规则（用于 Python 变量引用）。
*   依赖链: 规则 $N$ 可以引用规则 $1$ 到 $N-1$ 的结果。

### 3.2 导出能力
*   CSV 导出: 统一带 BOM (\`utf-8-sig\`)，确保 Excel 在 Windows 平台无乱码。
*   Python 源码导出: 动态嵌入当前 Web 端已调优的规则。

---

## 4. 移植性说明 (Portability Guide)

1.  **代码移植**: Python 源码通过 Web 端 \`getPythonSource\` 函数根据当前规则动态编译生成。
2.  **打包移植**: 推荐使用 \`pyinstaller\` 配合 \`--onefile\` 参数，将所有逻辑打包为单个可执行文件。
`;

export const downloadPRD = () => {
  const blob = new Blob([PRD_CONTENT], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '围挡计算系统_移植重构PRD_v1.1.md';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};