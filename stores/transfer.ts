import { defineStore } from 'pinia';

export const useTransferStore = defineStore('transfer', {
    state: () => ({

    }),

    actions: {

        async sendTransferByID(payload: { amount: number, to_username: number }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                // console.log('this token ', this.accessToken)
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`
                }

                const formData = new FormData()
                formData.append('amount', payload.amount.toString())
                formData.append('to_username', payload.to_username.toString())

                // console.log('sendTransferByID payload amount:', payload.amount);
                const url = 'https://stage.api.delta-trade.app/api/v1/payments/transfer/'
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                    onResponse: ({ response }) => {
                        console.log('HTTP статус:', response.status);
                    },
                }))

                // Обновляем состояние после успешного запроса

                // console.log('sendTransferByID response', payload, response)

                if (response.success) {
                    return {
                        success: true,
                        status: response.status, // Для успешных запросов можно указать явный статус
                        data: response,
                    };
                } else {
                    return {
                        success: false,
                        status: response.status, // Для успешных запросов можно указать явный статус
                        data: response,
                    };
                }
            } catch (error) {
                console.error('sendTransferByID ', error)
                return error
            }
        }
    },
    getters: {}
});