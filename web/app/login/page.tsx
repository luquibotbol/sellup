"use client"

import { signIn } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FaGoogle, FaApple, FaEnvelope } from "react-icons/fa"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#c1ff72] p-4">
      <div className="w-full max-w-md flex flex-col items-center space-y-12">
        <div className="flex items-center space-x-2">
          <div className="bg-black p-2 rounded-lg">
            <Image src="/logo.svg" alt="SellUp Logo" width={40} height={40} className="text-[#c1ff72]" />
          </div>
          <div className="bg-black px-4 py-2 rounded-lg">
            <h1 className="text-3xl font-bold text-[#c1ff72]">sellup</h1>
          </div>
        </div>

        <div className="w-full space-y-4">
          <Button
            variant="outline"
            className="w-full bg-black text-white hover:bg-black/90 flex items-center justify-center gap-2 h-12 text-base"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FaGoogle className="h-5 w-5" />
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            className="w-full bg-black text-white hover:bg-black/90 flex items-center justify-center gap-2 h-12 text-base"
            onClick={() => signIn("apple", { callbackUrl: "/" })}
          >
            <FaApple className="h-5 w-5" />
            Sign in with Apple
          </Button>

          <Button
            variant="outline"
            className="w-full bg-black text-white hover:bg-black/90 flex items-center justify-center gap-2 h-12 text-base"
            onClick={() => signIn("email", { callbackUrl: "/" })}
          >
            <FaEnvelope className="h-5 w-5" />
            LOGIN WITH EMAIL
          </Button>
        </div>
      </div>
    </div>
  )
}

