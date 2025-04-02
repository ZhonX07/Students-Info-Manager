<template>
  <div class="settings-view">
    <h2>系统设置</h2>
    <div class="content-placeholder">
      系统设置功能开发中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  mounted() {
    console.log('系统设置组件已加载');
  }
}
</script>

<style scoped>
.settings-view {
  padding: 20px;
}
.content-placeholder {
  margin-top: 20px;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  color: #666;
}
</style>