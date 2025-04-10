import { $fetch } from "ofetch"
import { parseHTML } from "linkedom"
import { type Source } from "../types"

const PROXY_URL = "https://api.allorigins.win/raw?url="

export default {
  async fetch() {
    try {
      const html = await $fetch(PROXY_URL + encodeURIComponent("https://www.cnn.com/world"), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1"
        }
      })
      
      const { document } = parseHTML(html)
      const articles = Array.from(document.querySelectorAll(".card")) as Element[]
      
      return articles.slice(0, 30).map((article) => {
        const link = article.querySelector("a.container__link, .card__link") as HTMLAnchorElement | null
        const title = article.querySelector(".container__headline-text, .card__headline-text")
        const time = article.querySelector("time") || article.querySelector(".timestamp")
        
        const href = link?.getAttribute("href")
        const fullUrl = href ? new URL(href, "https://www.cnn.com").href : ""
        
        return {
          id: `cnn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: title?.textContent?.trim() || "",
          url: fullUrl,
          time: time?.getAttribute("datetime") || time?.textContent?.trim() || new Date().toISOString(),
          source: "CNN"
        }
      }).filter(item => item.title && item.url)
    } catch (error) {
      console.error("Error fetching CNN news through proxy:", error)
      return []
    }
  }
} satisfies Source 