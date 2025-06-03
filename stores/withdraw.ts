import { defineStore } from 'pinia';

export const useWithdrawStore = defineStore('withdraw', {
    state: () => ({

    }),

    actions: {

        async sendWithdraw(payload: { amount: string, address: string, token: string, secret_code: number }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                // console.log('this token ', this.accessToken)
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`
                }


                const formData = new FormData()
                formData.append('amount', payload.amount.toString())
                formData.append('address', payload.address.toString())
                formData.append('token', payload.token.toString())
                formData.append('secret_code', payload.secret_code.toString())

                // console.log('sendWithdraw payload amount:', payload.amount);
                const url = 'https://stage.api.delta-trade.app/api/v1/payments/withdrawal/'
                const response: { success: boolean; status: number;[key: string]: any } = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                    onResponse: ({ response }) => {
                        console.log('HTTP статус:', response.status);
                    },
                }))


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
                // console.log('sendWithdraw response', payload, response)


            } catch (error: any) {
                // Для обработки ошибок используем `onResponseError`
                console.error('sendWithdraw error', error);

                const status = error?.response?.status || 500;
                return {
                    success: false,
                    status,
                    message: error,
                };
            }
        }
    },
    getters: {}
});