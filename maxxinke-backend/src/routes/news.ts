import { Router } from 'express';
import { 
  getNews, 
  getNewsItem, 
  createNews, 
  updateNews, 
  deleteNews 
} from '../controllers/news';
import { auth } from '../middleware/auth';

const router = Router();

// 公开接口
// 获取新闻列表
router.get('/', getNews);

// 获取新闻详情
router.get('/:id', getNewsItem);

// 需要登录的接口
// 创建新闻（需要登录）
router.post('/', auth, createNews);

// 更新新闻（需要登录）
router.put('/:id', auth, updateNews);

// 删除新闻（需要登录）
router.delete('/:id', auth, deleteNews);

export default router; 