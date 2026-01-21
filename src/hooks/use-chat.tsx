'use client'
import { createContext, Dispatch, useContext, useState, useTransition } from "react"
import { deletePost, getPost, getPosts, newPost, updatePost } from "./use-posts"
import { toast } from "sonner"
import { Post, PostDelete, PostUpdate, PostCreate } from "@/lib/types"

type ChatContextValue = {
  post: Post | null
  posts: Post[]
  isPending: boolean
  changePost: Dispatch<string>
  loadPosts: Dispatch<void>
  newPost: Dispatch<PostCreate>
  updatePost: Dispatch<PostUpdate>
  deletePost: Dispatch<PostDelete>
}

export const ChatContext = createContext<ChatContextValue>({
  post: null,
  posts: [],
  isPending: false,
  loadPosts: () => { },
  changePost: () => { },
  newPost: () => { },
  updatePost: () => { },
  deletePost: () => { }
})

type Props = {
  children: React.ReactNode
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error("useCredits must be used within a Chat Provider");
  return context
}
export default function Chat({ children }: Props) {
  const [post, setPost] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isPending, start] = useTransition()


  const checkPost = (post: Post | null | string) => {
    if (!post) return false
    if (typeof post === 'string') {
      toast.error(post)
      return false
    }
    return true
  }
  const loadPosts = () => {
    start(async () => {
      setPosts(await getPosts())
    })
  }

  const changePost = (id: string) => {
    const post = posts.find((post) => post.id === id)
    if (!post) return
    if (post.content) {
      setPost(post)
    } else {
      start(async () => {
        const fullPost = await getPost(id)
        if (!fullPost) return
        setPost(fullPost)
        setPosts((posts) =>
          posts.map((p) => (p.id === id ? fullPost : p))
        )
      })
    }
  }
  const createPost = (post: PostCreate) => {
    start(async () => {
      let _post = await newPost(post)
      if (!checkPost(_post)) return
      _post = _post as Post
      setPost(_post)
      setPosts(posts => [...posts, _post])
    })
  }
  const updateCurrentPost = (post: PostUpdate) => {
    start(async () => {
      let _post = await updatePost(post)
      if (!checkPost(_post)) return
      _post = _post as Post
      setPost(_post)
      setPosts(posts => {
        const index = posts.findIndex(({ id }) => id === post.id)
        return [
          ...posts.slice(0, index),
          _post,
          ...posts.slice(index + 1)
        ]
      })
    })
  }
  const deleteAPost = (postId: PostDelete) => {
    start(async () => {
      let _post = await deletePost(postId)
      if (!_post) return
      setPosts(posts => {
        const filteredPosts = posts.filter(({ id }) => id !== postId)
        return [
          ...filteredPosts
        ]
      })
    })
  }

  return <ChatContext.Provider value={{
    post,
    posts,
    isPending,
    changePost,
    newPost: createPost,
    updatePost: updateCurrentPost,
    deletePost: deleteAPost,
    loadPosts
  }}>
    {children}
  </ChatContext.Provider>
}
