import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { NativeEventVue } from '../../lib/main.ts'

createApp(App).use(router).use(NativeEventVue).mount('#app')
