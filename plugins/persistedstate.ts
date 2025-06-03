import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia
  if (pinia) {
    pinia.use(piniaPluginPersistedstate)
  } else {
    // Fallback for Nuxt 2 or if $pinia is not available
    // This might indicate a different setup or Pinia not being properly initialized by @pinia/nuxt
    console.warn('Pinia instance not found on nuxtApp.$pinia. Attempting to create a new one for persisted state.')
    const newPiniaInstance = createPinia()
    newPiniaInstance.use(piniaPluginPersistedstate)
    nuxtApp.vueApp.use(newPiniaInstance)
    // Attempt to make it available globally, though this might not be standard
    // nuxtApp.provide('pinia', newPiniaInstance) 
  }
})
