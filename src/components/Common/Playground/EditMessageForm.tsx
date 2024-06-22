import { useForm } from "@mantine/form"
import React from "react"
import { useTranslation } from "react-i18next"
import useDynamicTextareaSize from "~/hooks/useDynamicTextareaSize"

type Props = {
  value: string
  onSumbit: (value: string) => void
  onClose: () => void
  isBot: boolean
}

export const EditMessageForm = (props: Props) => {
  const [isComposing, setIsComposing] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const { t } = useTranslation("common")

  const form = useForm({
    initialValues: {
      message: props.value
    }
  })
  useDynamicTextareaSize(textareaRef, form.values.message, 300)

  React.useEffect(() => {
    form.setFieldValue("message", props.value)
  }, [props.value])

  return (
    <form
      onSubmit={form.onSubmit((data) => {
        if (isComposing) return
        props.onClose()
        props.onSumbit(data.message)
      })}
      className="flex flex-col gap-2">
      <textarea
        {...form.getInputProps("message")}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        required
        rows={1}
        style={{ minHeight: "60px" }}
        tabIndex={0}
        placeholder={t("editMessage.placeholder")}
        ref={textareaRef}
        className="w-full  bg-transparent focus-within:outline-none focus:ring-0 focus-visible:ring-0 ring-0 dark:ring-0 border-0 dark:text-gray-100"
      />
      <div className="flex justify-center space-x-2 mt-2">
        <button
          aria-label={t("save")}
          className="bg-white dark:bg-black px-2.5 py-2 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900">
          {props.isBot ? t("save") : t("saveAndSubmit")}
        </button>
        <button
          onClick={props.onClose}
          aria-label={t("cancel")}
          className="border dark:border-gray-600 px-2.5 py-2 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900">
          {t("cancel")}
        </button>
      </div>
    </form>
  )
}
