import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPosts } from '../services/Api'
import { Button, Spinner } from 'flowbite-react'
import CallToAction from '../components/CallToAction'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'

const PostPage = () => {
  const { postSlug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [recentPosts, setRecentPosts] = useState(null)

  
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)

        const res = await getPosts({slug: postSlug})
  
        if (res.status === 200) {
          setPost(res.data.posts[0])
          setLoading(false)
          setError(false)
        }
        
      } catch (e) {
        console.log(e)
        setError(true);
      }
    }
    
    fetchPost()

  }, [postSlug])

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await getPosts({ limit: 3})
  
        if (res.status === 200) {
          setRecentPosts(res.data.posts)
          setError(false)
        }

      } catch (e) {
        console.log(e)
        setError(true);
      }
    }
    fetchRecentPosts()
  }, [])


  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <Spinner size={'xl'} />
    </div>
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen font-medium'>
  
      <h1 className='text-3xl mt-10 p-3 text-center font-general-sans font-semibold tracking-wide max-w-3xl mx-auto md:text-4xl'
      >
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color={'gray'} pill  size={'xs'} >
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.slug}
        className='mt-10 mx-5 w-full p-3 max-h-[400px] self-center max-w-2xl object-cover'
      />
      <div className=" flex justify-between p-3 border-b border-slate-300 dark:border-slate-500 mx-auto w-full  max-w-2xl text-xs ">
        <span>{post && new Date(post.createdAt).toLocaleDateString() }</span>
        <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{__html: post && post.content}}
      ></div>
      
      <div className="max-w-4xl mx-auto my-5 w-full">
        <CallToAction />
      </div>

      <CommentSection postId={post && post._id} />

      <div className="flex flex-col justify-center items-center mb-5 m-2">
        <h1 className='text-xl mt-5'>Recent Articles</h1>
        <div className=" flex flex-wrap gap-5 mt-5 justify-center ">
          {recentPosts && recentPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default PostPage