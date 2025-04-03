import { $fetch } from "ofetch"
import { parseHTML } from "linkedom"
import { type Source } from "../types"

export default {
  async fetch() {
    const html = await $fetch("https://www.nytimes.com/section/world")
    const { document } = parseHTML(html)
    const articles = Array.from(document.querySelectorAll("article"))
    return articles.slice(0, 30).map((article) => {
      const link = article.querySelector("a")
      const title = article.querySelector("h3")
      const time = article.querySelector("time")
      return {
        id: `nyt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title?.textContent?.trim() || "",
        url: link?.href ? new URL(link.href, "https://www.nytimes.com").href : "",
        time: time?.getAttribute("datetime") || new Date().toISOString(),
        source: "New York Times"
      }
    }).filter(item => item.title && item.url)
  }
} satisfies Source 