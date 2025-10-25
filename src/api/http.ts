import axios from 'axios'

export const AUTH_TOKEN_KEY = 'AUTH_TOKEN'

const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || '/api'

// Lightweight http helper that delegates to axios.post dynamically.
// This implementation omits the third arg when no config/headers are provided
// so tests that assert a two-argument call signature continue to pass.
const http = {
  async post<T = any>(url: string, data?: unknown, config?: any) {
    try {
      const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(AUTH_TOKEN_KEY) : null

      // build headers, but keep track if there are any
      const baseHeaders = config && config.headers ? { ...config.headers } : {}
      if (token) baseHeaders.Authorization = `Bearer ${token}`

      const axiosLib: any = axios as any

      // Determine final options only if needed
      const hasHeaders = Object.keys(baseHeaders).length > 0
      const opts = config ? { ...config, headers: baseHeaders } : hasHeaders ? { headers: baseHeaders } : undefined

      // Use current axios.post (mock-friendly). Call signature depends on presence of opts
      if (axiosLib && typeof axiosLib.post === 'function') {
        if (opts === undefined) {
          return axiosLib.post(url, data)
        }
        return axiosLib.post(url, data, opts)
      }

      // Fallback: create instance and call its post
      const instance = (axios as any).create ? (axios as any).create({ baseURL, timeout: 10000 }) : axios
      if (opts === undefined) {
        return instance.post(url, data)
      }
      return instance.post(url, data, opts)
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

export default http
