export const getPythonSource = (currentRulesJson: string) => {
  return `import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import csv
import math
import os
import datetime

# ==========================================
# 核心计算引擎 (Calculator Engine)
# ==========================================
class CalculationEngine:
    @staticmethod
    def calculate(L, W, D, rules):
        """
        核心算法移植：模拟 JavaScript 的动态公式计算
        L: 长度, W: 宽度, D: 封闭状态(1/0)
        """
        # 定义公式中可用的数学函数
        context = {
            'L': float(L),
            'W': float(W),
            'D': int(D),
            'MAX': max,
            'MIN': min,
            'INT': math.floor,
            'CEIL': math.ceil,
            'ABS': abs,
            'ROUND': round,
            'math': math
        }
        
        results = {}
        for rule in rules:
            try:
                # 允许后续公式引用前面已计算出的 ID
                local_context = {**context, **results}
                # 使用 eval 进行动态求值，关闭内置敏感函数以提高安全性
                val = eval(rule['formula'], {"__builtins__": None}, local_context)
                results[rule['id']] = round(float(val), 2)
            except Exception as e:
                print(f"Error in rule {rule['id']}: {e}")
                results[rule['id']] = 0.0
        return results

# ==========================================
# 主应用程序 (Main Application)
# ==========================================
class EnclosureApp:
    def __init__(self, root):
        self.root = root
        self.root.title("围挡清单计算系统 - 跨平台桌面版")
        self.root.geometry("1200x700")
        
        # 初始规则配置 (由 Web 端同步生成)
        self.default_rules = ${currentRulesJson}
        self.config_file = "enclosure_config.json"
        self.rules = self.load_config()
        self.items = []

        self.setup_ui()

    def load_config(self):
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return self.default_rules
        return self.default_rules

    def save_config(self):
        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(self.rules, f, ensure_ascii=False, indent=2)

    def setup_ui(self):
        # 样式配置
        style = ttk.Style()
        style.configure("Treeview", rowheight=25)
        
        # 主布局
        main_container = ttk.PanedWindow(self.root, orient=tk.HORIZONTAL)
        main_container.pack(fill=tk.BOTH, expand=True)

        # 左侧控制面板
        control_frame = ttk.Frame(main_container, padding=10)
        main_container.add(control_frame, weight=1)

        ttk.Label(control_frame, text="参数录入", font=('Arial', 12, 'bold')).pack(pady=5)
        
        # 录入字段
        self.type_var = tk.StringVar(value="项目A")
        self.length_var = tk.DoubleVar(value=6.0)
        self.width_var = tk.DoubleVar(value=4.0)
        self.enclosed_var = tk.BooleanVar(value=True)

        ttk.Label(control_frame, text="项目名称:").pack(anchor="w")
        ttk.Entry(control_frame, textvariable=self.type_var).pack(fill="x", pady=2)

        ttk.Label(control_frame, text="长度 (m):").pack(anchor="w", pady=(10,0))
        ttk.Entry(control_frame, textvariable=self.length_var).pack(fill="x", pady=2)

        ttk.Label(control_frame, text="宽度 (m):").pack(anchor="w", pady=(10,0))
        ttk.Entry(control_frame, textvariable=self.width_var).pack(fill="x", pady=2)

        ttk.Checkbutton(control_frame, text="是否封闭 (D=1)", variable=self.enclosed_var).pack(pady=10)

        ttk.Button(control_frame, text="➕ 添加到清单", command=self.add_item).pack(fill="x", pady=5)
        ttk.Button(control_frame, text="🗑️ 清空清单", command=self.clear_items).pack(fill="x")
        ttk.Button(control_frame, text="⚙️ 管理计算规则", command=self.open_settings).pack(fill="x", pady=(20, 0))
        ttk.Button(control_frame, text="📥 导出 CSV", command=self.export_csv).pack(fill="x", pady=5)

        # 右侧列表面板
        list_frame = ttk.Frame(main_container, padding=10)
        main_container.add(list_frame, weight=4)

        # 动态创建表格
        self.rebuild_table(list_frame)

    def rebuild_table(self, container):
        if hasattr(self, 'tree_frame'):
            self.tree_frame.destroy()
        
        self.tree_frame = ttk.Frame(container)
        self.tree_frame.pack(fill=tk.BOTH, expand=True)

        cols = ["type", "L", "W", "D"] + [r['id'] for r in self.rules]
        self.tree = ttk.Treeview(self.tree_frame, columns=cols, show="headings")
        
        # 设置列头
        headings = {"type": "名称", "L": "长", "W": "宽", "D": "封闭"}
        for r in self.rules:
            headings[r['id']] = r['label']

        for col in cols:
            self.tree.heading(col, text=headings.get(col, col))
            self.tree.column(col, width=80, anchor="center")

        sb = ttk.Scrollbar(self.tree_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscroll=sb.set)
        
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        sb.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.tree.bind("<Delete>", lambda e: self.delete_selected())

    def add_item(self):
        try:
            name = self.type_var.get()
            l = self.length_var.get()
            w = self.width_var.get()
            d = 1 if self.enclosed_var.get() else 0
            
            results = CalculationEngine.calculate(l, w, d, self.rules)
            
            row_values = [name, l, w, "是" if d else "否"]
            for r in self.rules:
                row_values.append(results.get(r['id'], 0))
            
            self.tree.insert("", "end", values=row_values)
            self.items.append(row_values)
        except Exception as e:
            messagebox.showerror("错误", f"计算失败: {e}")

    def delete_selected(self):
        for selected_item in self.tree.selection():
            self.tree.delete(selected_item)

    def clear_items(self):
        if messagebox.askyesno("确认", "确定清空当前所有清单数据吗？"):
            for item in self.tree.get_children():
                self.tree.delete(item)
            self.items = []

    def export_csv(self):
        filename = filedialog.asksaveasfilename(defaultextension=".csv", filetypes=[("CSV Files", "*.csv")])
        if not filename: return
        
        try:
            with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
                writer = csv.writer(f)
                headers = ["名称", "长", "宽", "封闭"] + [r['label'] for r in self.rules]
                writer.writerow(headers)
                for child in self.tree.get_children():
                    writer.writerow(self.tree.item(child)['values'])
            messagebox.showinfo("成功", "清单已成功导出！")
        except Exception as e:
            messagebox.showerror("错误", f"导出失败: {e}")

    def open_settings(self):
        settings_win = tk.Toplevel(self.root)
        settings_win.title("规则管理 (JSON 配置)")
        settings_win.geometry("600x500")
        
        ttk.Label(settings_win, text="直接编辑 JSON 配置以修改计算逻辑:", padding=10).pack()
        
        text_area = tk.Text(settings_win, font=('Consolas', 10))
        text_area.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        text_area.insert("1.0", json.dumps(self.rules, ensure_ascii=False, indent=2))

        def save_rules():
            try:
                new_rules = json.loads(text_area.get("1.0", tk.END))
                self.rules = new_rules
                self.save_config()
                self.rebuild_table(self.tree_frame.master) # 刷新主表
                settings_win.destroy()
                messagebox.showinfo("成功", "规则已更新，请继续使用")
            except Exception as e:
                messagebox.showerror("错误", f"JSON 格式错误: {e}")

        ttk.Button(settings_win, text="💾 保存并应用", command=save_rules).pack(pady=10)

if __name__ == "__main__":
    root = tk.Tk()
    app = EnclosureApp(root)
    root.mainloop()
`;
};