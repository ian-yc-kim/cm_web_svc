import http from './http'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type?: string
  user?: { employee_id?: string; [k: string]: unknown }
}

export interface SignupRequest {
  email: string
  password: string
  name?: string
  [k: string]: unknown
}

export interface SignupResponse {
  id: string
  [k: string]: unknown
}

export class ApiError extends Error {
  public status?: number
  public body?: unknown

  constructor(message: string, status?: number, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
    this.name = 'ApiError'
  }
}

function isAxiosLike(err: unknown): boolean {
  const anyErr = err as any
  return Boolean(anyErr && (anyErr.isAxiosError || anyErr.response || anyErr.request))
}

function extractAxiosDetails(err: unknown): { message: string; status?: number; body?: unknown } {
  const anyErr = err as any
  let status: number | undefined
  let body: unknown
  let message = 'Unknown error'

  try {
    if (anyErr) {
      if (typeof anyErr.message === 'string' && anyErr.message.length) {
        message = String(anyErr.message)
      }

      // Only access response fields if response exists
      if (anyErr.response) {
        status = anyErr.response?.status
        body = anyErr.response?.data

        if (body !== undefined && body !== null) {
          if (typeof body === 'string' && body.length) {
            message = body
          } else if (typeof body === 'object') {
            const b = body as any
            if (typeof b.message === 'string' && b.message.length) {
              message = String(b.message)
            } else if (typeof b.error === 'string' && b.error.length) {
              message = String(b.error)
            } else {
              try {
                message = JSON.stringify(body)
              } catch (e) {
                // keep previous message
              }
            }
          } else {
            // primitive
            message = String(body)
          }
        }
      }
    }
  } catch (e) {
    // Fallback: preserve original err.message if present
    if (anyErr && anyErr.message) {
      message = String(anyErr.message)
    }
  }

  return { message, status, body }
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const resp = await http.post<LoginResponse>('/login', payload)
    // Use optional chaining in case mocked http returns undefined
    return (resp && (resp as any).data) ?? resp
  } catch (err: unknown) {
    if (isAxiosLike(err)) {
      const { message, status, body } = extractAxiosDetails(err)
      throw new ApiError(message, status, body)
    }
    const anyErr = err as any
    throw new ApiError(anyErr?.message ? String(anyErr.message) : 'Unknown error')
  }
}

export async function signup(payload: SignupRequest): Promise<SignupResponse> {
  try {
    const resp = await http.post<SignupResponse>('/signup', payload)
    return (resp && (resp as any).data) ?? resp
  } catch (err: unknown) {
    if (isAxiosLike(err)) {
      const { message, status, body } = extractAxiosDetails(err)
      throw new ApiError(message, status, body)
    }
    const anyErr = err as any
    throw new ApiError(anyErr?.message ? String(anyErr.message) : 'Unknown error')
  }
}
