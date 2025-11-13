import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

export const fetchAllKafedrasThunk = createAsyncThunk(
  'kafedras/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/kafedras/')
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Fetch All kafedras failed'
      )
    }
  }
)

export const fetchAddKafedrasThunk = createAsyncThunk(
  'kafedras/fetchAdd',
  async (create, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/kafedras/', create)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Fetch Add kafedras failed'
      )
    }
  }
)

export const fetchUpdateKafedrasThunk = createAsyncThunk(
  'kafedras/fetchUpdate',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`/kafedras/${id}`, updated)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Fetch Update kafedras failed'
      )
    }
  }
)

export const fetchDeleteKafedrasThunk = createAsyncThunk(
  'kafedras/fetchDelete',
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/kafedras/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Fetch Delete kafedras failed'
      )
    }
  }
)

const kafedrasSlice = createSlice({
  name: 'kafedras',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllKafedrasThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchAllKafedrasThunk.fulfilled, (s, action) => {
        s.loading = false
        s.items = action.payload.sort((a, b) => a.id - b.id)
      })
      .addCase(fetchAllKafedrasThunk.rejected, (s, action) => {
        s.error = action.payload
      })

      .addCase(fetchAddKafedrasThunk.fulfilled, (s, action) => {
        s.items.push(action.payload)
      })

      .addCase(fetchUpdateKafedrasThunk.fulfilled, (s, action) => {
        const updated = action.payload
        s.items = s.items.map((k) => (k.id === updated.id ? updated : k))
        if (s.current?.id === updated.id) s.current = updated
      })

      .addCase(fetchDeleteKafedrasThunk.fulfilled, (s, action) => {
        const deletedId = action.payload
        s.items = s.items.filter((k) => k.id !== deletedId)
        if (s.current?.id === deletedId) s.current = null
      })
  },
})

export default kafedrasSlice.reducer
