import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import VueFuse from 'vue-fuse';
import DefaultLayout from '~/layouts/Default.vue';
// Relative import imporant here. Gridsom does not like import css from 'dygraphs/dist/dygraph.css'
import '../node_modules/dygraphs/dist/dygraph.css';
import '~/resources/scss/theme.scss';
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';

export default function(Vue, { router, appOptions, head, isClient }) {
  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'
  });

  head.link.push({
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css'
  });

  /*
  head.link.push({
    rel: 'stylesheet',
    href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css'
  });
  */

  // Add a meta tag
  head.meta.push({
    name: 'keywords',
    content: 'Analytics,COVID-19,predictions,charts,uniquekeywordfortestinghillsgreen'
  });

  Vue.use(VueFuse);

  // TODO Vuetify opts - includes, vuetify themes, icons, etc.
  const opts = {};
  Vue.use(Vuetify);

  appOptions.vuetify = new Vuetify(opts);

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout);
}
