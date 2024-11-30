"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { ActionError, handleActionError } from "./actions/error"

export async function createPost(content: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new ActionError("You must be logged in to create a post", 401)
    }

    const post = await prisma.post.create({
      data: {
        content,
        authorId: session.user.id,
      },
    })

    revalidatePath("/")
    return { data: post }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new ActionError("You must be logged in to comment", 401)
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
    })

    revalidatePath("/")
    return { data: comment }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function toggleLike(postId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new ActionError("You must be logged in to like a post", 401)
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId: session.user.id,
        },
      })
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return handleActionError(error)
  }
}

