import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import universReducer from '../features/admins/univerSlice'
import adminsReducer from '../features/admins/adminSlice'
import usersReducer from '../features/admins/userSlice'
import directionsReducer from '../features/admins/directionSlice'
import kafedrasReducer from '../features/admins/kafedraSlice'
import subjectsReducer from '../features/admins/subjectSlice'
import literaturesReducer from '../features/admins/literatureSlice'
import statisticsReducer from '../features/admins/statisticsSlice'
import generalStatsReducer from '../features/General_stats'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    univers: universReducer,
    admins: adminsReducer,
    users: usersReducer,
    directions: directionsReducer,
    kafedras: kafedrasReducer,
    subjects: subjectsReducer,
    literatures: literaturesReducer,
    statistics: statisticsReducer,
    general_stats: generalStatsReducer,
  },
})

export const selectAuth = (state) => state.auth
export const selectUniver = (state) => state.univers
export const selectAdmin = (state) => state.admins
export const selectUser = (state) => state.users
export const selectDirection = (state) => state.directions
export const selectKafedra = (state) => state.kafedras
export const selectSubject = (state) => state.subjects
export const selectLiterature = (state) => state.literatures
export const selectStatistics = (state) => state.statistics
export const selectGeneralStats = (state) => state.general_stats
