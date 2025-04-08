import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { message } from 'antd';

declare const process: {
  env: {
    REACT_APP_API_URL?: string;
  };
};

declare module 'axios' {
  interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  }
}

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 如果是上传文件的请求，不设置 Content-Type，让浏览器自动设置
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 如果是登录页面，让错误继续传递，由登录页面处理
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }
      
      switch (error.response.status) {
        case 401:
          message.error('未授权，请重新登录');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求错误，未找到该资源');
          break;
        case 500:
          message.error('服务器端出错');
          break;
        default:
          message.error(`连接错误${error.response.status}`);
      }
    } else {
      // 如果是登录页面，让错误继续传递
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }
      message.error('连接到服务器失败');
    }
    return Promise.reject(error);
  }
);

export default request; 