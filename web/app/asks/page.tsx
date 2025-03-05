import { Navbar } from "@/components/layout/navbar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { ListingCard } from "@/components/listings/listing-card"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ } from "lucide-react"

// Mock data - would come from API in real app
const askListings = [
  {
    id: "1",
    title: "leba",
    date: "02/06",
    image: "/images/concert.jpg",
    tickets: "#",
    price: 15,
    type: "ask",
  },
  {
    id: "2",
    title: "lingo",
    date: "02/06",
    image: "/images/concert.jpg",
    tickets: "#",
    price: 25,
    type: "ask",
  },
  {
    id: "3",
    title: "kairos",
    date: "02/06",
    image: "/images/concert.jpg",
    tickets: "#",
    price: 15,
    type: "ask",
  },
  {
    id: "4",
    title: "UT football",
    date: "02/06",
    image: "/images/football.jpg",
    tickets: "#",
    price: 30,
    type: "ask",
  },
]

export default function AsksPage() {
  return (
    <div className="pb-24">
      <Navbar />

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">asks</h1>
          <Button variant="ghost" size="icon">
            <ArrowDownAZ className="h-5 w-5" />
            <span className="sr-only">Sort</span>
          </Button>
        </div>

        <div className="space-y-4">
          {askListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

