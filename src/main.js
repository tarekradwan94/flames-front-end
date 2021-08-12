import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import HomePage from './components/pages/HomePage.vue';
import OccasionsPage from './components/pages/OccasionsPage.vue';
import StylesPage from './components/pages/StylesPage.vue';
import SearchResultsPage from './components/pages/SearchResultsPage.vue';
import OutfitPage from './components/pages/OutfitPage.vue';
import { defaultLocale } from './i18n/i18n.config';
import { languages } from './i18n/i18n.config';
import axios from 'axios';
import { constants } from './utilities/constants';
import dataCenter from './dataCenter';

Vue.config.productionTip = false;

//used libraries
Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use({
  install (Vue) {
    // Add a request interceptor for custom headers: e.g. locale
    let axiosToolbox = {
      defaultLocale,
      constants
    };
    Vue.prototype.$api = axios.create({
      baseURL: constants.backend.endpointRoot
    });
    Vue.prototype.$api.defaults.withCredentials = true;
    Vue.prototype.$api.interceptors.request.use(function (config) {
      config.headers[this.constants.backend.localeHTTPHeader] =  this.defaultLocale;
      return config;
    }.bind(axiosToolbox), (error) => {
        return Promise.reject(error);
    });
  }
});

//manage routing
const routes = [
  { name:'home', path: '/', component: HomePage },
  { name:'results', path: '/results/:keyWords?/:occasionID/:styleID', component: SearchResultsPage, props: true},
  { name:'occasions', path: '/occasions', component: OccasionsPage },
  { name:'styles', path: '/styles', component: StylesPage },
  { name:'outfit', path: '/outfit/:uniqueName', component: OutfitPage, props: true }
];

const router = new VueRouter({
  routes, // short for `routes: routes`
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let scrollPosition = savedPosition;
        if (!savedPosition) {
          scrollPosition = { x: 0, y: 0 };
        }
        resolve(scrollPosition);
      }, 250); //250 ms since transition animation is 200ms -> scroll right after transition is over
    });
  }
});

//manage languages
const messages = Object.assign(languages);
var i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages
});

//mount app
new Vue({
  store: dataCenter,
  router,
  i18n
}).$mount('#flames-app');