// utils/api.ts
import { useTgWebAppStore } from '@/stores/tgWebApp'

export const apiRequest = async <T>(
  method: 'GET' | 'PATCH' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  body?: T | FormData
) => {
  const tgWebAppStore = useTgWebAppStore()

  const config = useRuntimeConfig()
  const accessToken = tgWebAppStore.accessToken

  // Initialize headers object
  const headers: Record<string, string> = {
    Authorization: `JWT ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  }

  // Create a FormData object if uploading files
  let requestBody
  if (body instanceof FormData) {
    requestBody = body
  } else if (body) {
    requestBody = JSON.stringify(body as T)
    headers['Content-Type'] = 'multipart/form-data'
  }

  const { data: responseData, error } = await $fetch(
    `${config.public.apiBaseUrl}${url}`,
    {
      method,
      body: requestBody,
      headers,
    }
  )

  if (error) {
    throw new Error(`Error during ${method} request to ${url}: ${error}`)
  }

  return responseData
}

// Специфические функции для различных запросов
export const getDataRequest = async (url: string) => {
  return await apiRequest('GET', `${url}`, undefined)
}

export const postData = async <T>(data: T, url: string) => {
  return await apiRequest('POST', url, data)
}

export const putData = async <T>(data: T, url: string) => {
  return await apiRequest('PUT', `${url}`, data)
}

export const patchData = async <T>(data: T, url: string) => {
  return await apiRequest('PATCH', `${url}`, data)
}

export const deleteData = async <T>(data: T, url: string) => {
  return await apiRequest('DELETE', `${url}`)
}
