import { db } from '../config/database';
import bcrypt from 'bcryptjs';

async function createDefaultAdmin() {
  try {
    // 检查是否已存在管理员账号
    const [rows] = await db.query('SELECT COUNT(*) as count FROM admins');
    const count = (rows as any)[0].count;

    if (count > 0) {
      console.log('管理员账号已存在，跳过创建');
      return;
    }

    // 创建默认管理员账号
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO admins (username, password, real_name, status) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, '系统管理员', 1]
    );

    console.log('默认管理员账号创建成功');
    console.log('用户名:', username);
    console.log('密码:', password);
  } catch (error) {
    console.error('创建默认管理员账号失败:', error);
  } finally {
    process.exit();
  }
}

createDefaultAdmin(); 