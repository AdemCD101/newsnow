import { $fetch } from "ofetch"
import { parseHTML } from "linkedom"
import { type Source } from "../types"

const PROXY_URL = "https://api.allorigins.win/raw?url="

export default {
  async fetch() {
    try {
      console.log("Fetching BBC news through proxy...")
      const targetUrl = "https://www.bbc.com/news/world"
      console.log("Target URL:", targetUrl)
      
      const response = await $fetch(PROXY_URL + encodeURIComponent(targetUrl), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1"
        }
      })
      
      console.log("Proxy response received, length:", response.length)
      
      const { document } = parseHTML(response)
      const articles = Array.from(document.querySelectorAll("article.gs-c-promo")) as Element[]
      console.log("Found articles:", articles.length)
      
      return articles.slice(0, 30).map((article) => {
        const link = article.querySelector("a.gs-c-promo-heading") as HTMLAnchorElement | null
        const title = article.querySelector(".gs-c-promo-heading__title")
        const time = article.querySelector("time") || article.querySelector(".gs-o-bullet__text")
        
        const href = link?.getAttribute("href")
        const fullUrl = href ? new URL(href, "https://www.bbc.com").href : ""
        
        return {
          id: `bbc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: title?.textContent?.trim() || "",
          url: fullUrl,
          time: time?.getAttribute("datetime") || time?.textContent?.trim() || new Date().toISOString(),
          source: "BBC"
        }
      }).filter(item => item.title && item.url)
    } catch (error) {
      console.error("Error fetching BBC news through proxy:", error)
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
      return []
    }
  }
} satisfies Source 