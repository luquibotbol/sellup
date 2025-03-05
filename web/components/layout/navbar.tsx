"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Don't show back button on main pages
  const showBackButton = !["/"].includes(pathname)

  return (
    <div className="flex items-center justify-between p-4 bg-gray-300">
      {showBackButton ? (
        <Link href="/" className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      ) : (
        <div className="w-10" />
      )}

      <Link href="/" className="bg-black px-4 py-2 rounded-lg">
        <h1 className="text-xl font-bold text-[#c1ff72]">sellup</h1>
      </Link>

      <Link href="/profile" className="p-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback className="bg-black">{session?.user?.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  )
}

