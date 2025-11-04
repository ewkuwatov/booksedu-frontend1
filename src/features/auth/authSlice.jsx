import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http, setAccessToken, getAccessToken } from '../../api/http'

// --- Thunks ---
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/auth/login', { email, password })
      // ответ: { access_token, token_type, role, email, university_id }
      setAccessToken(data.access_token)
      return {
        accessToken: data.access_token,
        role: data.role,
        email: data.email,
        university_id: data.university_id ?? null,
      }
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || 'Login failed')
    }
  }
)

export const refreshThunk = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/auth/refresh', {})
      setAccessToken(data.access_token)
      return {
        accessToken: data.access_token,
        role: data.role,
        email: data.email,
        university_id: data.university_id ?? null,
      }
    } catch (e) {
      setAccessToken(null)
      return rejectWithValue(e.response?.data?.detail || 'Refresh failed')
    }
  }
)

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await http.post('/auth/logout', {}, { withCredentials: true })
  } finally {
    setAccessToken(null)
  }
})

const initialState = {
  user: null, // { email, role, university_id }
  accessToken: getAccessToken(),
  status: 'idle',
  error: null,
  isReady: false, // чтобы один раз дернуть refresh при старте
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // login
      .addCase(loginThunk.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(loginThunk.fulfilled, (s, { payload }) => {
        s.status = 'succeeded'
        s.accessToken = payload.accessToken
        s.user = {
          email: payload.email,
          role: payload.role,
          university_id: payload.university_id,
        }
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Login failed'
      })

      // refresh
      .addCase(refreshThunk.pending, (s) => {
        s.status = 'loading'
      })
      .addCase(refreshThunk.fulfilled, (s, { payload }) => {
        s.status = 'succeeded'
        s.accessToken = payload.accessToken
        s.user = {
          email: payload.email,
          role: payload.role,
          university_id: payload.university_id,
        }
        s.isReady = true
      })
      .addCase(refreshThunk.rejected, (s) => {
        s.status = 'failed'
        s.user = null
        s.accessToken = null
        s.isReady = true
      })

      // logout
      .addCase(logoutThunk.fulfilled, (s) => {
        s.user = null
        s.accessToken = null
        s.isReady = true
      })
  },
})

export default slice.reducer
