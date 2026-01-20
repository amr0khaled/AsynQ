import 'client-only'
import x from 'axios'
import { auth } from './firebase/client'

const api = x.create({
  allowAbsoluteUrls: false
})

api.interceptors.request.use(async (req) => {
  console.debug(auth.currentUser)
  if (!!auth.currentUser) {
    req.headers.set("Authorization", `Bearer ${await auth.currentUser.getIdToken()}`)
  }
  return req
}, (e) => {
  'use client'
  return Promise.reject(e)
})


export default api
