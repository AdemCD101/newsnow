import { $fetch } from "ofetch"
import { parseHTML } from "linkedom"
import { type Source } from "../types"

export default {
  async fetch() {
    const html = await $fetch("https://www.cnn.com/world")
    const { document } = parseHTML(html)
    const articles = Array.from(document.querySelectorAll("article.container__item")) as Element[]
    return articles.slice(0, 30).map((article) => {
      const link = article.querySelector("a")
      const title = article.querySelector("span.container__headline-text")
      const time = article.querySelector("time")
      return {
        id: `cnn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title?.textContent?.trim() || "",
        url: link?.href ? new URL(link.href, "https://www.cnn.com").href : "",
        time: time?.getAttribute("datetime") || new Date().toISOString(),
        source: "CNN"
      }
    }).filter(item => item.title && item.url)
  }
} satisfies Source 