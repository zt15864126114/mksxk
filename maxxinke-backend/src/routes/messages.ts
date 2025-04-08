import express from 'express';
import { auth } from '../middleware/auth';
import { getMessages, createMessage, updateMessage, deleteMessage } from '../controllers/message';

const router = express.Router();

// 获取留言列表
router.get('/', getMessages);

// 创建留言
router.post('/', createMessage);

// 更新留言
router.put('/:id', auth, updateMessage);

// 删除留言
router.delete('/:id', auth, deleteMessage);

export default router; 