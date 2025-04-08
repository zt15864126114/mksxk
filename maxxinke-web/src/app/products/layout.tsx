export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题区域 */}
      <div className="relative py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              产品中心
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              我们提供全方位的水处理和水泥外加剂解决方案，致力于为客户创造更高的价值
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
} 