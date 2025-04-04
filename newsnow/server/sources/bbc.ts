import { $fetch } from "ofetch"
import { parseHTML } from "linkedom"
import { type Source } from "../types"

export default {
  async fetch() {
    try {
      const html = await $fetch("https://www.bbc.com/news/world", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1"
        }
      })
      
      const { document } = parseHTML(html)
      const articles = Array.from(document.querySelectorAll("article.gs-c-promo")) as Element[]
      
      return articles.slice(0, 30).map((article) => {
        const link = article.querySelector("a.gs-c-promo-heading") as HTMLAnchorElement
        const title = article.querySelector(".gs-c-promo-heading__title")
        const time = article.querySelector("time") || article.querySelector(".gs-o-bullet__text")
        
        return {
          id: `bbc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: title?.textContent?.trim() || "",
          url: link?.href ? new URL(link.href, "https://www.bbc.com").href : "",
          time: time?.getAttribute("datetime") || time?.textContent?.trim() || new Date().toISOString(),
          source: "BBC"
        }
      }).filter(item => item.title && item.url)
    } catch (error) {
      console.error("Error fetching BBC news:", error)
      return []
    }
  }
} satisfies Source 