import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | {
      id: number
      name: string
      balance: string
    },
    token: null as null | string,
  }),
  actions: {
    async login(credentials) {
      // Отправка запроса на сервер для авторизации
      const response = await $fetch(
        'https://stage.api.delta-trade.app/api/v1/auth/',
        {
          method: 'POST',
          body: credentials,
        }
      )
      this.token = response.token
      // Сохранение токена в localStorage
      localStorage.setItem('token', response.token)
      // Обновление информации о пользователе
      this.user = response.user
    },
    logout() {
      // Удаление токена из localStorage и обнуление состояния
      localStorage.removeItem('token')
      this.user = null
      this.token = null
    },

    async getUserBalance() {
      try {
        const url = '/api/v1/user/balance/'
        const response = (await getDataRequest(url)) as string
        // Проверяем, что user не равен null перед обновлением
        if (this.user) {
          this.user.balance = response
        } else {
          console.error('User is not authenticated.')
        }
      } catch (error) {
        console.error('getUserBalance ', error)
        return error
      }
    },
  },
})
