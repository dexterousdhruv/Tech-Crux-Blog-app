import { clientRequest } from "./ApiCall.js"

export const BASE_URL = import.meta.env.VITE_API_BASE_URL

//--------------------------Auth Requests-------------------------------

export const signup = (data) => {
  return clientRequest('POST', `${BASE_URL}/auth/signup`, data)
}

export const signin = async (data) => {
  return await clientRequest('POST', `${BASE_URL}/auth/signin`, data)
}

export const googleSignin = async (data) => {
  return await clientRequest('POST', `${BASE_URL}/auth/google`, data)
}



//----------------------------User Requests------------------------------

export const getUsers = async ({startIndex, limit, order} = {}) => {
  let url = `${BASE_URL}/user/get-users?`
  let isAmpersand = () => {
    return url.charAt(url.length -1) === '?' ? '' : '&' 
  }
  
  if (startIndex) url += isAmpersand() + `startIndex=${startIndex}`
  if (limit) url += isAmpersand() + `limit=${limit}`
  if (order) url += isAmpersand() + `order=${order}`
  
  return await clientRequest('GET', url )
}

export const getUserWithId = async (userId) => {
  return await clientRequest('GET', `${BASE_URL}/user/${userId}`)
}

export const updateUser = async (updateUserId, data) => {
  return await clientRequest('PUT', `${BASE_URL}/user/update/${updateUserId}`, data)
}

export const deleteUser = async (deleteUserId) => {
  return await clientRequest('DELETE', `${BASE_URL}/user/delete/${deleteUserId}`)
}

export const signout = async () => {
  return await clientRequest('POST', `${BASE_URL}/user/signout`)
}



//---------------------------Post Requests-----------------------------------

export const createPost = async (data) => {
  return await clientRequest('POST', `${BASE_URL}/post/create`, data)
}

export const getPosts= async ({startIndex, limit, order, userId, category, slug, postId, searchTerm} = {}) => {
  let url = `${BASE_URL}/post/get-posts?`
  let isAmpersand = () => {
    return url.charAt(url.length -1) === '?' ? '' : '&' 
  }

  if (startIndex) url += isAmpersand() + `startIndex=${startIndex}`
  if (limit) url += isAmpersand() + `limit=${limit}`
  if (order) url += isAmpersand() + `order=${order}`
  if (userId) url += isAmpersand() + `userId=${userId}`
  if (category) url += isAmpersand() + `category=${category}`
  if (slug) url += isAmpersand() + `slug=${slug}`
  if (postId) url += isAmpersand() + `postId=${postId}`
  if (searchTerm) url += isAmpersand() + `searchTerm=${searchTerm}`
  
  return await clientRequest('GET', url )
}

export const searchPosts = async (searchQuery) => {
  return await clientRequest('GET', `${BASE_URL}/post/get-posts?${searchQuery}`)
}

export const updatePost = async (postId, userId, data) => {
  return await clientRequest('PUT', `${BASE_URL}/post/update/${postId}/${userId}`, data)
}

export const deletePost = async (postId, userId) => {
  return await clientRequest('DELETE', `${BASE_URL}/post/delete/${postId}/${userId}`)
}



//-------------------------- Comment Requests--------------------------------

export const createComment = async (data) => {
  return await clientRequest('POST', `${BASE_URL}/comment/create`, data)
}

export const getPostComments = async (postId) => {
  return await clientRequest('GET', `${BASE_URL}/comment/get-post-comments/${postId}`)
}

export const getComments = async ({startIndex, limit, order} = {}) => {
  let url = `${BASE_URL}/comment/get-comments?`
  let isAmpersand = () => {
    return url.charAt(url.length -1) === '?' ? '' : '&' 
  }
  
  if (startIndex) url += isAmpersand() + `startIndex=${startIndex}`
  if (limit) url += isAmpersand() + `limit=${limit}`
  if (order) url += isAmpersand() + `order=${order}`

  return await clientRequest('GET', url )
}

export const likeComment = async (commentId) => {
  return await clientRequest('PUT', `${BASE_URL}/comment/like-comment/${commentId}`)
}

export const editComment = async (commentId, data) => {
  return await clientRequest('PUT', `${BASE_URL}/comment/edit-comment/${commentId}`, data)
}

export const deleteComment = async (commentId) => {
  return await clientRequest('PUT', `${BASE_URL}/comment/delete-comment/${commentId}`)
}