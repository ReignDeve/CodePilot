import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import '@radix-ui/themes/styles.css'
import App from 'App'
import { Theme } from '@radix-ui/themes'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <Theme>
    <App />
  </Theme>
)
