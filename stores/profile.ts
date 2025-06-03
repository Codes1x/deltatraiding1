import { defineStore } from 'pinia'
import { useTgWebAppStore } from '@/stores/tgWebApp'

export const useProfileStore = defineStore('profile', {
    state: () => ({

    }),
    actions: {

        async setLanguage(payload: { language: string }) {
            // API для установки setLanguage
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }

                const formData = new FormData()
                formData.append('language', payload.language.toString())


                const url = 'https://stage.api.delta-trade.app/api/v1/user/update-language/'
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                })) as boolean

                return response
            } catch (error) {
                console.error('setLanguage ', error)
                return error
            }
        },

    },
    getters: {
    },
})