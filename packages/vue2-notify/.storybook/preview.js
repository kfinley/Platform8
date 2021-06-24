import Vue from 'vue'
import Vuex from 'vuex'

import '!style-loader!css-loader!sass-loader!../node_modules/bootstrap/dist/css/bootstrap.css';
// import '!style-loader!css-loader!sass-loader!@platform8/web-ui/src/styles/styles.scss';

Vue.use(Vuex)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  // layout: 'centered',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
 