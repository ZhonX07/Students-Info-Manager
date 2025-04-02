const path = require('path');
const fs = require('fs-extra');
const { app, remote } = require('electron');

class DatabaseManager {
  constructor() {
    try {
      // 使用正确的方式获取app实例
      const electronApp = app || (remote && remote.app);
      if (!electronApp) {
        throw new Error('无法访问Electron app对象');
      }
      
      this.dbFolder = electronApp.getPath('userData');
      this.dbPath = path.join(this.dbFolder, 'student-data.json');
      this.isInitialized = false;
      
      // 默认数据结构
      this.data = {
        students: [],
        attendance: [],
        grades: [],
        settings: {
          appName: "Student Information System",
          version: "0.0.1-ArrowLake-Alpha"
        }
      };
    } catch (error) {
      console.error('DatabaseManager初始化失败:', error);
      throw error;
    }
  }

  // 初始化数据存储
  async init() {
    try {
      // 如果已经初始化，则直接返回
      if (this.isInitialized) {
        return true;
      }
      
      // 确保目录存在
      await fs.ensureDir(this.dbFolder);
      
      // 检查文件是否存在
      if (await fs.pathExists(this.dbPath)) {
        // 如果存在，读取数据
        this.data = await fs.readJson(this.dbPath);
      } else {
        // 如果不存在，创建默认数据文件
        await fs.writeJson(this.dbPath, this.data, { spaces: 2 });
      }
      
      this.isInitialized = true;
      console.log('数据文件已初始化');
      return true;
    } catch (error) {
      console.error('初始化数据存储时出错:', error);
      throw error;
    }
  }

  // 检查数据文件是否存在
  async databaseExists() {
    try {
      return await fs.pathExists(this.dbPath);
    } catch (error) {
      console.error('检查数据文件存在性时出错:', error);
      return false;
    }
  }

  // 创建初始数据结构
  async createDataStructure() {
    try {
      await fs.writeJson(this.dbPath, this.data, { spaces: 2 });
      console.log('数据结构已创建');
      return true;
    } catch (error) {
      console.error('创建数据结构时出错:', error);
      throw error;
    }
  }

  // 导入学生信息
  async importStudents(students, classInfo) {
    try {
      if (!Array.isArray(students) || students.length === 0) {
        throw new Error('学生列表为空或格式不正确');
      }
      
      if (!classInfo || typeof classInfo !== 'string') {
        throw new Error('班级信息为空或格式不正确');
      }
      
      // 解析班级信息
      const gradeParts = classInfo.split('级');
      const grade = gradeParts[0] + '级';
      const className = gradeParts.length > 1 ? gradeParts[1] : classInfo;
      
      // 生成学生ID并添加数据
      const year = new Date().getFullYear();
      let count = 0;
      let errors = [];
      const newStudents = [];
      
      students.forEach((name, index) => {
        if (!name.trim()) return;
        
        try {
          // 生成学号：年份 + 班级编号(两位) + 序号(两位)
          const classNum = '01'; // 这里可以根据实际情况调整
          const studentNum = (index + 1).toString().padStart(2, '0');
          const studentId = `${year}${classNum}${studentNum}`;
          
          // 添加到学生列表
          newStudents.push({
            id: studentId,
            name: name.trim(),
            class: className,
            grade: grade,
            createdAt: new Date().toISOString()
          });
          
          count++;
        } catch (error) {
          errors.push({ name, error: error.message });
          console.error('处理学生数据时出错:', error);
        }
      });
      
      // 更新数据
      this.data.students = this.data.students.concat(newStudents);
      
      // 保存到文件
      await fs.writeJson(this.dbPath, this.data, { spaces: 2 });
      
      return { count, errors: errors.length > 0 ? errors : null };
    } catch (error) {
      console.error('导入学生信息时出错:', error);
      throw error;
    }
  }

  // 获取所有学生
  async getStudents() {
    try {
      return this.data.students;
    } catch (error) {
      console.error('获取学生列表时出错:', error);
      throw error;
    }
  }

  // 保存数据到文件
  async saveData() {
    try {
      await fs.writeJson(this.dbPath, this.data, { spaces: 2 });
      return true;
    } catch (error) {
      console.error('保存数据时出错:', error);
      throw error;
    }
  }

  // 关闭连接 (对于JSON文件，实际上只需要确保数据已保存)
  async close() {
    try {
      // 如果有未保存的数据，这里可以添加保存逻辑
      this.isInitialized = false;
      console.log('数据存储已关闭');
    } catch (error) {
      console.error('关闭数据存储时出错:', error);
    }
  }
}

module.exports = new DatabaseManager();