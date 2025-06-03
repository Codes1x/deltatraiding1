import { defineStore } from 'pinia'
import type { IFaq } from '~/types/faq'

export const useFaqStore = defineStore('faq', {
  state: () => ({
    faq: [] as IFaq[],
  }),

  actions: {
    async fetchAllFaqs() {
      try {
        const tgWebAppStore = useTgWebAppStore()
        const accessToken = tgWebAppStore.accessToken
        // console.log('this token ', this.accessToken)
        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }

        const url = 'https://stage.api.delta-trade.app/api/v1/support/faq/'
        const response = (await $fetch(url, {
          method: 'GET',
          headers,
        })) as IFaq[]
        this.faq = response
        console.log('this faq', response)

        return response
      } catch (error) {
        this.faq = []
        console.error('faq ', error)
        return error
      }
    }
  },
  getters: {
    getFaq(state) {
      return state.faq
    },
  }
})
