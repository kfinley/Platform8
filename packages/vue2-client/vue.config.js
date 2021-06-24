// vue.config.js
const path = require('path');
module.exports = {
  configureWebpack: {
    // optimization: {
    //   runtimeChunk: 'single',
    //   splitChunks: {
    //     chunks: 'all',
    //     maxInitialRequests: Infinity,
    //     minSize: 0,
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]/,
    //         name(module) {
    //           // get the name. E.g. node_modules/packageName/not/this/part.js
    //           // or node_modules/packageName
    //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

    //           // npm package names are URL-safe, but some servers don't like @ symbols
    //           return `npm.${packageName.replace('@', '')}`;
    //         }
    //       }
    //     }
    //   }
    // },
    resolve: {
      alias: {
        vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js'),
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@platform8/web-ui/src/styles/styles.scss";`
      }
    }
  }
}
