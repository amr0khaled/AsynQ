import { PrismLight } from 'react-syntax-highlighter'
import type { Components } from 'react-markdown'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php'
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust'
import xml from 'react-syntax-highlighter/dist/esm/languages/prism/xml-doc'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin'
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'

import theme from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'

PrismLight.registerLanguage('tsx', tsx)
PrismLight.registerLanguage('jsx', jsx)
PrismLight.registerLanguage('sql', sql)
PrismLight.registerLanguage('rust', rust)
PrismLight.registerLanguage('swift', swift)
PrismLight.registerLanguage('kotlin', kotlin)
PrismLight.registerLanguage('python', python)
PrismLight.registerLanguage('cpp', cpp)
PrismLight.registerLanguage('php', php)
PrismLight.registerLanguage('xml', xml)
PrismLight.registerLanguage('javascript', javascript)
PrismLight.registerLanguage('typescript', typescript)
PrismLight.registerLanguage('css', css)
PrismLight.registerLanguage('json', json)
PrismLight.registerLanguage('c', c)
PrismLight.registerLanguage('bash', bash)

export const components: Components = {
  code({ node, inline, className, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <PrismLight
        style={theme}
        language={match[1]}
        PreTag="div"
        showLineNumbers={true}
        useInlineStyles={true}
        {...props}
      >
        {props.children}
      </PrismLight>
    ) : (
      <code className={className} {...props} />
    )
  }
}
