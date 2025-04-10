import Link from 'next/link'
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">麦克斯鑫科</h3>
            <p className="text-gray-400">
              专业从事水处理产品和水泥外加剂的研发、设计、生产与销售
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  产品中心
                </Link>
              </li>
              <li>
                <Link href="/applications" className="text-gray-400 hover:text-white">
                  应用领域
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <PhoneOutlined className="mr-2" />
                <span>联系电话</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MailOutlined className="mr-2" />
                <span>电子邮箱</span>
              </li>
              <li className="flex items-center text-gray-400">
                <EnvironmentOutlined className="mr-2" />
                <span>公司地址</span>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xl font-bold mb-4">产品中心</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  水处理产品
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} 麦克斯鑫科（山东）新型材料科技有限公司. 版权所有</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 