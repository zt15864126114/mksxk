import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../utils/request';
import { theme } from '../styles/theme';

interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    userInfo: {
      id: number;
      username: string;
      real_name: string;
    }
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await request.post<LoginResponse>('/api/admin/login', values);
      
      // 检查响应状态
      if (response.code === 200 && response.data) {
        // 登录成功
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.userInfo.username);
        localStorage.setItem('realName', response.data.userInfo.real_name);
        message.success('登录成功');
        // 使用 window.location.href 进行页面跳转，确保完全刷新
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        // 登录失败但有响应
        message.error(response.message || '登录失败，请检查用户名和密码');
        form.setFieldValue('password', '');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // 处理错误响应
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 401:
            message.error('用户名或密码错误');
            break;
          case 403:
            message.error('账号已被禁用，请联系管理员');
            break;
          case 429:
            message.error('登录尝试次数过多，请稍后再试');
            break;
          case 500:
            message.error('服务器错误，请稍后重试');
            break;
          default:
            message.error(data?.message || '登录失败，请稍后重试');
        }
      } else if (error.request) {
        message.error('网络连接失败，请检查网络设置');
      } else {
        message.error('登录失败，请稍后重试');
      }
      // 清空密码字段
      form.setFieldValue('password', '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: theme.colors.primaryGradient,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 背景动画效果 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        background: `
          radial-gradient(circle at 10% 20%, rgba(255,255,255,0.3) 0%, transparent 25%),
          radial-gradient(circle at 90% 30%, rgba(255,255,255,0.3) 0%, transparent 25%),
          radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 0%, transparent 25%),
          radial-gradient(circle at 70% 80%, rgba(255,255,255,0.3) 0%, transparent 25%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)
        `
      }} />
      
      <div style={{ 
        width: 400, 
        padding: 40,
        background: theme.colors.white,
        borderRadius: 8,
        boxShadow: theme.shadows.large,
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 40
        }}>
          <h1 style={{ 
            fontSize: 32,
            margin: 0,
            background: theme.colors.primaryGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            麦克斯鑫科
          </h1>
          <p style={{
            marginTop: 12,
            color: theme.colors.text.secondary,
            fontSize: 16
          }}>
            企业管理系统
          </p>
        </div>

        <Form
          form={form}
          name="login"
          size="large"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: theme.colors.primary }} />} 
              placeholder="用户名"
              autoComplete="off"
              style={{ 
                height: 50,
                borderRadius: 6
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: theme.colors.primary }} />} 
              placeholder="密码"
              style={{ 
                height: 50,
                borderRadius: 6
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={loading}
              style={{ 
                height: 50,
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 6,
                background: theme.colors.primaryGradient,
                border: 'none'
              }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login; 