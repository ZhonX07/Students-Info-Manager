import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 创建Vue实例
const app = createApp(App);

// 添加路由调试
router.beforeEach((to, from, next) => {
  console.log(`[Router] 全局导航守卫: ${from.path} → ${to.path}`);
  next();
});

// 监听路由错误
router.onError((error) => {
  console.error('[Router] 路由错误:', error);
});

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('[Vue] 错误:', err);
  console.error('[Vue] 组件:', vm);
  console.error('[Vue] 信息:', info);
};

// 确保挂载路由
app.use(router);

// 挂载应用
app.mount('#app');

// 确认应用已挂载
console.log('[Main] 应用已挂载，路由已注册');

// 暴露用于调试
window.vueApp = app;
window.appRouter = router;
