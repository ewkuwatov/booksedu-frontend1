import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { http } from '../../api/http'

// helpers
const toFormData = (obj = {}) => {
  const fd = new FormData()
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    // массивы (напр., если когда-то пойдут tags[])
    if (Array.isArray(v)) {
      v.forEach((x) => fd.append(k, x))
    } else {
      fd.append(k, v)
    }
  })
  return fd
}

// ===== Thunks =====
export const fetchAllLiteraturesThunk = createAsyncThunk(
  'literatures/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/literatures/')
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Fetch literatures failed'
      )
    }
  }
)

export const createLiteratureThunk = createAsyncThunk(
  'literatures/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/literatures/', payload)
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Create literature failed'
      )
    }
  }
)

export const updateLiteratureThunk = createAsyncThunk(
  'literatures/update',
  async ({ id, updated }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`/literatures/${id}`, updated)
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Update literature failed'
      )
    }
  }
)

export const deleteLiteratureThunk = createAsyncThunk(
  'literatures/delete',
  async (id, { rejectWithValue }) => {
    try {
      await http.delete(`/literatures/${id}`)
      return id
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Delete literature failed'
      )
    }
  }
)

// multipart: create with file
export const createLiteratureUploadThunk = createAsyncThunk(
  'literatures/createUpload',
  async (payload, { rejectWithValue }) => {
    try {
      const fd = toFormData(payload) // { ...fields, file: File }
      const { data } = await http.post('/literatures/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || 'Create (upload) failed'
      )
    }
  }
)

// multipart: update with file
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
        e.response?.data?.detail || 'Update (upload) failed'
      )
    }
  }
)

// download (вернёт blob + имя файла из Content-Disposition, если нужно — можно доработать)
export const downloadLiteratureFileThunk = createAsyncThunk(
  'literatures/download',
  async (id, { rejectWithValue }) => {
    try {
      const res = await http.get(`/literatures/${id}/download`, {
        responseType: 'blob',
      })

      // Получаем имя из заголовка Content-Disposition
      const disposition = res.headers['content-disposition']
      let filename = `literature_${id}`

      if (disposition) {
        const match = disposition.match(/filename="?(.+?)"?$/)
        if (match && match[1]) filename = match[1]
      }

      // Создаём blob URL
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
  }
)


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
        s.items = payload
      })
      .addCase(fetchAllLiteraturesThunk.rejected, (s, { payload }) => {
        s.loading = false
        s.error = payload
      })

      // create (json)
      .addCase(createLiteratureThunk.fulfilled, (s, { payload }) => {
        s.items.push(payload)
      })
      .addCase(createLiteratureThunk.rejected, (s, { payload }) => {
        s.error = payload
      })

      // create (upload)
      .addCase(createLiteratureUploadThunk.fulfilled, (s, { payload }) => {
        s.items.push(payload)
      })
      .addCase(createLiteratureUploadThunk.rejected, (s, { payload }) => {
        s.error = payload
      })

      // update (json)
      .addCase(updateLiteratureThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.map((x) => (x.id === payload.id ? payload : x))
        if (s.current?.id === payload.id) s.current = payload
      })
      .addCase(updateLiteratureThunk.rejected, (s, { payload }) => {
        s.error = payload
      })

      // update (upload)
      .addCase(updateLiteratureUploadThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.map((x) => (x.id === payload.id ? payload : x))
        if (s.current?.id === payload.id) s.current = payload
      })
      .addCase(updateLiteratureUploadThunk.rejected, (s, { payload }) => {
        s.error = payload
      })

      // delete
      .addCase(deleteLiteratureThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.filter((x) => x.id !== payload)
        if (s.current?.id === payload) s.current = null
      })
      .addCase(deleteLiteratureThunk.rejected, (s, { payload }) => {
        s.error = payload
      })
  },
})

export const selectLiterature = (state) => state.literatures
export const { setCurrentLiterature, clearError } = literatureSlice.actions
export default literatureSlice.reducer
