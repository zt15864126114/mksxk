'use client'

import { useEffect, useState } from 'react'
import { Spin, Descriptions, message, Button } from 'antd'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { API_ENDPOINTS } from '@/config/api'

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
  create_time: string
  update_time: string
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.products.detail(params.id))
        const data = await response.json()
        
        if (data.code === 200) {
          setProduct(data.data)
        } else {
          message.error(data.message || '获取产品详情失败')
        }
      } catch (error) {
        message.error('获取产品详情失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const getImageUrl = (image: string) => {
    if (!image) return '/images/products/default.jpg'
    return `${API_ENDPOINTS.baseUrl}${image}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">产品不存在</h1>
        <Link href="/products">
          <Button type="primary">返回产品列表</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="mb-8">
        <Link 
          href="/products" 
          className="inline-flex items-center text-blue-500 hover:text-blue-600"
        >
          <ArrowLeftOutlined className="mr-2" />
          返回产品列表
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* 产品图片 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-xl overflow-hidden"
          >
            <Image
              src={getImageUrl(product.image)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>

          {/* 产品信息 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6">
              <div className="text-sm text-blue-500 font-medium mb-2">
                {product.category}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <Descriptions
              title="产品规格"
              bordered
              column={1}
              className="mb-6"
              labelStyle={{ width: '120px', fontWeight: 500 }}
            >
              {product.specification.split('\n').map((spec, index) => {
                const [label, value] = spec.split(':')
                return (
                  <Descriptions.Item key={index} label={label}>
                    {value}
                  </Descriptions.Item>
                )
              })}
            </Descriptions>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">应用领域</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600 whitespace-pre-line">
                  {product.application}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/contact">
                <Button type="primary" size="large" className="h-12 px-8">
                  立即咨询
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 