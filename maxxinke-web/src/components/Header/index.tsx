'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Drawer } from 'antd'
import { 
  MenuOutlined,
  SearchOutlined,
  CloseOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const HeaderComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = (value: string) => {
    if (!value.trim()) return
    // TODO: 实现搜索逻辑
    setSearchValue('')
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    {
      key: '/',
      label: '首页',
      link: '/'
    },
    {
      key: '/products',
      label: '产品中心',
      link: '/products'
    },
    {
      key: '/applications',
      label: '应用领域',
      link: '/applications'
    },
    {
      key: '/news',
      label: '新闻中心',
      link: '/news'
    },
    {
      key: '/about',
      label: '关于我们',
      link: '/about'
    },
    {
      key: '/contact',
      label: '联系我们',
      link: '/contact'
    },
  ]

  // 预加载所有页面
  useEffect(() => {
    menuItems.forEach(item => {
      router.prefetch(item.link)
    })
  }, [router])

  return (
    <header className={`fixed w-full top-0 z-50 transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" prefetch className="flex items-center">
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none mb-0.5">麦克斯鑫科</h1>
                <p className="text-xs text-gray-500">专业水处理解决方案</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.link}
                  prefetch
                  className={`
                    text-sm font-medium px-4 py-2 transition-colors
                    ${pathname === item.key ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative flex items-center">
                <Input
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="搜索产品..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-48 h-8 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors rounded-full"
                  onPressEnter={() => handleSearch(searchValue)}
                  variant="borderless"
                />
                {searchValue && (
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setSearchValue('')}
                    className="absolute right-0 text-gray-400 hover:text-gray-600"
                  />
                )}
              </div>
              <Button 
                type="primary" 
                className="h-8 px-4 bg-blue-500 hover:bg-blue-600 text-sm"
                onClick={() => router.push('/contact')}
              >
                立即咨询
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <div className="relative">
                <Input
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="搜索..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-32 h-8 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors rounded-full"
                  onPressEnter={() => handleSearch(searchValue)}
                  variant="borderless"
                />
                {searchValue && (
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setSearchValue('')}
                    className="absolute right-0 text-gray-400 hover:text-gray-600"
                  />
                )}
              </div>
              <Button
                type="text"
                icon={<MenuOutlined className="text-lg" />}
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center hover:bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">导航菜单</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:bg-gray-50"
            />
          </div>
        }
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={280}
        closable={false}
      >
        <div className="flex flex-col -mx-4">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.link}
              prefetch
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                px-4 py-3 text-left transition-colors w-full block
                ${pathname === item.key ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-4 px-4 py-4">
            <Link
              href="/contact"
              prefetch
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button 
                type="primary" 
                className="w-full h-9 bg-blue-500 hover:bg-blue-600"
              >
                立即咨询
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>
    </header>
  )
}

export default HeaderComponent