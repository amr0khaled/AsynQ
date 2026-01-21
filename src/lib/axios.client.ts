import 'client-only'
import x from 'axios'
import { auth } from './firebase/client'

const api = x.create({
  allowAbsoluteUrls: false
})

api.interceptors.request.use(async (req) => {
  if (!!auth.currentUser) {
<<<<<<< Updated upstream
    req.headers.set("Authorization", `Bearer ${await auth.currentUser.getIdToken()}`)
=======
    const token = await auth.currentUser.getIdToken()
    req.headers.set("Authorization", `Bearer ${token}`)
    if (!hasCookie('token')) {
      setCookie("token", token, {
        maxAge: 1000 * 60 * 60 * 2, // 2hours
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict'
      })
    }
>>>>>>> Stashed changes
  }
  return req
}, (e) => {
  'use client'
  return Promise.reject(e)
})


export default api
