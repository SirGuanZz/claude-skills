<!--
 * 首页 — 新闻方向样板:置顶头条大卡 + 资讯列表
 * 调用 main 域名 news/feed,接口未接通时展示静态 demo 数据
 * 修改注意:换方向(改 biz.ts type)时整页可替换
-->
<template>
  <view class="page">
    <!-- 顶部渐变背景 + 站点头 -->
    <view class="hero">
      <view class="hero-blob hero-blob-1"></view>
      <view class="hero-blob hero-blob-2"></view>
      <view class="hero-inner">
        <text class="brand">{{ brandLabel }}</text>
        <text class="tagline">每天三分钟,看懂世界</text>
        <view class="search">
          <text class="search-icon">⌕</text>
          <text class="search-ph">搜索资讯、话题、作者</text>
        </view>
      </view>
    </view>

    <!-- 头条大卡 -->
    <view class="section">
      <view class="section-head">
        <text class="dot"></text>
        <text class="section-title">今日头条</text>
      </view>
      <view class="hero-card" hover-class="card-active">
        <image class="hero-cover" :src="topNews.cover" mode="aspectFill" />
        <view class="hero-mask"></view>
        <view class="hero-card-text">
          <text class="hero-card-title">{{ topNews.title }}</text>
          <view class="hero-meta">
            <text class="meta-source">{{ topNews.source }}</text>
            <text class="meta-dot">·</text>
            <text class="meta-time">{{ topNews.publishAt }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 资讯列表 -->
    <view class="section">
      <view class="section-head">
        <text class="dot"></text>
        <text class="section-title">最新资讯</text>
      </view>
      <view
        v-for="item in newsList"
        :key="item.id"
        class="news-row"
        hover-class="card-active"
      >
        <view class="news-text">
          <text class="news-title">{{ item.title }}</text>
          <view class="news-meta">
            <text class="meta-source">{{ item.source }}</text>
            <text class="meta-dot">·</text>
            <text class="meta-time">{{ item.publishAt }}</text>
          </view>
        </view>
        <image v-if="item.cover" class="news-cover" :src="item.cover" mode="aspectFill" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BIZ } from "@/config/biz";
import type { NewsItem } from "@/api/modules/news";

const brandLabel = BIZ.label;

// 静态 demo 数据;接通 getNewsFeed 后替换为接口返回
const topNews = ref<NewsItem>({
  id: "0",
  title: "宏观经济观察:三大领先指标释放回暖信号,二季度增速有望回升",
  source: "财经晚报",
  publishAt: "10 分钟前",
  cover: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200",
});

const newsList = ref<NewsItem[]>([
  {
    id: "1",
    title: "AI 监管新规落地:头部厂商联合发布行业自律公约",
    source: "科技前沿",
    publishAt: "30 分钟前",
    cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600",
  },
  {
    id: "2",
    title: "城市更新进行时:老厂房改造的另一种可能",
    source: "城市观察",
    publishAt: "1 小时前",
    cover: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600",
  },
  {
    id: "3",
    title: "夏季旅游报告:小众目的地搜索量同比增长 240%",
    source: "出行周刊",
    publishAt: "2 小时前",
  },
  {
    id: "4",
    title: "新能源汽车价格战进入第二轮,售价继续下探",
    source: "汽车商业",
    publishAt: "3 小时前",
    cover: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
  },
]);
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: $space-8;
}

/* 顶部渐变 hero — 渐变 + 装饰光斑,落地"禁纯白铺底" */
.hero {
  position: relative;
  padding: 120rpx $space-4 $space-6;
  background: linear-gradient(135deg, $color-brand-600 0%, $color-brand-500 60%, #38bdf8 100%);
  overflow: hidden;
}
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60rpx);
  opacity: 0.55;
}
.hero-blob-1 {
  width: 360rpx;
  height: 360rpx;
  background: #7dd3fc;
  top: -80rpx;
  right: -60rpx;
}
.hero-blob-2 {
  width: 280rpx;
  height: 280rpx;
  background: #fbbf24;
  bottom: -120rpx;
  left: -40rpx;
  opacity: 0.35;
}
.hero-inner {
  position: relative;
  z-index: 1;
}
.brand {
  display: block;
  font-family: var(--font-display);
  font-size: $fs-display;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1rpx;
}
.tagline {
  display: block;
  margin-top: $space-2;
  font-size: $fs-body;
  color: rgba(255, 255, 255, 0.85);
}
.search {
  margin-top: $space-5;
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 $space-4;
  background: rgba(255, 255, 255, 0.92);
  border-radius: $radius-pill;
  box-shadow: 0 12rpx 32rpx rgba(2, 132, 199, 0.18);
}
.search-icon {
  font-size: 32rpx;
  color: $color-brand-600;
  margin-right: $space-2;
}
.search-ph {
  font-size: $fs-body;
  color: $color-text-mute;
}

/* section 通用 */
.section {
  padding: $space-5 $space-4 0;
}
.section-head {
  display: flex;
  align-items: center;
  margin-bottom: $space-3;
}
.dot {
  width: 8rpx;
  height: 28rpx;
  background: $color-brand-500;
  border-radius: 4rpx;
  margin-right: $space-2;
}
.section-title {
  font-family: var(--font-display);
  font-size: $fs-h2;
  font-weight: 700;
  color: $color-text;
}

/* 头条大卡 */
.hero-card {
  position: relative;
  height: 360rpx;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.12);
}
.hero-cover {
  width: 100%;
  height: 100%;
}
.hero-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0) 60%);
}
.hero-card-text {
  position: absolute;
  left: $space-4;
  right: $space-4;
  bottom: $space-4;
}
.hero-card-title {
  display: block;
  font-family: var(--font-display);
  font-size: $fs-h2;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
}
.hero-meta {
  display: flex;
  align-items: center;
  margin-top: $space-2;
}
.meta-source {
  font-size: $fs-caption;
  color: rgba(255, 255, 255, 0.85);
}
.meta-dot {
  font-size: $fs-caption;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 $space-1;
}
.meta-time {
  font-size: $fs-caption;
  color: rgba(255, 255, 255, 0.7);
}

/* 列表项 */
.news-row {
  display: flex;
  padding: $space-3 0;
  border-bottom: 1rpx solid $color-line;
  transition: transform 200ms ease-out;
}
.news-row:last-child {
  border-bottom: none;
}
.news-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: $space-3;
}
.news-title {
  font-size: $fs-h3;
  font-weight: 600;
  color: $color-text;
  line-height: 1.45;
}
.news-meta {
  display: flex;
  align-items: center;
  margin-top: $space-2;
  .meta-source {
    color: $color-text-soft;
  }
  .meta-dot {
    color: $color-text-mute;
  }
  .meta-time {
    color: $color-text-mute;
  }
}
.news-cover {
  width: 200rpx;
  height: 140rpx;
  border-radius: $radius-md;
  background: $color-line;
}

.card-active {
  transform: scale(0.98);
}
</style>
