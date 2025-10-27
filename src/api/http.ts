import axios from 'axios'

export const AUTH_TOKEN_KEY = 'AUTH_TOKEN'

const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || '/api'

// Lightweight http helper that delegates to axios methods dynamically.
// This implementation omits the config arg when not needed to keep tests mock-friendly.
const http = {
  async post<T = any>(url: string, data?: unknown, config?: any) {
    try {
      const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(AUTH_TOKEN_KEY) : null
      const baseHeaders = config && config.headers ? { ...config.headers } : {}
      if (token) baseHeaders.Authorization = `Bearer ${token}`

      const axiosLib: any = axios as any
      const hasHeaders = Object.keys(baseHeaders).length > 0
      const opts = config ? { ...config, headers: baseHeaders } : hasHeaders ? { headers: baseHeaders } : undefined

      if (axiosLib && typeof axiosLib.post === 'function') {
        if (opts === undefined) {
          return axiosLib.post(url, data)
        }
        return axiosLib.post(url, data, opts)
      }

      const instance = (axios as any).create ? (axios as any).create({ baseURL, timeout: 10000 }) : axios
      if (opts === undefined) {
        return instance.post(url, data)
      }
      return instance.post(url, data, opts)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async get<T = any>(url: string, config?: any) {
    try {
      const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(AUTH_TOKEN_KEY) : null
      const baseHeaders = config && config.headers ? { ...config.headers } : {}
      if (token) baseHeaders.Authorization = `Bearer ${token}`

      const axiosLib: any = axios as any
      const hasHeaders = Object.keys(baseHeaders).length > 0
      const opts = config ? { ...config, headers: baseHeaders } : hasHeaders ? { headers: baseHeaders } : undefined

      if (axiosLib && typeof axiosLib.get === 'function') {
        if (opts === undefined) {
          return axiosLib.get(url)
        }
        return axiosLib.get(url, opts)
      }

      const instance = (axios as any).create ? (axios as any).create({ baseURL, timeout: 10000 }) : axios
      if (opts === undefined) {
        return instance.get(url)
      }
      return instance.get(url, opts)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async put<T = any>(url: string, data?: unknown, config?: any) {
    try {
      const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(AUTH_TOKEN_KEY) : null
      const baseHeaders = config && config.headers ? { ...config.headers } : {}
      if (token) baseHeaders.Authorization = `Bearer ${token}`

      const axiosLib: any = axios as any
      const hasHeaders = Object.keys(baseHeaders).length > 0
      const opts = config ? { ...config, headers: baseHeaders } : hasHeaders ? { headers: baseHeaders } : undefined

      if (axiosLib && typeof axiosLib.put === 'function') {
        if (opts === undefined) {
          return axiosLib.put(url, data)
        }
        return axiosLib.put(url, data, opts)
      }

      const instance = (axios as any).create ? (axios as any).create({ baseURL, timeout: 10000 }) : axios
      if (opts === undefined) {
        return instance.put(url, data)
      }
      return instance.put(url, data, opts)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async delete<T = any>(url: string, config?: any) {
    try {
      const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(AUTH_TOKEN_KEY) : null
      const baseHeaders = config && config.headers ? { ...config.headers } : {}
      if (token) baseHeaders.Authorization = `Bearer ${token}`

      const axiosLib: any = axios as any
      const hasHeaders = Object.keys(baseHeaders).length > 0
      const opts = config ? { ...config, headers: baseHeaders } : hasHeaders ? { headers: baseHeaders } : undefined

      if (axiosLib && typeof axiosLib.delete === 'function') {
        if (opts === undefined) {
          return axiosLib.delete(url)
        }
        return axiosLib.delete(url, opts)
      }

      const instance = (axios as any).create ? (axios as any).create({ baseURL, timeout: 10000 }) : axios
      if (opts === undefined) {
        return instance.delete(url)
      }
      return instance.delete(url, opts)
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

export default http
