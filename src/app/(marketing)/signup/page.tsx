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
import { signupFormSchema } from "@/lib/input-schemas";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";


export default function Page() {
  const [isSigningUp, setIsSigningUp] = useState(false)
  const {
    signInWithGoogle,
    createUserWithEmailAndPassword,
    loading
  } = useAuth(auth)


  const { control, handleSubmit } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: ''
    }
  })

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
    setIsSigningUp(true)
    await createUserWithEmailAndPassword(name, email, password)
    setIsSigningUp(false)
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
            className="gap-y-4"
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
                        disabled={isSigningUp || loading}
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
                        disabled={isSigningUp || loading}
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
                        disabled={isSigningUp || loading}
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
              disabled={isSigningUp || loading}
              className="w-full"
              form="signup-form"
            >
              <span className='inline-flex items-center gap-x-6'>
                {(isSigningUp || loading)
                  ? <><Spinner /> Signing up...</>
                  : <>Sign Up</>
                }
              </span>
            </Button>

            <Separator />

            <Button
              onClick={() => signInWithGoogle()}
              disabled={isSigningUp || loading}
              variant={'outline'}
              type='button'
              className='text-white w-full hover:brightness-110 py-5'
              form="signup-form"
            >
              <span className='inline-flex items-center gap-x-2'>
                {(isSigningUp || loading)
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
