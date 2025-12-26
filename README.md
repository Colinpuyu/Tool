# 建筑围护结构计算器

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

建筑围护结构计算器是一个用于计算施工材料的工具，支持多种计算规则和材料清单导出功能。

## 功能特点

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

## 打包为桌面应用

### 使用 GitHub Actions 自动构建

本项目已配置 GitHub Actions，可自动为 Windows、macOS 和 Linux 生成桌面应用安装程序：

1. 将项目推送到 GitHub 仓库
2. 推送代码到 main 分支以触发构建
3. 在 Actions 标签页中下载构建产物

详细配置请查看 [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md) 文件。

### 手动构建

您也可以在相应操作系统上手动构建：

- Windows: `npm run electron-build`
- macOS: `npm run electron-build`
- Linux: `npm run electron-build`

更多信息请查看 [DEPLOYMENT.md](DEPLOYMENT.md) 文件。
