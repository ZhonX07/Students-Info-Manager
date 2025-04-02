const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      contextIsolation: true,
      customFileProtocol: 'app://./',
      preload: 'src/preload.js',
      // webpack配置
      chainWebpackRendererProcess: (config) => {
        config.externals({
          'electron': 'require("electron")',
          '@electron/remote': 'require("@electron/remote")',
          'fs': 'require("fs")',
          'fs-extra': 'require("fs-extra")',
          'path': 'require("path")'
        })
      },
      // 确保Vue Router正常工作
      builderOptions: {
        extraResources: ['src/**/*'],
        appId: 'com.student.information.system',
        productName: 'Student Information System'
      }
    }
  },
  configureWebpack: {
    externals: {
      'electron': 'electron',
      '@electron/remote': '@electron/remote'
    },
    resolve: {
      fallback: {
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        assert: false,
        os: false
      }
    },
    devtool: 'source-map',
    plugins: [
      // 添加Vue 3所需的特性标志
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
      })
    ]
  }
})
