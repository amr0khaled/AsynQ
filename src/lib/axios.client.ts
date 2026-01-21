import 'client-only'
import x from 'axios'
import { auth } from './firebase/client'
import { setCookie, hasCookie } from 'cookies-next/client'

const api = x.create({
  allowAbsoluteUrls: false,
  withCredentials: true
})

api.interceptors.request.use(async (req) => {
  if (!!auth.currentUser) {
    const token = await auth.currentUser.getIdToken()
    req.headers.set("Authorization", `Bearer ${token}`)
    if (!hasCookie('token')) {
      setCookie("token", token, {
        maxAge: 1000 * 3,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict'
      })
    }
  }
  return req
}, (e) => {
  'use client'
  return Promise.reject(e)
})


export default api
