import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

export const fetchAllGetSubjectsThunk = createAsyncThunk(
  'subjects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/subjects/')
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'fetch all get Subjets Failed'
      )
    }
  }
)

export const fetchAddSubjectsThunkBulk = createAsyncThunk(
  'subjects/fetchAdd',
  async (subjects, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/subjects/bulk', subjects)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'fetch Add Subjets Failed'
      )
    }
  }
)

export const fetchUpdateSubjectsThunk = createAsyncThunk(
  'subjects/fetchUpdate',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`/subjects/${id}`, updated)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'fetch Updated Subjets Failed'
      )
    }
  }
)

export const fetchDeleteSubjectsThunk = createAsyncThunk(
  'subjects/fetchDelete',
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/subjects/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'fetch Delete Subjets Failed'
      )
    }
  }
)

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllGetSubjectsThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchAllGetSubjectsThunk.fulfilled, (s, action) => {
        s.loading = false
        s.items = action.payload
      })
      .addCase(fetchAllGetSubjectsThunk.rejected, (s, action) => {
        s.error = action.payload
      })

      .addCase(fetchAddSubjectsThunkBulk.fulfilled, (s, action) => {
        s.items.push(action.payload)
      })

      .addCase(fetchUpdateSubjectsThunk.fulfilled, (s, action) => {
        const updated = action.payload
        s.items = s.items.map((s) => (s.id === updated.id ? updated : s))
        if (s.current?.id === updated.id) s.current = updated
      })

      .addCase(fetchDeleteSubjectsThunk.fulfilled, (s, action) => {
        const deleteId = action.payload
        s.items = s.items.filter((s) => s.id !== deleteId)
        if (s.current?.id === deleteId) s.current = null
      })
  },
})

export default subjectSlice.reducer
