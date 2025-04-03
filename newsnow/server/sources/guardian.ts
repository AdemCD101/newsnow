import { $fetch } from "ofetch"
import { parseHTML } from "linkedom"
import { type Source } from "../types"

export default {
  async fetch() {
    const html = await $fetch("https://www.theguardian.com/international")
    const { document } = parseHTML(html)
    const articles = Array.from(document.querySelectorAll("div.fc-item"))
    return articles.slice(0, 30).map((article) => {
      const link = article.querySelector("a")
      const title = article.querySelector("span.js-headline-text")
      const time = article.querySelector("time")
      return {
        id: `guardian-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title?.textContent?.trim() || "",
        url: link?.href ? new URL(link.href, "https://www.theguardian.com").href : "",
        time: time?.getAttribute("datetime") || new Date().toISOString(),
        source: "The Guardian"
      }
    }).filter(item => item.title && item.url)
  }
} satisfies Source 