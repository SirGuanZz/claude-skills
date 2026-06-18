/**
 * 小程序域名配置 — 无 dev proxy,直连 getApiBase
 * 依赖方:src/api/request.ts(每次请求按 options.api 取 baseURL)
 * 修改注意:
 *   - IS_TEST: develop/trial 下切换测试/正式域名;release 恒走 prod
 *   - 新增 api key:在 API_MAP 加一项,modules 里 request 用 options.api 引用
 *   - 上线前在微信公众平台「开发管理 → 服务器域名」配置 request 合法域名
 */

// develop / trial 环境是否走 test 域名;true=测试,false=正式;release 恒忽略
export const IS_TEST = true;

// 新闻方向占位:main = 主业务/资讯接口,cms = 内容管理/频道接口;按实际业务替换
export const API_MAP = {
  // 主业务域名(资讯列表、详情、用户等)
  main: {
    prod: "https://api.example.com/api/",
    test: "https://api-test.example.com/api/",
  },
  // 内容管理域名(频道、专题、专栏等)
  cms: {
    prod: "https://cms.example.com/api/",
    test: "https://cms-test.example.com/api/",
  },
} as const;

export type ApiKey = keyof typeof API_MAP;

// 微信小程序运行时注入的版本号,用来区分体验版/开发版/正式版
export function getEnvVersion(): "develop" | "trial" | "release" {
  // @ts-expect-error __wxConfig 由微信运行时注入,无类型声明
  return typeof __wxConfig !== "undefined" ? __wxConfig?.envVersion ?? "develop" : "develop";
}

// 是否是开发或体验版;只有这两种才允许切到 test 域名
export function isDevOrTrial() {
  const v = getEnvVersion();
  return v === "develop" || v === "trial";
}

// 按 envVersion + IS_TEST 决定 baseURL;release 永远 prod,防止上线误走测试
export function getApiBase(key: ApiKey): string {
  const c = API_MAP[key];
  if (isDevOrTrial() && IS_TEST && "test" in c && c.test) {
    return c.test;
  }
  return c.prod;
}
