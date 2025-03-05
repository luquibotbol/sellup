import { Navbar } from "@/components/layout/navbar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "parties",
    name: "parties",
    image: "/images/parties.jpg",
  },
  {
    id: "phones",
    name: "phones",
    image: "/images/phones.jpg",
  },
  {
    id: "mens-clothing",
    name: "mens clothing",
    image: "/images/mens-clothing.jpg",
  },
  {
    id: "concerts",
    name: "concerts",
    image: "/images/concerts.jpg",
  },
]

export default function HomePage() {
  return (
    <div className="pb-24">
      <Navbar />

      <div className="p-4 space-y-4">
        <div className="relative">
          <Input
            placeholder="search categories"
            className="w-full bg-black/80 text-white placeholder:text-gray-400 rounded-full py-6"
          />
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="flex items-center overflow-hidden rounded-lg bg-black h-32"
            >
              <div className="w-1/2 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
              </div>
              <div className="w-1/2 h-full">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={300}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

