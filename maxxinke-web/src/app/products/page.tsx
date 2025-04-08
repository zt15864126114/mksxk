'use client'

import { Pagination, Spin, message } from 'antd'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ExperimentOutlined, ToolOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
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

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const pageSize = 6

  const fetchProducts = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.products.list}?page=${page}&pageSize=${pageSize}`)
      const data = await response.json()
      
      if (data.code === 200) {
        setProducts(data.data.list)
        setTotal(data.data.total)
      } else {
        message.error(data.message || '获取产品列表失败')
      }
    } catch (error) {
      message.error('获取产品列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getProductIcon = (category: string) => {
    return category.includes('水处理') ? (
      <ExperimentOutlined className="text-3xl" />
    ) : (
      <ToolOutlined className="text-3xl" />
    )
  }

  const getImageUrl = (image: string) => {
    if (!image) return '/images/products/default.jpg'
    return `${API_ENDPOINTS.baseUrl}${image}`
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.id}`} className="block group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        {getProductIcon(product.category)}
                      </div>
                      <div>
                        <div className="text-sm text-blue-500 font-medium mb-1">
                          {product.category}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {product.specification.split('\n').slice(0, 4).map((spec, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-sm text-gray-600">{spec.split(':')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* 分页 */}
      {!loading && total > 0 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={total}
            pageSize={pageSize}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  )
} 