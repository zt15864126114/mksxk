'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Drawer, AutoComplete } from 'antd'
import { 
  MenuOutlined,
  SearchOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const HeaderComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()

  // 从 localStorage 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const handleSearch = (value: string) => {
    if (!value.trim()) return
    // 保存搜索历史
    const newHistory = [value, ...searchHistory.filter(item => item !== value)].slice(0, 5)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
    // TODO: 实现搜索逻辑
    setSearchValue('')
  }

  // 模拟搜索建议
  useEffect(() => {
    if (searchValue.trim()) {
      // 这里可以替换为实际的API调用
      const suggestions = ['水处理设备', '水泥外加剂', '水处理药剂'].filter(
        item => item.includes(searchValue)
      )
      setSearchSuggestions(suggestions)
    } else {
      setSearchSuggestions([])
    }
  }, [searchValue])

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
    const prefetchPages = async () => {
      for (const item of menuItems) {
        try {
          await router.prefetch(item.link)
        } catch (error) {
          console.error(`Failed to prefetch ${item.link}:`, error)
        }
      }
    }
    prefetchPages()
  }, [router])

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md backdrop-blur-md bg-white/90' : 'bg-white'}`}>
      <div className="w-full">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" prefetch className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-1"
              >
                <h1 className="text-xl font-bold text-gray-900 leading-none mb-1 tracking-tight group-hover:text-blue-600 transition-colors">
                  麦克斯鑫科
                </h1>
                <p className="text-sm text-gray-500 tracking-wide">专业水处理解决方案</p>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.link}
                  prefetch
                  className="relative group px-5 py-2"
                >
                  <span className={`
                    text-[15px] font-medium transition-colors relative tracking-wide
                    ${pathname === item.key ? 'text-blue-600 font-semibold' : 'text-gray-700 group-hover:text-blue-600'}
                  `}>
                    {item.label}
                    <span className={`
                      absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform origin-left rounded-full
                      transition-transform duration-300 ease-out
                      ${pathname === item.key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `} />
                  </span>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="relative">
                <AutoComplete
                  value={searchValue}
                  onChange={value => setSearchValue(value)}
                  onSelect={value => handleSearch(value)}
                  options={[
                    ...searchSuggestions.map(item => ({ value: item, label: item })),
                    ...searchHistory.map(item => ({
                      value: item,
                      label: (
                        <div className="flex items-center py-1">
                          <HistoryOutlined className="mr-2 text-gray-400" />
                          <span className="text-sm">{item}</span>
                        </div>
                      )
                    }))
                  ]}
                  placeholder="搜索产品..."
                  dropdownClassName="rounded-xl shadow-lg"
                >
                  <Input
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="w-56 h-9 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors rounded-full text-sm"
                    onPressEnter={(e) => handleSearch(searchValue)}
                  />
                </AutoComplete>
                {searchValue && (
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setSearchValue('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  />
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary" 
                  className="h-9 px-6 bg-blue-500 hover:bg-blue-600 text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all rounded-full"
                  onClick={() => router.push('/contact')}
                >
                  立即咨询
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <div className="relative">
                <Input
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="搜索..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-36 h-9 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors rounded-full text-sm"
                  onPressEnter={() => handleSearch(searchValue)}
                  variant="borderless"
                />
                {searchValue && (
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setSearchValue('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  />
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="text"
                  icon={<MenuOutlined className="text-xl" />}
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex items-center justify-center w-9 h-9 hover:bg-gray-50 text-gray-700 rounded-full"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Drawer
            title={
              <div className="flex items-center justify-between py-1">
                <span className="text-lg font-medium tracking-wide">导航菜单</span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    type="text"
                    icon={<CloseOutlined className="text-lg" />}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-9 h-9 hover:bg-gray-50 rounded-full"
                  />
                </motion.div>
              </div>
            }
            placement="right"
            onClose={() => setIsMobileMenuOpen(false)}
            open={isMobileMenuOpen}
            width={300}
            closable={false}
            className="rounded-l-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col -mx-4"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.link}
                    prefetch
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      px-6 py-4 text-left transition-all duration-300 w-full block relative overflow-hidden
                      ${pathname === item.key ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <span className="relative z-10 text-[15px] tracking-wide">{item.label}</span>
                    {pathname === item.key && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-blue-50"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-gray-100 mt-4 px-6 py-6">
                <Link
                  href="/contact"
                  prefetch
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="primary" 
                      className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all rounded-full"
                    >
                      立即咨询
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </Drawer>
        )}
      </AnimatePresence>
    </header>
  )
}

export default HeaderComponent