'use client'
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/firebase/client";
import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod";
import { loginFormSchema } from "@/lib/input-schemas";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function Page() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const {
    signInWithGoogle,
    signInWithEmailAndPassword,
    loading
  } = useAuth(auth, true)


  const { control, handleSubmit } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ''
    }
  })

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
    await signInWithEmailAndPassword(email, password)
    setIsLoggingIn(false)
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
                {isLoggingIn || loading
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
                {isLoggingIn || loading
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
