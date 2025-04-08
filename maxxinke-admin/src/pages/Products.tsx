import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Tag, Upload, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { theme } from '../styles/theme';
import dayjs from 'dayjs';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  specification: string;
  application: string;
  image: string;
  sort: number;
  status: number;
  create_time: string;
  update_time: string;
}

interface ProductResponse {
  list: Product[];
  total: number;
  page: number;
  pageSize: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fetchProducts = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await request.get<{ code: number; message: string; data: ProductResponse }>('/api/products', {
        params: { page, pageSize }
      });
      
      if (response.code === 200 && response.data) {
        setProducts(response.data.list || []);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        });
      } else {
        setProducts([]);
        message.error(response.message || '获取产品列表失败');
      }
    } catch (error) {
      message.error('获取产品列表失败');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    setFileList([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setEditingId(record.id);
    // 处理多张图片的显示
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
      status: record.status.toString(),
      image: record.image,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/api/products/${id}`);
      message.success('删除成功');
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // 处理多张图片的URL
      const imageUrls = fileList
        .filter(file => file.status === 'done')
        .map(file => {
          let imageUrl = file.response?.data?.image || file.url || '';
          // 如果是完整URL，转换为相对路径
          if (imageUrl.startsWith('http://localhost:3000')) {
            imageUrl = imageUrl.replace('http://localhost:3000', '');
          }
          return imageUrl;
        })
        .join(',');
      
      if (editingId) {
        await request.put(`/api/products/${editingId}`, {
          ...values,
          image: imageUrls,
          status: parseInt(values.status),
        });
        message.success('更新成功');
      } else {
        await request.post('/api/products', {
          ...values,
          image: imageUrls,
          status: parseInt(values.status),
        });
        message.success('添加成功');
      }
      setModalVisible(false);
      setFileList([]);
      form.resetFields();
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: 'http://localhost:3000/api/upload',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    listType: 'picture-card' as const,
    maxCount: 5, // 最多上传5张图片
    multiple: true, // 允许多选文件
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
        // 更新文件列表，保留其他已上传的图片
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
        // 从文件列表中移除上传失败的文件
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
          // 只移除被删除的图片，保留其他图片
          setFileList(fileList.filter(f => f.uid !== file.uid));
          // 更新表单中的图片值
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
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: '12%',
      render: (category: string) => (
        <Tag color={
          category === '水处理' ? 'blue' :
          category === '混凝土外加剂' ? 'green' : 'default'
        }>
          {category}
        </Tag>
      ),
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: '12%',
    },
    {
      title: '应用',
      dataIndex: 'application',
      key: 'application',
      width: '15%',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: '8%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '已上架' : '未上架'}
        </Tag>
      ),
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
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个产品吗？"
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
        <h2 style={{ margin: 0, color: theme.colors.text.primary }}>产品管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加产品
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
            fetchProducts(page, pageSize);
          },
        }}
      />
      <Modal
        title={editingId ? '编辑产品' : '添加产品'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="产品名称"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请输入产品分类' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入产品描述' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="specification"
            label="规格"
            rules={[{ required: true, message: '请输入产品规格' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="application"
            label="应用"
            rules={[{ required: true, message: '请输入产品应用' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="image"
            label="产品图片"
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
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序值' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="1">上架</Select.Option>
              <Select.Option value="0">下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products; 