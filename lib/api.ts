import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add token and landlord ID to requests
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('authToken')
    const landlordId = localStorage.getItem('landlordId')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    if (landlordId) {
        config.headers['X-Landlord-Id'] = landlordId
    }

    return config
})

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken')
            localStorage.removeItem('landlordId')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)