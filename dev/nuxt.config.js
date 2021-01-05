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

export default {
  target: "static",
  head: {
    titleTemplate: `${title} | %s`,
    title,
    meta: [{
      charset: "utf-8",
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    }, {
      hid: "description",
      name: "description",
      content: description,
    }, ],
    link: [{
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    }, {
      hid: "canonical",
      rel: "canonical",
      href: url,
    }, ],
  },
  css: [],
  plugins: [{
    src: "./plugins/smooth-scroll",
    mode: "client",
  }, ],
  components: true,
  buildModules: ["@nuxtjs/eslint-module", "@nuxtjs/stylelint-module", "@nuxtjs/tailwindcss", "@nuxtjs/svg", ],
  modules: ["@nuxtjs/pwa", "@nuxt/content", ],
  build: {},
  server: {
    host,
    port,
  },
  generate: {
    fallback: true,
  },
  content: {
    markdown: {
      prism: {
        theme: "prism-themes/themes/prism-atom-dark.css",
      },
    },
  },
  workbox: {
    cleanupOutdatedCaches: true,
    runtimeCaching: [{
      urlPattern: "https://fonts.googleapis.com/.*",
      cacheableResponse: {
        statuses: [0, 200, ],
      },
    }, {
      urlPattern: "https://cdn.jsdelivr.net/.*",
      cacheableResponse: {
        statuses: [0, 200, ],
      },
    }, ],
  },
  manifest: {
    name: title,
    lang: siteData.lang,
    display: "standalone",
    start_url: "/",
  },
  twa: {},
  ngrok: {
    addr: 8080,
  },
  publicRuntimeConfig: {
    baseUrl: url,
    navigation,
    siteData: {
      ...siteData,
      name: title,
      description: description,
    },
  },
  tailwindcss: {
    exposeConfig: true
  },
  build: {
    postcss: {
      plugins: {
        "postcss-nested": {}
      }
    }
  }
}
