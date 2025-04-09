'use client'

import { Card, Tag, Button } from 'antd'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  CalendarOutlined,
  TagOutlined,
  LeftOutlined
} from '@ant-design/icons'

const NewsDetailPage = ({ params }: { params: { id: string } }) => {
  // 模拟新闻数据
  const news = {
    id: 1,
    title: '麦克斯鑫科成功研发新型水处理材料',
    date: '2024-03-15',
    category: '公司动态',
    content: `
      <p>近日，麦克斯鑫科（山东）新型材料科技有限公司研发团队成功开发出新型高效水处理材料，该材料在污水处理领域具有显著效果。</p>
      
      <h2>研发背景</h2>
      <p>随着环保要求的不断提高，传统水处理材料已难以满足日益严格的排放标准。为此，我公司投入大量研发资源，致力于开发新型高效水处理材料。</p>
      
      <h2>技术特点</h2>
      <p>新型水处理材料具有以下特点：</p>
      <ul>
        <li>处理效率高：比传统材料提高30%以上</li>
        <li>适用范围广：可用于多种工业废水处理</li>
        <li>使用成本低：用量少，效果显著</li>
        <li>环保性能好：无毒无害，可生物降解</li>
      </ul>
      
      <h2>应用效果</h2>
      <p>在多个工业废水处理项目中，新型材料表现出色：</p>
      <ul>
        <li>COD去除率提高至95%以上</li>
        <li>氨氮去除率提高至90%以上</li>
        <li>总磷去除率提高至85%以上</li>
      </ul>
      
      <h2>未来展望</h2>
      <p>公司将继续加大研发投入，不断优化产品性能，为水处理行业提供更多优质解决方案。</p>
    `,
    image: '/images/news/news1.jpg',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/news">
          <Button type="link" className="mb-4 p-0">
            <LeftOutlined /> 返回新闻列表
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <div className="mb-4">
              <Tag color="blue">
                <TagOutlined className="mr-2" />
                {news.category}
              </Tag>
            </div>
            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
            <div className="text-gray-500 mb-6">
              <CalendarOutlined className="mr-2" />
              {news.date}
            </div>
            <div className="mb-6">
              <img
                src={news.image ? `${process.env.NEXT_PUBLIC_API_URL}${news.image}` : '/images/news-placeholder.jpg'}
                alt={news.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default NewsDetailPage 