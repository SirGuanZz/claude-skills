/**
 * 资讯模块接口 — 调用 main/cms 域名,demo 用,接入真实后端时按返回结构调整
 * 依赖方:pages/index、pages/channel
 * 修改注意:跨域名调用须显式声明 api key(main / cms),不要复用同一个常量
 */
import { request } from "@/api/request";

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishAt: string;
  cover?: string;
}

export interface Channel {
  id: string;
  name: string;
}

/**
 * 获取首页头条 + 新闻列表
 * @param page 第几页,从 1 开始
 * @returns { list: NewsItem[], hasMore: boolean }
 */
export const getNewsFeed = (page = 1) =>
  request<{ list: NewsItem[]; hasMore: boolean }>({
    api: "main",
    url: "news/feed",
    data: { page, pageSize: 20 },
    loading: page === 1,
    // 游客也能看资讯流,登录态过期不强制跳登录
    homeToken: true,
  });

/**
 * 获取频道列表(订阅 + 推荐)
 * 走 cms 域名:与 main 不同业务边界,跨域名典型示例
 */
export const getChannelList = () =>
  request<{ subscribed: Channel[]; recommended: Channel[] }>({
    api: "cms",
    url: "channel/list",
    loading: true,
  });
