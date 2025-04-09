'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { message } from 'antd'
import { API_ENDPOINTS } from '@/config/api'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  category: string
  description: string
  specification: string
  application: string
  image: string
  sort: number
  status: number
}

const HomePage = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  const carouselItems = [
    {
      image: '/images/carousel/banner-water-tech.jpg',
      title: '专业水处理解决方案',
      description: '致力于为客户提供高效、环保的水处理技术和产品',
      link: '/products',
      badge: '创新科技'
    },
    {
      image: '/images/carousel/banner-laboratory.jpg',
      title: '创新技术研发',
      description: '持续创新，引领行业发展',
      link: '/about',
      badge: '研发实力'
    },
    {
      image: '/images/carousel/new-town-water-supply.jpg',
      title: '优质工程案例',
      description: '服务多家企业，打造精品工程',
      link: '/applications',
      badge: '工程案例'
    }
  ]

  const products = [
    {
      title: '絮凝剂',
      description: '高效絮凝，快速沉降',
      features: ['快速沉降', '低残留', '使用方便'],
      image: 'https://images.unsplash.com/photo-1535951412925-d7130b48f778?w=600&h=400&fit=crop',
      link: '/products/water-treatment'
    },
    {
      title: '助滤剂',
      description: '提高过滤效率',
      features: ['高效过滤', '延长滤芯寿命', '节约成本'],
      image: 'https://images.unsplash.com/photo-1606858374351-beb22b1bef59?w=600&h=400&fit=crop',
      link: '/products/water-treatment'
    },
    {
      title: 'COD去除剂',
      description: '有效降低COD含量',
      features: ['去除率高', '适用范围广', '环保无害'],
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop',
      link: '/products/water-treatment'
    },
    {
      title: '水泥添加剂',
      description: '改善水泥性能',
      features: ['增强强度', '改善和易性', '缩短凝固时间'],
      image: 'https://images.unsplash.com/photo-1590372648787-e9b4228c9e70?w=600&h=400&fit=crop',
      link: '/products/concrete'
    }
  ]

  const advantages = [
    {
      title: '技术领先',
      description: '拥有多项自主知识产权，持续创新研发',
      details: [
        '国家高新技术企业',
        '自主研发实验室',
        '专业技术团队',
        '行业领先技术'
      ]
    },
    {
      title: '品质保证',
      description: '严格的质量管理体系，保证产品品质',
      details: [
        'ISO9001认证',
        '全程质量监控',
        '原料严格筛选',
        '性能稳定可靠'
      ]
    },
    {
      title: '服务完善',
      description: '专业的技术支持，完善的服务体系',
      details: [
        '24小时技术支持',
        '定期回访跟踪',
        '及时解决问题',
        '培训指导服务'
      ]
    }
  ]

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.products.list}?pageSize=4&sort=1`)
        const data = await response.json()
        
        if (data.code === 200) {
          setFeaturedProducts(data.data.list)
        }
      } catch (error) {
        console.error('获取推荐产品失败:', error)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* 轮播图部分 */}
      <div className="relative -mt-[80px] overflow-hidden">
        <div className="relative h-[100vh]">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] ease-out"
                  style={{ 
                    backgroundImage: `url(${item.image})`,
                    transform: `scale(${index === activeSlide ? 1.08 : 1})`,
                    transition: 'transform 6000ms ease-out'
                  }}
                />
                {/* 渐变遮罩 - 多层渐变提供更好的覆盖 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
                
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6">
                    <div 
                      className={`max-w-2xl transition-all duration-1000 transform ${
                        index === activeSlide 
                          ? 'translate-y-0 opacity-100' 
                          : 'translate-y-8 opacity-0'
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: activeSlide === index ? 1 : 0, y: activeSlide === index ? 0 : 20 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                      >
                        <span className="inline-block px-6 py-2 bg-blue-500/30 backdrop-blur-sm text-blue-50 text-sm font-medium rounded-full border border-blue-400/30 shadow-lg">
                          {item.badge}
                        </span>
                      </motion.div>
                      
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: activeSlide === index ? 1 : 0, y: activeSlide === index ? 0 : 20 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
                        style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.5)' }}
                      >
                        {item.title}
                      </motion.h1>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: activeSlide === index ? 1 : 0, y: activeSlide === index ? 0 : 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-white mb-12 max-w-xl leading-relaxed"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                      >
                        {item.description}
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: activeSlide === index ? 1 : 0, y: activeSlide === index ? 0 : 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap gap-6"
                      >
                        <button
                          onClick={() => router.push(item.link)}
                          className="inline-flex items-center px-10 py-5 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg transition-all transform hover:translate-y-[-2px] hover:shadow-xl shadow-lg"
                        >
                          了解更多 <ArrowRightOutlined className="ml-2" />
                        </button>
                        <button
                          onClick={() => router.push('/contact')}
                          className="inline-flex items-center px-10 py-5 bg-white/20 hover:bg-white/30 text-white text-lg backdrop-blur-sm rounded-lg transition-all transform hover:translate-y-[-2px] hover:shadow-xl shadow-lg"
                        >
                          立即咨询 <ArrowRightOutlined className="ml-2" />
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 轮播指示器 */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`
                  h-2 rounded-full transition-all duration-300 
                  ${index === activeSlide 
                    ? 'w-10 bg-blue-500' 
                    : 'w-2 bg-white/50 hover:bg-white/70'
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block z-20">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2 bg-black/20 backdrop-blur-sm">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 产品展示 */}
      <div className="relative py-32">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute right-0 w-1/3 h-1/2 bg-blue-50/50 blur-3xl" />
        
        <div className="container relative mx-auto px-6">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium mb-4">
                产品中心
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 bg-clip-text text-transparent">
                为您提供全方位的水处理解决方案
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                专业的技术，优质的产品，为您解决各类水处理难题
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/products/${product.id}`}>
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    {product.image && (
                      <div className="relative w-12 h-12 mb-4">
                        <Image
                          src={`${API_ENDPOINTS.baseUrl}${product.image}`}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.description}
                    </p>
                    <ul className="space-y-2">
                      {product.specification.split('\n').slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <svg
                            className="w-4 h-4 text-blue-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature.split(':')[0]}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <span className="text-blue-600 hover:text-blue-700 inline-flex items-center">
                        了解更多
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看更多产品
            </Link>
          </div>
        </div>
      </div>

      {/* 公司优势 */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">为什么选择我们</h2>
              <p className="text-gray-600">专业的技术团队，优质的产品质量，完善的服务体系</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                <ul className="space-y-3">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircleOutlined className="text-blue-500 mr-2" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 数据统计 */}
      <StatsSection />
    </div>
  )
}

const StatsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  const stats = [
    {
      number: 15,
      suffix: '+',
      label: '年行业经验',
      delay: 0
    },
    {
      number: 100,
      suffix: '+',
      label: '服务客户',
      delay: 0.2
    },
    {
      number: 20,
      suffix: '+',
      label: '技术专利',
      delay: 0.4
    },
    {
      number: 24,
      suffix: 'h',
      label: '技术支持',
      delay: 0.6
    }
  ]

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-blue-400">
        {/* 主背景 */}
        <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-xl" />
        
        {/* 动态光斑效果 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[100px] mix-blend-soft-light" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] mix-blend-soft-light" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] bg-blue-200/20 rounded-full blur-[100px] mix-blend-soft-light" />
        </div>
        
        {/* 动态波浪效果 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat-x animate-wave mix-blend-overlay" />
          <div 
            className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat-x animate-wave-slow mix-blend-overlay opacity-50" 
            style={{ animationDelay: '-2s' }} 
          />
        </div>

        {/* 内容区域 */}
        <div className="relative py-16 px-8">
          <div
            ref={ref}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: stat.delay }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] to-white/[0.05] rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-500" />
                <div className="relative backdrop-blur-sm bg-white/10 rounded-2xl p-5 md:p-6 border border-white/10 transform hover:translate-y-[-2px] transition-all duration-300">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 flex justify-center items-baseline text-white">
                    {inView && (
                      <CountUp
                        start={0}
                        end={stat.number}
                        duration={2}
                        separator=","
                      />
                    )}
                    <span className="ml-1">{stat.suffix}</span>
                  </div>
                  <div className="text-sm md:text-base lg:text-lg text-blue-50/90">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 