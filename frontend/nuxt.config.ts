// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  image: {
      format: ['webp'],
      domains: [
          'lh3.googleusercontent.com'
      ]
  },

  modules: [
      "nuxt-primevue",
      "nuxt-icon",
      "@pinia/nuxt",
      "@nuxtjs/tailwindcss",
      "@pinia-plugin-persistedstate/nuxt",
      "@nuxt/image",
  ],


  css: [
      "~/assets/css/main.css",
      "primevue/resources/themes/aura-light-green/theme.css",
      "primeicons/primeicons.css",

  ],

  postcss: {
      plugins: {
          tailwindcss: {},
          autoprefixer: {},
      },
  },

  vite: {
      server: {
          host: true,
          port: 3001,
          watch: {
              usePolling: true,
          },
      },
  },

  runtimeConfig: {
      // The private keys which are only available server side
      apiSecret: process.env.NUXT_API_URL,

      public: {
          // this base url for api call
          baseURl: process.env.NUXT_API_URL,
          // This is master key for add access
          masterToken: process.env.NUXT_API_TOKEN,

        //   this meta seo Application url
          metaBaseUrl:process.env.META_BASE_URL,
        //   this is meta seo Application name
          metaApplicationName:process.env.META_BASE_APPLICATION_NAME,
        //   this is meta seo application icon
         metaApplicationIcon:process.env.META_BASE_ICON
      },
  },

  compatibilityDate: "2024-11-19",
});