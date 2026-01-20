'use client'
import api from "@/lib/axios.client";
import { auth } from "@/lib/firebase/client";
import { AxiosError } from "axios";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";


type CreditContextValue = {
  credits: number,
  setCredits: Dispatch<SetStateAction<number>>
  refreshCredits: () => void
}

export const CreditContext = createContext<CreditContextValue>({
  credits: 0,
  setCredits: () => { },
  refreshCredits: () => { }
})
type SyncCreditData = {
  credits: number
}

export const useCredits = () => {
  const context = useContext(CreditContext)
  if (!context) throw new Error("useCredits must be used within a Credits Provider");
  return context
}

type Props = {
  children: React.ReactNode
}
export default function Credits({ children }: Props) {
  const [credits, setCredits] = useState(0)
  const [triggerSync, setTriggerSync] = useState(0)
  const [user, loading] = useAuthState(auth)
  useLayoutEffect(() => {
    if (!!loading) return
    if (!user) {
      setCredits(0);
      return;
    }
    const sync = async () => {
      try {
        const res = await api.get("/api/me")
        const { credits } = res.data as SyncCreditData
        setCredits(credits)
      } catch (e) {
        if (e instanceof AxiosError) {
          switch (e.status) {
            case 401:
              toast.error("Unauthorized. Try loging in")
              break
            default:
              toast.error("Sync error. Maybe you are offline")
          }
        }
      }
    }
    sync()
  }, [triggerSync, user, loading])
  const refreshCredits = () => setTriggerSync(e => e + 1)

  return <CreditContext.Provider value={{
    credits,
    setCredits,
    refreshCredits
  }}>
    {children}
  </CreditContext.Provider>
}
