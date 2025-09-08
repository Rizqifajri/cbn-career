import { NextResponse } from "next/server"
import * as jose from "jose"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Validasi sederhana terhadap env (bisa kamu ganti ke DB sendiri nanti)
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Buat JWT (valid 7 hari)
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "")
    const token = await new jose.SignJWT({ sub: email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret)

    // Set cookie HttpOnly
    const res = NextResponse.json({ ok: true })
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    })
    return res
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Login error" }, { status: 500 })
  }
}
