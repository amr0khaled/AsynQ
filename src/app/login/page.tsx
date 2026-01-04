'use client'
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation"; // Changed from redirect
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { signInWithPopup, signInWithEmailAndPassword, User } from '@firebase/auth'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod";
import { loginFormSchema } from "@/lib/input-schemas";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa6";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import debounce from 'lodash/debounce'

enum SignInMethod {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE"
}

export default function Page() {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)
  const [loginMethod, setLoginMethod] = useState<SignInMethod>(SignInMethod.EMAIL)
  const [isLoggingIn, setIsLoggingIn] = useState(false)


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
      router.push('/success')
    }
  }, [user, router])

  if (loading) return <Spinner />
  if (error) {
    toast.error('Auth state error:' + error)
    return <div>Authentication error. Please refresh.</div>
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

    function methodToString(method: SignInMethod) {
      switch (method) {
        case SignInMethod.EMAIL:
          return "Email"
        case SignInMethod.GOOGLE:
          return "Google"
      }
    }

    toast.info(`You're logging in with ${methodToString(loginMethod)}`)

    setIsLoggingIn(true)
    try {
      let userResult: User | null = null

      switch (loginMethod) {
        case SignInMethod.EMAIL:
          if (!email || !password) {
            toast.error('Please enter email and password')
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
      toast.success("Logged in successfully")
    } catch (e: any) {
      if (e?.code === 'auth/internal-error') {
        toast.error('Authentication error. Try again later.')
      } else if (e?.code === "auth/popup-closed-by-user") {
        toast.error("Authentication error. Pop up is closed unexpectedly")
      } else {
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
            className="space-y-4 gap-y-8"
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
              disabled={isLoggingIn}
              className="w-full"
              form="login-form"
            >
              <span className='inline-flex items-center gap-x-6'>
                {loginMethod === SignInMethod.EMAIL && isLoggingIn
                  ? <><Spinner /> Logging in...</>
                  : <>Log in</>
                }
              </span>
            </Button>

            <Separator />

            <Button
              onClick={() => setLoginMethod(SignInMethod.GOOGLE)}
              disabled={isLoggingIn}
              className='bg-blue-500 text-white w-full hover:bg-blue-400'
              form="login-form"
            >
              <span className='inline-flex items-center gap-x-6'>
                {loginMethod === SignInMethod.GOOGLE && isLoggingIn
                  ? <><Spinner /> Signing...</>
                  : <><FaGoogle /> Sign in With Google</>
                }
              </span>
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </section>
  )
}
