'use client'

import { motion } from 'framer-motion'
import { CheckCircleOutlined } from '@ant-design/icons'

const WaterTreatmentPage = () => {
  const products = [
    {
      title: '絮凝剂',
      description: '高效絮凝，快速沉降，适用于各类工业废水处理',
      features: [
        '快速沉降效果',
        '低残留，环保安全',
        '使用方便，成本低',
        '适用范围广泛'
      ],
      image: 'https://images.unsplash.com/photo-1535951412925-d7130b48f778?w=800&h=600&fit=crop'
    },
    {
      title: '助滤剂',
      description: '提高过滤效率，延长滤芯使用寿命',
      features: [
        '高效过滤性能',
        '延长滤芯寿命',
        '节约运营成本',
        '适用多种滤材'
      ],
      image: 'https://images.unsplash.com/photo-1606858374351-beb22b1bef59?w=800&h=600&fit=crop'
    },
    {
      title: 'COD去除剂',
      description: '高效去除水中COD，提高出水水质',
      features: [
        'COD去除率高',
        '适用范围广泛',
        '环保无二次污染',
        '使用成本经济'
      ],
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="relative py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              水处理产品解决方案
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              我们提供全方位的水处理产品，从絮凝剂到助滤剂，从COD去除到水质改善，
              为您的水处理需求提供专业可靠的解决方案。
            </p>
          </motion.div>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {product.description}
                    </p>
                    <ul className="space-y-3">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <CheckCircleOutlined className="text-blue-500 mr-3" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterTreatmentPage 