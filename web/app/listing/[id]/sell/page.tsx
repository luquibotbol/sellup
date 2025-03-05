import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Mock data - would come from API in real app
const mockBuyers = [
  {
    id: "1",
    name: "Nicholas VanSice",
    avatar: "/images/avatar1.jpg",
    paymentMethods: ["Zelle", "Apple Pay", "Venmo"],
  },
  {
    id: "2",
    name: "Lucas Botbol",
    avatar: "/images/avatar2.jpg",
    paymentMethods: ["PayPal", "Google Pay", "Cash App"],
  },
  {
    id: "3",
    name: "Lucas Botbol",
    avatar: "/images/avatar2.jpg",
    paymentMethods: ["PayPal", "Google Pay"],
  },
]

export default function SellListingPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Navbar />

      <div className="p-4">
        <h1 className="text-center mb-2">
          <span className="text-[#c1ff72] font-bold">sell</span>
          <span className="ml-2 font-bold">kairos 02/05</span>
        </h1>

        <div className="grid grid-cols-3 text-center mb-4 font-medium">
          <div>buyers</div>
          <div>payments</div>
          <div>price</div>
        </div>

        <div className="space-y-4">
          {mockBuyers.map((buyer) => (
            <div key={buyer.id} className="bg-black rounded-lg p-4 text-white">
              <div className="flex items-center">
                <div className="flex items-center space-x-2 w-1/3">
                  <Image
                    src={buyer.avatar || "/placeholder.svg"}
                    alt={buyer.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{buyer.name}</p>
                  </div>
                </div>

                <div className="w-1/3 flex flex-col items-center space-y-1">
                  {buyer.paymentMethods.map((method) => (
                    <div
                      key={method}
                      className={`text-xs px-2 py-1 rounded-md w-full text-center ${
                        method === "Zelle"
                          ? "bg-purple-600"
                          : method === "Apple Pay"
                            ? "bg-white text-black"
                            : method === "Venmo"
                              ? "bg-blue-500"
                              : method === "PayPal"
                                ? "bg-blue-700"
                                : method === "Google Pay"
                                  ? "bg-white text-black"
                                  : method === "Cash App"
                                    ? "bg-green-500"
                                    : ""
                      }`}
                    >
                      {method}
                    </div>
                  ))}
                </div>

                <div className="w-1/3 text-center">
                  <p className="font-bold">$25</p>
                  {buyer.id === "1" && (
                    <Button className="mt-2 bg-[#c1ff72] text-black hover:bg-[#a8ff3e]">sell</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button className="w-full py-6 text-lg bg-black text-[#c1ff72] hover:bg-black/90">add to selling</Button>
        </div>
      </div>
    </div>
  )
}

