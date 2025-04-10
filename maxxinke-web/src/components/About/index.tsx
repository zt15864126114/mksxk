'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  EnvironmentOutlined,
  TeamOutlined,
  TrophyOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  GlobalOutlined,
  ExperimentOutlined,
  SettingOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import { useRef } from 'react'

const AboutPage = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const companyInfo = {
    name: '麦克斯鑫科（山东）新型材料科技有限公司',
    description: '专业从事水处理产品及水泥添加剂的研究、设计、生产、销售的高新技术企业',
    address: '山东省济南市高新区',
    employees: '100+',
    established: '2015年',
    vision: '致力于成为水处理行业的引领者，为环保事业贡献力量',
    mission: '通过持续创新和优质服务，为客户提供最佳的水处理解决方案'
  }

  const advantages = [
    {
      title: '研发实力',
      description: '拥有专业研发团队100余人，配备先进研发设备和实验室',
      icon: <ExperimentOutlined className="text-3xl" />,
      color: 'bg-purple-500',
      features: ['国家级实验室', '专业研发设备', '技术创新能力']
    },
    {
      title: '生产能力',
      description: '现代化生产基地，智能化生产线，严格质量管控',
      icon: <SettingOutlined className="text-3xl" />,
      color: 'bg-blue-500',
      features: ['智能生产线', '标准化工艺', '质量追溯系统']
    },
    {
      title: '服务体系',
      description: '完善的技术支持和售后服务体系，快速响应客户需求',
      icon: <ApartmentOutlined className="text-3xl" />,
      color: 'bg-green-500',
      features: ['24小时响应', '技术支持', '定制方案']
    }
  ]

  const certifications = [
    {
      title: '高新技术企业',
      icon: <SafetyCertificateOutlined className="text-3xl" />,
      color: 'bg-yellow-500',
      description: '国家认定的高新技术企业资质',
      year: '2020'
    },
    {
      title: 'ISO9001认证',
      icon: <CheckCircleOutlined className="text-3xl" />,
      color: 'bg-green-500',
      description: '国际质量管理体系认证',
      year: '2018'
    },
    {
      title: 'ISO14001认证',
      icon: <CheckCircleOutlined className="text-3xl" />,
      color: 'bg-blue-500',
      description: '环境管理体系认证',
      year: '2019'
    },
    {
      title: '质量管理体系认证',
      icon: <SafetyCertificateOutlined className="text-3xl" />,
      color: 'bg-indigo-500',
      description: '产品质量管理体系认证',
      year: '2018'
    }
  ]

  const values = [
    {
      title: '创新驱动',
      description: '持续创新，追求卓越，引领行业发展',
      icon: <BulbOutlined className="text-3xl" />,
      color: 'bg-blue-500'
    },
    {
      title: '专业专注',
      description: '专注水处理领域，提供专业解决方案',
      icon: <TrophyOutlined className="text-3xl" />,
      color: 'bg-green-500'
    },
    {
      title: '诚信合作',
      description: '诚信经营，合作共赢，共创价值',
      icon: <SafetyCertificateOutlined className="text-3xl" />,
      color: 'bg-yellow-500'
    },
    {
      title: '环保责任',
      description: '践行环保理念，履行社会责任',
      icon: <GlobalOutlined className="text-3xl" />,
      color: 'bg-indigo-500'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 py-24">
        <div className="absolute inset-0 bg-[url('/images/about-hero.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block px-6 py-2 bg-blue-500/30 backdrop-blur-sm text-blue-50 text-sm font-medium rounded-full border border-blue-400/30 shadow-lg mb-6">
              关于我们
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6"
                style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.5)' }}>
              专注水处理技术
              <br />
              引领行业发展
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl"
               style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {companyInfo.description}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vision & Mission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                  <RocketOutlined className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  公司愿景
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {companyInfo.vision}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                  <GlobalOutlined className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                  企业使命
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {companyInfo.mission}
              </p>
            </div>
          </motion.div>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              企业概况
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <EnvironmentOutlined className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">公司地址</h3>
                  <p className="text-gray-600">{companyInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <TeamOutlined className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">研发团队</h3>
                  <p className="text-gray-600">{companyInfo.employees}专业技术人员</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500 flex-shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                  <ClockCircleOutlined className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">成立时间</h3>
                  <p className="text-gray-600">成立于{companyInfo.established}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium mb-4">
              核心优势
            </span>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 bg-clip-text text-transparent">
              为什么选择我们
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              专业的技术，优质的产品，为您解决各类水处理难题
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 h-full hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${advantage.color} text-white flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                  <p className="text-gray-600 mb-4">{advantage.description}</p>
                  <ul className="space-y-2">
                    {advantage.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 group/item">
                        <ArrowRightOutlined className="text-green-500 mr-2 transform group-hover/item:translate-x-1 transition-transform" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium mb-4">
              资质认证
            </span>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 bg-clip-text text-transparent">
              专业资质认证
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              多项国家级认证，质量保证
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${cert.color} text-white flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 transition-transform duration-300`}>
                    {cert.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{cert.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{cert.description}</p>
                  <p className="text-blue-500 font-medium">{cert.year}年获得</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium mb-4">
              企业文化
            </span>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 bg-clip-text text-transparent">
              我们的价值观
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              以创新为驱动，以专业为基础，以诚信为准则
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 h-full hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${value.color} text-white flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage 