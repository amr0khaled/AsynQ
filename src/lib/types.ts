
export type Post = {
  id: string
  prompt: string
  content?: string
  createdAt: Date
}

export type PostCreate = Omit<Post, 'id' | 'createdAt'>
export type PostUpdate = Omit<Post, 'prompt' | 'createdAt'>
export type PostDelete = string
