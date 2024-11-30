"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Send } from 'lucide-react'
import { createComment, toggleLike } from "@/app/actions"
import { formatDistanceToNow } from "date-fns"

interface SocialFeedProps {
  initialPosts: any[]
  currentUser: any
}

export default function SocialFeed({ initialPosts, currentUser }: SocialFeedProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()

  const handleLike = async (postId: string) => {
    try {
      setIsLoading((prev) => ({ ...prev, [postId]: true }))
      await toggleLike(postId)
      router.refresh()
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const handleComment = async (postId: string) => {
    if (!newComments[postId]?.trim()) return
    try {
      setIsLoading((prev) => ({ ...prev, [`comment-${postId}`]: true }))
      await createComment(postId, newComments[postId])
      setNewComments({ ...newComments, [postId]: "" })
      router.refresh()
    } catch (error) {
      console.error("Failed to create comment:", error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [`comment-${postId}`]: false }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="w-full">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={post.author.image ?? "/placeholder.svg?height=40&width=40"} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base">{post.content}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex items-center gap-4 w-full">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleLike(post.id)}
                disabled={isLoading[post.id]}
              >
                <Heart
                  className={`w-4 h-4 ${
                    post.likes.some((like: any) => like.userId === currentUser?.id) ? "fill-current text-red-500" : ""
                  }`}
                />
                <span>{post.likes.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments.length}</span>
              </Button>
            </div>
            <ScrollArea className="w-full max-h-40">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="flex items-start gap-2 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={comment.author.image ?? "/placeholder.svg?height=32&width=32"}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="flex items-center gap-2 w-full">
              <Input
                placeholder="Write a comment..."
                value={newComments[post.id] || ""}
                onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment(post.id)
                  }
                }}
              />
              <Button
                size="icon"
                onClick={() => handleComment(post.id)}
                disabled={isLoading[`comment-${post.id}`]}
              >
                <Send className="w-4 h-4" />
                <span className="sr-only">Send comment</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

