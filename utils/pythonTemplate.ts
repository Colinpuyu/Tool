export const getPythonSource = () => {
  return `import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import csv
import math
import datetime

class EnclosureCalculator:
    def __init__(self, root):
        self.root = root
        self.root.title("项目围挡清单计算系统 (Python版)")
        self.root.geometry("1400x800")
        
        # Configure style
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("Treeview", rowheight=25)
        style.configure("TButton", padding=6)
        
        # Data storage
        self.items = []
        
        # Layout
        self.create_header()
        self.create_input_frame()
        self.create_treeview()
        self.create_footer()

    def create_header(self):
        header_frame = ttk.Frame(self.root, padding="10")
        header_frame.pack(fill="x")
        ttk.Label(header_frame, text="🚧 围挡清单计算系统", font=("Segoe UI", 16, "bold")).pack(side="left")
        ttk.Label(header_frame, text=" (基于 Excel 公式自动计算)", font=("Segoe UI", 10)).pack(side="left", padx=10, pady=(6,0))

    def create_input_frame(self):
        frame = ttk.LabelFrame(self.root, text="参数录入", padding="15")
        frame.pack(fill="x", padx=10, pady=5)
        
        # Variables
        self.type_var = tk.StringVar(value="熔化焊接K11")
        self.length_var = tk.DoubleVar(value=6.0)
        self.width_var = tk.DoubleVar(value=4.0)
        self.enclosed_var = tk.BooleanVar(value=True)
        
        # Grid layout
        grid_frame = ttk.Frame(frame)
        grid_frame.pack(fill="x")
        
        ttk.Label(grid_frame, text="工种 / 区域名称:").grid(row=0, column=0, padx=5, sticky="w")
        ttk.Entry(grid_frame, textvariable=self.type_var, width=25).grid(row=1, column=0, padx=5, pady=(0, 10), sticky="w")
        
        ttk.Label(grid_frame, text="长 (m) [B2]:").grid(row=0, column=1, padx=5, sticky="w")
        ttk.Entry(grid_frame, textvariable=self.length_var, width=15).grid(row=1, column=1, padx=5, pady=(0, 10), sticky="w")
        
        ttk.Label(grid_frame, text="宽 (m) [C2]:").grid(row=0, column=2, padx=5, sticky="w")
        ttk.Entry(grid_frame, textvariable=self.width_var, width=15).grid(row=1, column=2, padx=5, pady=(0, 10), sticky="w")
        
        chk_frame = ttk.Frame(grid_frame)
        chk_frame.grid(row=1, column=3, padx=15, pady=(0,10))
        ttk.Checkbutton(chk_frame, text="是否封闭 [D2]", variable=self.enclosed_var).pack()
        
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill="x", pady=10)
        ttk.Button(btn_frame, text="➕ 添加到清单", command=self.add_item).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🗑️ 清空列表", command=self.clear_list).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="📥 导出 CSV", command=self.export_csv).pack(side="right", padx=5)

    def create_treeview(self):
        columns = (
            "id", "type", "L", "W", "enc", 
            "plate", "pole1", "midPole", "openPole", "door", "wall",
            "rib1", "rib2", "ribL", "bolt40", "bolt60", "bolt100", "nut", "screw"
        )
        
        self.tree = ttk.Treeview(self.root, columns=columns, show="headings")
        
        # Define headings and column widths
        headers = [
            ("#", 40), ("工种", 120), ("长", 50), ("宽", 50), ("封闭", 50),
            ("洞洞板1", 60), ("竖杆1", 50), ("中间杆", 50), ("开放立杆", 60), ("门框", 50), ("一体墙", 50),
            ("加强筋", 60), ("加强筋2", 60), ("L型筋", 50), ("M10*40", 60), ("M10*60", 60),
            ("M10*100", 70), ("螺母", 50), ("燕尾丝", 60)
        ]
        
        for col, (text, width) in zip(columns, headers):
            self.tree.heading(col, text=text)
            self.tree.column(col, width=width, anchor="center")
            
        # Scrollbar
        scrollbar = ttk.Scrollbar(self.root, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscroll=scrollbar.set)
        
        self.tree.pack(side="left", fill="both", expand=True, padx=(10,0), pady=10)
        scrollbar.pack(side="right", fill="y", padx=(0,10), pady=10)
        
        # Delete binding
        self.tree.bind("<Delete>", self.delete_selected)

    def create_footer(self):
        footer_frame = ttk.Frame(self.root, padding="10")
        footer_frame.pack(fill="x")
        ttk.Label(footer_frame, text="提示: 选中行按 Delete 键删除", foreground="gray").pack(side="left")

    def calculate(self, L, W, is_enclosed):
        B2 = float(L)
        C2 = float(W)
        D2 = 1 if is_enclosed else 0
        MAX_BC = max(B2, C2)
        INT = math.floor

        # Formula translations based on Excel logic
        plate = (B2 + C2) * 2 - 2 if D2 == 1 else (B2 + C2) * 2 - MAX_BC
        pole1 = 4 if D2 == 1 else 2
        
        term_h1 = INT((B2 - 1) / 2) * 2 if B2 > 3 else 0
        term_h2 = INT((C2 - 1) / 2) * 2 if C2 > 3 else 0
        term_h3 = 0 if D2 == 1 else INT((MAX_BC - 1) / 2)
        midPole = term_h1 + term_h2 - term_h3
        
        openPole = 1 if D2 == 0 else 0
        doorFrame = 0 if D2 == 0 else 1
        wall = 1
        
        commonL2 = (B2 + C2 - 2) * 2
        rib1 = (commonL2 - midPole - doorFrame) if D2 == 1 else (commonL2 - midPole - (MAX_BC - 1))
        
        rib2 = midPole
        ribL = 2 if D2 == 0 else 3
        
        bolt40 = pole1 * 8
        if D2 == 0:
            bolt60 = ((B2 + C2 - 2) * 2 - MAX_BC + 1 - midPole) * 4
        else:
            bolt60 = ((B2 + C2 - 2) * 2 - midPole) * 4
            
        bolt100 = midPole * 4
        nut = bolt40 + bolt60 + bolt100
        screw = (rib1 + rib2 + ribL) * 6
        
        return {
            "plate": plate, "pole1": pole1, "midPole": midPole, 
            "openPole": openPole, "doorFrame": doorFrame, "wall": wall,
            "rib1": rib1, "rib2": rib2, "ribL": ribL,
            "bolt40": bolt40, "bolt60": bolt60, "bolt100": bolt100,
            "nut": nut, "screw": screw
        }

    def add_item(self):
        try:
            L = self.length_var.get()
            W = self.width_var.get()
            if L == 0 and W == 0: return
            
            res = self.calculate(L, W, self.enclosed_var.get())
            
            idx = len(self.tree.get_children()) + 1
            enc_str = "是" if self.enclosed_var.get() else "否"
            
            values = (
                idx, self.type_var.get(), L, W, enc_str,
                res["plate"], res["pole1"], res["midPole"], res["openPole"],
                res["doorFrame"], res["wall"], res["rib1"], res["rib2"], res["ribL"],
                res["bolt40"], res["bolt60"], res["bolt100"], res["nut"], res["screw"]
            )
            
            self.tree.insert("", "end", values=values)
            
        except ValueError:
            messagebox.showerror("错误", "请输入有效的数字")

    def delete_selected(self, event):
        for item in self.tree.selection():
            self.tree.delete(item)

    def clear_list(self):
        if messagebox.askyesno("确认", "确定清空列表吗？"):
            for item in self.tree.get_children():
                self.tree.delete(item)

    def export_csv(self):
        if not self.tree.get_children():
            messagebox.showwarning("警告", "列表为空")
            return
            
        filename = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV Files", "*.csv")],
            initialfile=f"围挡清单_{datetime.date.today()}.csv"
        )
        if not filename:
            return
            
        try:
            with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
                writer = csv.writer(f)
                # Header
                writer.writerow(["#", "工种", "长", "宽", "封闭", "洞洞板1", "竖杆1", "中间杆", "开放立杆", "门框", "一体墙", "加强筋", "加强筋2", "L型筋", "M10*40", "M10*60", "M10*100", "螺母", "燕尾丝"])
                
                # Data
                totals = [0] * 14 # Index 5 to 18
                
                for child in self.tree.get_children():
                    row = self.tree.item(child)['values']
                    writer.writerow(row)
                    # Accumulate totals
                    for i in range(5, 19):
                        try:
                            totals[i-5] += float(row[i])
                        except: pass
                
                # Totals row
                total_row = ["合计", "", "", "", ""] + [str(t) if t % 1 != 0 else str(int(t)) for t in totals]
                writer.writerow(total_row)
                
            messagebox.showinfo("成功", "导出成功！")
        except Exception as e:
            messagebox.showerror("错误", str(e))

if __name__ == "__main__":
    root = tk.Tk()
    app = EnclosureCalculator(root)
    root.mainloop()
`;
};