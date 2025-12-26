# GitHub Actions 自动构建

项目已配置 GitHub Actions，可自动构建跨平台桌面应用。

## 工作流配置

`.github/workflows/build.yml` 配置文件会在每次推送到 main 分支时触发：

- 在 Windows、macOS 和 Linux 环境中并行构建
- 为每个平台生成对应的安装程序
- 自动上传构建产物

## 使用方法

1. 推送代码到 GitHub 仓库的 main 分支
2. Actions 自动开始构建过程
3. 在 Actions 标签页下载构建产物

## 构建产物

- Windows: `.exe` 安装程序
- macOS: `.dmg` 磁盘映像
- Linux: `.AppImage` 可执行文件