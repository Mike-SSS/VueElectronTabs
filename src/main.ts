import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'

// // Vuetify
// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

// Plugins
import { registerPlugins } from '@/plugins'
import CloseComponentButtonVue from './components/CloseComponentButton.vue'


const app = createApp(App);
app.component("close-comp-button", CloseComponentButtonVue);
registerPlugins(app);
app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
