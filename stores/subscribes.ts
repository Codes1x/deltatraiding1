import { defineStore } from 'pinia'
import { useTgWebAppStore } from '@/stores/tgWebApp'
import type { ISubscribesResponseArray } from '~/types/subscribes'

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const useSubscribesStore = defineStore('subscribes', {
  state: () => ({
    subscribes: [] as ISubscribesResponseArray[],
    isLoadingSubscribes: false,
    fetchSubscribesPromise: null as Promise<any> | null,
    lastFetched: null as number | null, // Timestamp of the last successful fetch
  }),

  actions: {
    async fetchSubsribes(forceRefresh = false) {
      const now = Date.now();

      // Return cached data if available, not forced, and not stale
      if (!forceRefresh && this.subscribes.length > 0 && this.lastFetched && (now - this.lastFetched < CACHE_DURATION_MS)) {
        console.log('fetchSubscribes: Returning fresh data from cache.');
        return Promise.resolve(this.subscribes);
      }

      // If a fetch is already in progress, return its promise
      if (this.isLoadingSubscribes && this.fetchSubscribesPromise) {
        console.log('fetchSubscribes is already in progress. Returning existing promise.');
        return this.fetchSubscribesPromise;
      }

      console.log('fetchSubscribes: Cache stale or not available or forced. Fetching from API.');
      this.isLoadingSubscribes = true;
      this.fetchSubscribesPromise = (async () => {
        try {
          const { accessToken } = useTgWebAppStore();
          if (!accessToken) {
            throw new Error('Access token is missing');
          }

          const headers = { Authorization: `JWT ${accessToken}` };
          const url = `https://stage.api.delta-trade.app/api/v1/purchases/all_subscribes/`;

          const startFetch = performance.now();
          const response = await $fetch<ISubscribesResponseArray[]>(url, {
            method: 'GET',
            headers,
          });
          const endFetch = performance.now();
          console.log(`API fetch time: ${(endFetch - startFetch).toFixed(2)} ms`);

          this.subscribes = response;
          this.lastFetched = Date.now(); // Update lastFetched timestamp
          console.log(`State assignment time: ${(performance.now() - endFetch).toFixed(2)} ms`);

          return response;
        } catch (error) {
          // Do not clear subscribes on error if we have old data, to avoid UI flicker
          // this.subscribes = []; 
          // this.lastFetched = null;
          console.error('fetchSubscribes error:', error);
          throw error;
        } finally {
          this.isLoadingSubscribes = false;
          this.fetchSubscribesPromise = null;
        }
      })();
      return this.fetchSubscribesPromise;
    },

    async fetchUnconfiguredSubscribeByID(id: number) {
      return this.subscribes.find(el => el.id === id) || null
    },

    fetchSubscribeByID(payload: { id: number }) {
      return this.subscribes.find(el => el.id === payload.id)
    },

    updateAutoTradeStatusByID(payload: { robotId: number; auto_trade: boolean }) {
      const result = this.subscribes.find(el => el.id === payload.robotId)
      if (result) {
        result.auto_trade = payload.auto_trade
      }
    },
  },

  getters: {
    getAllSubscribes(state) {
      return state.subscribes
    },

    getTS(state) {
      return state.subscribes.filter(el =>
        ['Торговые системы', 'Robots'].includes(el.product.category.name)
      )
    },

    getTSwithVPS(state) {
      console.time('getTSwithVPS')

      const TSList = state.subscribes.filter(el =>
        ['Торговые системы', 'Robots'].includes(el.product.category.name)
      )

      const VPSMap = new Map<number, ISubscribesResponseArray[]>()
      state.subscribes
        .filter(el => el.product.category.name === 'VPS')
        .forEach(vps => {
          const purchaseId = vps.product.purchase_id
          if (!VPSMap.has(purchaseId)) {
            VPSMap.set(purchaseId, [])
          }
          VPSMap.get(purchaseId)?.push(vps)
        })

      const result = TSList.map(ts => ({
        tradingSystem: ts,
        vps: VPSMap.get(ts.id) || [],
      }))

      console.timeEnd('getTSwithVPS')
      return result
    },

    getSubscribedReferralProgram(state) {
      return state.subscribes.filter(el =>
        ['Рефералы', 'Referrals'].includes(el.product.category.name)
      )
    },
  },
  persist: {
    paths: ['subscribes', 'lastFetched'], // Persist these state properties
  },
})