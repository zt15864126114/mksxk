import { Router } from 'express';
import { login, changePassword } from '../controllers/admin';
import { auth } from '../middleware/auth';

const router = Router();

// 管理员登录
router.post('/login', login);

// 修改密码（需要登录）
router.post('/change-password', auth, changePassword);

export default router; 