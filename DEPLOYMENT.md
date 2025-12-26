# 部署指南

## 桌面应用构建

### 使用 GitHub Actions（推荐）

项目已配置 GitHub Actions，可自动构建跨平台桌面应用：

1. 将代码推送到 GitHub 仓库
2. Actions 自动在 Windows、macOS 和 Linux 环境中构建应用
3. 在 Actions 标签页下载对应平台的安装程序

### 本地构建

在目标操作系统上运行：

```bash
npm run electron-build
```

这将生成适用于当前系统的桌面应用安装程序。

## Web 版本部署

如需部署为 Web 应用：

```bash
npm run build
```

将 `dist` 目录中的文件部署到 Web 服务器即可。