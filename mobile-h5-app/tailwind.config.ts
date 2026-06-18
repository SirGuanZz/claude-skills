/**
 * Tailwind 配置 — 设计 token 单一真相源
 * 依赖方:全部 .vue 文件、main.css base 层、vue-component-gen 读 brand 色阶
 * 修改注意:
 *   - 改 brand 色阶须替换占位玫红 #E11D48 为品牌真实色,并同步更新 README 与 main.css 引用
 *   - 加新断点须更新 mobile-container max-width(目前 750px PC 居中)
 *   - 字族变更须同步 index.html 的 Google Fonts link
 */
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      // 双字族:正文 Inter,标题 Space Grotesk;系统字体兜底
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      // 占位 brand: rose 玫红色阶,后续按品牌替换
      colors: {
        brand: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
      },
      backgroundImage: {
        // 渐变光斑:落地"禁纯白铺底"纪律,根容器读这个 utility
        'hero-gradient':
          'radial-gradient(at 18% 0%, rgba(225,29,72,0.16), transparent 50%), radial-gradient(at 82% 100%, rgba(244,114,182,0.14), transparent 50%)',
      },
      boxShadow: {
        // 移动卡片专用阴影,比默认 lg 更软一些
        card: '0 12px 32px -12px rgba(15, 23, 42, 0.18)',
      },
      // 顶部安全区(notch 机型),layout 内引用
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
} satisfies Config
