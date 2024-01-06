import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { NativeEventVue, DebugLogLevel } from 'native-event-vue'

createApp(App).use(router).use(NativeEventVue, { debugLogLevel: DebugLogLevel.Verbose }).mount('#app')
