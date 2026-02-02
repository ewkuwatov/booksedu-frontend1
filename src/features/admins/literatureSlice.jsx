import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

/* ===========================
   Helpers
=========================== */

const toFormData = (obj = {}) => {
  const fd = new FormData()

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    // File / Blob
    if (value instanceof File) {
      fd.append(key, value)
      return
    }

    // arrays
    if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, v))
      return
    }

    fd.append(key, value)
  })

  return fd
}

/* ===========================
   Thunks
=========================== */

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

export const createLiteratureThunk = createAsyncThunk(
  'literatures/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/literatures/', payload)
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Create literature failed',
      )
    }
  },
)

export const updateLiteratureThunk = createAsyncThunk(
  'literatures/update',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`/literatures/${id}`, updated)
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Update literature failed',
      )
    }
  },
)

export const deleteLiteratureThunk = createAsyncThunk(
  'literatures/delete',
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/literatures/${id}`)
      return id
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Delete literature failed',
      )
    }
  },
)

/* ===========================
   Upload (file / file2)
=========================== */

export const createLiteratureUploadThunk = createAsyncThunk(
  'literatures/createUpload',
  async (payload, { rejectWithValue }) => {
    try {
      const fd = toFormData(payload)

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

export const updateLiteratureUploadThunk = createAsyncThunk(
  'literatures/updateUpload',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const fd = toFormData(updated)

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

/* ===========================
   Download
=========================== */

export const downloadLiteratureFileThunk = createAsyncThunk(
  'literatures/download',
  async ({ id, fileNumber = 1 }, { rejectWithValue }) => {
    try {
      const res = await http.get(
        `/literatures/${id}/download/${fileNumber}`,
        { responseType: 'blob' },
      )

      const disposition = res.headers['content-disposition']
      let filename = `literature_${id}`

      if (disposition) {
        const match = disposition.match(/filename="?(.+?)"?$/)
        if (match?.[1]) filename = match[1]
      }

      const blobUrl = window.URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)

      return id
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || 'Download failed')
    }
  },
)

/* ===========================
   Slice
=========================== */

const literatureSlice = createSlice({
  name: 'literatures',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentLiterature: (state, action) => {
      state.current = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAllLiteraturesThunk.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchAllLiteraturesThunk.fulfilled, (s, { payload }) => {
        s.loading = false
        s.items = payload
      })
      .addCase(fetchAllLiteraturesThunk.rejected, (s, { payload }) => {
        s.loading = false
        s.error = payload
      })

      // create
      .addCase(createLiteratureThunk.fulfilled, (s, { payload }) => {
        s.items.push(payload)
      })

      // upload create
      .addCase(createLiteratureUploadThunk.fulfilled, (s, { payload }) => {
        s.items.push(payload)
      })

      // update
      .addCase(updateLiteratureThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.map((i) => (i.id === payload.id ? payload : i))
      })

      // update upload
      .addCase(updateLiteratureUploadThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.map((i) => (i.id === payload.id ? payload : i))
      })

      // delete
      .addCase(deleteLiteratureThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.filter((i) => i.id !== payload)
      })
  },
})

export const { setCurrentLiterature, clearError } = literatureSlice.actions

export const selectLiterature = (state) => state.literatures

export default literatureSlice.reducer
