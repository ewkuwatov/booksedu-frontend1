import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

export const downloadStatisticsExcelThunk = createAsyncThunk(
  'statistics/downloadExcel',
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.get('/statistics/export', {
        responseType: 'blob',
      })

      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'statistics.xlsx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      return true
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || 'Download failed')
    }
  }
)

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState: { loading: false, error: null },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(downloadStatisticsExcelThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(downloadStatisticsExcelThunk.fulfilled, (s) => {
        s.loading = false
      })
      .addCase(downloadStatisticsExcelThunk.rejected, (s, action) => {
        s.loading = false
        s.error = action.payload
      })
  },
})

export default statisticsSlice.reducer
