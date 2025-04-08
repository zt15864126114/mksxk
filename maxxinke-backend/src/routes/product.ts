import { Router } from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product';
import { auth } from '../middleware/auth';

const router = Router();

// 公开接口
// 获取产品列表
router.get('/', getProducts);

// 获取产品详情
router.get('/:id', getProduct);

// 需要登录的接口
// 创建产品（需要登录）
router.post('/', auth, createProduct);

// 更新产品（需要登录）
router.put('/:id', auth, updateProduct);

// 删除产品（需要登录）
router.delete('/:id', auth, deleteProduct);

export default router;

 