import { defineStore } from 'pinia'
import { useTgWebAppStore } from '@/stores/tgWebApp'
import type { ITransaction, ITransactionsResponse } from '~/types/transactions'

export const useTransactionsStore = defineStore('transactions', {
    state: () => ({
        transactions: {} as ITransactionsResponse,
        lastTransactionsParams: null as object | null, // Store parameters of the last fetch
        transactionsLastFetched: null as number | null, // Timestamp of the last fetch

    }),
    actions: {
        // Helper to compare if two parameter objects are the same
        _areParamsEqual(params1: object | null, params2: object | null): boolean {
            if (!params1 || !params2) return false;
            const keys1 = Object.keys(params1);
            const keys2 = Object.keys(params2);
            if (keys1.length !== keys2.length) return false;
            for (const key of keys1) {
                if (params1[key as keyof typeof params1] !== params2[key as keyof typeof params2]) return false;
            }
            return true;
        },

        async fetchTransactions(payload: { created_at_after?: string; created_at_before?: string; transaction_type?: string; page?: number }, forceRefresh = false) {
            const CACHE_DURATION_MS_TRANSACTIONS = 2 * 60 * 1000; // 2 minutes for transactions
            const now = Date.now();

            // Return cached transactions if available, not forced, same params, and not stale
            if (!forceRefresh && 
                this.transactions && Object.keys(this.transactions).length > 0 && 
                this.transactionsLastFetched && (now - this.transactionsLastFetched < CACHE_DURATION_MS_TRANSACTIONS) &&
                this._areParamsEqual(this.lastTransactionsParams, payload)) {
                console.log('fetchTransactions: Returning fresh transactions from cache for params:', payload);
                return Promise.resolve(this.transactions);
            }
            console.log('fetchTransactions: Cache stale, new params, or forced. Fetching from API for params:', payload);

            try {
                const tgWebAppStore = useTgWebAppStore();
                const accessToken = tgWebAppStore.accessToken;
                if (!accessToken) {
                    throw new Error("Access token is missing");
                }

                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                };

                // Создание URL с динамическими параметрами
                const params = new URLSearchParams();
                if (payload.created_at_after) params.append('created_at_after', payload.created_at_after);
                if (payload.created_at_before) params.append('created_at_before', payload.created_at_before);
                if (payload.transaction_type) params.append('transaction_type', payload.transaction_type);
                if (payload.page) params.append('page', payload.page.toString());
                const url = `https://stage.api.delta-trade.app/api/v1/user/transactions-history/?${params.toString()}`;

                const response = (await $fetch(url, {
                    method: 'GET',
                    headers,
                })) as ITransactionsResponse;

                this.transactions = response;
                this.lastTransactionsParams = { ...payload }; // Store a copy of payload
                this.transactionsLastFetched = Date.now();
                // console.log('this transactions', this.transactions, response);
                return response;
            } catch (error) {
                this.transactions = {} as ITransactionsResponse;
                console.error('fetchTransactions ', error);
                return error;
            }
        }

    },
    getters: {
        getTransactions(state) {
            return state.transactions;
        }
    },
    persist: {
        paths: ['transactions', 'lastTransactionsParams', 'transactionsLastFetched'],
    },
})