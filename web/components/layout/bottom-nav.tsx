"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-between bg-gray-300 p-4">
      <Link
        href="/asks"
        className={`flex items-center justify-center w-16 h-16 rounded-lg bg-black ${
          pathname === "/asks" ? "text-[#c1ff72]" : "text-gray-400"
        }`}
      >
        <span className="text-sm font-medium">asks</span>
      </Link>

      <Link href="/create" className="flex items-center justify-center w-16 h-16 rounded-lg bg-black text-[#c1ff72]">
        <Plus className="h-8 w-8" />
      </Link>

      <Link
        href="/selling"
        className={`flex items-center justify-center w-16 h-16 rounded-lg bg-black ${
          pathname === "/selling" ? "text-[#c1ff72]" : "text-gray-400"
        }`}
      >
        <span className="text-sm font-medium">selling</span>
      </Link>
    </div>
  )
}

