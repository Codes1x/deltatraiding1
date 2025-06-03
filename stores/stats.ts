import { defineStore } from 'pinia'
import type { IStats } from '~/types/stats'

export const useStatsStore = defineStore('stats', {
    state: () => ({
        stats: {} as IStats,
    }),

    actions: {
        async fetchStats(payload: { product_id: number }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                // console.log('this token ', this.accessToken)
                const headers: Record<string, string> = {
                    Authorization: `Bearer JWT ${accessToken}`,
                }
                const url = 'https://forex-orders-store.ntxpro.ai/v1/orders/profit_statistics_optimized/info/'
                // old slow const url = 'https://forex-orders-store.ntxpro.ai/v1/orders/profit_statistics/info/'
                const response = (await $fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers,
                })) as IStats
                this.stats = {}
                this.stats = response
                // console.log(' fetchBrokers', this.brokers, response)

                return response
            } catch (error) {
                this.stats = {}
                console.error('fetchBrokers ', error)
                return error
            }
        },
        async fetchStatsSummarize(payload: { products_ids: number[] }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                console.log('payload.products_ids ', payload.products_ids)
                const headers: Record<string, string> = {
                    Authorization: `Bearer JWT ${accessToken}`,
                }
                const url = 'https://forex-orders-store.ntxpro.ai/v1/orders/profit_statistics_optimized/all_user_robots/info/'
                const response = (await $fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers,
                })) as IStats
                this.stats = {}
                this.stats = response
                // console.log(' fetchBrokers', this.brokers, response)

                return response
            } catch (error) {
                this.stats = {}
                console.error('fetchStatsSummarize ', error)
                return error
            }
        },

    },
    getters: {
        getStatsMonth(state) {
            if (state.stats) {
                return state.stats.days_30
            }
            return {}
        },
        getStatsWeek(state) {
            if (state.stats) {
                return state.stats.days_7
            }
            return {}
        },
        getStatsToday(state) {
            if (state.stats) {
                return state.stats.today
            }
            return {}
        },
        getStatsAllTime(state) {
            if (state.stats.all_time) {
                return state.stats.all_time
            }
            return {}
        },
        getStatsAll(state) {
            if (state.stats) {
                return state.stats
            }
            return {}
        }
    }
})