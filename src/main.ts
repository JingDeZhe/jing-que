import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import useI18n from './libs/i18n'
import useVuetify from './libs/vuetify'
import router from './router'

import './assets/main.scss'
import 'virtual:uno.css'

const app = createApp(App)

useI18n(app)
useVuetify(app)
app.use(createPinia())
app.use(router)

app.mount('#app')
