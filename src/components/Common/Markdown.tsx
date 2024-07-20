import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import ReactMarkdown from "react-markdown"

import "property-information"
import React from "react"
import { CodeBlock } from "./CodeBlock"

export default function Markdown({
  message,
  className = "prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 dark:prose-dark"
}: {
  message: string
  className?: string
}) {
  return (
    <React.Fragment>
      <ReactMarkdown
        className={className}
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline ? (
              <CodeBlock
                language={match ? match[1] : ""}
                value={String(children).replace(/\n$/, "")}
              />
            ) : (
              <code className={`${className} font-semibold`} {...props}>
                {children}
              </code>
            )
          },
          a({ node, ...props }) {
            return (
              <a
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm hover:underline"
                {...props}>
                {props.children}
              </a>
            )
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>
          }
        }}>
        {message}
      </ReactMarkdown>
    </React.Fragment>
  )
}
