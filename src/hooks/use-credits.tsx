'use client'
import api from "@/lib/axios.client";
import { auth } from "@/lib/firebase/client";
import { ActionResponse } from "@/lib/types";
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
  useEffect(() => {
    if (!!loading) return
    if (!user) {
      setCredits(0);
      return;
    }
    const sync = async () => {
      const res = await api.get("/api/me")
      const action: ActionResponse<number> = res.data
      if (!action.success) return toast.error(action.message)
      const { data: credits } = action
      setCredits(credits)
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
