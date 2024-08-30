import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchPosts } from '../services/Api'
import PostCard from '../components/PostCard'

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTerm = urlParams.get('searchTerm')
    const sort = urlParams.get('sort')
    const category = urlParams.get('category')
    const searchQuery = urlParams.toString()

    setSidebarData(prev => ({
      ...prev, 
      ...(searchTerm && {searchTerm}),
      ...(sort && {sort}),
      ...(category && {category}),
    }))
  
    const fetchPosts = async () => {
      setLoading(true)

      const res = await searchPosts(searchQuery)

      if (res.status === 200) {
        setPosts(res.data.posts)
        setLoading(false)

        if (res.data.posts.length === 9)
          setShowMore(true)
        else 
          setShowMore(false)
      }
    }

    fetchPosts()

  },[location.search])

  const handleChange = (e) => {
    setSidebarData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', searchTerm)
    urlParams.set('sort',sort)
    urlParams.set('category', category)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const handleShowMore = async () => {
    const startIndex = posts.length 
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()

    try {
      const res = await searchPosts(searchQuery)

      if (res.status === 200) {
        setPosts(prev => [...prev, ...res.data.posts])

       if (res.data.posts.length === 9)
          setShowMore(true)
        else 
          setShowMore(false) 
      }

    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='flex flex-col md:flex-row '>
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
        <div className='flex   items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone={'purpleToPink'}>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-6 ">
          {!loading && posts.length === 0 &&
            <p className="text-xl text-gray-500">No posts found</p>
          }
          {loading && (
            <p className="text-xl text-gray-500">Loading... </p>
          )}
          {!loading && posts && posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
          {showMore &&
            <button onClick={handleShowMore} className='w-full text-purple-500 font-bold self-center text-lg py-7'>
                Show more
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default Search