"use client"

import Image from "next/image"
import { Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ListingCardProps {
  listing: {
    id: string
    title: string
    date: string
    image: string
    tickets: string
    price: number
    type: "selling" | "ask"
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const { id, title, date, image, tickets, price, type } = listing

  return (
    <div className="flex overflow-hidden rounded-lg bg-black text-white">
      <div className="flex-1 p-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm">{date}</span>
        </div>
        <div className="mt-2">
          <p className="text-sm">tickets: {tickets}</p>
          <p className="text-sm">
            {type === "selling" ? "selling" : "ask"} price: ${price}
          </p>
        </div>
        <div className="mt-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative w-1/3">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 text-white rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

