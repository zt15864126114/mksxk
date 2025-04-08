import React, { useState } from 'react';
import { Layout, Menu, Button, theme as antTheme, Dropdown, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  MessageOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = antTheme.useToken();

  const username = localStorage.getItem('username') || '管理员';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('realName');
    window.location.href = '/login';
  };

  const menuItems = [
    {
      key: '/products',
      icon: <ShopOutlined />,
      label: '产品管理',
    },
    {
      key: '/news',
      icon: <FileTextOutlined />,
      label: '新闻管理',
    },
    {
      key: '/messages',
      icon: <MessageOutlined />,
      label: '留言管理',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '修改密码',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: theme.colors.white,
          boxShadow: theme.shadows.small,
        }}
      >
        <div style={{
          height: '64px',
          padding: '16px',
          color: theme.colors.primary,
          fontWeight: 'bold',
          fontSize: collapsed ? '16px' : '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}>
          {collapsed ? 'MX' : '麦克斯鑫科'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            borderRight: 'none',
          }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 16px',
          background: theme.colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: theme.shadows.small,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Avatar
                style={{
                  background: theme.colors.primaryGradient,
                  cursor: 'pointer',
                }}
                icon={<UserOutlined />}
              />
              <span>欢迎，{username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          background: theme.colors.background,
          borderRadius: 8,
          minHeight: 280,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 