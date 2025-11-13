import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../api/http'
import { Loader } from 'lucide-react'

export const fetchGetGeneralStatsThunk = createAsyncThunk(
  'general',
  async (__, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/stats/general')
      return data
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail || 'get General Stats failed'
      )
    }
  }
)

const General_stats = createSlice({
  name: 'general_stats',
  initialState: {
    items: null,
    Loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGetGeneralStatsThunk.pending, (s) => {
        s.Loading = true
        s.error = null
      })
      .addCase(fetchGetGeneralStatsThunk.fulfilled, (s, action) => {
        s.Loading = false
        s.items = action.payload
      })
      .addCase(fetchGetGeneralStatsThunk.rejected, (s, action) => {
        s.error = action.payload
      })
  },
})

export default General_stats.reducer
