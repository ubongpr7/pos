import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = [
    // Home page
    "/",

    // Authentication related
    "/membership/portal",
    "/forgot-password",
    "/reset-password",
    "/verify-email",

    // About section
    "/about",
    "/vision-mission",
    "/core-values",
    "/history",
    "/leadership",

    // Resources section
    "/resources",
    "/resources/publications",
    "/resources/reports",
    "/resources/media",

    // Blog section
    "/blog",
    "/blog/category",

    // Information pages
    "/faqs",
    "/contact",
    "/donate",
    "/privacy-policy",
    "/terms-of-service",

    // Membership information pages
    "/membership/benefits",
    "/membership/join",
    "/membership/tiers",
    "/membership/volunteer",
    "/membership/partner",

    // Verification page (accessible after registration)
    "/membership/verification",
  ]

  // Check if the current path starts with any of the public paths
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))

  // Get the token from the cookies
  const token = request.cookies.get("accessToken")?.value || ""

  

  return NextResponse.next()
}

// Configure which paths should be processed by the middleware
export const config = {
  matcher: [
    // Match all paths except static files, api routes, and specific excluded paths
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
