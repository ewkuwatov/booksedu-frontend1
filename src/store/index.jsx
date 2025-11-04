import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import universReducer from '../features/admins/univerSlice'
import adminsReducer from '../features/admins/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    univers: universReducer,
    admins: adminsReducer,
  },
})

export const selectAuth = (state) => state.auth
export const selectUniver = (state) => state.univers
export const selectAdmin = (state) => state.admins
