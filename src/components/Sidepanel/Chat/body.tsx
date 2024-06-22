import React from "react"
import { PlaygroundMessage } from "~/components/Common/Playground/Message"
import { useMessage } from "~/hooks/useMessage"
import { EmptySidePanel } from "../Chat/empty"
import { useWebUI } from "@/store/webui"

export const SidePanelBody = () => {
  const { messages, streaming, regenerateLastMessage, editMessage } =
    useMessage()
  const divRef = React.useRef<HTMLDivElement>(null)
  const { ttsEnabled } = useWebUI()
  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" })
    }
  })
  return (
    <div className="grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
      {messages.length === 0 && <EmptySidePanel />}
      {messages.map((message, index) => (
        <PlaygroundMessage
          key={index}
          isBot={message.isBot}
          message={message.message}
          name={message.name}
          images={message.images || []}
          currentMessageIndex={index}
          totalMessages={messages.length}
          onRengerate={regenerateLastMessage}
          onEditFormSubmit={(value) => {
            editMessage(index, value, !message.isBot)
          }}
          isProcessing={streaming}
          isTTSEnabled={ttsEnabled}
        />
      ))}
      {import.meta.env.BROWSER === "chrome" ? (
        <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
      ) : (
        <div className="w-full h-48 flex-shrink-0"></div>
      )}
      <div ref={divRef} />
    </div>
  )
}
