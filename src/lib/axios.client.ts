import x from 'axios'
import { toast } from 'sonner'
import { auth } from './firebase'

const api = x.create({
  allowAbsoluteUrls: false
})

api.interceptors.request.use((req) => {
  if (!!auth.currentUser) {
    req.url += `?uid=${auth.currentUser.uid}`
  }
  return req
}, (e) => {
  'use client'
  return Promise.reject(e)
})


export default api
