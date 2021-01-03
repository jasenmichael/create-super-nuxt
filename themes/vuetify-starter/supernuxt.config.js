module.exports = {
    replaceFolders: ['components', 'content', 'layouts', 'pages', 'utils'],
    mergeFolders: ['static', 'plugins'],
    replaceFiles: [],
    dependencies: [
        'vue-masonry',
        '@mdi/js',
    ],
    devDependencies: ['write-json-file', 'load-json-file'],
    scripts: {
        "dev": "npm run tumblrCache && nuxt",
        "build": "npm run tumblrCache && nuxt build",
        "start": "nuxt start",
        "generate": "npm run tumblrCache && nuxt generate",
        "tumblrCache": "node -e \"require('./plugins/tumblr').cacheTumblrDownloadImages('annefeeney')\"",
        "cmsProxy": "npx netlify-cms-proxy-server"
    },
    mergeNuxtConfig: {
        css: [],
        plugins: ['~/plugins/getMeta', {
            src: '~/plugins/vue-masonry',
            ssr: false
        }],
        modules: [
            '@nuxtjs/pwa',
            '@nuxt/content',
        ],
        buildModules: [
            'nuxt-purgecss',
            'nuxt-font-loader',
            '@nuxtjs/ngrok',
            // 'nuxt-twa-module',
        ]
    },
    addReplaceNuxtConfig: {
        server: {
            // for self asign key keyName
            // use keyName: "''''''"
            host: "''''''",
            port: "''''''"
        },
        generate: {
            fallback: true
        },
        head: {
            titleTemplate: "'''`${title} | %s`'''",
            title: "''''''",
            meta: [{
                    charset: 'utf-8'
                },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                },
                {
                    hid: 'description',
                    name: 'description',
                    content: "'''description'''"
                }
            ],
            link: [{
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.ico'
                },
                {
                    hid: 'canonical',
                    rel: 'canonical',
                    href: "'''url'''"
                }
            ]
        },
        workbox: {
            cleanupOutdatedCaches: true,
            runtimeCaching: [{
                urlPattern: 'https://fonts.googleapis.com/.*',
                // handler: 'cacheFirst',
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }, {
                urlPattern: 'https://cdn.jsdelivr.net/.*',
                // handler: 'cacheFirst',
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }]
        },
        manifest: {
            name: "'''title'''",
            lang: "'''siteData.lang'''" || "en-US",
            display: "standalone",
            start_url: "/"
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
            addr: 8080
        },
        publicRuntimeConfig: {
            // for var use "'''var'''"
            baseUrl: "'''url'''",
            siteData: {
                // for spreader ...var
                // use var: '...var',
                siteData: '...siteData',
                // url,
                name: "'''title'''",
                description: "'''description'''"
            }
        }
    }
}
