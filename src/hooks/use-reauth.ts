import { Auth } from "@firebase/auth";
import { useAuth } from "./use-auth";
import { setCookie } from "cookies-next/client";



export function useReauthUser(auth: Auth) {
  const { user } = useAuth(auth)
  const reauth = async (): Promise<any> => {
  }
  return { reauthenticate: reauth }
}
