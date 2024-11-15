import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Desactivar SSR para que todo se ejecute en el cliente
  ssr: false,

  devtools: { enabled: true },

  modules: ["@nuxt/ui"],

  runtimeConfig: {
    // Claves privadas que solo estarán disponibles en el servidor
    apiSecret: '123',

    // Claves públicas que se exponen al cliente
    public: {
      apiKey: process.env.FIRE_APIKEY || '',
      authDomain: process.env.FIRE_AUTHDOMAIN || '',
      projectId: process.env.FIRE_PROJECTID || '',
      storageBucket: process.env.FIRE_STORAGEBUCKET || '',
      messagingSenderId: process.env.FIRE_MESSAGINGSENDERID || '',
      appId: process.env.FIRE_APPID || ''
    }
  },

  nitro: {
    prerender: {
      routes: ["/"]
    }
  }
});
