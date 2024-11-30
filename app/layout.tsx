import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import "./globals.css"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <header className="border-b">
            <div className="container flex items-center justify-between h-14">
              <Link href="/" className="font-semibold text-lg">
                Social App
              </Link>
              <div className="flex items-center gap-4">
                {session?.user ? (
                  <form action="/api/auth/signout" method="post">
                    <Button variant="ghost" type="submit">
                      Sign Out
                    </Button>
                  </form>
                ) : (
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}

