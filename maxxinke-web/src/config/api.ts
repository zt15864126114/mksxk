// API 基础地址
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// API 端点
export const API_ENDPOINTS = {
  baseUrl: API_BASE_URL,
  
  // 留言相关
  messages: {
    create: `${API_BASE_URL}/api/messages`,
    list: `${API_BASE_URL}/api/messages`,
    update: (id: string) => `${API_BASE_URL}/api/messages/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/messages/${id}`,
  },

  // 产品相关
  products: {
    list: `${API_BASE_URL}/api/products`,
    detail: (id: string) => `${API_BASE_URL}/api/products/${id}`,
    create: `${API_BASE_URL}/api/products`,
    update: (id: string) => `${API_BASE_URL}/api/products/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  },
}; 