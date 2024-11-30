import { auth } from "@/auth"
import SignIn from "@/components/sign-in"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()
  
  if (session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Social App</CardTitle>
          <CardDescription>Sign in to start posting and interacting</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form action="/api/auth/signin/github" className="space-y-4">
            <Button className="w-full" type="submit">
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          </form> */}
          <SignIn/>
        </CardContent>
      </Card>
    </div>
  )
}

