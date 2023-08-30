import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import { messages } from '../i18n/index'

const i18n = createI18n({
  locale: 'zh',
  messages,
})

export default function use(app: App) {
  app.use(i18n)
}
