import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

export const fetchAllUniverThunk = createAsyncThunk(
  'universities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/universities/')
      console.log('UNIVERS RESPONSE:', data)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'get Univer failed'
      )
    }
  }
)

export const fetchUnvierByIdThunk = createAsyncThunk(
  'universities/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await http.get(`/universities/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'get UniverByID failed'
      )
    }
  }
)

export const fetchAddUnvierThunk = createAsyncThunk(
  'universities/fetchAdd',
  async (created, { rejectWithValue }) => {
    try {
      const { data } = await http.post(`/universities/`, created)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'create Univer failed'
      )
    }
  }
)


export const fetchUpdateUnvierThunk = createAsyncThunk(
  'universities/fetchUpdate',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`/universities/${id}`, updated)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'update Univer failed'
      )
    }
  }
)

export const fetchDeleteUniverThunk = createAsyncThunk(
  'universities/fetchDelete',
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/universities/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'delete Univer failed'
      )
    }
  }
)

const univerSlice = createSlice({
  name: 'univers',
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      // ---- FETCH ALL ----
      .addCase(fetchAllUniverThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchAllUniverThunk.fulfilled, (s, action) => {
        s.loading = false
        s.items = action.payload
      })
      .addCase(fetchAllUniverThunk.rejected, (s, action) => {
        s.error = action.payload
      })

      // ---- FETCH BY ID ----
      .addCase(fetchUnvierByIdThunk.fulfilled, (s, action) => {
        s.selected = action.payload
      })

      // ---- ADD ----
      .addCase(fetchAddUnvierThunk.fulfilled, (s, action) => {
        s.items.push(action.payload) // Добавили новый элемент в state
      })

      // ---- UPDATE ----
      .addCase(fetchUpdateUnvierThunk.fulfilled, (s, action) => {
        const updated = action.payload
        s.items = s.items.map((u) => (u.id === updated.id ? updated : u))
        if (s.selected?.id === updated.id) s.selected = updated
      })
      // ---- DELETE ----
      .addCase(fetchDeleteUniverThunk.fulfilled, (s, action) => {
        const deletedId = action.payload
        s.items = s.items.filter((u) => u.id !== deletedId)
        if (s.selected?.id === deletedId) s.selected = null
      })
  },
})

export default univerSlice.reducer
