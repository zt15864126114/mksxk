import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth } from '../middleware/auth';
import { pool } from '../db';

const router = Router();
const uploadDir = path.join(__dirname, '../../uploads');

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Destination directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log('File filter checking:', file);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      console.log('Invalid file type:', file.mimetype);
      cb(new Error('只允许上传图片文件'));
    } else {
      console.log('File type accepted:', file.mimetype);
      cb(null, true);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
  }
});

// 上传图片
router.post('/', auth, upload.single('file'), (req, res) => {
  console.log('Upload request received:', {
    file: req.file,
    body: req.body,
    headers: req.headers
  });

  if (!req.file) {
    console.log('No file received');
    return res.status(400).json({ code: 400, message: '没有上传文件' });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('File uploaded successfully:', {
      filename: req.file.filename,
      path: req.file.path,
      imageUrl
    });

    res.json({ 
      code: 200, 
      message: '上传成功',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ 
      code: 500, 
      message: '上传失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 删除图片
router.delete('/:filename', auth, async (req, res) => {
  const { filename } = req.params;
  console.log('Received delete request for filename:', filename);
  
  // 从URL中提取实际的文件名（去掉/uploads/前缀）
  const actualFilename = filename.replace(/^\/?uploads\//, '');
  console.log('Actual filename:', actualFilename);
  
  const filePath = path.join(uploadDir, actualFilename);
  console.log('Full file path:', filePath);

  try {
    // 检查文件是否存在并删除
    console.log('Checking if file exists...');
    if (fs.existsSync(filePath)) {
      console.log('File exists, attempting to delete...');
      fs.unlinkSync(filePath);
      console.log('File deleted successfully');
    } else {
      console.log('File not found at path:', filePath);
    }

    // 尝试更新数据库（如果表存在）
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // 从数据库中删除使用该图片的产品记录
        console.log('Updating database records...');
        const [result] = await connection.query(
          'UPDATE product SET image = NULL WHERE image = ?',
          [`/uploads/${actualFilename}`]
        );
        console.log('Database update result:', result);

        // 提交事务
        await connection.commit();
        console.log('Transaction committed');
      } catch (error) {
        // 回滚事务
        console.error('Error during transaction:', error);
        await connection.rollback();
        console.log('Transaction rolled back');
        // 如果表不存在，我们仍然认为删除成功，因为文件已经被删除了
      } finally {
        // 释放连接
        connection.release();
        console.log('Database connection released');
      }
    } catch (error) {
      console.log('Database operation skipped:', error);
      // 如果数据库操作失败，我们仍然认为删除成功，因为文件已经被删除了
    }
    
    res.json({ 
      code: 200, 
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '删除文件失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 