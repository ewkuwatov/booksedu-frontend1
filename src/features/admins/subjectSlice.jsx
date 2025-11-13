import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

// === GET all subjects ===
export const fetchAllGetSubjectsThunk = createAsyncThunk(
  'subjects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/subjects/')
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Fetch all subjects failed'
      )
    }
  }
)

// === GET by university ID ===
export const fetchGetByIdThunk = createAsyncThunk(
  'subjects/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await http.get(`/subjects/university/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Fetch subjects by university failed'
      )
    }
  }
)

// === BULK ADD ===
export const fetchAddSubjectsThunkBulk = createAsyncThunk(
  'subjects/fetchAddBulk',
  async (subjects, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/subjects/bulk', subjects)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Add subjects failed'
      )
    }
  }
)

// === UPDATE ===
export const fetchUpdateSubjectsThunk = createAsyncThunk(
  'subjects/fetchUpdate',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`/subjects/${id}`, updated)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Update subject failed'
      )
    }
  }
)

// === DELETE ===
export const fetchDeleteSubjectsThunk = createAsyncThunk(
  'subjects/fetchDelete',
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/subjects/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Delete subject failed'
      )
    }
  }
)

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    items: [],
    current: null, // список предметов определенного университета
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      // === GET ALL ===
      .addCase(fetchAllGetSubjectsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllGetSubjectsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = [...action.payload].sort((a, b) => a.id - b.id)
      })
      .addCase(fetchAllGetSubjectsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // === GET BY UNIVERSITY ===
      .addCase(fetchGetByIdThunk.fulfilled, (state, action) => {
        state.current = action.payload
      })

      // === BULK ADD ===
      .addCase(fetchAddSubjectsThunkBulk.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload]
      })

      // === UPDATE ===
      .addCase(fetchUpdateSubjectsThunk.fulfilled, (state, action) => {
        const updated = action.payload
        state.items = state.items.map((item) =>
          item.id === updated.id ? updated : item
        )
        if (state.current?.id === updated.id) state.current = updated
      })

      // === DELETE ===
      .addCase(fetchDeleteSubjectsThunk.fulfilled, (state, action) => {
        const deletedId = action.payload
        state.items = state.items.filter((item) => item.id !== deletedId)
        if (state.current?.id === deletedId) state.current = null
      })
  },
})

export default subjectSlice.reducer
