import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = event.headers.get('authorization')

  const formData = new FormData()
  formData.append('product_id', body.product_id.toString())

  // account_num может быть необязательным, поэтому добавляем его только если он есть
  if (body.account_num) {
    formData.append('account_num', body.account_num.toString())
  }

  const res = await fetch('https://robots.nitrex.online/api/v2/get_additional_robot_settings/', {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: token } : {}),
    },
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Ошибка при запросе: ${res.status}`)
  }

  return await res.json()
})
