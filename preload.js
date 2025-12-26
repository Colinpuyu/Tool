// 预加载脚本，用于安全地暴露 Node.js 功能到渲染进程
const { contextBridge } = require('electron');

// 安全地暴露 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 可以在这里添加需要与主进程通信的 API
});