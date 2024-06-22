import { Route, Routes } from "react-router-dom"
import OptionIndex from "./option-index"
import OptionSettings from "./option-settings"
import OptionModal from "./option-settings-model"
import OptionPrompt from "./option-settings-prompt"
import OptionOllamaSettings from "./options-settings-ollama"
import OptionKnowledgeBase from "./option-settings-knowledge"
import SidepanelChat from "./sidepanel-chat"
import SidepanelSettings from "./sidepanel-settings"

export const OptionRoutingChrome = () => {
  return (
    <Routes>
      <Route path="/" element={<OptionIndex />} />
      <Route path="/settings" element={<OptionSettings />} />
      <Route path="/settings/model" element={<OptionModal />} />
      <Route path="/settings/prompt" element={<OptionPrompt />} />
      <Route path="/settings/ollama" element={<OptionOllamaSettings />} />
      <Route path="/settings/knowledge" element={<OptionKnowledgeBase />} />
    </Routes>
  )
}

export const SidepanelRoutingChrome = () => {
  return (
    <Routes>
      <Route path="/" element={<SidepanelChat />} />
      <Route path="/settings" element={<SidepanelSettings />} />
    </Routes>
  )
}
