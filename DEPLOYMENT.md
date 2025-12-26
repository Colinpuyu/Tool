# 建筑围护结构计算器 - Windows 部署指南

## 方法一：使用 Electron 打包为桌面应用

### 在 Windows 系统上打包步骤：

1. **安装 Node.js**
   - 从 https://nodejs.org 下载并安装 Node.js

2. **克隆或下载项目**
   ```bash
   git clone <repository-url>
   # 或者直接下载 ZIP 文件并解压
   ```

3. **安装依赖**
   ```bash
   cd construction-enclosure-calculator
   npm install
   ```

4. **安装 Electron 开发依赖**
   ```bash
   npm install --save-dev electron electron-builder electron-is-dev
   ```

5. **构建应用**
   ```bash
   npm run electron-build
   ```

6. **查找安装程序**
   - 构建完成后，安装程序将位于 `release` 目录中
   - 文件名类似：`建筑围护结构计算器 Setup x.x.x.exe`

### 手动安装 Electron 的替代方法：
如果直接安装 Electron 遇到问题，可以尝试：
```bash
npm install --save-dev electron@latest electron-builder@latest electron-is-dev@latest --legacy-peer-deps
```

## 方法二：使用 GitHub Actions 自动构建

您可以使用 GitHub Actions 在云端自动构建适用于不同操作系统的应用程序：

1. **准备 GitHub 仓库**
   - 将项目推送到 GitHub 仓库
   - 确保 `.github/workflows/build.yml` 文件已包含在仓库中

2. **配置构建流程**
   - GitHub Actions 将在 Windows、macOS 和 Ubuntu 环境中自动构建应用
   - 为每个平台生成相应的安装程序

3. **获取构建产物**
   - 构建完成后，在仓库的 "Actions" 标签页中找到运行的工作流
   - 下载适用于各平台的构建产物
   - Windows 版本将包含 `.exe` 安装程序

GitHub Actions 配置文件会自动：
- 安装 Node.js 依赖
- 构建 React 应用
- 使用 Electron 打包为各平台的原生应用
- 上传构建产物作为工件

### 优势
- 无需本地 Windows 环境
- 自动为多个平台构建
- 与代码版本控制集成

## 方法三：作为静态网站部署

如果您不需要桌面应用，也可以将应用构建为静态网站：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署**
   - 将 `dist` 目录中的文件部署到任何 Web 服务器
   - 或者直接双击 `dist/index.html` 在浏览器中打开（部分功能可能受限）

## 所需文件

确保以下文件存在于项目根目录：
- `electron-main.js` - Electron 主进程文件
- `preload.js` - 预加载脚本
- `package.json` 中的 Electron 配置

## 环境变量

在生产环境中，您需要在 `.env` 文件中设置 API 密钥：
```
GEMINI_API_KEY=your_actual_api_key_here
```

## 故障排除

1. **如果遇到权限错误**
   - 在 Windows 上以管理员身份运行命令提示符
   - 或者使用 PowerShell 以管理员身份运行

2. **如果构建失败**
   - 确保 Node.js 版本为 16 或更高
   - 清理 npm 缓存：`npm cache clean --force`
   - 重新安装依赖：`npm install`

3. **如果应用启动空白**
   - 检查浏览器控制台是否有错误
   - 确保所有依赖都已正确安装

## 应用功能

打包后的 Windows 应用将包含：
- 参数录入表单
- 材料清单表格
- 实时计算功能
- CSV 导出功能
- 计算规则配置

构建成功后，您将获得一个独立的 Windows 可执行文件，可以在任何 Windows 11/10 系统上运行，无需安装 Node.js 或其他依赖。