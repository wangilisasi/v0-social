"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createPost } from "@/app/actions"

export default function NewPost({ user }: { user: any }) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePost = async () => {
    if (!content.trim()) return
    try {
      setIsLoading(true)
      await createPost(content)
      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mb-4">
      <CardContent className="pt-4">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={user?.image ?? "/placeholder.svg?height=40&width=40"} alt={user?.name ?? "User avatar"} />
            <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handlePost} disabled={!content.trim() || isLoading}>
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </CardFooter>
    </Card>
  )
}

