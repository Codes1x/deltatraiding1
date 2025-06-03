import { defineStore } from 'pinia'
import { useTgWebAppStore } from './tgWebApp' // Импортируем нужный store
import type { IPurchase, IPurchaseResponse } from '~/types/purchases'

export const usePurchasesStore = defineStore('purchases', {
    state: () => ({
        purchases: null as unknown as IPurchaseResponse | null,
        currentSetupPurchase: null as IPurchase | null,
        isInSetupProcess: false
    }),

    actions: {
        async fetchAllPurchases(payload: { page: number, page_size: number }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                // console.log('this token ', this.accessToken)
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }

                const url = `https://stage.api.delta-trade.app/api/v1/purchases/?page=${payload.page}&page_size=${payload.page_size}`
                const response = (await $fetch(url, {
                    method: 'GET',
                    headers,
                })) as IPurchaseResponse
                this.purchases = response
                // console.log('this friends', this.purchases =, response)

                return response
            } catch (error) {
                this.purchases = []
                console.error('fetchAllUserReferrals ', error)
                return error
            }
        },

        // Handle purchase payment completion and transition to setup
        async handlePaymentSuccess(purchaseId: number | string) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                
                // In a real application, this would be a call to update payment status
                // For example:
                // const url = `https://stage.api.delta-trade.app/api/v1/purchases/${purchaseId}/confirm-payment/`
                // await $fetch(url, {
                //   method: 'POST',
                //   headers: {
                //     Authorization: `JWT ${accessToken}`,
                //   }
                // })
                
                // For demo purposes, we'll simulate a response
                this.currentSetupPurchase = {
                    id: purchaseId,
                    name: 'Торговая система',
                    price: 500,
                    status: 'paid',
                    created_at: new Date().toISOString()
                } as IPurchase;
                
                this.isInSetupProcess = true;
                
                return this.currentSetupPurchase;
            } catch (error) {
                console.error('Error confirming payment: ', error);
                throw error;
            }
        },

        // Handle product setup completion
        completeSetup(purchaseId: number | string) {
            // In a real app, this would call an API to mark setup as complete
            this.isInSetupProcess = false;
            
            if (this.currentSetupPurchase && this.currentSetupPurchase.id === purchaseId) {
                this.currentSetupPurchase.status = 'active';
            }
            
            return this.currentSetupPurchase;
        },

        // Reset setup state (useful for navigation or errors)
        resetSetupState() {
            this.isInSetupProcess = false;
            this.currentSetupPurchase = null;
        }
    },
    getters: {
        getPurchases(state) {
            if (state.purchases?.results) {
                return state.purchases
            }
            return []
        },
        
        getSetupStatus(state) {
            return state.isInSetupProcess;
        },
        
        getCurrentSetupPurchase(state) {
            return state.currentSetupPurchase;
        }
    },
})