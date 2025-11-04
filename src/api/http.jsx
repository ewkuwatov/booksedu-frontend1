// import axios from 'axios'

// const API_URL =
//   import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://bookedu.uz'

// // --- общий axios экземпляр ---
// export const http = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // чтобы refresh cookie ходила
//   headers: { 'Content-Type': 'application/json' },
// })

// // --- утилита доступа к access токену ---
// const TOKEN_KEY = 'access_token'
// export const getAccessToken = () => localStorage.getItem(TOKEN_KEY)
// export const setAccessToken = (t) =>
//   t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)

// // --- проставляем Bearer ---
// http.interceptors.request.use((config) => {
//   const token = getAccessToken()
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// // --- очередь запросов во время refresh ---
// let isRefreshing = false
// let pendingQueue = []

// function subscribeTokenRefresh(cb) {
//   pendingQueue.push(cb)
// }
// function onRefreshed(newToken) {
//   pendingQueue.forEach((cb) => cb(newToken))
//   pendingQueue = []
// }

// // --- авто-рефреш при 401 ---
// http.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original = error.config

//     // если не 401 или уже пробовали ретраить — отдаём ошибку
//     if (error?.response?.status !== 401 || original?._retry) {
//       return Promise.reject(error)
//     }

//     // попытка refresh (одна на все параллельные 401)
//     if (!isRefreshing) {
//       isRefreshing = true
//       try {
//         const { data } = await axios.post(
//           `${API_URL}/auth/refresh`,
//           {},
//           {
//             withCredentials: true,
//             headers: { 'Content-Type': 'application/json' },
//           }
//         )
//         // backend возвращает { access_token, role, email, university_id, ... }
//         setAccessToken(data?.access_token || null)
//         isRefreshing = false
//         onRefreshed(data?.access_token || null)
//       } catch (e) {
//         isRefreshing = false
//         setAccessToken(null)
//         // пробросим дальше — на UI можно поймать и выкинуть на /login
//         return Promise.reject(e)
//       }
//     }

//     // ждём, пока refresh завершится, затем повторяем оригинальный запрос
//     const retryOriginal = new Promise((resolve) => {
//       subscribeTokenRefresh((newToken) => {
//         original._retry = true
//         original.headers = original.headers || {}
//         if (newToken) original.headers.Authorization = `Bearer ${newToken}`
//         resolve(http(original))
//       })
//     })
//     return retryOriginal
//   }
// )

import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://bookedu.uz'

// --- общий axios экземпляр ---
export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // чтобы refresh cookie ходила
  headers: { 'Content-Type': 'application/json' },
})

// --- утилита доступа к access токену ---
const TOKEN_KEY = 'access_token'
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY)
export const setAccessToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)

// --- проставляем Bearer ---
http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- очередь запросов во время refresh ---
let isRefreshing = false
let pendingQueue = []

function subscribeTokenRefresh(cb) {
  pendingQueue.push(cb)
}
function onRefreshed(newToken) {
  pendingQueue.forEach((cb) => cb(newToken))
  pendingQueue = []
}

// --- авто-рефреш при 401 ---
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // если не 401 или уже пробовали ретраить — отдаём ошибку
    if (error?.response?.status !== 401 || original?._retry) {
      return Promise.reject(error)
    }

    // попытка refresh (одна на все параллельные 401)
    if (!isRefreshing) {
      isRefreshing = true
      try {
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        )
        // backend возвращает { access_token, role, email, university_id, ... }
        setAccessToken(data?.access_token || null)
        isRefreshing = false
        onRefreshed(data?.access_token || null)
      } catch (e) {
        isRefreshing = false
        setAccessToken(null)
        // пробросим дальше — на UI можно поймать и выкинуть на /login
        return Promise.reject(e)
      }
    }

    // ждём, пока refresh завершится, затем повторяем оригинальный запрос
    const retryOriginal = new Promise((resolve) => {
      subscribeTokenRefresh((newToken) => {
        original._retry = true
        original.headers = original.headers || {}
        if (newToken) original.headers.Authorization = `Bearer ${newToken}`
        resolve(http(original))
      })
    })
    return retryOriginal
  }
)
