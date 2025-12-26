# 建筑围护结构计算器

建筑围护结构计算器是一个专门用于计算施工围护材料的工具，帮助工程团队快速准确地计算所需材料数量。

## 主要功能

- 参数录入：输入工种/区域名称、长度、宽度和封闭状态
- 实时计算：根据预设规则自动计算所需材料数量
- 材料清单：以表格形式展示详细的材料清单
- 数据导出：支持导出为 CSV 格式
- 规则配置：可自定义计算规则

## 本地运行

**前置条件：** Node.js

1. 安装依赖：
   `npm install`
2. 设置 `GEMINI_API_KEY` 环境变量，在 [.env.local](.env.local) 文件中添加您的 Gemini API 密钥
3. 启动应用：
   `npm run dev`

## 桌面应用构建

### GitHub Actions 自动构建

项目配置了 GitHub Actions，可自动为 Windows、macOS 和 Linux 生成桌面应用：

1. 推送代码到 GitHub 仓库的 main 分支
2. Actions 自动触发跨平台构建
3. 在 Actions 标签页下载对应平台的安装程序

### 本地构建

在相应操作系统上运行：

```bash
npm run electron-build
```

这将生成适用于当前操作系统的桌面应用安装程序。
