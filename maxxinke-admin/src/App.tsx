import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import Products from './pages/Products';
import News from './pages/News';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          // 未登录状态下的路由
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          // 已登录状态下的路由
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<Products />} />
            <Route path="news" element={<News />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App; 