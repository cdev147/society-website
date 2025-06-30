import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = "8R9a3UfBncQS+DnkkC6GNOAJuzw2e9oOCERthLaMGaEX+eLfie5x4qDq/HNuOGopJKLnY68i57fvmUrZmFcnTA=="

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Protect resident routes
  if (request.nextUrl.pathname.startsWith("/resident")) {
    const token = request.cookies.get("resident-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/resident/:path*"],
}
