interface RateLimitStore {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitStore>()

export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (userLimit.count >= maxRequests) {
    return false
  }

  userLimit.count++
  return true
}

export function getRateLimitInfo(identifier: string): { remaining: number; resetIn: number } {
  const userLimit = rateLimitMap.get(identifier)
  if (!userLimit) {
    return { remaining: 10, resetIn: 0 }
  }

  const now = Date.now()
  const remaining = Math.max(0, 10 - userLimit.count)
  const resetIn = Math.max(0, userLimit.resetTime - now)

  return { remaining, resetIn }
}
