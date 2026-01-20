'use client'
import '@/styles/components/header.css'
import localFont from "next/font/local";
import { useContext, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { DoorOpenIcon } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/client';
import { Separator } from './ui/separator';
import { useTheme } from '@/hooks/use-theme';
import { signOut } from '@firebase/auth';
import { useRouter } from 'next/navigation';
import { CreditContext, useCredits } from '@/hooks/use-credits';
export const kyivType = localFont({
  src: '../assets/fonts/KyivTypeSans-VarGX.ttf'
})

export default function Header() {
  const router = useRouter()
  const { credits } = useCredits()
  const [user] = useAuthState(auth)


  const isAuthed = !!user
  useTheme()

  return <header className='header'>
    <span className='flex-1'>
      {
        isAuthed ?
          `Hi, ${user.displayName}!`
          : `Hi, Guest!`
      }
    </span>
    <div className='logo-container'>
      <span className={`logo ${kyivType.className}`}>
        AsynQ
      </span>
    </div>
    <nav className='profile-nav'>
      {
        isAuthed &&
        <>
          <span className='credits' >
            Credits: {credits}
          </span>
          <Separator orientation='vertical' />
        </>
      }
      <ul className='profile-controls'>
        {isAuthed ?
          <>
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={'destructive'}
                    size={'icon-sm'}
                    onClick={async () => await signOut(auth)}>
                    <DoorOpenIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Log Out
                </TooltipContent>
              </Tooltip>
            </li>
          </>
          :
          <>
            <li>
              <Button
                size='sm'
                className='text-sm max-w-fit px-6'
                onClick={() => router.push("/login")}>
                Log in
              </Button>
            </li>
            <li>
              <Button
                variant={'ghost'}
                size='sm'
                className='text-sm max-w-fit px-6'
                onClick={() => router.push("/signup")}>
                Sign Up
              </Button>
            </li>
          </>
        }
      </ul>
    </nav>
  </header>
}
