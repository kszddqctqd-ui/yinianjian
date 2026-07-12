'use client';

import { useState } from 'react';

export default function PassiveIncomePage() {
  const [activeTab, setActiveTab] = useState<'tools' | 'course' | 'community'>('tools');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            跨境电商自动化方案
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            用 Python + AI 自动化你的跨境电商业务
          </p>
          <p className="text-lg text-gray-400 mb-8">
            从选品、翻译、发帖到发货，全流程自动化。每天只需30分钟。
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://gumroad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              查看工具套装 →
            </a>
            <a
              href="#features"
              className="px-8 py-3 border border-gray-600 rounded-lg font-semibold hover:border-gray-400 transition-all"
            >
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400">29,760+</div>
            <div className="text-sm text-gray-400 mt-1">已自动化商品</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">100%</div>
            <div className="text-sm text-gray-400 mt-1">自动化程度</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-400">30min</div>
            <div className="text-sm text-gray-400 mt-1">每日耗时</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">0</div>
            <div className="text-sm text-gray-400 mt-1">需要英语能力</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-3">批量图片采集</h3>
              <p className="text-gray-400 mb-4">
                自动从微购相册/1688/拼多多等平台采集商品图片，智能过滤UI元素，只保留商品图。
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>✅ CDP协议连接浏览器</li>
                <li>✅ 自动翻页采集</li>
                <li>✅ 支持多平台扩展</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI 文案翻译</h3>
              <p className="text-gray-400 mb-4">
                一键将中文商品描述翻译为英文，自动生成3种风格的社媒文案和热门标签。
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>✅ GPT-4o-mini 驱动</li>
                <li>✅ 3种文案风格</li>
                <li>✅ 自动 Hashtags</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-all">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-3">社媒自动发布</h3>
              <p className="text-gray-400 mb-4">
                自动将商品信息发布到 Facebook/Instagram/TikTok，控制频率避免封号。
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>✅ Facebook Graph API</li>
                <li>✅ 智能频率控制</li>
                <li>✅ 发布状态追踪</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">产品价格</h2>
          <p className="text-center text-gray-400 mb-12">选择适合你的方案</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-2">基础版</h3>
              <div className="text-3xl font-bold text-blue-400 mb-4">$9.9</div>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li>✅ 文案翻译工具</li>
                <li>✅ Prompt 模板库</li>
                <li>✅ 使用文档</li>
                <li>❌ GUI 界面</li>
                <li>❌ 多平台支持</li>
              </ul>
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                立即购买
              </a>
            </div>

            {/* Pro - Featured */}
            <div className="bg-gradient-to-b from-blue-500/10 to-purple-500/10 backdrop-blur rounded-xl p-6 border border-purple-500/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 rounded-full text-xs font-bold">
                最受欢迎
              </div>
              <h3 className="text-lg font-bold mb-2">专业版</h3>
              <div className="text-3xl font-bold text-purple-400 mb-4">$29.9</div>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li>✅ 文案翻译工具</li>
                <li>✅ 图片采集器 Pro</li>
                <li>✅ GUI 界面</li>
                <li>✅ 多平台支持</li>
                <li>✅ Notion 模板</li>
                <li>✅ 视频教程</li>
              </ul>
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold"
              >
                立即购买
              </a>
            </div>

            {/* Bundle */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-2">全套方案</h3>
              <div className="text-3xl font-bold text-pink-400 mb-4">$49.9</div>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li>✅ 全部工具</li>
                <li>✅ 自动发帖脚本</li>
                <li>✅ Notion 模板</li>
                <li>✅ 视频教程全集</li>
                <li>✅ 社群资格</li>
                <li>✅ 终身更新</li>
              </ul>
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-all"
              >
                立即购买
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">常见问题</h2>

          <div className="space-y-4">
            <details className="bg-white/5 rounded-lg border border-white/10">
              <summary className="px-6 py-4 cursor-pointer font-semibold hover:text-blue-400 transition-colors">
                需要编程基础吗？
              </summary>
              <div className="px-6 pb-4 text-gray-400">
                基础版不需要。我们提供了预编译的 exe 文件和详细的视频教程，跟着做就行。
              </div>
            </details>

            <details className="bg-white/5 rounded-lg border border-white/10">
              <summary className="px-6 py-4 cursor-pointer font-semibold hover:text-blue-400 transition-colors">
                需要英语能力吗？
              </summary>
              <div className="px-6 pb-4 text-gray-400">
                完全不需要。工具会自动将中文翻译为英文，并生成适合海外社媒的文案。
              </div>
            </details>

            <details className="bg-white/5 rounded-lg border border-white/10">
              <summary className="px-6 py-4 cursor-pointer font-semibold hover:text-blue-400 transition-colors">
                每天需要花多少时间？
              </summary>
              <div className="px-6 pb-4 text-gray-400">
                设置完成后，每天只需30分钟查看发布状态和处理异常情况。其余全部自动化。
              </div>
            </details>

            <details className="bg-white/5 rounded-lg border border-white/10">
              <summary className="px-6 py-4 cursor-pointer font-semibold hover:text-blue-400 transition-colors">
                支持哪些电商平台？
              </summary>
              <div className="px-6 pb-4 text-gray-400">
                目前已支持微购相册、1688。拼多多、淘宝、Shopify 正在开发中。
              </div>
            </details>

            <details className="bg-white/5 rounded-lg border border-white/10">
              <summary className="px-6 py-4 cursor-pointer font-semibold hover:text-blue-400 transition-colors">
                有退款保证吗？
              </summary>
              <div className="px-6 pb-4 text-gray-400">
                通过 Gumroad 购买享受7天无理由退款。如果工具不能帮你节省时间，全额退款。
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">准备好自动化你的跨境电商了吗？</h2>
          <p className="text-gray-400 mb-8">
            加入已经在使用这套方案的跨境电商卖家，让工具替你工作。
          </p>
          <a
            href="https://gumroad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            立即开始 →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© 2026 跨境电商自动化方案 · 由一念间团队打造</p>
        <p className="mt-2">
          <a href="/privacy/" className="hover:text-gray-300">隐私政策</a> ·{' '}
          <a href="/terms/" className="hover:text-gray-300">服务条款</a>
        </p>
      </footer>
    </div>
  );
}
