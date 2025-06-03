import { defineStore } from 'pinia'
import { useTgWebAppStore } from './tgWebApp' // Импортируем нужный store
import type { IProduct, IProductResponce, IProductInvoiceResponce } from '@/types/products'
import type { IPurchase } from '~/types/purchases'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as IProduct[],
    productsLastFetched: null as number | null, // Timestamp for products cache
    unconfiguredProducts: [] as IPurchase[],
  }),

  actions: {
    async fetchAllProducts(forceRefresh = false) {
      const CACHE_DURATION_MS_PRODUCTS = 5 * 60 * 1000; // 5 minutes for products
      const now = Date.now();

      if (!forceRefresh && this.products.length > 0 && this.productsLastFetched && (now - this.productsLastFetched < CACHE_DURATION_MS_PRODUCTS)) {
        console.log('fetchAllProducts: Returning fresh products from cache.');
        return Promise.resolve(this.products);
      }
      console.log('fetchAllProducts: Cache stale or not available or forced. Fetching products from API.');


      try {
        const tgWebAppStore = useTgWebAppStore()
        const accessToken = tgWebAppStore.accessToken
        // console.log('this token ', this.accessToken)
        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }

        const url = 'https://stage.api.delta-trade.app/api/v1/products/'
        const response = (await $fetch(url, {
          method: 'GET',
          headers,
        })) as IProduct[]
        this.products = []
        this.products = response;
        this.productsLastFetched = Date.now();
        // console.log(' fetchAllProducts', this.products, response)
        return response;
      } catch (error) {
        this.products = []
        console.error('fetchAllProducts ', error)
        return error
      }
    },
    async buyProduct(payload: {
      product_id: number,
      pay_from_balance: boolean
    }) {
      try {
        const tgWebAppStore = useTgWebAppStore()
        const accessToken = tgWebAppStore.accessToken
        // console.log('this token ', this.accessToken)
        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }


        const formData = new FormData()
        formData.append('product_id', payload.product_id.toString())
        if (payload.pay_from_balance !== undefined) {
          formData.append('pay_from_balance', payload.pay_from_balance ? 'true' : 'false');
        }

        const url = 'https://stage.api.delta-trade.app/api/v1/payments/buy-product/'
        const response = (await $fetch(url, {
          method: 'POST',
          headers,
          body: formData,
        })) as IProductInvoiceResponce


        const tgWebApp = useTgWebAppStore()
        const responseBalance = await tgWebApp.fetchUserBalance()
        // console.log('buyProduct response', response)
        // console.log('responseBalance response', responseBalance)
        return response
      } catch (error) {
        console.error('buyProduct ', error)
        return error
      }
    },
    // Robots
    async robotSetting(payload: { account_num: number, account_password: string, broker_id: number, broker_server_name: string, product_slug: string, purchase_id: number }) {
      try {
        const tgWebAppStore = useTgWebAppStore()
        const accessToken = tgWebAppStore.accessToken

        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }

        const formData = new FormData()

        if (payload.account_num) {
          formData.append('account_num', payload.account_num.toString())
        }

        if (payload.account_password) {
          formData.append('account_password', payload.account_password.toString())
        }

        if (payload.broker_id) {
          formData.append('broker_id', payload.broker_id.toString())
        }

        if (payload.broker_server_name) {
          formData.append('broker_server_name', payload.broker_server_name.toString())
        }



        if (payload.product_slug) {
          formData.append('product_slug', payload.product_slug.toString())
        }

        if (payload.purchase_id) {
          formData.append('purchase_id ', payload.purchase_id.toString())
        }

        const url = 'https://stage.api.delta-trade.app/api/v1/robots/setting/'
        const response = (await $fetch(url, {
          method: 'POST',
          headers,
          body: formData,
          onResponse: ({ response }) => {
            console.log('HTTP статус:', response.status);
          },
        }))

        // console.log(' robotSetting', this.products, response)
        return response
      } catch (error) {
        console.error('robotSetting ', error)
        return error
      }
    },
    async fetchRobotStatus(payload: { product_id: number }) {
      try {
        const tgWebAppStore = useTgWebAppStore()
        const accessToken = tgWebAppStore.accessToken
        // console.log('this token ', this.accessToken)
        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }

        const url = `https://stage.api.delta-trade.app/api/v1/robots/${payload.product_id}/setup-status/`
        const response = (await $fetch(url, {
          method: 'GET',
          headers,
          onResponse({ response }) {
            console.log('Статус ответа:', response.status);
          }
        }))

        // console.log(' fetchRobotStatus', this.products, response)

        return response
      } catch (error) {
        console.error('fetchRobotStatus ', error)
        return error
      }
    },
    // steps
    productByID(id: number) {
      if (this.products?.length > 0) {
        return this.products.filter(el => el.id == id)
      }
      return null
    },
    async fetchCheckUnconfiguredProducts() {
      try {
        const tgWebAppStore = useTgWebAppStore()
        const accessToken = tgWebAppStore.accessToken
        // console.log('this token ', this.accessToken)
        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }

        const url = 'https://stage.api.delta-trade.app/api/v1/purchases/non_configured_trading_systems/'
        const response = (await $fetch(url, {
          method: 'GET',
          headers,
        })) as IPurchase[]
        this.unconfiguredProducts = []
        this.unconfiguredProducts = response
        // console.log(' fetchCheckUnconfiguredProducts', this.unconfiguredProducts, response)

        return response
      } catch (error) {
        this.unconfiguredProducts = []
        console.error('fetchCheckUnconfiguredProducts ', error)
        return error
      }
    },
    fetchCheckUnconfiguredProductsByID(id: number) {
      if (this.unconfiguredProducts.length > 0) {
        const foundUnconfiguredProduct = this.unconfiguredProducts.filter(el => el.id === id)
        return foundUnconfiguredProduct[0]
      }
      return null
    },

  },
  getters: {
    getAllProducts(state) {
      return state.products
    },
    getTradingSystems(state) {
      if (state.products?.length > 0) {
        return state.products.filter(el => el.category?.name === 'Торговые системы' || el.category?.name === 'Robots');
      }
      return []
    },
    getReferralPrograms(state) {
      if (state.products?.length > 0) {
        return state.products.filter(
          el => el.category.name === "Рефералы" || el.category.name === "Referrals"
        )
      }
      return []
    },
  },
  persist: {
    paths: ['products', 'productsLastFetched', 'unconfiguredProducts'], // Added unconfiguredProducts as it was already in state and might be intended for persistence
  },
})
