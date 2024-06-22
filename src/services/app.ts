import { Storage } from "@plasmohq/storage"
const storage = new Storage()

const DEFAULT_URL_REWRITE_URL = "http://127.0.0.1:11434"

export const isUrlRewriteEnabled = async () => {
  const enabled = await storage.get<boolean | undefined>("urlRewriteEnabled")
  return enabled
}
export const setUrlRewriteEnabled = async (enabled: boolean) => {
  await storage.set("urlRewriteEnabled", enabled ? "true" : "false")
}

export const getRewriteUrl = async () => {
  const rewriteUrl = await storage.get("rewriteUrl")
  if (!rewriteUrl || rewriteUrl.trim() === "") {
    return DEFAULT_URL_REWRITE_URL
  }
  return rewriteUrl
}

export const setRewriteUrl = async (url: string) => {
  await storage.set("rewriteUrl", url)
}

export const getAdvancedOllamaSettings = async () => {
  const [isEnableRewriteUrl, rewriteUrl] = await Promise.all([
    isUrlRewriteEnabled(),
    getRewriteUrl()
  ])

  return {
    isEnableRewriteUrl,
    rewriteUrl
  }
}


export const copilotResumeLastChat = async () => {
  return await storage.get<boolean>("copilotResumeLastChat")
}