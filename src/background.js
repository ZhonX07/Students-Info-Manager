'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import fs from 'fs-extra'
import * as remote from '@electron/remote/main'
const dbManager = require('./database/db-manager')

// 初始化remote模块
remote.initialize()

const isDevelopment = process.env.NODE_ENV !== 'production'

// 声明全局变量以防止被垃圾回收
let win
let importWindow

// 添加全局错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
  
  if (app.isReady()) {
    dialog.showErrorBox('应用错误', 
      `发生了一个未处理的错误：${error.message}\n\n` +
      '应用可能需要重新启动。'
    )
  }
  
  // 不立即退出，让用户有机会看到错误消息
})

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  try {
    // 创建浏览器窗口
    win = new BrowserWindow({
      width: 1024,
      height: 768,
      frame: false, // 无边框窗口，以便使用自定义标题栏
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false, // 出于安全考虑设为false
        contextIsolation: true, // 修改为true，启用上下文隔离，这样contextBridge可以正常工作
        enableRemoteModule: false, // 启用远程模块
        worldSafeExecuteJavaScript: true, // 安全执行JS
        webSecurity: true // 启用网页安全
      }
    })

    // 为当前窗口启用remote模块
    remote.enable(win.webContents)
    
    // 添加路由调试辅助功能
    win.webContents.on('did-finish-load', () => {
      console.log('[Main] 页面加载完成');
    });

    // 监听关闭事件以便在控制台记录
    win.on('closed', () => {
      win = null
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
      if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      win.loadURL('app://./index.html')
    }

    // 初始化数据存储
    await initializeDataStore();
  } catch (error) {
    console.error('创建窗口或初始化数据存储时出错:', error)
    dialog.showErrorBox('启动错误', `启动应用时发生错误: ${error.message}`)
  }
}

// 创建导入学生信息的窗口
function createImportWindow() {
  try {
    importWindow = new BrowserWindow({
      parent: win,
      modal: true,
      width: 500,
      height: 600,
      frame: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      }
    })

    remote.enable(importWindow.webContents)

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      importWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/import')
    } else {
      importWindow.loadURL('app://./index.html#/import')
    }

    importWindow.on('closed', () => {
      importWindow = null
    })
  } catch (error) {
    console.error('创建导入窗口时出错:', error)
    dialog.showErrorBox('窗口错误', `创建导入窗口时出错: ${error.message}`)
  }
}

// 初始化数据存储
async function initializeDataStore() {
  try {
    await dbManager.init();
    
    // 检查数据文件是否存在
    if (!await dbManager.databaseExists()) {
      console.log('数据文件不存在，需要创建并导入学生信息');
      await dbManager.createDataStructure();
      createImportWindow();
    } else {
      console.log('数据文件已存在');
    }
  } catch (error) {
    console.error('初始化数据存储失败:', error);
    dialog.showErrorBox('数据错误', '初始化数据存储失败: ' + error.message);
  }
}

// 处理导入学生信息的IPC消息
ipcMain.on('import-students', async (event, { students, classInfo }) => {
  try {
    const result = await dbManager.importStudents(students, classInfo);
    event.reply('import-students-result', { success: true, count: result.count });
    
    // 导入成功后关闭导入窗口
    if (importWindow && !importWindow.isDestroyed()) {
      importWindow.close();
    }
  } catch (error) {
    console.error('导入学生信息失败:', error);
    event.reply('import-students-result', { success: false, error: error.message });
  }
});

// 添加一个健康检查IPC消息
ipcMain.on('app-health-check', (event) => {
  event.returnValue = { status: 'ok', memory: process.memoryUsage() };
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  try {
    if (dbManager) {
      dbManager.close();
    }
    
    if (process.platform !== 'darwin') {
      app.quit();
    }
  } catch (error) {
    console.error('关闭应用时出错:', error);
    app.exit(1);
  }
})

// 在应用将要退出时确保资源被正确释放
app.on('will-quit', () => {
  try {
    if (dbManager) {
      dbManager.close();
    }
  } catch (error) {
    console.error('应用退出前清理资源时出错:', error);
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        dbManager.close();
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      dbManager.close();
      app.quit()
    })
  }
}
