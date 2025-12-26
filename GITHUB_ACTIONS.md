# GitHub Actions 构建指南

## 什么是 GitHub Actions

GitHub Actions 是 GitHub 提供的持续集成和持续部署 (CI/CD) 服务，可以自动执行软件开发生命周期中的各种任务，包括构建、测试和部署应用程序。

## 如何使用 GitHub Actions 构建 Windows 应用

### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 创建新仓库，例如 `construction-calculator`
3. 将本地项目推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/construction-calculator.git
git push -u origin main
```

### 2. 工作流配置说明

当前项目包含的 `.github/workflows/build.yml` 配置文件将：

- 在每次推送到 `main` 或 `master` 分支时触发
- 在 Windows、macOS 和 Ubuntu 三个平台上并行构建应用
- 为每个平台生成相应的安装程序
- 上传构建产物供下载

### 3. 工作流文件详解

```yaml
name: Build and Release  # 工作流名称

on:
  push:
    branches: [ main, master ]  # 在推送到 main 或 master 分支时触发
  pull_request:
    branches: [ main, master ]  # 在创建 pull request 时触发

jobs:
  build:
    runs-on: ${{ matrix.os }}  # 在多个操作系统上运行

    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest, macos-latest]  # 定义构建矩阵

    steps:
    # 步骤 1: 检出代码
    - name: Checkout code
      uses: actions/checkout@v4

    # 步骤 2: 设置 Node.js 环境
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'  # 使用 Node.js 20
        cache: 'npm'        # 启用 npm 缓存以加快安装

    # 步骤 3: 安装依赖
    - name: Install dependencies
      run: npm install

    # 步骤 4: 构建 React 应用
    - name: Build application
      run: npm run build

    # 步骤 5: 为每个平台安装 Electron 并构建
    # Windows 构建
    - name: Install Electron dependencies (Windows)
      if: matrix.os == 'windows-latest'
      run: |
        npm install --save-dev electron electron-builder electron-is-dev
        npx electron-builder --win --x64 --publish=never
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    # macOS 构建
    - name: Install Electron dependencies (macOS)
      if: matrix.os == 'macos-latest'
      run: |
        npm install --save-dev electron electron-builder electron-is-dev
        npx electron-builder --mac --x64 --publish=never
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    # Ubuntu 构建
    - name: Install Electron dependencies (Ubuntu)
      if: matrix.os == 'ubuntu-latest'
      run: |
        sudo apt-get update
        sudo apt-get install -y libgtk-3-dev libnss3-dev libatk1.0-dev libdrm-dev libxss-dev libgtk-3-0 libgbm1
        npm install --save-dev electron electron-builder electron-is-dev
        npx electron-builder --linux --x64 --publish=never
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    # 步骤 6: 上传构建产物
    - name: Upload artifacts (Windows)
      if: matrix.os == 'windows-latest'
      uses: actions/upload-artifact@v4
      with:
        name: windows-app
        path: |
          release/*.exe
          !release/*.blockmap
```

### 4. 查看构建结果

1. 推送代码到 GitHub 后，转到仓库的 "Actions" 标签页
2. 点击正在运行或已完成的工作流
3. 等待所有平台的构建完成
4. 在 "Artifacts" 部分下载构建产物

### 5. 构建产物说明

- **Windows**: `.exe` 安装程序文件
- **macOS**: `.dmg` 磁盘映像文件
- **Linux**: `.AppImage` 可执行文件

### 6. 自定义构建配置

如果需要自定义构建配置，可以修改 `package.json` 中的 `build` 部分：

```json
{
  "build": {
    "appId": "com.example.construction-calculator",
    "productName": "建筑围护结构计算器",
    "directories": {
      "output": "release"
    },
    "win": {
      "target": "nsis",  // 可选: nsis, appx, msi
      "icon": "public/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### 7. 故障排除

- **权限问题**: 确保 GitHub 仓库的 Actions 设置已启用
- **构建失败**: 检查工作流日志以确定失败原因
- **依赖问题**: 确保所有依赖都正确配置在 `package.json` 中

使用 GitHub Actions，您无需本地 Windows 环境即可生成 Windows 应用程序，所有构建过程都在云端完成。