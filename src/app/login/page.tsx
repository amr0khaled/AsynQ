'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation"; // Changed from redirect
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { signInWithPopup, signInWithEmailAndPassword, User } from '@firebase/auth'

enum SignInMethod {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE"
}

export default function Page() {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)
  const [{ email, password }, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/success')
    }
  }, [user, router])

  if (loading) return <Spinner />
  if (error) {
    console.error('Auth state error:', error)
    return <div>Authentication error. Please refresh.</div>
  }

  const login = async (method: SignInMethod) => {
    if (isLoggingIn) return

    setIsLoggingIn(true)
    try {
      let userResult: User | null = null

      switch (method) {
        case SignInMethod.EMAIL:
          if (!email || !password) {
            alert('Please enter email and password')
            setIsLoggingIn(false)
            return
          }
          const resEmail = await signInWithEmailAndPassword(auth, email, password)
          userResult = resEmail.user
          break

        case SignInMethod.GOOGLE:
          const resGoogle = await signInWithPopup(auth, googleProvider)
          userResult = resGoogle.user
          break

        default:
          throw new Error("METHOD IS NOT SUPPORTED")
      }

      console.log('Login successful:', userResult?.email)

    } catch (e: any) {
      console.error('Login error:', e)
      console.error('Error code:', e?.code)
      console.error('Error message:', e?.message)

      if (e?.code === 'auth/internal-error') {
        alert('Authentication error. Please check your Firebase configuration.')
      } else {
        alert('Login failed: ' + (e?.message || 'Unknown error'))
      }
      setIsLoggingIn(false)
    }
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4 max-w-md mx-auto p-6"
    >
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
        />
      </div>

      <Button
        type="button"
        onClick={() => login(SignInMethod.EMAIL)}
        disabled={isLoggingIn}
        className="w-full"
      >
        {isLoggingIn ? 'Logging in...' : 'Log in'}
      </Button>

      <Button
        type="button"
        className='bg-blue-500 text-white w-full'
        onClick={() => login(SignInMethod.GOOGLE)}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Signing in...' : 'Sign in With Google'}
      </Button>
    </form>
  )
}
