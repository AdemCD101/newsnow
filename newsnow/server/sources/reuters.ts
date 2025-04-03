import { $fetch } from "ofetch"
import { parseHTML } from "linkedom"
import { type Source } from "../types"

export default {
  async fetch() {
    const html = await $fetch("https://www.reuters.com/world/")
    const { document } = parseHTML(html)
    const articles = Array.from(document.querySelectorAll("article.story"))
    return articles.slice(0, 30).map((article) => {
      const link = article.querySelector("a")
      const title = article.querySelector("h3")
      const time = article.querySelector("time")
      return {
        title: title?.textContent?.trim() || "",
        url: link?.href ? new URL(link.href, "https://www.reuters.com").href : "",
        time: time?.getAttribute("datetime") || new Date().toISOString()
      }
    }).filter(item => item.title && item.url)
  }
} satisfies Source 