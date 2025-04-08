import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 这里添加实际的邮件发送逻辑
    // 可以使用 nodemailer 或其他邮件服务
    
    return NextResponse.json(
      { message: '留言已成功发送' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: '发送失败，请稍后重试' },
      { status: 500 }
    )
  }
} 