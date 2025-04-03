import process from "node:process"
import { Interval } from "./consts"
import { typeSafeObjectFromEntries } from "./type.util"
import type { OriginSource, Source, SourceID } from "./types"

const Time = {
  Test: 1,
  Realtime: 2 * 60 * 1000,
  Fast: 5 * 60 * 1000,
  Default: Interval, // 10min
  Common: 30 * 60 * 1000,
  Slow: 60 * 60 * 1000,
}

export const originSources = {
  "v2ex": {
    name: "V2EX",
    color: "slate",
    home: "https://v2ex.com/",
    sub: {
      share: {
        title: "最新分享",
        column: "tech",
      },
    },
  },
  "zhihu": {
    name: "知乎",
    type: "hottest",
    column: "china",
    color: "blue",
    home: "https://www.zhihu.com",
  },
  "weibo": {
    name: "微博",
    title: "实时热搜",
    type: "hottest",
    column: "china",
    color: "red",
    interval: Time.Realtime,
    home: "https://weibo.com",
  },
  "zaobao": {
    name: "联合早报",
    interval: Time.Common,
    type: "realtime",
    column: "world",
    color: "red",
    desc: "来自第三方网站: 早晨报",
    home: "https://www.zaobao.com",
  },
  "coolapk": {
    name: "酷安",
    type: "hottest",
    column: "tech",
    color: "green",
    title: "今日最热",
    home: "https://coolapk.com",
  },
  "wallstreetcn": {
    name: "华尔街见闻",
    color: "blue",
    column: "finance",
    home: "https://wallstreetcn.com/",
    sub: {
      quick: {
        type: "realtime",
        interval: Time.Fast,
        title: "实时快讯",
      },
      news: {
        title: "最新资讯",
        interval: Time.Common,
      },
      hot: {
        title: "最热文章",
        type: "hottest",
        interval: Time.Common,
      },
    },
  },
  "36kr": {
    name: "36氪",
    type: "realtime",
    color: "blue",
    // cloudflare pages cannot access
    disable: "cf",
    home: "https://36kr.com",
    column: "tech",
    sub: {
      quick: {
        title: "快讯",
      },
    },
  },
  "douyin": {
    name: "抖音",
    type: "hottest",
    column: "china",
    color: "gray",
    home: "https://www.douyin.com",
  },
  "hupu": {
    name: "虎扑",
    disable: true,
    home: "https://hupu.com",
  },
  "tieba": {
    name: "百度贴吧",
    title: "热议",
    column: "china",
    type: "hottest",
    color: "blue",
    home: "https://tieba.baidu.com",
  },
  "toutiao": {
    name: "今日头条",
    type: "hottest",
    column: "china",
    color: "red",
    home: "https://www.toutiao.com",
  },
  "ithome": {
    name: "IT之家",
    color: "red",
    column: "tech",
    type: "realtime",
    home: "https://www.ithome.com",
  },
  "thepaper": {
    name: "澎湃新闻",
    interval: Time.Common,
    type: "hottest",
    column: "china",
    title: "热榜",
    color: "gray",
    home: "https://www.thepaper.cn",
  },
  // 🌍 主流英文媒体（RSS源）
  cnn: {
    name: "CNN International",
    url: "https://rss.cnn.com/rss/edition.rss",
    lang: "en",
    type: "rss",
    color: "blue",
    interval: Time.Common,
    column: "world",
    home: "https://edition.cnn.com"
  },
  bbc: {
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    lang: "en",
    type: "rss",
    color: "red",
    interval: Time.Common,
    column: "world",
    home: "https://www.bbc.com/news"
  },
  reuters: {
    name: "Reuters Top News",
    url: "https://feeds.reuters.com/reuters/topNews",
    lang: "en",
    type: "rss",
    color: "orange",
    interval: Time.Common,
    column: "world",
    home: "https://www.reuters.com"
  },
  guardian: {
    name: "The Guardian - World",
    url: "https://www.theguardian.com/world/rss",
    lang: "en",
    type: "rss",
    color: "blue",
    interval: Time.Common,
    column: "world",
    home: "https://www.theguardian.com/international"
  },
  nyt: {
    name: "New York Times",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    lang: "en",
    type: "rss",
    color: "gray",
    interval: Time.Common,
    column: "world",
    home: "https://www.nytimes.com"
  },
  nhk: {
    name: "NHK Japan (English)",
    url: "https://www3.nhk.or.jp/rss/news/cat0.xml",
    lang: "en",
    type: "rss",
    color: "red",
    interval: Time.Common,
    column: "world",
    home: "https://www3.nhk.or.jp/nhkworld/en/news/"
  },
  "sputniknewscn": {
    name: "卫星通讯社",
    color: "orange",
    // cloudflare pages cannot access
    disable: "cf",
    column: "world",
    home: "https://sputniknews.cn",
  },
  "cankaoxiaoxi": {
    name: "参考消息",
    color: "red",
    column: "world",
    interval: Time.Common,
    home: "https://china.cankaoxiaoxi.com",
  },
  "cls": {
    name: "财联社",
    color: "red",
    column: "finance",
    home: "https://www.cls.cn",
    sub: {
      telegraph: {
        title: "电报",
        interval: Time.Fast,
        type: "realtime",
      },
      depth: {
        title: "深度",
      },
      hot: {
        title: "热门",
        type: "hottest",
      },
    },
  },
  "xueqiu": {
    name: "雪球",
    color: "blue",
    home: "https://xueqiu.com",
    column: "finance",
    sub: {
      hotstock: {
        title: "热门股票",
        interval: Time.Realtime,
        type: "hottest",
      },
    },
  },
  "gelonghui": {
    name: "格隆汇",
    color: "blue",
    title: "事件",
    column: "finance",
    type: "realtime",
    interval: Time.Realtime,
    home: "https://www.gelonghui.com",
  },
  "fastbull": {
    name: "法布财经",
    color: "emerald",
    home: "https://www.fastbull.cn",
    column: "finance",
    sub: {
      express: {
        title: "快讯",
        type: "realtime",
        interval: Time.Realtime,
      },
      news: {
        title: "头条",
        interval: Time.Common,
      },
    },
  },
  "solidot": {
    name: "Solidot",
    color: "teal",
    column: "tech",
    home: "https://solidot.org",
    interval: Time.Slow,
  },
  "hackernews": {
    name: "Hacker News",
    color: "orange",
    column: "tech",
    type: "hottest",
    home: "https://news.ycombinator.com/",
  },
  "producthunt": {
    name: "Product Hunt",
    color: "red",
    column: "tech",
    type: "hottest",
    home: "https://www.producthunt.com/",
  },
  "github": {
    name: "Github",
    color: "gray",
    home: "https://github.com/",
    column: "tech",
    sub: {
      "trending-today": {
        title: "Today",
        type: "hottest",
      },
    },
  },
  "bilibili": {
    name: "哔哩哔哩",
    color: "blue",
    home: "https://www.bilibili.com",
    sub: {
      "hot-search": {
        title: "热搜",
        column: "china",
        type: "hottest",
      },
    },
  },
  "kuaishou": {
    name: "快手",
    type: "hottest",
    column: "china",
    color: "orange",
    // cloudflare pages cannot access
    disable: "cf",
    home: "https://www.kuaishou.com",
  },
  "kaopu": {
    name: "靠谱新闻",
    column: "world",
    color: "gray",
    interval: Time.Common,
    desc: "不一定靠谱，多看多思考",
    home: "https://kaopu.news/",
  },
  "jin10": {
    name: "金十数据",
    column: "finance",
    color: "blue",
    type: "realtime",
    home: "https://www.jin10.com",
  },
  "baidu": {
    name: "百度热搜",
    column: "china",
    color: "blue",
    type: "hottest",
    home: "https://www.baidu.com",
  },
  "linuxdo": {
    name: "LINUX DO",
    column: "tech",
    color: "slate",
    home: "https://linux.do/",
    disable: "cf",
    sub: {
      latest: {
        title: "最新",
        home: "https://linux.do/latest",
      },
      hot: {
        title: "今日最热",
        type: "hottest",
        interval: Time.Common,
        home: "https://linux.do/hot",
      },
    },
  },
} as const satisfies Record<string, OriginSource>

export function genSources() {
  const _: [SourceID, Source][] = []

  Object.entries(originSources).forEach(([id, source]: [any, OriginSource]) => {
    const parent = {
      name: source.name,
      type: source.type,
      disable: source.disable,
      desc: source.desc,
      column: source.column,
      home: source.home,
      color: source.color ?? "primary",
      interval: source.interval ?? Time.Default,
    }
    if (source.sub && Object.keys(source.sub).length) {
      Object.entries(source.sub).forEach(([subId, subSource], i) => {
        if (i === 0) {
          _.push([id, {
            redirect: `${id}-${subId}`,
            ...parent,
            ...subSource,
          }] as [any, Source])
        }
        _.push([`${id}-${subId}`, { ...parent, ...subSource }] as [any, Source])
      })
    } else {
      _.push([id, {
        title: source.title,
        ...parent,
      }])
    }
  })

  return typeSafeObjectFromEntries(_.filter(([_, v]) => {
    if (v.disable === "cf" && process.env.CF_PAGES) {
      return false
    } else if (v.disable === true) {
      return false
    } else {
      return true
    }
  }))
}
