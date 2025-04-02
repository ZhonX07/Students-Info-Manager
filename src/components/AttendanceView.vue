<template>
  <div class="attendance-view">
    <h2>考勤管理</h2>
    <div class="content-placeholder">
      考勤管理功能开发中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttendanceView',
  mounted() {
    console.log('考勤管理组件已加载');
  }
}
</script>

<style scoped>
.attendance-view {
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