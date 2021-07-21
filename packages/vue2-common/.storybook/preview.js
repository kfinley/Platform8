import 'reflect-metadata';
import Vue from 'vue'
import Vuex from 'vuex'
import { setupValidation } from './../src/validation';
import { extend } from 'vee-validate';
import { action } from '@storybook/addon-actions';

import '!style-loader!css-loader!sass-loader!../node_modules/bootstrap/dist/css/bootstrap.css';
import '!style-loader!css-loader!sass-loader!@platform8/web-ui/src/styles/styles.scss';

Vue.use(Vuex);
setupValidation(extend);

Vue.component('RouterLink', {
  props:   ['to'],
  methods: {
    log() {
      action('link target')(this.to)
    },
  },
  template: '<a href="#" @click.prevent="log()"><slot>RouterLink</slot></a>',
});
