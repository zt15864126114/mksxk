'use client'

import { useState } from 'react'
import { Card, Row, Col, Form, Input, Button, message } from 'antd'
import { motion } from 'framer-motion'
import { 
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  WechatOutlined,
  SendOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { API_ENDPOINTS } from '@/config/api'

const ContactPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const contactInfo = {
    address: {
      full: '山东省济南市高新区新泺大街1768号齐鲁软件园大厦B座',
      city: '济南市',
      area: '高新区'
    },
    phone: {
      sales: '400-1234-5678',
      service: '0531-88888888'
    },
    email: 'info@maxxinke.com',
    workingHours: '周一至周五 9:00-18:00'
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.messages.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          company: values.company,
          content: values.message
        })
      });

      const data = await response.json();
      
      if (data.code === 200) {
        message.success({
          content: '留言提交成功！我们会尽快与您联系。',
          duration: 3,
          className: 'custom-message',
          style: {
            marginTop: '20vh',
          },
        });
        form.resetFields();
      } else {
        throw new Error(data.message || '提交失败');
      }
    } catch (error: any) {
      message.error(error.message || '发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题区域 */}
      <div className="relative py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              联系我们
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              如果您有任何问题或建议，请随时与我们联系，我们将竭诚为您服务
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 联系信息卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* 联系方式 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-8">联系方式</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <EnvironmentOutlined className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">公司地址</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {contactInfo.address.full}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0">
                    <PhoneOutlined className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">联系电话</h3>
                    <p className="text-gray-600">销售热线：{contactInfo.phone.sales}</p>
                    <p className="text-gray-600">服务热线：{contactInfo.phone.service}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500 flex-shrink-0">
                    <MailOutlined className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">电子邮箱</h3>
                    <p className="text-gray-600">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                    <ClockCircleOutlined className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">工作时间</h3>
                    <p className="text-gray-600">{contactInfo.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 关注我们 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <WechatOutlined className="text-green-500" />
                关注我们
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-full aspect-square bg-gray-50 rounded-lg shadow-md mb-2 flex items-center justify-center">
                    <span className="text-gray-400">公众号二维码</span>
                  </div>
                  <p className="text-sm text-gray-600">官方公众号</p>
                </div>
                <div className="text-center">
                  <div className="w-full aspect-square bg-gray-50 rounded-lg shadow-md mb-2 flex items-center justify-center">
                    <span className="text-gray-400">小程序二维码</span>
                  </div>
                  <p className="text-sm text-gray-600">官方小程序</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 留言表单 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                  <SendOutlined className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">在线留言</h2>
                  <p className="text-gray-600">我们会尽快回复您的留言</p>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-4"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="姓名"
                      rules={[{ required: true, message: '请输入您的姓名' }]}
                    >
                      <Input 
                        placeholder="请输入您的姓名" 
                        className="rounded-lg" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="电话"
                      rules={[
                        { required: true, message: '请输入您的电话' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                      ]}
                    >
                      <Input 
                        placeholder="请输入您的电话" 
                        className="rounded-lg"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入您的邮箱' },
                    { type: 'email', message: '请输入正确的邮箱地址' }
                  ]}
                >
                  <Input 
                    placeholder="请输入您的邮箱" 
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="company"
                  label="公司名称"
                >
                  <Input 
                    placeholder="请输入您的公司名称" 
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="留言内容"
                  rules={[{ required: true, message: '请输入留言内容' }]}
                >
                  <Input.TextArea 
                    rows={4} 
                    placeholder="请输入您的留言内容" 
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    className="w-full h-12 rounded-lg text-lg"
                  >
                    提交留言
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </motion.div>
        </div>

        {/* 地图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <GlobalOutlined className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">公司位置</h2>
                <p className="text-gray-600">欢迎来访参观交流</p>
              </div>
            </div>
            <div className="w-full h-[400px] bg-gray-50 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">地图区域</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactPage 