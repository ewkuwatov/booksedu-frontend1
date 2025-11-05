import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

export const fetchAllUsersThunk = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithvalue }) => {
    try {
      const { data } = await http.get('/users/')
      return data
    } catch (error) {
      return rejectWithvalue(
        error.response?.data?.detail || 'All users get failed'
      )
    }
  }
)

export const fetchUserGetByIdThunk = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithvalue }) => {
    try {
      const { data } = await http.get(`/admins/${id}`)
      return data
    } catch (error) {
      return rejectWithvalue(
        error.response?.data?.detail || 'Users get by id failed'
      )
    }
  }
)

export const fetchOwnerUserUpdateThunk = createAsyncThunk(
  'users/fetchUserOwnerUpdate',
  async ({ id, updated }, { rejectWithvalue }) => {
    try {
      const { data } = await http.put(`/admins/${id}`, updated)
      return data
    } catch (error) {
      return rejectWithvalue(
        error.response?.data?.detail || 'Owner update user failed'
      )
    }
  }
)

export const fetchUserUpdateThunk = createAsyncThunk(
  'users/fetchUserUpdate',
  async (updated, { rejectWithvalue }) => {
    try {
      const { data } = await http.put('/admins/', updated)
      return data
    } catch (error) {
      return rejectWithvalue(
        error.response?.data?.detail || 'User update failed'
      )
    }
  }
)

export const fetchrUserDeleteThunk = createAsyncThunk(
  'users/fetchUserDelete',
  async (id, { rejectWithvalue }) => {
    try {
      await http.put(`/admins/${id}`)
      return id
    } catch (error) {
      return rejectWithvalue(
        error.response?.data?.detail || 'User delete failed'
      )
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllUsersThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchAllUsersThunk.fulfilled, (s, action) => {
        s.loading = false
        s.items = action.payload
      })
      .addCase(fetchAllUsersThunk.rejected, (s, action) => {
        s.error = action.payload
      })

      .addCase(fetchUserGetByIdThunk.fulfilled, (s, action) => {
        s.current = action.payload
      })

      .addCase(fetchOwnerUserUpdateThunk.fulfilled, (s, action) => {
        const updated = action.payload
        s.items = s.items.map((u) => (u.id === updated.id ? updated : u))
        if (s.current?.id === updated?.id) s.current = updated
      })

      .addCase(fetchrUserDeleteThunk.fulfilled, (s, action) => {
        const deletedId = action.payload
        s.items = s.items.filter((u) => u.id !== deletedId)
        if (s.current?.id === deletedId) s.current = null
      })
  },
})

export default userSlice.reducer
