import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import { useEffect, useState } from 'react'
import { getPosts } from '../services/Api';
import PostCard from '../components/PostCard';


const Home = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts()
  
        if (res.status === 200) {
          setPosts(res.data.posts)
        }
        
      } catch (e) {
        console.log(e)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div> 
      <div className="flex flex-col gap-6 px-3 p-28 max-w-6xl mx-auto ">
        <div className="w-fit ">
          <h1 className='text-3xl font-bold lg:text-6xl lg:h-[64px] animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-[#374151] dark:border-r-white pr-5'>
            Welcome to my Blog &nbsp;
          </h1>
        </div>
        <p className='text-gray-500 text-xs sm:text-sm w-full max-w-[80ch]' >
          Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.
        </p>
        <Link to={`/search`} className='text-xs sm:text-sm text-purple-500 font-bold border px-3 max-w-fit rounded-3xl hover:bg-purple-500 hover:text-white duration-300 py-2 border-purple-500'>
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className="max-w-6xl w-fit mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 &&
          <>
            <h2 className='text-2xl font-semibold text-center '>
              Recent Posts
            </h2>
            <div className=" flex flex-wrap gap-8 max-w-4xl mx-auto">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to={`/search`} className=' self-center text-purple-500 font-bold  max-w-fit   duration-300 hover:underline'>
          View all posts
        </Link>
          </>
        }
      </div>

    </div>
  )
}

export default Home