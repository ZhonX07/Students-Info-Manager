<template>
  <div class="import-view">
    <h2>导入学生信息</h2>
    <div class="content-placeholder">
      导入学生功能开发中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImportStudentView',
  mounted() {
    console.log('导入学生组件已加载');
  }
}
</script>

<style scoped>
.import-view {
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
