import app from './app';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 