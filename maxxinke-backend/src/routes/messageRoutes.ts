import { Router } from 'express';
import { createMessage, getMessages, updateMessage, deleteMessage } from '../controllers/messageController';
import { auth } from '../middleware/auth';

const router = Router();

// 公开接口 - 创建留言
router.post('/', createMessage);

// 管理员接口 - 需要认证
router.get('/', auth, getMessages);
router.patch('/:id', auth, updateMessage);
router.delete('/:id', auth, deleteMessage);

export default router; 