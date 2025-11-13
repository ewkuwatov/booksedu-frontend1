import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

export const fetchAllDirectionThunk = createAsyncThunk(
  'directions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/directions/')
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Get all directions failed'
      )
    }
  }
)

export const fetchAddDirectionThunk = createAsyncThunk(
  'directions/fetchAdd',
  async (created, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/directions/', created)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Add directions failed'
      )
    }
  }
)

export const fetchUpdateDirectionThunk = createAsyncThunk(
  'directions/fetchUpdate',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`/directions/${id}`, updated)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Update directions failed'
      )
    }
  }
)

export const fetchDeleteDirectionThunk = createAsyncThunk(
  'directions/fetchDelete',
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/directions/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Delete directions failed'
      )
    }
  }
)

const directionSlice = createSlice({
  name: 'directions',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllDirectionThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchAllDirectionThunk.fulfilled, (s, action) => {
        s.loading = false
        s.items = action.payload.sort((a, b) => a.id - b.id)
      })
      .addCase(fetchAddDirectionThunk.rejected, (s, action) => {
        s.error = action.payload
      })

      .addCase(fetchAddDirectionThunk.fulfilled, (s, action) => {
        s.items.push(action.payload)
      })

      .addCase(fetchUpdateDirectionThunk.fulfilled, (s, action) => {
        const updated = action.payload
        s.items = s.items.map((d) => (d.id === updated.id ? updated : d))
        if (s.current?.id === updated.id) s.current = updated
      })

      .addCase(fetchDeleteDirectionThunk.fulfilled, (s, action) => {
        const deletedId = action.payload
        s.items = s.items.filter((d) => d.id !== deletedId)
        if (s.current?.id === deletedId) s.current = null
      })
  },
})

export default directionSlice.reducer
