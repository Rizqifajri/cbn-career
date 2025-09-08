import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">CBN Career</h1>
          <p className="text-muted-foreground mb-6">Career Job Posting Management</p>
          <div className="flex items-center justify-center gap-6">
            <Image
              src="/logo/LOGOBRANCH.png"
              alt="Branch Logo"
              width={500}
              height={500}
              className="h-auto md:h-24 w-auto object-contain"
            />
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
