import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectLiterature } from '../../../features/admins/literatureSlice'
import {
  fetchAllLiteraturesThunk,
  createLiteratureThunk,
  updateLiteratureThunk,
  deleteLiteratureThunk,
  createLiteratureUploadThunk,
  updateLiteratureUploadThunk,
  downloadLiteratureFileThunk,
} from '../../../features/admins/literatureSlice'

import { selectDirection, selectSubject, selectUniver } from '../../../store'
import { fetchAllDirectionThunk } from '../../../features/admins/directionSlice'
import { fetchAllGetSubjectsThunk } from '../../../features/admins/subjectSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'

import { useTranslation } from 'react-i18next'
import { usePagination } from '../../../hooks/usePagination'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Trash,
} from 'lucide-react'

// ===== ENUMS =====
const LANGUAGE_OPTIONS = ["o'zbek", 'rus', 'qoraqolpoq', 'ingliz']
const FONT_OPTIONS = ['kirill', 'lotin', 'ingliz']
const CONDITION_OPTIONS = ['Zamon talabiga mos', 'Zamon talabiga mos emas']
const USAGE_OPTIONS = [
  'Fan dasturida foydalaniladi',
  'Fan dasturida foydalanilmaydi',
]

// ===== EMPTY FORM =====
const emptyForm = {
  title: '',
  kind: '',
  author: '',
  publisher: '',
  language: 'Til',
  font_type: 'Yozuv turi',
  year: new Date().getFullYear(),
  printed_count: '',
  condition: 'Zamon talabiga mos',
  usage_status: 'Fan dasturida foydalaniladi',

  subject_id: null,
  university_id: null,

  file: null,
  file2: null,
}

export default function OwnerLiteratures() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { items: directions } = useSelector(selectDirection)
  const { items: literatures, loading, error } = useSelector(selectLiterature)
  const { items: subjects } = useSelector(selectSubject)
  const { items: univers } = useSelector(selectUniver)

  const [filterUniver, setFilterUniver] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [useFileMode, setUseFileMode] = useState(false)

  useEffect(() => {
    dispatch(fetchAllUniverThunk())
    dispatch(fetchAllDirectionThunk())
    dispatch(fetchAllGetSubjectsThunk())
    dispatch(fetchAllLiteraturesThunk())
  }, [dispatch])

  const filtered = useMemo(() => {
    let list = literatures
    if (filterUniver)
      list = list.filter((i) => i.university_id === Number(filterUniver))
    if (filterSubject)
      list = list.filter((i) => i.subject_id === Number(filterSubject))
    return list
  }, [literatures, filterUniver, filterSubject])

  const getName = (arr, id) => arr.find((x) => x.id === id)?.name || '-'

  const startAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setUseFileMode(false)
    setOpenForm(true)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setUseFileMode(false)
    setForm({
      title: item.title ?? '',
      kind: item.kind ?? '',
      author: item.author ?? '',
      publisher: item.publisher ?? '',
      language: item.language,
      font_type: item.font_type,
      year: item.year,
      printed_count: item.printed_count ?? '',
      condition: item.condition,
      usage_status: item.usage_status,
      subject_id: item.subject_id,
      university_id: item.university_id,
      file: null,
      file2: null,
    })
    setOpenForm(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      year: Number(form.year),
      subject_id: Number(form.subject_id),
      university_id: Number(form.university_id),
      printed_count: form.printed_count ? Number(form.printed_count) : null,
    }

    if (!payload.title || !payload.kind) return

    if (editingId) {
      if (useFileMode) {
        await dispatch(
          updateLiteratureUploadThunk({
            id: editingId,
            updated: {
              ...payload,
              file: form.file,
              file2: form.file2,
            },
          }),
        )
      } else {
        await dispatch(
          updateLiteratureThunk({ id: editingId, updated: payload }),
        )
      }
    } else {
      if (useFileMode) {
        await dispatch(
          createLiteratureUploadThunk({
            ...payload,
            file: form.file,
            file2: form.file2,
          }),
        )
      } else {
        await dispatch(createLiteratureThunk(payload))
      }
    }

    await dispatch(fetchAllLiteraturesThunk())
    setOpenForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const onDelete = async (id) => {
    await dispatch(deleteLiteratureThunk(id))
  }

  const onDownload = async (id, fileNumber) => {
    await dispatch(downloadLiteratureFileThunk({ id, fileNumber }))
  }

  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    filtered,
    10,
  )

  return (
    <div style={{ padding: 16 }}>
      <h1>Literatures</h1>

      <button onClick={startAdd}>{t('add')}</button>

      {openForm && (
        <form onSubmit={onSubmit} className="directions-form">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Kind"
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
          />

          <label>
            <input
              type="checkbox"
              checked={useFileMode}
              onChange={(e) => setUseFileMode(e.target.checked)}
            />{' '}
            Attach files
          </label>

          {useFileMode && (
            <>
              <input
                type="file"
                onChange={(e) =>
                  setForm({
                    ...form,
                    file: e.target.files?.[0] || null,
                  })
                }
              />
              <input
                type="file"
                onChange={(e) =>
                  setForm({
                    ...form,
                    file2: e.target.files?.[0] || null,
                  })
                }
              />
            </>
          )}

          <button type="submit">{editingId ? 'Save' : 'Create'}</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Files</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((l, i) => (
            <tr key={l.id}>
              <td>{i + 1}</td>
              <td>{l.title}</td>
              <td>
                {l.file_path && (
                  <button onClick={() => onDownload(l.id, 1)}>
                    <Download />
                  </button>
                )}
                {l.file_path_2 && (
                  <button onClick={() => onDownload(l.id, 2)}>
                    <Download />
                  </button>
                )}
              </td>
              <td>
                <button onClick={() => startEdit(l)}>
                  <Pencil />
                </button>
                <button onClick={() => onDelete(l.id)}>
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={prev} disabled={page === 1}>
          <ChevronLeft />
        </button>

        {[...Array(maxPage)].map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            className={page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={next} disabled={page === maxPage}>
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
