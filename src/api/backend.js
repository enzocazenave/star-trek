import axios from 'axios'

const backend = axios.create({
  baseURL: 'http://localhost:3000/api'
})

backend.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default backend