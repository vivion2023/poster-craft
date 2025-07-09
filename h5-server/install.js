const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始安装 H5 预览服务依赖...\n');

try {
  // 检查 package.json 是否存在
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json 文件不存在');
    process.exit(1);
  }

  // 安装依赖
  console.log('📦 正在安装依赖包...');
  execSync('npm install', { 
    stdio: 'inherit',
    cwd: __dirname 
  });

  console.log('\n✅ H5 预览服务依赖安装完成！');
  console.log('\n🎯 接下来你可以：');
  console.log('   npm start     - 启动生产服务');
  console.log('   npm run dev   - 启动开发服务（自动重启）');
  console.log('\n🌐 服务地址: http://localhost:8082');
  console.log('📖 预览格式: http://localhost:8082/p/{workId}-{uuid}');

} catch (error) {
  console.error('\n❌ 安装失败:', error.message);
  process.exit(1);
}
