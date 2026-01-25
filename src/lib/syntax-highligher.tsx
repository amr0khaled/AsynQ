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
      <div className='grid grid-cols-1 w-full max-w-full'>
        <PrismLight
          style={theme}
          customStyle={{
            margin: '0',
            width: '100% !important',
            display: 'grid',
            overflowX: 'auto',
          }}
          codeTagProps={{
            style: {
              // FIX THE TYPO HERE
              width: 'fit-content', // Allows code to grow > 100% to trigger scroll
              minWidth: '100%',     // Ensures bg fills container if code is short
              display: 'block',     // Treats code as a box, not inline text
            }
          }}
          language={match[1]}
          PreTag="div"
          showLineNumbers={true}
          useInlineStyles={true}
          {...props}
          className={`${!!className ? className + ' ' : ''}m-0 w-full md:max-w-none px-0 md:p-1 overflow-x-auto`}
        >
          {props.children}
        </PrismLight>
      </div>
    ) : (
      <code className={className} {...props} />
    )
  }
}
