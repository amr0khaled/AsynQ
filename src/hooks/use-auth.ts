import api from "@/lib/axios.client";
import { Auth, UserCredential } from "@firebase/auth";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword, useSignInWithGoogle, useSignOut } from "react-firebase-hooks/auth";
import { toast } from "sonner";
import { errorNotifying } from "./use-error";
import { FirebaseError } from "@firebase/app";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthData = {
  email: string | null
  name: string | null
}
export const useAuth = (auth: Auth) => {
  const router = useRouter()
  const [signInWithEmailAndPassword, userCredential, loading, error] = useSignInWithEmailAndPassword(auth)
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)
  const [signInWithGoogle] = useSignInWithGoogle(auth)
  const [signOut] = useSignOut(auth)

  useEffect(() => {
    if (userCredential) {
      toast.info("You're already logged in. Redirecting...")
      router.push('/post/create')
    }
  }, [userCredential, router])

  if (error) {
    toast.error(error.message)
  }
  const createUser = async (data: AuthData) => {
    await api.post('/api/user/create', data)
  }
  const handleResult = async (result: UserCredential | undefined, name?: string) => {
    if (!result) {
      toast.error("Login Failed.")
      return
    }
    const user = result.user
    await createUser({
      email: user.email,
      name: name ?? user.displayName
    })
    console.log('Login successful:', user.email)
    toast.success("Logged in successfully")
  }
  const handleCreateUserWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(email, password)
      handleResult(result, name)
    } catch (e) {
      errorNotifying(e as FirebaseError)
    }
  }
  const handleSignInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(email, password)
      handleResult(result)
    } catch (e) {
      errorNotifying(e as FirebaseError)
    }
  }
  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle()
      handleResult(result)
    } catch (e) {
      errorNotifying(e as FirebaseError)
    }
  }
  return {
    createUserWithEmailAndPassword: handleCreateUserWithEmailAndPassword,
    signInWithEmailAndPassword: handleSignInWithEmailAndPassword,
    signInWithGoogle: handleSignInWithGoogle,
    signOut,
    user: userCredential?.user,
    loading,
    error
  }
}
