import type { Metadata } from "next";
import "./globals.css";
import "@/components/fonts.css";

export const metadata: Metadata = {
  title: {
    default: '一念间 · 八字精批',
    template: '%s | 一念间',
  },
  description: '心诚则灵。为家人点一盏祈福灯，求一支关帝灵签，看一卦命理八字。',
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "一念间" },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/favicon.svg',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#1a1410" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="一念间" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Hydrate lang attribute from localStorage on client */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var l=localStorage.getItem('yinianjian_lang');if(l&&(l==='en'||l==='zh-CN'))document.documentElement.lang=l==='zh-CN'?'zh-CN':'en'}catch(e){}})()` }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
