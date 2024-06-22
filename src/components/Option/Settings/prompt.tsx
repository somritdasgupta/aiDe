import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Skeleton, Radio, Form, Input } from "antd"
import React from "react"
import { useTranslation } from "react-i18next"
import { SaveButton } from "~/components/Common/SaveButton"
import {
  getWebSearchPrompt,
  geWebSearchFollowUpPrompt,
  setWebPrompts,
  promptForRag,
  setPromptForRag
} from "~/services/ollama"

export const SettingPrompt = () => {
  const { t } = useTranslation("settings")

  const [selectedValue, setSelectedValue] = React.useState<"web" | "rag">("rag")

  const queryClient = useQueryClient()

  const { status, data } = useQuery({
    queryKey: ["fetchOllaPrompt"],
    queryFn: async () => {
      const [prompt, webSearchPrompt, webSearchFollowUpPrompt] =
        await Promise.all([
          promptForRag(),
          getWebSearchPrompt(),
          geWebSearchFollowUpPrompt()
        ])

      return {
        prompt,
        webSearchPrompt,
        webSearchFollowUpPrompt
      }
    }
  })

  return (
    <div className="flex flex-col gap-3">
      {status === "pending" && <Skeleton paragraph={{ rows: 4 }} active />}

      {status === "success" && (
        <div>
          <div className="my-3 flex justify-end">
            <Radio.Group
              defaultValue={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}>
              <Radio.Button value="rag">RAG</Radio.Button>
              <Radio.Button value="web">
                {t("ollamaSettings.settings.prompt.option2")}
              </Radio.Button>
            </Radio.Group>
          </div>

          {selectedValue === "rag" && (
            <Form
              layout="vertical"
              onFinish={(values) => {
                // setSystemPromptForNonRagOption(values?.prompt || "")
                setPromptForRag(
                  values?.systemPrompt || "",
                  values?.questionPrompt || ""
                )
                queryClient.invalidateQueries({
                  queryKey: ["fetchOllaPrompt"]
                })
              }}
              initialValues={{
                systemPrompt: data.prompt.ragPrompt,
                questionPrompt: data.prompt.ragQuestionPrompt
              }}>
              <Form.Item
                label={t("managePrompts.systemPrompt")}
                name="systemPrompt"
                rules={[
                  {
                    required: true,
                    message: "Enter a prompt."
                  }
                ]}>
                <Input.TextArea
                  value={data.webSearchPrompt}
                  rows={5}
                  placeholder="Enter a prompt."
                />
              </Form.Item>
              <Form.Item
                label={t("managePrompts.questionPrompt")}
                name="questionPrompt"
                rules={[
                  {
                    required: true,
                    message: "Enter a follow up prompt."
                  }
                ]}>
                <Input.TextArea
                  value={data.webSearchFollowUpPrompt}
                  rows={5}
                  placeholder={t(
                    "ollamaSettings.settings.prompt.webSearchFollowUpPromptPlaceholder"
                  )}
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end">
                  <SaveButton btnType="submit" />
                </div>{" "}
              </Form.Item>
            </Form>
          )}

          {selectedValue === "web" && (
            <Form
              layout="vertical"
              onFinish={(values) => {
                setWebPrompts(
                  values?.webSearchPrompt || "",
                  values?.webSearchFollowUpPrompt || ""
                )
                queryClient.invalidateQueries({
                  queryKey: ["fetchOllaPrompt"]
                })
              }}
              initialValues={{
                webSearchPrompt: data.webSearchPrompt,
                webSearchFollowUpPrompt: data.webSearchFollowUpPrompt
              }}>
              <Form.Item
                label={t("ollamaSettings.settings.prompt.webSearchPrompt")}
                name="webSearchPrompt"
                help={t("ollamaSettings.settings.prompt.webSearchPromptHelp")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "ollamaSettings.settings.prompt.webSearchPromptError"
                    )
                  }
                ]}>
                <Input.TextArea
                  value={data.webSearchPrompt}
                  rows={5}
                  placeholder={t(
                    "ollamaSettings.settings.prompt.webSearchPromptPlaceholder"
                  )}
                />
              </Form.Item>
              <Form.Item
                label={t(
                  "ollamaSettings.settings.prompt.webSearchFollowUpPrompt"
                )}
                name="webSearchFollowUpPrompt"
                help={t(
                  "ollamaSettings.settings.prompt.webSearchFollowUpPromptHelp"
                )}
                rules={[
                  {
                    required: true,
                    message: t(
                      "ollamaSettings.settings.prompt.webSearchFollowUpPromptError"
                    )
                  }
                ]}>
                <Input.TextArea
                  value={data.webSearchFollowUpPrompt}
                  rows={5}
                  placeholder={t(
                    "ollamaSettings.settings.prompt.webSearchFollowUpPromptPlaceholder"
                  )}
                />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end">
                  <SaveButton btnType="submit" />
                </div>{" "}
              </Form.Item>
            </Form>
          )}
        </div>
      )}
    </div>
  )
}
