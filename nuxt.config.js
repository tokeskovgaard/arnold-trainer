export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#fff'},
  /*
  ** Global CSS
  */
  css: [],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/google-analytics'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/sentry-module
    '@nuxtjs/sentry',
  ],
  /* See https://axios.nuxtjs.org/options */
  axios: {},
  googleAnalytics: {id: 'UA-107675518-4'},
  sentry: {
    dsn: 'https://989fe762680c44baa2be630fbd5adfec@sentry.io/1830276', // Enter your project's DSN here
    publishRelease: true,
    config: {}, // Additional config
  },
  /* Build configuration */
  build: {
    /* You can extend webpack config here */
    extend(config, ctx) {
      config.devtool = 'eval-source-map'
    }
  }
}
