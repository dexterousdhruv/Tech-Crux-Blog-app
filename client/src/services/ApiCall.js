import axios from 'axios'

export const clientRequest = async (method, url, data) => {
  const headers = { "Content-Type": "application/json" }
  let config = { method, url, headers, withCredentials: true }

  if(data) config.data = data

  return axios(config)
}