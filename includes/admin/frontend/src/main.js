import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Notifications from 'notiwind'

import App from './App.vue'
import router from './router'


import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Notifications)
app.mount('#rapidload-app')
