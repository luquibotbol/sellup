"use client"

import { Navbar } from "@/components/layout/navbar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="pb-24">
      <Navbar />

      <div className="p-4 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="h-40 w-40 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={session?.user?.image || "/images/avatar-placeholder.jpg"}
              alt="Profile"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-black text-white"
          >
            <Pencil className="h-5 w-5" />
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-4">{session?.user?.name || "Lucas Botbol"}</h1>

        <div className="flex items-center mb-6">
          <p className="text-[#c1ff72] font-medium">tel. (314) 440-7980</p>
          <Button variant="ghost" size="icon" className="ml-2">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full mb-8">
          <h2 className="text-center text-lg font-medium mb-4">payment methods</h2>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-700 text-white py-1 px-3 rounded-md text-center">PayPal</div>
            <div className="bg-purple-600 text-white py-1 px-3 rounded-md text-center">Zelle</div>
            <div className="bg-white text-black py-1 px-3 rounded-md text-center border">Apple Pay</div>
            <div className="bg-white text-black py-1 px-3 rounded-md text-center border">Google Pay</div>
            <div className="bg-green-500 text-white py-1 px-3 rounded-md text-center">Cash App</div>
            <div className="bg-blue-500 text-white py-1 px-3 rounded-md text-center">venmo</div>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: "/login" })}>
          Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}

