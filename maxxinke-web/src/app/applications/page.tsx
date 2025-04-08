'use client'

import { motion } from 'framer-motion'
import { 
  EnvironmentOutlined,
  HomeOutlined,
  ForkOutlined,
  ExperimentOutlined,
  TeamOutlined,
  BulbOutlined,
  CustomerServiceOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'

const ApplicationsPage = () => {
  const applications = [
    {
      title: '污水处理',
      description: '为各类污水处理厂提供专业解决方案',
      icon: <EnvironmentOutlined className="text-3xl" />,
      bgImage: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=800&h=600&fit=crop',
      features: [
        '工业废水处理',
        '生活污水处理',
        '污泥处理',
        '中水回用',
        '水质提升',
      ],
      details: '采用先进工艺，确保出水达标，实现污水的资源化利用'
    },
    {
      title: '城镇供水',
      description: '提供安全、可靠的供水解决方案',
      icon: <HomeOutlined className="text-3xl" />,
      bgImage: 'https://images.unsplash.com/photo-1584824388174-7c69a307f710?w=800&h=600&fit=crop',
      features: [
        '饮用水处理',
        '管网水质保障',
        '二次供水处理',
        '水质监测',
        '智能化管理',
      ],
      details: '保障供水安全，提供全程水质保障系统'
    },
    {
      title: '环保行业',
      description: '为环保工程提供专业支持',
      icon: <EnvironmentOutlined className="text-3xl" />,
      bgImage: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=600&fit=crop',
      features: [
        '环境治理',
        '生态修复',
        '污染控制',
        '环境监测',
        '生态保护',
      ],
      details: '致力于环境保护，提供全面的环保解决方案'
    },
    {
      title: '工业应用',
      description: '为各类工业企业提供水处理解决方案',
      icon: <ForkOutlined className="text-3xl" />,
      bgImage: 'https://images.unsplash.com/photo-1565715101841-4e50c7eac76c?w=800&h=600&fit=crop',
      features: [
        '电力行业',
        '石油化工',
        '纺织印染',
        '造纸行业',
        '冶金行业',
      ],
      details: '针对不同行业特点，提供定制化解决方案'
    },
  ]

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
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              应用领域
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              我们的产品和技术广泛应用于污水处理、城镇供水、环保工程等多个领域，
              为客户提供全面的解决方案
            </p>
          </motion.div>
        </div>
      </div>

      {/* 应用领域列表 */}
      <div className="container mx-auto px-6 py-16">
        <div className="space-y-12">
          {applications.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* 图片区域 */}
                  <div className="lg:w-1/3 relative overflow-hidden">
                    <div className="aspect-w-4 aspect-h-3 lg:aspect-none lg:h-full">
                      <img
                        src={app.bgImage}
                        alt={app.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r" />
                    <div className="absolute bottom-4 left-4 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-blue-600">
                        {app.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{app.title}</h3>
                    </div>
                  </div>

                  {/* 内容区域 */}
                  <div className="lg:w-2/3 p-6 lg:p-8">
                    <p className="text-gray-600 mb-6">{app.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {app.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{app.details}</p>
                      <ArrowRightOutlined className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ApplicationsPage 