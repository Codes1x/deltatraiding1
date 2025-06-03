import { defineStore } from 'pinia'
import { useTgWebAppStore } from '@/stores/tgWebApp'

export const useCodeStore = defineStore('code', {
    state: () => ({
        isCodeSet: false as boolean
    }),
    actions: {
        async fetchIsCode() {
            this.isCodeSet = false
            // API для проверки, установлен ли SECRET_CODE. Возвращает True, если код уже установлен, иначе False
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }

                const url = `https://stage.api.delta-trade.app/api/v1/payments/check-secret-code/`
                const response = (await $fetch(url, {
                    method: 'GET',
                    headers,
                })) as { is_secret_code_set: boolean }
                this.isCodeSet = response.is_secret_code_set
                return response
            } catch (error) {
                this.isCodeSet = false
                console.error('fetchIsCode ', error)
                return error
            }
        },
        async setCode(payload: { secret_code: string }) {
            // API для установки SECRET_CODE
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
                formData.append('secret_code', payload.secret_code.toString())


                const url = 'https://stage.api.delta-trade.app/api/v1/payments/set-secret-code/'
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                })) as boolean

                return response
            } catch (error) {
                console.error('setCode ', error)
                return error
            }
        },
    },
    getters: {
        getIsCodeSet(state) {
            return state.isCodeSet
        }
    },
})