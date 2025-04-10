import { $fetch } from "ofetch"
import { XMLParser } from "fast-xml-parser"
import type { Source } from "../types"

export default {
  async fetch() {
    try {
      const rssUrls = {
        cnn: "http://rss.cnn.com/rss/cnn_world.rss",
        bbc: "http://feeds.bbci.co.uk/news/world/rss.xml",
        reuters: "https://www.reutersagency.com/feed/?taxonomy=best-regions&post_type=best",
        guardian: "https://www.theguardian.com/world/rss",
        nyt: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
        nhk: "https://www3.nhk.or.jp/nhkworld/en/rss/news/index.xml",
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      })

      const results = await Promise.all(
        Object.entries(rssUrls).map(async ([source, url]) => {
          try {
            const xml = await $fetch(url)
            const data = parser.parse(xml)

            const items = data.rss?.channel?.item || []
            return items.map((item: any) => ({
              id: `${source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: item.title,
              url: item.link,
              time: item.pubDate || new Date().toISOString(),
              source: source.toUpperCase(),
            }))
          } catch (error) {
            console.error(`Error fetching ${source} RSS:`, error)
            return []
          }
        }),
      )

      return results.flat().slice(0, 30)
    } catch (error) {
      console.error("Error in RSS processor:", error)
      return []
    }
  },
} satisfies Source
