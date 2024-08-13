import { ChevronLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import logoImage from "~/assets/icon.png"

export const SidepanelSettingsHeader = () => {
  const { t } = useTranslation("common")
  return (
    <div className="flex px-3 justify-start gap-3 bg-white dark:bg-[#171717] border-b border-gray-300 dark:border-gray-700  py-4 items-center">
      <Link to="/">
        <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </Link>
      <div className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center dark:text-white">
        <img className="h-6 w-auto" src={logoImage} alt={t("pageAssist")} />
        <span className="ml-1 text-sm ">{t("pageAssist")}</span>
      </div>
    </div>
  )
}
