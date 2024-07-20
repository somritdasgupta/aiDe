import {
  SimpleChatModel,
  type BaseChatModelParams
} from "@langchain/core/language_models/chat_models"
import type { BaseLanguageModelCallOptions } from "@langchain/core/language_models/base"
import {
  CallbackManagerForLLMRun,
  Callbacks
} from "@langchain/core/callbacks/manager"
import { BaseMessage, AIMessageChunk } from "@langchain/core/messages"
import { ChatGenerationChunk } from "@langchain/core/outputs"
import { IterableReadableStream } from "@langchain/core/utils/stream"

export interface AI {
  canCreateTextSession(): Promise<AIModelAvailability>
  createTextSession(options?: AITextSessionOptions): Promise<AITextSession>
  defaultTextSessionOptions(): Promise<AITextSessionOptions>
}

export interface AITextSession {
  prompt(input: string): Promise<string>
  promptStreaming(input: string): ReadableStream
  destroy(): void
  clone(): AITextSession
}

export interface AITextSessionOptions {
  topK: number
  temperature: number
}

export const enum AIModelAvailability {
  Readily = "readily",
  AfterDownload = "after-download",
  No = "no"
}

export interface ChromeAIInputs extends BaseChatModelParams {
  topK?: number
  temperature?: number
  /**
   * An optional function to format the prompt before sending it to the model.
   */
  promptFormatter?: (messages: BaseMessage[]) => string
}

export interface ChromeAICallOptions extends BaseLanguageModelCallOptions {}

function formatPrompt(messages: BaseMessage[]): string {
  return messages
    .map((message) => {
      if (typeof message.content !== "string") {
        // console.log(message.content)
        // throw new Error(
        //   "ChatChromeAI does not support non-string message content."
        // )
        if (message.content.length > 0) {
          //@ts-ignore
          return message.content[0]?.text || ""
        }

        return ""
      }
      return `${message._getType()}: ${message.content}`
    })
    .join("\n")
}

/**
 * To use this model you need to have the `Built-in AI Early Preview Program`
 * for Chrome. You can find more information about the program here:
 * @link https://developer.chrome.com/docs/ai/built-in
 *
 * @example
 * ```typescript
 * // Initialize the ChatChromeAI model.
 * const model = new ChatChromeAI({
 *   temperature: 0.5, // Optional. Default is 0.5.
 *   topK: 40, // Optional. Default is 40.
 * });
 *
 * // Call the model with a message and await the response.
 * const response = await model.invoke([
 *   new HumanMessage({ content: "My name is John." }),
 * ]);
 * ```
 */
export class ChatChromeAI extends SimpleChatModel<ChromeAICallOptions> {
  session?: AITextSession

  temperature = 0.5

  topK = 40

  promptFormatter: (messages: BaseMessage[]) => string

  static lc_name() {
    return "ChatChromeAI"
  }

  constructor(inputs?: ChromeAIInputs) {
    super({
      callbacks: {} as Callbacks,
      ...inputs
    })
    this.temperature = inputs?.temperature ?? this.temperature
    this.topK = inputs?.topK ?? this.topK
    this.promptFormatter = inputs?.promptFormatter ?? formatPrompt
  }

  _llmType() {
    return "chrome-ai"
  }

  /**
   * Initialize the model. This method must be called before calling `.invoke()`.
   */
  async initialize() {
    if (typeof window === "undefined") {
      throw new Error("ChatChromeAI can only be used in the browser.")
    }

    const { ai } = window as any
    const canCreateTextSession = await ai.canCreateTextSession()
    if (canCreateTextSession === AIModelAvailability.No) {
      throw new Error("The AI model is not available.")
    } else if (canCreateTextSession === AIModelAvailability.AfterDownload) {
      throw new Error("The AI model is not yet downloaded.")
    }

    this.session = await ai.createTextSession({
      topK: this.topK,
      temperature: this.temperature
    })
  }

  /**
   * Call `.destroy()` to free resources if you no longer need a session.
   * When a session is destroyed, it can no longer be used, and any ongoing
   * execution will be aborted. You may want to keep the session around if
   * you intend to prompt the model often since creating a session can take
   * some time.
   */
  destroy() {
    if (!this.session) {
      return console.log("No session found. Returning.")
    }
    this.session.destroy()
  }

  async *_streamResponseChunks(
    messages: BaseMessage[],
    _options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): AsyncGenerator<ChatGenerationChunk> {
    if (!this.session) {
      await this.initialize()
    }
    const textPrompt = this.promptFormatter(messages)
    const stream = this.session.promptStreaming(textPrompt)
    const iterableStream = IterableReadableStream.fromReadableStream(stream)

    let previousContent = ""
    for await (const chunk of iterableStream) {
      const newContent = chunk.slice(previousContent.length)
      previousContent += newContent
      yield new ChatGenerationChunk({
        text: newContent,
        message: new AIMessageChunk({
          content: newContent,
          additional_kwargs: {}
        })
      })
      await runManager?.handleLLMNewToken(newContent)
    }
  }

  async _call(
    messages: BaseMessage[],
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): Promise<string> {
    const chunks = []
    for await (const chunk of this._streamResponseChunks(
      messages,
      options,
      runManager
    )) {
      chunks.push(chunk.text)
    }
    return chunks.join("")
  }
}
