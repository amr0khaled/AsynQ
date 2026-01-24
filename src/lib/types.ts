
export type Post = {
  id: string
  prompt: string
  content?: string
  createdAt: Date
}

export type PostCreate = Omit<Post, 'id' | 'createdAt'>
export type PostUpdate = Omit<Post, 'prompt' | 'createdAt'>
export type PostDelete = string

interface BaseActionResponse {
  success: boolean
}


export type ActionResponse<T> = SuccessActionResponse<T> | ErrorActionResponse

type SuccessActionResponse<T> = {
  success: true
  data: T
  code?: never
  meesage?: never
}

export type ErrorActionResponse = {
  success: false
  data?: never
  code: string
  message: string
}


// Error codes


export const UNAUTHENTICATED: ErrorActionResponse = {
  success: false,
  code: "UNAUTHENTICATED",
  message: "Please log in first."
}
export const NOT_FOUND: ErrorActionResponse = {
  success: false,
  code: "NOT_FOUND",
  message: "User not found."
}
export const ERROR_TOKEN_CHECK: ErrorActionResponse = {
  success: false,
  code: "ERROR_TOKEN_CHECK",
  message: "Error happened when checking user identity."
}
export const ID_TOKEN_EXPIRED: ErrorActionResponse = {
  success: false,
  code: "ID_TOKEN_EXPIRED",
  message: "Your authentication session has expired. Please Reauthenticate"
}
export const INTERNAL_ERROR: ErrorActionResponse = {
  success: false,
  code: "INTERNAL_ERROR",
  message: "Internal Server error"
}
export const CANNOT_CREATE_POST: ErrorActionResponse = {
  success: false,
  code: "CANNOT_CREATE_POST",
  message: "Could not create a post due to internal error"
}
export const CANNOT_UPDATE_POST: ErrorActionResponse = {
  success: false,
  code: "CANNOT_UPDATE_POST",
  message: "Could not update a post due to internal error"
}
export const CANNOT_DETETE_POST: ErrorActionResponse = {
  success: false,
  code: "CANNOT_DETETE_POST",
  message: "Could not delete a post due to internal error"
}
export const SCHEMA_ERROR: ErrorActionResponse = {
  success: false,
  code: "SCHEMA_ERROR",
  message: ''
}

const ErrorCodesValues = {
  "UNAUTHENTICATED": UNAUTHENTICATED,
  "NOT_FOUND": NOT_FOUND,
  "ERROR_TOKEN_CHECK": ERROR_TOKEN_CHECK,
  "auth/id-token-expired": ID_TOKEN_EXPIRED,
  "INTERNAL_ERROR": INTERNAL_ERROR,
  "SCHEMA_ERROR": SCHEMA_ERROR,
  "CANNOT_CREATE_POST": CANNOT_CREATE_POST,
  "CANNOT_UPDATE_POST": CANNOT_UPDATE_POST
}
const ErrorHandler: ProxyHandler<Record<string, ErrorActionResponse>> = {
  get: (target, key) => {
    if (key in target) {
      return Reflect.get(target, key)
    } else if (key === 'TOKEN')
      return ERROR_TOKEN_CHECK
    return INTERNAL_ERROR
  }
}

export const ErrorCodes = new Proxy(ErrorCodesValues, ErrorHandler) 
