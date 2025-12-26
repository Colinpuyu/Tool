// 简化的 Electron 构建脚本，用于创建 Windows 应用
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始构建 Windows 应用...');

// 1. 首先构建 React 应用
console.log('步骤 1: 构建 React 应用...');
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`构建错误: ${error}`);
    return;
  }
  console.log('React 应用构建完成');

  // 2. 检查 dist 目录是否存在
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    console.error('错误: dist 目录不存在，请先运行 npm run build');
    return;
  }

  console.log('应用已准备就绪，可以使用以下命令打包为 Windows 应用:');
  console.log('');
  console.log('npm install --save-dev electron electron-builder electron-is-dev');
  console.log('npx electron-builder --win --x64');
  console.log('');
  console.log('或者在 Windows 系统上使用:');
  console.log('1. 安装 Node.js');
  console.log('2. 运行: npm install');
  console.log('3. 运行: npm install --save-dev electron electron-builder electron-is-dev');
  console.log('4. 运行: npm run electron-build');
});