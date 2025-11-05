import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import universReducer from '../features/admins/univerSlice'
import adminsReducer from '../features/admins/adminSlice'
import usersReducer from '../features/admins/userSlice'
import directionsReducer from '../features/admins/directionSlice'
import kafedrasReducer from '../features/admins/kafedraSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    univers: universReducer,
    admins: adminsReducer,
    users: usersReducer,
    directions: directionsReducer,
    kafedras: kafedrasReducer,
  },
})

export const selectAuth = (state) => state.auth
export const selectUniver = (state) => state.univers
export const selectAdmin = (state) => state.admins
export const selectUser = (state) => state.users
export const selectDirection = (state) => state.directions
export const selectKafedra = (state) => state.kafedras
