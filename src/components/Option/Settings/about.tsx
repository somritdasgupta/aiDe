import { getOllamaURL } from "~/services/ollama"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "antd"
import { cleanUrl } from "@/libs/clean-url"
import { Descriptions } from "antd"

export const AboutApp = () => {
  const { t } = useTranslation("settings")

  const { data, status } = useQuery({
    queryKey: ["fetchOllamURL"],
    queryFn: async () => {
      const chromeVersion = browser.runtime.getManifest().version
      try {
        const url = await getOllamaURL()
        const req = await fetch(`${cleanUrl(url)}/api/version`)

        if (!req.ok) {
          return {
            ollama: "N/A",
            chromeVersion
          }
        }

        const res = (await req.json()) as { version: string }
        return {
          ollama: res.version,
          chromeVersion
        }
      } catch {
        return {
          ollama: "N/A",
          chromeVersion
        }
      }
    }
  })

  return (
    <div className="flex flex-col space-y-3">
      {status === "pending" && <Skeleton paragraph={{ rows: 4 }} active />}
      {status === "success" && (
        <div className="flex flex-col space-y-4">
          <Descriptions
            title={t("about.heading")}
            column={1}
            size="middle"
            items={[
              {
                key: 1,
                label: t("about.chromeVersion"),
                children: data.chromeVersion
              },
              {
                key: 1,
                label: t("about.ollamaVersion"),
                children: data.ollama
              },
            ]}
          />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
              {t("about.support")}
            </p>

            <div className="flex gap-2">
              <a
                href="https://buymeacoffee.com/somritdasgupta"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 dark:text-blue-400 border dark:border-yellow-600 px-2.5 py-2 rounded-md">
                {t("about.coffee")}
              </a>

              <a
                href="https://github.com/sponsors/somritdasgupta"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 dark:text-blue-400 border dark:border-yellow-600 px-2.5 py-2 rounded-md">
                {t("about.githubSponsor")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
