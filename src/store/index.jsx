import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import universReducer from '../features/admins/univerSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    univers: universReducer,
  },
})

export const selectAuth = (state) => state.auth
export const selectUniver = (state) => state.univers
