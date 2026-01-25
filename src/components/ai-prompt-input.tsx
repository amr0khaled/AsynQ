import { Dispatch, SetStateAction } from "react"
import { Input } from "./ui/input"
import sanitize from 'sanitize-html'



type Props = {
  prompt?: string
  setPrompt: Dispatch<SetStateAction<string>>
  streamGemini: () => void
  isStreaming: boolean
}
export default function AiPromptInput({ prompt, setPrompt, streamGemini, isStreaming }: Props) {

  return <Input
    value={prompt}
    onChange={(e) => setPrompt(sanitize(e.target.value))}
    placeholder="What caption do you need?"
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        streamGemini()
      }
    }}
    disabled={isStreaming}
    className="md:min-w-lg md:max-w-full"
  />
}
