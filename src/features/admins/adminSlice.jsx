import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

export const fetchAllAdminsThunk = createAsyncThunk(
  'admins/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/admins/')
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'get All Admins failed'
      )
    }
  }
)

export const fetchByIdThunk = createAsyncThunk(
  'admins/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await http.get(`/admins/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Admins get by Id failed'
      )
    }
  }
)

export const fetchCreateAdminThunk = createAsyncThunk(
  'admins/fetchAdd',
  async (created, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/admins/', created)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Admins created failed'
      )
    }
  }
)

export const fetchUpdateAdminThunk = createAsyncThunk(
  'admins/fetchUpdate',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`/admins/${id}`, updated)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Admins updated failed'
      )
    }
  }
)

export const fetchDeletedAdminThunk = createAsyncThunk(
  'admins/fetchDelete',
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/admins/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Admins deleted failed'
      )
    }
  }
)

const adminSlice = createSlice({
  name: 'admins',
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    //   ---- Deleted ----
    builder
      // ---- Fetch All ----
      .addCase(fetchAllAdminsThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchAllAdminsThunk.fulfilled, (s, action) => {
        s.loading = false
        s.items = action.payload.sort((a, b) => a.id - b.id)
      })
      .addCase(fetchAllAdminsThunk.rejected, (s, action) => {
        s.loading = false
        s.error = action.payload
      })

      // ---- Fetch By Id ----
      .addCase(fetchByIdThunk.fulfilled, (s, action) => {
        s.selected = action.payload
      })

      //  ---- Add ----
      .addCase(fetchCreateAdminThunk.fulfilled, (s, action) => {
        s.items.push(action.payload)
      })
      //   ---- Updated ----
      .addCase(fetchUpdateAdminThunk.fulfilled, (s, action) => {
        const updated = action.payload
        s.items = s.items.map((a) => (a.id === updated.id ? updated : a))
        if (s.selected?.id === updated.id) s.selected = updated
      })
      .addCase(fetchDeletedAdminThunk.fulfilled, (s, action) => {
        const deletedId = action.payload
        s.items = s.items.filter((a) => a.id !== deletedId)
        if (s.selected?.id === deletedId) s.selected === null
      })
  },
})

export default adminSlice.reducer
