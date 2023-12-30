import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VNativeEvent from '../views/VNativeEvent.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/v-native-event',
    name: 'v-native-event',
    component: VNativeEvent,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
