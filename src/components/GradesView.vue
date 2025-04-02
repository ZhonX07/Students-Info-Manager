<template>
  <div class="grades-view">
    <h2>成绩管理</h2>
    <div class="content-placeholder">
      成绩管理功能开发中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradesView',
  mounted() {
    console.log('成绩管理组件已加载');
  }
}
</script>

<style scoped>
.grades-view {
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