import { NextRequest, NextResponse } from "next/server"
import * as jose from "jose"

const PROTECTED_PREFIX = "/admin"
const LOGIN_PATH = "auth/login"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next()
  }

  if (pathname === LOGIN_PATH) {
    const token = req.cookies.get("session")?.value
    if (token && (await verifyToken(token))) {
      const url = req.nextUrl.clone()
      url.pathname = "/admin/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (pathname.startsWith(PROTECTED_PREFIX)) {
    const token = req.cookies.get("session")?.value
    if (!token || !(await verifyToken(token))) {
      const url = req.nextUrl.clone()
      url.pathname = LOGIN_PATH
      url.searchParams.set("next", pathname) 
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "")
    await jose.jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
