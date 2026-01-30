import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

// helpers
const toFormData = (obj = {}) => {
  const fd = new FormData()
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    // массивы
    if (Array.isArray(v)) {
      v.forEach((x) => fd.append(k, x))
    } else {
      fd.append(k, v)
    }
  })
  return fd
}

// ===== Thunks =====

// fetch all
export const fetchAllLiteraturesThunk = createAsyncThunk(
  'literatures/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/literatures/')
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Fetch literatures failed',
      )
    }
  },
)

// create (multipart)
export const createLiteratureUploadThunk = createAsyncThunk(
  'literatures/createUpload',
  async (payload, { rejectWithValue }) => {
    try {
      const fd = toFormData(payload) // может содержать file и file_2
      const { data } = await http.post('/literatures/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Create (upload) failed',
      )
    }
  },
)

// update (multipart)
export const updateLiteratureUploadThunk = createAsyncThunk(
  'literatures/updateUpload',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const fd = toFormData(updated) // file и file_2
      const { data } = await http.put(`/literatures/upload/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Update (upload) failed',
      )
    }
  },
)

// download file
export const downloadLiteratureFileThunk = createAsyncThunk(
  'literatures/download',
  async ({ id, fileNumber = 1 }, { rejectWithValue }) => {
    try {
      const res = await http.get(`/literatures/${id}/download/${fileNumber}`, {
        responseType: 'blob',
      })

      const disposition = res.headers['content-disposition']
      let filename = `literature_${id}`

      if (disposition) {
        const match = disposition.match(/filename="?(.+?)"?$/)
        if (match && match[1]) filename = match[1]
      }

      const blobUrl = window.URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)

      return { id, fileNumber }
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || 'Download failed')
    }
  },
)

// slice
const literatureSlice = createSlice({
  name: 'literatures',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentLiterature: (s, a) => {
      s.current = a.payload
    },
    clearError: (s) => {
      s.error = null
    },
  },
  extraReducers: (b) => {
    b
      // fetch all
      .addCase(fetchAllLiteraturesThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchAllLiteraturesThunk.fulfilled, (s, { payload }) => {
        s.loading = false
        s.items = payload.sort((a, b) => a.id - b.id)
      })
      .addCase(fetchAllLiteraturesThunk.rejected, (s, { payload }) => {
        s.loading = false
        s.error = payload
      })

      // create
      .addCase(createLiteratureUploadThunk.fulfilled, (s, { payload }) => {
        s.items.push(payload)
      })
      .addCase(createLiteratureUploadThunk.rejected, (s, { payload }) => {
        s.error = payload
      })

      // update
      .addCase(updateLiteratureUploadThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.map((x) => (x.id === payload.id ? payload : x))
        if (s.current?.id === payload.id) s.current = payload
      })
      .addCase(updateLiteratureUploadThunk.rejected, (s, { payload }) => {
        s.error = payload
      })
  },
})

export const selectLiterature = (state) => state.literatures
export const { setCurrentLiterature, clearError } = literatureSlice.actions
export default literatureSlice.reducer
