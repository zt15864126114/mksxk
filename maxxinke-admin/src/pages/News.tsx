import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Tag, Select, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import type { RcFile } from 'antd/es/upload/interface';
import request from '../utils/request';
import { theme } from '../styles/theme';
import dayjs from 'dayjs';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  type: string;
  status: number;
  create_time: string;
  update_time: string;
}

interface NewsResponse {
  list: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fetchNews = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await request.get<{ code: number; message: string; data: NewsResponse }>('/api/news', {
        params: { page, pageSize }
      });
      
      if (response.code === 200 && response.data) {
        setNews(response.data.list || []);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        });
      } else {
        setNews([]);
        message.error(response.message || '获取新闻列表失败');
      }
    } catch (error) {
      message.error('获取新闻列表失败');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAdd = () => {
    setEditingNews(null);
    setFileList([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: NewsItem) => {
    setEditingNews(record);
    const imageUrls = record.image ? record.image.split(',') : [];
    const initialFileList: UploadFile[] = imageUrls.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}.png`,
      status: 'done' as const,
      url: url.startsWith('http') ? url : `http://localhost:3000${url}`,
      thumbUrl: url.startsWith('http') ? url : `http://localhost:3000${url}`,
    }));
    setFileList(initialFileList);
    form.setFieldsValue({
      ...record,
      type: record.type.toString(),
      status: record.status.toString(),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/api/news/${id}`);
      message.success('删除成功');
      fetchNews(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const imageUrls = fileList
        .filter(file => file.status === 'done')
        .map(file => {
          let imageUrl = file.response?.data?.image || file.url || '';
          if (imageUrl.startsWith('http://localhost:3000')) {
            imageUrl = imageUrl.replace('http://localhost:3000', '');
          }
          return imageUrl;
        })
        .join(',');

      if (editingNews) {
        await request.put(`/api/news/${editingNews.id}`, {
          ...values,
          image: imageUrls,
          type: parseInt(values.type),
          status: parseInt(values.status),
        });
        message.success('更新成功');
      } else {
        await request.post('/api/news', {
          ...values,
          image: imageUrls,
          type: parseInt(values.type),
          status: parseInt(values.status),
        });
        message.success('添加成功');
      }
      setModalVisible(false);
      setFileList([]);
      form.resetFields();
      fetchNews(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  const uploadProps = {
    name: 'file',
    action: 'http://localhost:3000/api/upload',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    listType: 'picture-card' as const,
    maxCount: 5,
    multiple: true,
    fileList,
    customRequest: async (options: UploadRequestOption) => {
      const { file, onSuccess, onError, onProgress } = options;
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await request.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress?.({ percent });
            }
          },
        });
        
        console.log('Upload response:', response);
        onSuccess?.(response);
      } catch (error) {
        console.error('Upload error:', error);
        onError?.(new Error('上传失败'));
      }
    },
    onChange: ({ file, fileList: newFileList }: { file: UploadFile; fileList: UploadFile[] }) => {
      console.log('Upload onChange:', file, newFileList);
      if (file.status === 'done') {
        const imageUrl = file.response.data.image;
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:3000${imageUrl}`;
        message.success('图片上传成功');
        setFileList(newFileList.map(f => {
          if (f.uid === file.uid) {
            return {
              ...f,
              url: fullImageUrl,
              thumbUrl: fullImageUrl
            };
          }
          return f;
        }));
      } else if (file.status === 'error') {
        console.error('Upload error:', file.error, file.response);
        message.error(`图片上传失败: ${file.response?.message || '未知错误'}`);
        setFileList(newFileList.filter(f => f.uid !== file.uid));
      } else if (file.status === 'uploading') {
        console.log('File uploading:', file);
        setFileList(newFileList);
      }
    },
    onPreview: async (file: UploadFile) => {
      const imageUrl = file.url || file.thumbUrl;
      if (imageUrl) {
        window.open(imageUrl);
      }
    },
    onRemove: async (file: UploadFile) => {
      try {
        const filename = file.url?.split('/').pop() || '';
        console.log('Deleting file:', filename);
        
        const response = await request.delete(`/api/upload/${filename}`);
        
        if (response.code === 200) {
          message.success('图片删除成功');
          setFileList(fileList.filter(f => f.uid !== file.uid));
          const remainingUrls = fileList
            .filter(f => f.uid !== file.uid)
            .map(f => {
              let url = f.response?.data?.image || f.url || '';
              if (url.startsWith('http://localhost:3000')) {
                url = url.replace('http://localhost:3000', '');
              }
              return url;
            })
            .join(',');
          form.setFieldsValue({ image: remainingUrls });
        } else {
          throw new Error(response.message || '删除失败');
        }
      } catch (error) {
        console.error('删除图片失败:', error);
        message.error('图片删除失败');
      }
    },
    beforeUpload: (file: RcFile) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB！');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
    accept: 'image/*',
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '12%',
      render: (type: string) => (
        <Tag color={
          type === '公司新闻' ? 'blue' :
          type === '产品新闻' ? 'green' :
          type === '行业新闻' ? 'orange' : 'default'
        }>
          {type}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '已发布' : '未发布'}
        </Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: '15%',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: '15%',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: NewsItem) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条新闻吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: theme.colors.text.primary }}>新闻管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加新闻
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={news}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
            fetchNews(page, pageSize);
          },
        }}
      />
      <Modal
        title={editingNews ? '编辑新闻' : '添加新闻'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select>
              <Select.Option value="1">公司动态</Select.Option>
              <Select.Option value="2">行业新闻</Select.Option>
              <Select.Option value="2">技术文章</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>

          <Form.Item
            name="image"
            label="封面图片"
          >
            <Upload
              {...uploadProps}
              fileList={fileList}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="1">已发布</Select.Option>
              <Select.Option value="0">未发布</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default News; 