import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './config/database';
import adminRoutes from './routes/admin';
import newsRoutes from './routes/news';
import productRoutes from './routes/product';
import messagesRoutes from './routes/messages';
import uploadRoutes from './routes/upload';
import messageRoutes from './routes/messageRoutes';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();

// 中间件
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],  // 前台 3000，后台 3001
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Static files directory:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// API 路由
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);

// 错误处理
app.use(errorHandler);

export default app; 