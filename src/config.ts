// 网站配置
export const SITE = {
  website: "https://fitness.sbnone.dpdns.org",
  title: "健身为王",
  description: "个人健身追踪与训练计划",
  author: "Jianwen Qiu",
  ogImage: "fitness-og.jpg",
  lightAndDarkMode: true,
  dir: "ltr",
  lang: "zh-CN",
  // API 后端地址
  apiBaseUrl: import.meta.env.PUBLIC_API_BASE_URL || "https://sbnone.dpdns.org/api/fitness",
} as const;
