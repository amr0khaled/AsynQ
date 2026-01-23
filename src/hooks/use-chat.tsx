'use client'
import { createContext, Dispatch, useCallback, useContext, useEffect, useRef, useState, useTransition } from "react"
import { deletePost, getPost, getPosts, newPost, updatePost } from "./use-posts"
import { toast } from "sonner"
import { type Post, type PostDelete, type PostUpdate, type PostCreate, type ErrorActionResponse, CANNOT_CREATE_POST, CANNOT_UPDATE_POST, CANNOT_DETETE_POST, ID_TOKEN_EXPIRED } from "@/lib/types"
import { auth } from "@/lib/firebase/client"
import { useReauthUser } from "./use-reauth"
import { useAuth } from "./use-auth"

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
  const { loading, user, reauth } = useAuth(auth)

  const errorHandler = async ({ message, code }: ErrorActionResponse) => {
    toast.error(`${code}: ${message}`)
    if (code === ID_TOKEN_EXPIRED.code) {
      reauth()
    }
  }
  const loadPosts = useCallback(() => {
    start(async () => {
      const res = await getPosts()
      if (!res.success) return await errorHandler(res)
      setPosts(res.data)
    })
  }, [])

  const changePost = useCallback((id: string) => {
    const post = posts.find((post) => post.id === id)
    if (!post) return
    if (post.content) {
      setPost(post)
    } else {
      start(async () => {
        const res = await getPost(id)
        if (!res.success) return await errorHandler(res)
        const fullPost = res.data
        if (!fullPost) return
        setPost(fullPost)
        setPosts((posts) =>
          posts.map((p) => (p.id === id ? fullPost : p))
        )
      })
    }
  }, [])
  const createPost = useCallback((post: PostCreate) => {
    start(async () => {
      const res = await newPost(post)
      if (!res.success) return await errorHandler(res)
      const _post = res.data
      if (!_post) return await errorHandler(CANNOT_CREATE_POST)
      setPost(_post)
      setPosts(posts => [_post, ...posts])
    })
  }, [])
  const updateCurrentPost = useCallback((post: PostUpdate) => {
    start(async () => {
      const res = await updatePost(post)
      if (!res.success) return await errorHandler(res)
      const _post = res.data
      if (!_post) return await errorHandler(CANNOT_UPDATE_POST)
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
  }, [])
  const deleteAPost = useCallback((postId: PostDelete) => {
    start(async () => {
      const res = await deletePost(postId)
      if (!res.success) return await errorHandler(CANNOT_DETETE_POST)

      if (post && post.id === postId) {
        setPost(null)
      }

      setPosts(posts => posts.filter(({ id }) => id !== postId))
    })
  }, [])
  const fetchedUserId = useRef<string | null>(null)
  useEffect(() => {
    if (loading || !user?.uid) {
      return;
    }
    if (fetchedUserId.current === user.uid) {
      return;
    }
    fetchedUserId.current = user.uid;
    loadPosts();

  }, [loading, user?.uid, loadPosts]);

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
