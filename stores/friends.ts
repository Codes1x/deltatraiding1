import { defineStore } from 'pinia'
import { useTgWebAppStore } from '@/stores/tgWebApp'
import type { IFriend } from '~/types/friends'

export const useFriendsStore = defineStore('friends', {
  state: () => ({
    friends: [] as IFriend[],
    referralLinkTG: '',
    referralLinkWeb: '',
    referralLinkBot: ''
  }),

  actions: {
    async fetchAllUserReferrals(payload: { max_level: number }) {
      try {
        const tgWebAppStore = useTgWebAppStore()
        const accessToken = tgWebAppStore.accessToken

        if (!accessToken) {
          throw new Error('Access token is missing')
        }

        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }

        const url = `https://stage.api.delta-trade.app/api/v1/referral/all_user_referrals/?max_level=${payload.max_level}`

        const response = await $fetch<IFriend[]>(url, {
          method: 'GET',
          headers,
        })

        this.friends = response

        // 🔄 Загружаем и реферальные ссылки после загрузки друзей
        await this.fetchReferralLink()

        return response
      } catch (error) {
        this.friends = []
        console.error('fetchAllUserReferrals error:', error)
        return error
      }
    },

    async fetchReferralLink() {
      try {
        const tgWebAppStore = useTgWebAppStore()
        const accessToken = tgWebAppStore.accessToken

        console.log('🪪 Access token:', accessToken)

        if (!accessToken) {
          throw new Error('Access token is missing')
        }

        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }

        const url = 'https://stage.api.delta-trade.app/api/v1/referral/link/'

        const response = await $fetch<{
          referral_link_tg?: string
          referral_link_web?: string
        }>(url, {
          method: 'GET',
          headers,
        })

        console.log('📦 API ответ на fetchReferralLink:', response)

        this.referralLinkTG = response.referral_link_tg?.trim() || ''
        this.referralLinkWeb = response.referral_link_web?.trim() || ''

        if (this.referralLinkWeb) {
          const regex = /reff_([a-z0-9]+)/i
          const match = this.referralLinkWeb.match(regex)

          if (match) {
            this.referralLinkBot = match[0]
          } else {
            this.referralLinkBot = ''
          }
        } else {
          this.referralLinkBot = ''
        }

        return response
      } catch (error) {
        this.referralLinkTG = ''
        this.referralLinkWeb = ''
        this.referralLinkBot = ''
        console.error('fetchReferralLink error:', error)
        return error
      }
    },
  },

  getters: {
    getUserReferrals(state) {
      return state.friends
    },
    getPersonalReferralLinkTG(state) {
      return state.referralLinkTG
    },
    getPersonalReferralLinkWeb(state) {
      return state.referralLinkWeb
    },
    getPersonalReferralLinkBot(state) {
      return state.referralLinkBot
    },
  },
})
