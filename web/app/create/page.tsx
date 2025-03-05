"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function CreateListingPage() {
  const [listingType, setListingType] = useState<"sell" | "ask">("sell")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="pb-24">
      <Navbar />

      <div className="p-4">
        <div className="mb-4">
          <Input
            placeholder="Search Tags"
            className="w-full bg-black/80 text-white placeholder:text-gray-400 rounded-full py-6"
          />
        </div>

        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
              {imagePreview ? (
                <Image src={imagePreview || "/placeholder.svg"} alt="Listing preview" fill className="object-cover" />
              ) : (
                <label className="cursor-pointer flex items-center justify-center h-full w-full">
                  <span className="sr-only">Upload image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="text-gray-500">Click to upload image</div>
                </label>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 flex justify-between items-center">
              <Input
                placeholder="insert title"
                className="bg-transparent border-none text-white text-xl font-bold placeholder:text-gray-400 p-0 focus-visible:ring-0"
              />
              <Input
                type="date"
                className="bg-transparent border-none text-white text-right w-auto p-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Input placeholder="location" className="bg-black text-white placeholder:text-gray-400 rounded-md" />
            <Input
              type="number"
              placeholder="$ 00.00"
              className="bg-black text-white placeholder:text-gray-400 rounded-md"
            />
          </div>

          <Textarea
            placeholder="description..."
            className="bg-black text-white placeholder:text-gray-400 rounded-md min-h-[100px]"
          />
        </div>

        <div className="mt-8">
          <Button className="w-full py-6 text-lg bg-black text-[#c1ff72] hover:bg-black/90">create</Button>
        </div>
      </div>
    </div>
  )
}

