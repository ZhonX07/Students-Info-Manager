import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

// 创建一个带加载状态和错误处理的异步组件加载器
const loadComponent = (componentPath) => {
  return defineAsyncComponent({
    loader: () => import(`../components/${componentPath}.vue`),
    loadingComponent: {
      template: '<div class="async-loading">正在加载组件...</div>',
    },
    errorComponent: {
      template: '<div class="async-error">组件加载失败</div>',
    },
    onError(error, retry, fail) {
      console.error('组件加载失败:', error);
      fail();
    },
  });
};

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/attendance'
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: loadComponent('AttendanceView'),
    meta: { title: '考勤管理' }
  },
  {
    path: '/grades',
    name: 'Grades',
    component: loadComponent('GradesView'),
    meta: { title: '成绩管理' }
  },
  {
    path: '/development',
    name: 'Development',
    component: loadComponent('DevelopmentView'),
    meta: { title: '成长档案' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: loadComponent('SettingsView'),
    meta: { title: '系统设置' }
  },
  {
    path: '/import',
    name: 'ImportStudent',
    component: loadComponent('ImportStudentView'),
    meta: { title: '导入学生' }
  },
  // 添加通配符路由，捕获所有未匹配的路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/attendance'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 添加导航事件日志
router.beforeEach((to, from, next) => {
  console.log('[Router] 导航开始:', from.path, '→', to.path);
  // 设置文档标题
  if (to.meta.title) {
    document.title = `SIM - ${to.meta.title}`;
  }
  next();
})

router.afterEach((to, from) => {
  console.log('[Router] 导航完成:', from.path, '→', to.path);
})

// 处理路由错误
router.onError((error) => {
  console.error('[Router] 路由导航出错:', error);
});

export default router
