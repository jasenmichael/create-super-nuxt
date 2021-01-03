const siteData = require('./content/sitedata.json')
const navigation = require('./content/navigation.json')
const host = '0.0.0.0' // or "localhost"
const port = 3000
const url =
  process.env.NODE_ENV != 'production'
    ? `http://localhost:${port}`
    : process.env.URL || `http://localhost:${port}`
const title =
  siteData.name ||
  process.env.npm_package_name
    .replace(/-/g, ' ')
    .replace(/(^\w{1})|(\s+\w{1})/g, (l) => l.toUpperCase())
const description = siteData.description || process.env.npm_package_description

module.exports = {
  // replaceFolders: ['components', 'content', 'layouts', 'pages', 'utils'],
  // mergeFolders: ['static', 'plugins'],
  replaceFiles: [],
  dependencies: ['@nuxtjs/pwa', '@nuxt/content', 'prism-themes'],
  devDependencies: [],
  scripts: {
    dev: 'nuxt',
    predev: 'node ./utils/prebuild.js',
    prebuild: 'node ./utils/prebuild.js',
    build: 'nuxt build',
    start: 'nuxt start',
    generate: 'nuxt generate',
    'lint:js': 'eslint --ext .js,.vue --ignore-path .gitignore .',
    'lint:style': 'stylelint **/*.{vue,css} --ignore-path .gitignore',
    lint: 'npm run lint:js && npm run lint:style',
    cmsProxy: 'npx netlify-cms-proxy-server',
  },
  mergeNuxtConfig: {
    css: [],
    plugins: [],
    modules: ['@nuxtjs/pwa', '@nuxt/content'],
    buildModules: [
      // '@nuxtjs/ngrok',
      // 'nuxt-twa-module',
    ],
  },
  addReplaceNuxtConfig: {
    server: {
      // for self asign key keyName
      // use keyName: "''''''"
      host: "''''''",
      port: "''''''",
    },
    generate: {
      fallback: true,
    },
    head: {
      titleTemplate: "'''`${title} | %s`'''",
      title: "''''''",
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          hid: 'description',
          name: 'description',
          content: "'''description'''",
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          hid: 'canonical',
          rel: 'canonical',
          href: "'''url'''",
        },
      ],
    },
    components: true,
    content: {
      markdown: {
        prism: {
          theme: 'prism-themes/themes/prism-atom-dark.css',
        },
      },
    },
    workbox: {
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          // handler: 'cacheFirst',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
        {
          urlPattern: 'https://cdn.jsdelivr.net/.*',
          // handler: 'cacheFirst',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      ],
    },
    manifest: {
      name: "'''title'''",
      lang: "'''siteData.lang'''" || 'en-US',
      display: 'standalone',
      start_url: '/',
    },
    twa: {
      //   // https://github.com/voorhoede/nuxt-twa-module#readme
      //   defaultUrl: 'url',
      //   hostName: 'nuxt-app-test.netlify.app',
      //   sha256Fingerprints: ['/* your SHA-256 keys */'],
      //   applicationId: 'com.example.example',
      //   launcherName: 'Your app name',
      //   versionCode: 1,
      //   versionName: '1.0',
      //   statusBarColor: 'grey',
      //   iconPath: '/static/icon.png',
      //   // distFolder: '.nuxt/dist/client',
    },
    ngrok: {
      addr: 8080,
    },
    publicRuntimeConfig: {
      // for var use "'''var'''"
      baseUrl: "'''url'''",
      navigation: "''''''",
      siteData: {
        // for spreader ...var
        // use var: '...var',
        siteData: '...siteData',
        // url,
        name: "'''title'''",
        description: "'''description'''",
      },
    },
  },
}
