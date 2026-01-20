'use client'
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { auth, googleProvider } from "@/lib/firebase/client";
import { useRouter } from "next/navigation"; // Changed from redirect
import { useAuthState, useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { User } from '@firebase/auth'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod";
import { loginFormSchema } from "@/lib/input-schemas";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

enum SignInMethod {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE"
}

export default function Page() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<SignInMethod>(SignInMethod.EMAIL)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)


  const { control, handleSubmit } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ''
    }
  })


  useEffect(() => {
    if (user) {
      toast.info("You're already logged in. Redirecting...")
      router.push('/post/create')
    }
  }, [user, router])

  if (error) {
    toast.error('Auth state error:' + error)
  }
  const onError: SubmitErrorHandler<z.infer<typeof loginFormSchema>> = (errors) => {
    let message = ""
    for (const error of Object.keys(errors)) {
      if (Object.hasOwn(errors, error)) {
        message += `${(errors as any)[error].message}\n`
      }
    }
    toast.error('Form has Validation Errors. ' + message);
  }
  const onSubmit = async ({ email, password }: z.infer<typeof loginFormSchema>) => {
    if (isLoggingIn) return

    setIsLoggingIn(true)
    try {
      if (!email || !password) {
        toast.error('Please enter email and password')
        setIsLoggingIn(false)
        return
      }
      const result = await signInWithEmailAndPassword(email, password)
      if (!result) {
        toast.error("Login Failed.")
        return
      }
      const user = result.user

      console.log('Login successful:', user.email)
      toast.success("Logged in successfully")
    } catch (e: any) {
      switch (e?.code) {
        case "auth/internal-error":
          toast.error('Authentication error. Try again later.')
          break
        case "auth/popup-closed-by-user":
          toast.error("Pop up is closed unexpectedly.")
          break
        case "auth/user-not-found":
          toast.error("Unknown login attempt. Please sign up first.")
          break
        case "auth/wrong-password":
          toast.error("Wrong password. Please try again.")
          break
        case "auth/invalid-email":
          toast.error("Invalid Email. Please try again.")
          break
        case "auth/user-disabled":
          toast.error("User account is disabled. Please contact administrations")
          break
        default:
          toast.error('Authentication error. ' + (e?.message.split(":")[1] || 'Unknown error'))
      }
      setIsLoggingIn(false)
    }
  }

  return (
    <section className='h-full w-full mt-12'>
      <Card className='max-w-sm mx-auto'>
        <CardHeader>
          <CardTitle>
            Log into your account
          </CardTitle>
          <CardDescription>
            Enter your credentails below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="gap-y-4"
            id="login-form"
          >
            <FieldGroup>
              <FieldSet>
                <Controller
                  name='email'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        disabled={isLoggingIn || loading}
                        aria-invalid={fieldState.invalid}
                        type="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>

                  )}
                />
                <Controller
                  name='password'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        disabled={isLoggingIn || loading}
                        aria-invalid={fieldState.invalid}
                        type="password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field
            className='font-semibold'
          >
            <Button
              type='submit'
              disabled={isLoggingIn || loading}
              className="w-full"
              form="login-form"
            >
              <span className='inline-flex items-center gap-x-6'>
                {loginMethod === SignInMethod.EMAIL && (isLoggingIn || loading)
                  ? <><Spinner /> Logging in...</>
                  : <>Log in</>
                }
              </span>
            </Button>

            <Separator />

            <Button
              onClick={() => signInWithGoogle()}
              disabled={isLoggingIn || loading}
              variant={'outline'}
              type='button'
              className='text-white w-full hover:brightness-110 py-5'
              form="login-form"
            >
              <span className='inline-flex items-center gap-x-6'>
                {(isLoggingIn || loading)
                  ? <><Spinner /> Signing...</>
                  : <><FcGoogle className='size-6' /> Sign in With Google</>
                }
              </span>
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </section>
  )
}
