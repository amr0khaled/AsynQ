'use client'
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation"; // Changed from redirect
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { signInWithPopup, signInWithEmailAndPassword, User, createUserWithEmailAndPassword } from '@firebase/auth'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod";
import { signupFormSchema } from "@/lib/input-schemas";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

enum SignUpMethod {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE"
}

export default function Page() {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)
  const [signupMethod, setSignupMethod] = useState<SignUpMethod>(SignUpMethod.EMAIL)
  const [isSigningUp, setIsSigningUp] = useState(false)


  const { control, handleSubmit } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: ''
    }
  })


  // useEffect(() => {
  //   if (user) {
  //     toast.info("You're already logged in. Redirecting...")
  //     router.push('/success')
  //   }
  // }, [user, router])

  if (loading) return <Spinner />
  if (error) {
    toast.error('Auth state error:' + error)
    return <div>Authentication error. Please refresh.</div>
  }
  const onError: SubmitErrorHandler<z.infer<typeof signupFormSchema>> = (errors) => {
    let message = ""
    for (const error of Object.keys(errors)) {
      if (Object.hasOwn(errors, error)) {
        message += `${(errors as any)[error].message}\n`
      }
    }
    toast.error('Form has Validation Errors. ' + message);
  }
  const onSubmit = async ({ name, email, password }: z.infer<typeof signupFormSchema>) => {
    if (isSigningUp) return

    function methodToString(method: SignUpMethod) {
      switch (method) {
        case SignUpMethod.EMAIL:
          return "Email"
        case SignUpMethod.GOOGLE:
          return "Google"
      }
    }

    toast.info(`You're signing up with ${methodToString(signupMethod)}`)

    setIsSigningUp(true)
    try {
      let userResult: User | null = null

      switch (signupMethod) {
        case SignUpMethod.EMAIL:
          if (!email || !password || !name) {
            toast.error('Please enter name, email and password')
            setIsSigningUp(false)
            return
          }
          const resEmail = await signInWithEmailAndPassword(auth, email, password)
          createUserWithEmailAndPassword(auth, email, password)
          userResult = resEmail.user
          break

        case SignUpMethod.GOOGLE:
          const resGoogle = await signInWithPopup(auth, googleProvider)
          userResult = resGoogle.user
          break

        default:
          throw new Error("METHOD IS NOT SUPPORTED")
      }

      console.log('Login successful:', userResult?.email)
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
      setIsSigningUp(false)
    }
  }

  return (
    <section className='h-full w-full mt-12'>
      <Card className='max-w-sm mx-auto'>
        <CardHeader>
          <CardTitle>
            Create a new Account
          </CardTitle>
          <CardDescription>
            Enter your credentails below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-4 gap-y-8"
            id="signup-form"
          >
            <FieldGroup>
              <FieldSet>
                <Controller
                  name='name'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="text"
                        required
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>

                  )}
                />
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
              disabled={isSigningUp}
              className="w-full"
              form="signup-form"
            >
              <span className='inline-flex items-center gap-x-6'>
                {signupMethod === SignUpMethod.EMAIL && isSigningUp
                  ? <><Spinner /> Signing up...</>
                  : <>Sign Up</>
                }
              </span>
            </Button>

            <Separator />

            <Button
              onClick={() => setSignupMethod(SignUpMethod.GOOGLE)}
              disabled={isSigningUp}
              variant={'outline'}
              className='text-white w-full hover:brightness-110 py-5'
              form="signup-form"
            >
              <span className='inline-flex items-center gap-x-2'>
                {signupMethod === SignUpMethod.GOOGLE && isSigningUp
                  ? <><Spinner /> Signing...</>
                  : <><FcGoogle className='size-6' /> Sign up With Google</>
                }
              </span>
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </section>
  )
}
