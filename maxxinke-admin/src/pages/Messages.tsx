import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Tag } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { theme } from '../styles/theme';
import dayjs from 'dayjs';

interface Message {
  id: number;
  name: string;
  phone: string;
  email: string;
  company: string;
  content: string;
  status: number;
  reply: string | null;
  reply_time: string | null;
  create_time: string;
  update_time: string;
}

interface MessageResponse {
  list: Message[];
  total: number;
  page: number;
  pageSize: number;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchMessages = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await request.get<{ code: number; message: string; data: MessageResponse }>('/api/messages', {
        params: { page, pageSize }
      });
      
      if (response.code === 200 && response.data) {
        setMessages(response.data.list || []);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        });
      } else {
        setMessages([]);
        message.error(response.message || '获取留言列表失败');
      }
    } catch (error) {
      message.error('获取留言列表失败');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = (record: Message) => {
    setSelectedMessage(record);
    form.setFieldsValue({ reply: record.reply });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedMessage) {
        await request.put(`/api/messages/${selectedMessage.id}`, {
          reply: values.reply,
        });
        message.success('回复成功');
        setModalVisible(false);
        fetchMessages(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      message.error('回复失败');
    }
  };

  const handleTableChange = (newPagination: any) => {
    fetchMessages(newPagination.current, newPagination.pageSize);
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
      width: '15%',
    },
    {
      title: '联系方式',
      key: 'contact',
      width: '20%',
      render: (_: any, record: Message) => (
        <Space direction="vertical" size="small">
          <div>电话：{record.phone}</div>
          <div>邮箱：{record.email}</div>
        </Space>
      ),
    },
    {
      title: '留言内容',
      dataIndex: 'content',
      key: 'content',
      width: '20%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'warning'}>
          {status === 1 ? '已回复' : '待回复'}
        </Tag>
      ),
    },
    {
      title: '回复内容',
      dataIndex: 'reply',
      key: 'reply',
      width: '15%',
      render: (reply: string | null) => reply || '-',
    },
    {
      title: '留言时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: '12%',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Message) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => handleReply(record)}
            disabled={record.status === 1}
          >
            {record.status === 1 ? '已回复' : '回复'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      padding: '24px',
      background: theme.colors.white,
      borderRadius: '8px',
      boxShadow: theme.shadows.small
    }}>
      <Table
        columns={columns}
        dataSource={messages}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title="回复留言"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="留言信息">
            <Input.TextArea 
              value={`
姓名：${selectedMessage?.name || ''}
公司：${selectedMessage?.company || ''}
电话：${selectedMessage?.phone || ''}
邮箱：${selectedMessage?.email || ''}
内容：${selectedMessage?.content || ''}
时间：${selectedMessage?.create_time ? dayjs(selectedMessage.create_time).format('YYYY-MM-DD HH:mm') : ''}
              `.trim()} 
              disabled 
              rows={6}
            />
          </Form.Item>
          <Form.Item
            name="reply"
            label="回复内容"
            rules={[{ required: true, message: '请输入回复内容' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Messages; 