import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = event.headers.get('authorization')

  const formData = new FormData()
  formData.append('product_id', body.product_id.toString())

  const res = await fetch('https://robots.nitrex.online/api/v2/get_robot_info/', {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: token } : {}),
    },
    body: formData,
  })

  if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`)
  return await res.json()
})
