import { NextResponse } from "next/server"

const BASE = process.env.UPSTREAM_BASE || ""
const RAW_TOKEN = process.env.BARRIER_TOKEN || ""
const TOKEN = RAW_TOKEN.trim()

export async function GET() {
  const res = await fetch(`${BASE}/career`, {
    headers: {
      Accept: "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    cache: "no-store",
  })

  const text = await res.text()
  try {
    return NextResponse.json(JSON.parse(text), { status: res.status })
  } catch {
    return NextResponse.json({ message: text }, { status: res.status })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    console.log("[career][POST] Incoming FormData:")

    // Buat ulang formData supaya field 'file' dipaksa jadi 'image'
    const beForm = new FormData()
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (key === "file") {
          console.log(` - ${key} → renamed to image: File(${value.name})`)
          beForm.append("image", value, value.name)
        } else {
          beForm.append(key, value, value.name)
        }
      } else {
        beForm.append(key, value)
      }
    }

    // Debug log
    for (const [key, value] of beForm.entries()) {
      if (value instanceof File) {
        console.log(`   BEForm - ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`   BEForm - ${key}: ${value}`)
      }
    }

    const res = await fetch(`${BASE}/career`, {
      method: "POST",
      headers: {
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: beForm,
    })

    const text = await res.text()
    console.log("[career][POST] BE response status:", res.status)
    console.log("[career][POST] BE response text:", text)

    try {
      return NextResponse.json(JSON.parse(text), { status: res.status })
    } catch {
      return NextResponse.json({ message: text }, { status: res.status })
    }
  } catch (err: any) {
    console.error("[career][POST] Error:", err)
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
