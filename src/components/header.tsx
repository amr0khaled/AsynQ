'use client'
import '@/styles/components/header.css'
import localFont from "next/font/local";
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { DoorClosed, DoorOpenIcon } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Separator } from './ui/separator';
const kyivType = localFont({
  src: '../assets/fonts/KyivTypeSans-VarGX.ttf'
})

export default function Header() {
  const [credit, setCredit] = useState<number>(0)

  const [user, error] = useAuthState(auth)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // detect the browser default theme
  useEffect(() => {
    // Get initial theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const initialTheme = mediaQuery.matches ? 'dark' : 'light'
    setTheme(initialTheme)

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // modify the web app theme according to client's theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <header className='header'>
    <span className='flex-1'>
      {
        !!user &&
        `Hi, ${user?.displayName}!`
      }
    </span>
    <div className='logo-container'>
      <span className={`logo ${kyivType.className}`}>
        AsynQ
      </span>
    </div>
    <nav className='profile-nav'>
      <span className='credits' >
        Credits: {credit}
      </span>
      <Separator orientation='vertical' />
      <ul className='profile-controls'>
        {!true ?
          <>
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button>
                    <DoorOpenIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Log Out
                </TooltipContent>
              </Tooltip>
            </li>
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={'destructive'}>
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
              <Button>
                Log in
              </Button>
            </li>
            <li>
              <Button variant={'ghost'}>
                Sign Up
              </Button>
            </li>
          </>
        }
      </ul>
    </nav>
  </header>
}
