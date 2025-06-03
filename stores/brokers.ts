import { defineStore } from 'pinia'
import type { IBrokerSimple } from '~/types/brokers'

export const useBrokersStore = defineStore('brokers', {
    state: () => ({
        brokers: [] as IBrokerSimple[],
        referrefLink: '',
        referralLink: ''
    }),

    actions: {
        async fetchBrokers(payload: { product_slug?: string }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                // console.log('this token ', this.accessToken)
                const headers: Record<string, string> = {
                    Authorization: `Bearer JWT ${accessToken}`,
                }

                const formData = new FormData()
                if (payload.product_slug) {
                    formData.append('product_slug', payload.product_slug.toString())
                }

                const url = 'https://robots.nitrex.online/api/v4/brokers/'
                const response = (await $fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers,
                })) as IBrokerSimple[]
                this.brokers = []
                this.brokers = response
                // console.log(' fetchBrokers', this.brokers, response)

                return response
            } catch (error) {
                this.brokers = []
                console.error('fetchBrokers ', error)
                return error
            }
        },
        async fetchBrokersByID(payload: { product_slug?: string, broker?: number, cent?: boolean | null }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                // console.log('this token ', this.accessToken)
                const headers: Record<string, string> = {
                    Authorization: `Bearer JWT ${accessToken}`,
                }

                const formData = new FormData()
                if (payload.product_slug) {
                    formData.append('product_slug', payload.product_slug.toString())
                }

                if (payload.broker) {
                    formData.append('broker', payload.broker.toString())
                }

                const url = 'https://robots.nitrex.online/api/v4/broker_servers/'
                const response = (await $fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers,
                })) as IBroker[]
                this.brokers = []
                this.brokers = response
                // console.log(' fetchBrokers', this.brokers, response)

                return response
            } catch (error) {
                this.brokers = []
                console.error('fetchBrokers ', error)
                return error
            }
        },
        // -------- Referrer Link //
        async fetchReferrer() {
            // Получение реф ссылку от брокера
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }

                const url = `https://stage.api.delta-trade.app/api/v1/user/referrer-broker-link/`
                const response = (await $fetch(url, {
                    method: 'GET',
                    headers,
                })) as { link: string }
                this.referrefLink = response.link
                console.log('this fetchReferrer', response)
                return response
            } catch (error) {
                this.referrefLink = ''
                console.error('fetchReferrer ', error)
                return error
            }
        },
        // -------- Referral Link //
        async fetchReferral() {
            // Получение реф ссылку от брокера
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }

                const url = `https://stage.api.delta-trade.app/api/v1/user/referral-broker-link/`
                const response = (await $fetch(url, {
                    method: 'GET',
                    headers,
                })) as { link: string }
                this.referralLink = response.link
                console.log('this fetchReferrer', response)
                return response
            } catch (error) {
                this.referralLink = ''
                console.error('fetchReferrer ', error)
                return error
            }
        },
        async changeReferrerLink(payload: { link: string }) {
            // API для установки broker link
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
                formData.append('link', payload.link.toString())


                const url = 'https://stage.api.delta-trade.app/api/v1/user/referral-broker-link/'
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                }))
                this.fetchReferral()
                return response
            } catch (error) {
                console.error('changeReferrerLink ', error)
                return error
            }
        },
    },
    getters: {
        getBrokers(state) {
            if (state.brokers.length > 0) {
                return state.brokers
            }
            return []
        },
        getReferralLink(state) {
            if (state.referralLink.length > 0) {
                return state.referralLink
            }
            return ''
        },
        getReferrerLink(state) {
            if (state.referrefLink.length > 0) {
                return state.referrefLink
            }
            return ''
        }
    }
})