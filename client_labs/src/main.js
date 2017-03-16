import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import store from './store'

import App from './App'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'

import PrivateMessageInbox from './components/private-message/PrivateMessageInbox'
import PrivateMessageCompose from './components/private-message/PrivateMessageCompose'
import PrivateMessageSent from './components/private-message/PrivateMessageSent'
import PrivateMessageView from './components/private-message/PrivateMessageView'

import Logger from './plugins/Logger'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Logger, {loggin: true})

Vue.component('app', App)

const routes = [
  {path: '/', component: LoginPage, name: 'home'},
  {path: '/dashboard', component: DashboardPage, name: 'dashboard', meta: { requiresAuth: true }},
  {path: '/chat', component: ChatPage, name: 'chat', meta: { requiresAuth: true }},
  {path: '/new-pm', component: PrivateMessageCompose, name: 'new-pm', meta: { requiresAuth: true }},
  {path: '/inbox-pms', component: PrivateMessageInbox, name: 'inbox-pms', meta: { requiresAuth: true }},
  {path: '/pms/:id', component: PrivateMessageView, name: 'pm-view', meta: { requiresAuth: true }},
  {path: '/sent-pms', component: PrivateMessageSent, name: 'my-sent-pms', meta: { requiresAuth: true }}

]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authUser = JSON.parse(window.localStorage.getItem('authUser'))
    if (authUser && authUser.access_token) {
      next()
    } else {
      next({name: 'home'})
    }
  }
  next()
})

Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (response.status === 401) {
      console.log('Need to login again')
    }
  })
})

new Vue({
  router, store
}).$mount('#app')
