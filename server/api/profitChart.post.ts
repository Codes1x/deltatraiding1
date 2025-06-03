import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Авторизация через JWT из headers клиента (если нужно)
  const token = event.headers.get('authorization')


  const res = await fetch('https://forex-orders-store.ntxpro.ai/v1/orders/profit_statistics/chart/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Ошибка при запросе: ${res.status}`)
  }

  return await res.json()
})
