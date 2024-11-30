import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import NewPost from "../components/new-post"
import SocialFeed from "../components/social-feed"

export default async function Page() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes: true,
    },
  })

  return (
    <main className="min-h-screen bg-muted/20 py-8">
      <div className="container">
        <NewPost user={session.user} />
        <SocialFeed initialPosts={posts} currentUser={session.user} />
      </div>
    </main>
  )
}

