'use client'

import { Card, Row, Col, Descriptions } from 'antd'
import { motion } from 'framer-motion'
import { 
  ToolOutlined, 
  SafetyCertificateOutlined,
  TeamOutlined,
  BulbOutlined
} from '@ant-design/icons'

const ConcretePage = () => {
  const products = [
    {
      title: '减水剂',
      description: '高效减水剂，提高混凝土性能',
      features: [
        '减水率高',
        '改善混凝土和易性',
        '提高混凝土强度',
      ],
    },
    {
      title: '抑尘剂',
      description: '有效抑制粉尘，改善施工环境',
      features: [
        '抑尘效果好',
        '使用方便',
        '环保安全',
      ],
    },
  ]

  const advantages = [
    {
      icon: <ToolOutlined className="text-4xl" />,
      title: '专业研发',
      description: '拥有专业的研发团队，持续创新',
    },
    {
      icon: <SafetyCertificateOutlined className="text-4xl" />,
      title: '质量保证',
      description: '严格的质量控制体系，确保产品质量',
    },
    {
      icon: <TeamOutlined className="text-4xl" />,
      title: '技术服务',
      description: '提供专业的技术支持和解决方案',
    },
    {
      icon: <BulbOutlined className="text-4xl" />,
      title: '创新应用',
      description: '不断探索新的应用领域和技术',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">水泥外加剂</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">产品系列</h2>
        <Row gutter={[24, 24]}>
          {products.map((product, index) => (
            <Col xs={24} sm={12} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  className="h-full"
                >
                  <Card.Meta
                    title={product.title}
                    description={product.description}
                  />
                  <div className="mt-4">
                    <Descriptions column={1}>
                      {product.features.map((feature, i) => (
                        <Descriptions.Item key={i}>{feature}</Descriptions.Item>
                      ))}
                    </Descriptions>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">产品优势</h2>
        <Row gutter={[24, 24]}>
          {advantages.map((advantage, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4">{advantage.icon}</div>
                <h3 className="text-xl font-bold mb-2">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default ConcretePage 