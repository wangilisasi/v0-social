"use client"

export class ActionError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message)
    this.name = 'ActionError'
  }
}

export function handleActionError(error: unknown) {
  if (error instanceof ActionError) {
    return { error: error.message, status: error.status }
  }
  
  console.error('Unexpected error:', error)
  return { error: 'An unexpected error occurred', status: 500 }
}

