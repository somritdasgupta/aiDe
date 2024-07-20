import { BetaTag } from "@/components/Common/Beta"
import { SaveButton } from "@/components/Common/SaveButton"
import { getAllModelSettings, setModelSetting } from "@/services/model-settings"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Form, Skeleton, Input, InputNumber, Collapse } from "antd"
import React from "react"
import { useTranslation } from "react-i18next"


export const ModelSettings = () => {
  const { t } = useTranslation("common")
  const [form] = Form.useForm()
  const client = useQueryClient()
  const { isPending: isLoading } = useQuery({
    queryKey: ["fetchModelConfig"],
    queryFn: async () => {
      const data = await getAllModelSettings()
      form.setFieldsValue(data)
      return data
    }
  })

  return (
    <div>
      <div>
        <div className="inline-flex items-center gap-2">
        <BetaTag />
        <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
          {t("modelSettings.label")} 
        </h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-neutral-400 mt-1">
          {t("modelSettings.description")}
        </p>
        <div className="border border-b border-gray-200 dark:border-gray-600 mt-3 mb-6"></div>
      </div>
      {!isLoading ? (
        <Form
          onFinish={(values: {
            keepAlive: string
            temperature: number
            topK: number
            topP: number
          }) => {
            Object.entries(values).forEach(([key, value]) => {
              setModelSetting(key, value)
            })
            client.invalidateQueries({
              queryKey: ["fetchModelConfig"]
            })
          }}
          form={form}
          layout="vertical">
          <Form.Item
            name="keepAlive"
            help={t("modelSettings.form.keepAlive.help")}
            label={t("modelSettings.form.keepAlive.label")}>
            <Input
              size="large"
              placeholder={t("modelSettings.form.keepAlive.placeholder")}
            />
          </Form.Item>
          <Form.Item
            name="temperature"
            label={t("modelSettings.form.temperature.label")}>
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              placeholder={t("modelSettings.form.temperature.placeholder")}
            />
          </Form.Item>

          <Form.Item name="numCtx" label={t("modelSettings.form.numCtx.label")}>
            <InputNumber
              style={{ width: "100%" }}
              placeholder={t("modelSettings.form.numCtx.placeholder")}
              size="large"
            />
          </Form.Item>

          <Collapse
            ghost
            className="border-none bg-transparent"
            items={[
              {
                key: "1",
                label: t("modelSettings.advanced"),
                children: (
                  <React.Fragment>
                    <Form.Item
                      name="topK"
                      label={t("modelSettings.form.topK.label")}>
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder={t("modelSettings.form.topK.placeholder")}
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="topP"
                      label={t("modelSettings.form.topP.label")}>
                      <InputNumber
                        style={{ width: "100%" }}
                        size="large"
                        placeholder={t("modelSettings.form.topP.placeholder")}
                      />
                    </Form.Item>
                  </React.Fragment>
                )
              }
            ]}
          />

          <div className="flex justify-end">
            <SaveButton btnType="submit" />
          </div>
        </Form>
      ) : (
        <Skeleton active />
      )}
    </div>
  )
}
