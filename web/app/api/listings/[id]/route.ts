import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
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
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, price, status, image, date, location } = body

    // Check if user owns the listing
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!listing || listing.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        title,
        description,
        price: Number.parseFloat(price),
        status,
        image,
        date: new Date(date),
        location,
      },
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if user owns the listing
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!listing || listing.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.listing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
  }
}

