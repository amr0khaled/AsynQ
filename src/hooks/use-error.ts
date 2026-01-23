import { FirebaseError } from "@firebase/app"
import { toast } from "sonner"

export const errorNotifying = (error: FirebaseError) => {
  switch (error.code) {
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
      toast.error('Authentication error. ' + (error?.message.split(":")[1] || 'Unknown error'))
  }

}
