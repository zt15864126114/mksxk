'use client'

import { useState, useEffect } from 'react'
import { Card, Row, Col, Pagination, Tag, Button, Input, message } from 'antd'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  CalendarOutlined,
  TagOutlined,
  RightOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Search } = Input

interface NewsItem {
  id: number
  title: string
  content?: string
  image?: string
  type: string
  status: number
  create_time: string
  update_time: string
  views?: number
}

const NewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [total, setTotal] = useState(0)
  const pageSize = 6

  const newsCategories = [
    { id: 1, name: '公司动态', type: '公司动态', color: 'blue' },
    { id: 2, name: '行业新闻', type: '行业新闻', color: 'green' },
    { id: 3, name: '技术文章', type: '技术文章', color: 'orange' },
  ]

  const fetchNews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      })

      if (selectedCategory) {
        params.append('type', newsCategories.find(c => c.name === selectedCategory)?.type || '')
      }

      if (keyword) {
        params.append('keyword', keyword)
      }

      const response = await fetch(`/api/news?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!")
      }

      const data = await response.json()

      if (data.code === 200) {
        setNewsList(data.data.list)
        setTotal(data.data.total)
      } else {
        throw new Error(data.message || '获取新闻列表失败')
      }
    } catch (error) {
      console.error('Fetch news error:', error)
      if (error instanceof TypeError && error.message.includes('JSON')) {
        message.error('服务器响应格式错误，请稍后重试')
      } else if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('获取新闻列表失败，请稍后重试')
      }
      setNewsList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      if (mounted) {
        await fetchNews()
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [currentPage, selectedCategory, keyword])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setKeyword(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-24">
        <div className="absolute inset-0 bg-[url('/images/news-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              新闻中心
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              了解麦克斯鑫科最新动态、行业资讯及技术创新
            </p>
            <Search
              placeholder="搜索新闻..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              className="max-w-xl w-full"
              onSearch={handleSearch}
            />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {newsCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tag
                  color={selectedCategory === category.name ? category.color : 'default'}
                  className={`text-lg px-6 py-2 cursor-pointer transition-all duration-300 ${
                    selectedCategory === category.name ? 'shadow-md' : ''
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <TagOutlined className="mr-2" />
                  {category.name}
                </Tag>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* News List */}
        <Row gutter={[24, 24]}>
          {newsList.map((news, index) => (
            <Col xs={24} sm={12} lg={8} key={news.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card
                  hoverable
                  loading={loading}
                  className="h-full overflow-hidden group"
                  cover={
                    <div className="h-48 overflow-hidden">
                      <div className="relative h-full w-full transform group-hover:scale-110 transition-transform duration-500">
                        <img
                          src={news.image ? `${process.env.NEXT_PUBLIC_API_URL}${news.image}` : '/images/news-placeholder.jpg'}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <Tag color={newsCategories.find(c => c.type === news.type)?.color}>
                      {newsCategories.find(c => c.type === news.type)?.name}
                    </Tag>
                    {news.views && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <EyeOutlined className="mr-1" />
                        {news.views}
                      </div>
                    )}
                  </div>
                  <Link href={`/news/${news.id}`} className="block group">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </Link>
                  <div className="text-gray-500 mb-3 flex items-center text-sm">
                    <CalendarOutlined className="mr-2" />
                    {dayjs(news.create_time).format('YYYY-MM-DD')}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {news.content}
                  </p>
                  <Link href={`/news/${news.id}`}>
                    <Button 
                      type="primary" 
                      ghost
                      className="group/btn hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                    >
                      阅读更多
                      <RightOutlined className="ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {!loading && newsList.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">暂无相关新闻</p>
          </div>
        )}

        {/* Pagination */}
        {total > pageSize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default NewsPage 