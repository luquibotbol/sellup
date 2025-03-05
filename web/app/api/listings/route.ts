import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const category = searchParams.get("category")

  try {
    const listings = await prisma.listing.findMany({
      where: {
        ...(type && { type: type }),
        ...(category && { categoryId: category }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(listings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, price, type, categoryId, image, date, location } = body

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number.parseFloat(price),
        type,
        date: new Date(date),
        location,
        image,
        user: {
          connect: { id: session.user.id },
        },
        category: {
          connect: { id: categoryId },
        },
      },
    })

    return NextResponse.json(listing)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}

