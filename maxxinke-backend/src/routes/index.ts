import { Router } from 'express';
import adminRouter from './admin';
import productRouter from './product';
import newsRouter from './news';
import messageRouter from './messages';

const router = Router();

// 管理员路由
router.use('/admin', adminRouter);

// 产品路由
router.use('/products', productRouter);

// 新闻路由
router.use('/news', newsRouter);

// 留言路由
router.use('/messages', messageRouter);

export default router; 