import { defineStore } from 'pinia';
import type { IInvoice, IReplenishmentResponce } from '~/types/replenishment';



export const useReplenishmentStore = defineStore('replenishment', {
    state: () => ({
        depositAddress: {} as IInvoice,
    }),

    actions: {
        async fetchDepositAddress(payload: { token: string }) {
            try {
                this.depositAddress = {} as IInvoice;

                const tgWebAppStore = useTgWebAppStore();
                const accessToken = tgWebAppStore.accessToken;

                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                };

                const formData = new FormData();
                formData.append('token', payload.token);

                const url = 'https://stage.api.delta-trade.app/api/v1/payments/replenishment/';
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                })) as IReplenishmentResponce;

                this.depositAddress = response.invoice;

                return response;
            } catch (error) {
                console.error('fetchDepositAddress error:', error);
                return error;
            }
        },

        resetDepositAddress() {
            this.depositAddress = {} as IInvoice;
        }
    },

    getters: {
        getDepositAddress(state) {
            return state.depositAddress;
        }
    }
});
