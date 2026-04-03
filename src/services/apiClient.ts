import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API]', error.response?.status, error.message)
    return Promise.reject(error)
  }
)
