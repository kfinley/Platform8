const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-essentials",
    "@storybook/addon-links"
  ],
  core: {
    builder: 'webpack4',
  },
  webpackFinal: (config) => {
    // add SCSS support for CSS Modules
    config.module.rules.push({
      test: /\.s[a|c]ss$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            }
          },
          {
            // https://github.com/storybookjs/storybook/issues/6743
            loader: 'sass-loader',
            options: {
              additionalData: `
                @import "@platform8/web-ui/src/styles/_variables.scss";
              `
            }
          },
        ]
    });

    // config.module.rules.push({
    //   test: /\.svg$/,
    //   use: [
    //     'svg-sprite-loader',
    //     'svgo-loader'
    //   ]
    // });

    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(new TsconfigPathsPlugin({}));

    return config;
  },
};
