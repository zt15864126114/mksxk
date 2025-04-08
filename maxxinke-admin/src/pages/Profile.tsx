import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { theme } from '../styles/theme';

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      const response = await request.post('/api/admin/change-password', {
        old_password: values.oldPassword,
        new_password: values.newPassword
      });

      if (response.code === 200) {
        message.success('密码修改成功');
        form.resetFields();
      } else {
        message.error(response.message || '密码修改失败');
      }
    } catch (error) {
      message.error('密码修改失败，请检查原密码是否正确');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '24px',
      background: theme.colors.white,
      borderRadius: '8px',
      boxShadow: theme.shadows.small
    }}>
      <Card 
        title="修改密码" 
        bordered={false}
        style={{ maxWidth: 500, margin: '0 auto' }}
      >
        <Form
          form={form}
          name="change_password"
          onFinish={handleChangePassword}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入原密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能小于6位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请确认新密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
            >
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile; 