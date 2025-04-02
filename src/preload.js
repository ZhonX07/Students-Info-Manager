const { contextBridge, ipcRenderer } = require('electron');
const remote = require('@electron/remote');

// 错误处理函数
function safeExecute(func, fallbackValue = null) {
  try {
    return func();
  } catch (error) {
    console.error('预加载脚本执行错误:', error);
    return fallbackValue;
  }
}

// 暴露远程控制功能到window对象
contextBridge.exposeInMainWorld('electronAPI', {
  remote: {
    getCurrentWindow: () => safeExecute(() => remote.getCurrentWindow()),
    getCurrentWebContents: () => safeExecute(() => remote.getCurrentWebContents()),
    closeWindow: () => safeExecute(() => {
      const win = remote.getCurrentWindow();
      if (win) win.close();
    }),
    minimizeWindow: () => safeExecute(() => {
      const win = remote.getCurrentWindow();
      if (win) win.minimize();
    }),
    maximizeWindow: () => safeExecute(() => {
      const win = remote.getCurrentWindow();
      if (win) {
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    }),
    checkHealth: () => safeExecute(() => {
      return ipcRenderer.sendSync('app-health-check');
    }, { status: 'error', message: '无法检查应用健康状态' })
  },
  ipc: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
      // 使用闭包保存对监听器的引用，以便可以后续移除
      const listener = (event, ...args) => func(...args);
      ipcRenderer.on(channel, listener);
      // 返回一个函数，用于移除这个特定的监听器
      return () => ipcRenderer.removeListener(channel, listener);
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    }
  },
  // 添加专门用于调试的API
  debug: {
    log: (...args) => console.log(...args),
    getCurrentPath: () => window.location.hash.slice(1) || '/'
  }
});

// 暴露一些有用的调试信息
contextBridge.exposeInMainWorld('electronInfo', {
  versions: process.versions,
  platform: process.platform,
  contextIsolation: true,
  nodeIntegration: false
});

// 在加载完成后打印路径信息
window.addEventListener('DOMContentLoaded', () => {
  console.log('[Preload] DOM已加载，当前路径:', window.location.hash);
});

// 打印预加载脚本已加载
console.log('[Preload] 脚本已加载，上下文隔离已启用');
