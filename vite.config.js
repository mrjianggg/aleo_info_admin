import legacyPlugin from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteLogo } from './src/core/config'
import Banner from 'vite-plugin-banner'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import vuePlugin from '@vitejs/plugin-vue'
import GvaPosition from './vitePlugin/gvaPosition'
import GvaPositionServer from './vitePlugin/codeServer'
import fullImportPlugin from './vitePlugin/fullImport/fullImport.js'
import { svgBuilder } from './vitePlugin/svgIcon/svgIcon.js'
// @see https://cn.vitejs.dev/config/
export default ({
  command,
  mode
}) => {
  const NODE_ENV = mode || 'production'
  const envFiles = [
    `.env.${NODE_ENV}`
  ]
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }

  viteLogo(process.env)

  const timestamp = Date.parse(new Date())

  const optimizeDeps = {}

  const alias = {
    '@': path.resolve(__dirname, './src'),
    'vue$': 'vue/dist/vue.runtime.esm-bundler.js',
  }

  const esbuild = {}

  const rollupOptions = {
    output: {
      entryFileNames: 'assets/087AC4D233B64EB0[name].js',
      chunkFileNames: 'assets/087AC4D233B64EB0[name].js',
      assetFileNames: 'assets/087AC4D233B64EB0[name].[ext]',
    },
  }

  const config = {
    base: './', // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias,
    },
    define: {
      'process.env': {}
    },
    server: {
      // 如果使用docker-compose开发模式，设置为false
      open: true,
      port: process.env.VITE_CLI_PORT,
      // proxy: {
      //   // 把key的路径代理到target位置
      //   // detail: https://cli.vuejs.org/config/#devserver-proxy
      //   '/api': { // 需要代理的路径   例如 '/api'
      //     target: `https://demo.gin-vue-admin.com/`, // 代理到 目标路径
      //     secure: true, // 接受运行在https上，默认不接受
      //     changeOrigin: true, // 如果设置为true,那么本地会虚拟一个服务器接收你的请求并代你发送该请求，这样就不会有跨域问题（只适合开发环境）
      //     // rewrite: path => path.replace(new RegExp('^' + process.env.VITE_BASE_API), ''),
      //     // pathRewrite: { //重写路径 比如'/apis/aaa/ccc'重写为'/aaa/ccc'
      //     //   '^/api': ''
      //     // }
      //   }
      // },
    },
    build: {
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出manifest.json
      sourcemap: false, // 是否产出sourcemap.json
      outDir: 'dist', // 产出目录
      rollupOptions,
    },
    esbuild,
    optimizeDeps,
    plugins: [
      process.env.VITE_POSITION === 'open' && GvaPositionServer(),
      process.env.VITE_POSITION === 'open' && GvaPosition(),
      legacyPlugin({
        targets: ['Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15'],
      }),
      vuePlugin(),
      svgBuilder('./src/assets/icons/'),
      [Banner(`\n Build based on gin-vue-admin \n Time : ${timestamp}`)]
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/style/element/index.scss" as *;`,
        }
      }
    },
  }

  if (NODE_ENV === 'production') {
    config.plugins.push(
      fullImportPlugin()
    )
  } else {
    config.plugins.push(AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })]
    }))
  }
  return config
}
