<template>
  <div id="app">
    <!-- 顶部栏 -->
    <header class="top-bar">
      <div class="window-controls">
        <div class="control close" @click="closeWindow"></div>
        <div class="control minimize" @click="minimizeWindow"></div>
        <div class="control expand" @click="maximizeWindow"></div>
      </div>
      <h1 class="app-title">SIM - 学生信息系统</h1>
      <div class="spacer"></div>
    </header>
    
    <div class="main-container">
      <div class="sidebar">
        <div class="logo">SIM</div>
        <div class="nav-buttons">
          <router-link
            to="/attendance"
            custom
            v-slot="{ navigate, isActive }">
            <button 
              @click="navigate" 
              :class="{ active: isActive }">
              考勤管理
            </button>
          </router-link>
          
          <router-link 
            to="/grades" 
            custom
            v-slot="{ navigate, isActive }">
            <button 
              @click="navigate" 
              :class="{ active: isActive }">
              成绩管理
            </button>
          </router-link>
          
          <router-link 
            to="/development" 
            custom
            v-slot="{ navigate, isActive }">
            <button 
              @click="navigate" 
              :class="{ active: isActive }">
              成长档案
            </button>
          </router-link>
          
          <router-link 
            to="/settings" 
            custom
            v-slot="{ navigate, isActive }">
            <button 
              @click="navigate" 
              :class="{ active: isActive }">
              系统设置
            </button>
          </router-link>
        </div>
      </div>
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRouterReady: false
    }
  },
  mounted() {
    // 打印版本信息
    console.log('应用启动成功，版本：0.0.1-ArrowLake-Alpha');
    
    // 确认路由已经准备好
    this.$nextTick(() => {
      this.isRouterReady = true;
      console.log('路由已初始化, 当前路径:', this.$route.path);
      
      // 添加额外调试信息
      console.log('当前路由对象:', this.$route);
      console.log('当前路由匹配的组件:', this.$route.matched);
    });
  },
  methods: {
    // 窗口控制方法
    closeWindow() {
      // 使用预加载脚本提供的功能
      if (window.electronAPI && window.electronAPI.remote) {
        window.electronAPI.remote.closeWindow();
      } else {
        console.error('electronAPI.remote not available');
      }
    },
    minimizeWindow() {
      if (window.electronAPI && window.electronAPI.remote) {
        window.electronAPI.remote.minimizeWindow();
      } else {
        console.error('electronAPI.remote not available');
      }
    },
    maximizeWindow() {
      if (window.electronAPI && window.electronAPI.remote) {
        window.electronAPI.remote.maximizeWindow();
      } else {
        console.error('electronAPI.remote not available');
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "微软雅黑", "Microsoft JHengHei UI", Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  background-color: #f5f7fa;
  overflow: hidden;
  user-select: none;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶部栏样式 */
.top-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #ffffff;
  height: 50px;
  border-bottom: 1px solid #e0e0e0;
  -webkit-app-region: drag; /* 允许拖动窗口 */
}

.window-controls {
  display: flex;
  gap: 8px;
  margin-right: 20px;
  -webkit-app-region: no-drag; /* 控制按钮不用于拖动 */
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  position: relative; /* 添加相对定位 */
}

/* 添加点击区域增强 */
.control:before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: 1;
}

.control:hover {
  opacity: 0.8; /* 添加悬停效果 */
}

.close { background-color: #ff5f56; }
.minimize { background-color: #ffbd2e; }
.expand { background-color: #27c93f; }

.app-title {
  flex-grow: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
}

.spacer {
  width: 40px; /* 使标题居中 */
}

/* 主容器样式 */
.main-container {
  display: flex;
  flex-grow: 1;
  height: calc(100vh - 50px);
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  width: 200px;
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0 40px;
}

.nav-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 15px;
}

.nav-buttons button {
  background: none;
  border: none;
  color: #bfcbd9;
  text-align: left;
  padding: 12px 15px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-buttons button:hover, 
.nav-buttons button.active {
  background-color: #1f2d3d;
  color: #ffffff;
}

/* 内容区域样式 */
.content {
  flex-grow: 1;
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
  position: relative;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #909399;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
