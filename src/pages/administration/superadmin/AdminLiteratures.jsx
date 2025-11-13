import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchAllLiteraturesThunk,
  createLiteratureThunk,
  updateLiteratureThunk,
  deleteLiteratureThunk,
  createLiteratureUploadThunk,
  updateLiteratureUploadThunk,
  downloadLiteratureFileThunk,
} from '../../../features/admins/literatureSlice'

import { fetchAllGetSubjectsThunk } from '../../../features/admins/subjectSlice'

import { selectAuth, selectSubject } from '../../../store'

import {
  LanguageEnum,
  FontTypeEnum,
  ConditionEnum,
  UsageStatusEnum,
} from '../../../utils/unums'

const emptyForm = {
  title: '',
  kind: '',
  author: '',
  publisher: '',
  language: 'uzbek',
  font_type: 'latin',
  year: new Date().getFullYear(),
  printed_count: '',
  condition: 'actual',
  usage_status: 'use',
  image: '',
  file_path: '',
  subject_id: null,
  university_id: null,
  file: null,
}

export default function AdminLiteratures() {
  const dispatch = useDispatch()

  const { user } = useSelector(selectAuth)
  const { items: subjects } = useSelector(selectSubject)
  const { items: literatures } = useSelector((s) => s.literatures)

  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [useFileMode, setUseFileMode] = useState(false)

  // !!! ВАЖНО — загружаем предметы !!!
  useEffect(() => {
    dispatch(fetchAllLiteraturesThunk()).unwrap()
    dispatch(fetchAllGetSubjectsThunk()).unwrap()
  }, [dispatch])

  // фильтрация литературы по университету админа
  const filtered = useMemo(
    () => literatures.filter((l) => l.university_id === user.university_id),
    [literatures, user]
  )

  // старт добавления
  const startAdd = () => {
    setEditingId(null)
    setForm({
      ...emptyForm,
      university_id: user.university_id,
    })
    setOpenForm(true)
    setUseFileMode(false)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm({
      ...item,
      file: null,
    })
    setOpenForm(true)
    setUseFileMode(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      year: Number(form.year),
      printed_count: form.printed_count ? Number(form.printed_count) : null,
      subject_id: Number(form.subject_id),
      university_id: user.university_id,
    }

    if (!payload.title || !payload.kind || !payload.subject_id) return

    if (editingId) {
      if (useFileMode && form.file) {
        await dispatch(
          updateLiteratureUploadThunk({
            id: editingId,
            updated: { ...payload, file: form.file },
          })
        ).unwrap()
      } else {
        await dispatch(
          updateLiteratureThunk({ id: editingId, updated: payload })
        )
      }
    } else {
      if (useFileMode && form.file) {
        await dispatch(createLiteratureUploadThunk(payload)).unwrap()
      } else {
        await dispatch(createLiteratureThunk(payload)).unwrap()
      }
    }

    await dispatch(fetchAllLiteraturesThunk()).unwrap()
    setOpenForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const onDelete = async (id) => {
    await dispatch(deleteLiteratureThunk(id)).unwrap()
  }

  const onDownload = async (id) => {
    await dispatch(downloadLiteratureFileThunk(id)).unwrap()
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Literatures — {user.university_name}</h1>

      <button onClick={startAdd}>Add Literature</button>

      {openForm && (
        <form
          onSubmit={onSubmit}
          style={{
            marginTop: 12,
            display: 'grid',
            gap: 8,
            maxWidth: 600,
          }}
        >
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

          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <input
            placeholder="Publisher"
            value={form.publisher}
            onChange={(e) => setForm({ ...form, publisher: e.target.value })}
          />

          <input
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

          <input
            type="number"
            placeholder="Printed count"
            value={form.printed_count}
            onChange={(e) =>
              setForm({ ...form, printed_count: e.target.value })
            }
          />

          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          >
            {Object.values(LanguageEnum).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={form.font_type}
            onChange={(e) => setForm({ ...form, font_type: e.target.value })}
          >
            {Object.values(FontTypeEnum).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          >
            {Object.values(ConditionEnum).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={form.usage_status}
            onChange={(e) => setForm({ ...form, usage_status: e.target.value })}
          >
            {Object.values(UsageStatusEnum).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* SUBJECT */}
          <select
            value={form.subject_id ?? ''}
            onChange={(e) =>
              setForm({ ...form, subject_id: Number(e.target.value) || null })
            }
          >
            <option value="">Select subject</option>

            {subjects
              .filter((s) => s.university_id === user.university_id)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">{editingId ? 'Save' : 'Create'}</button>
            <button
              type="button"
              onClick={() => {
                setOpenForm(false)
                setEditingId(null)
                setForm(emptyForm)
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Kind</th>
            <th>Subject</th>
            <th>File</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((l) => (
            <tr key={l.id}>
              <td>{l.title}</td>
              <td>{l.kind}</td>
              <td>
                {subjects.find((s) => s.id === l.subject_id)?.name || '-'}
              </td>
              <td>{l.file_path ? '📄' : '-'}</td>
              <td>
                <button onClick={() => startEdit(l)}>Edit</button>
                <button onClick={() => onDelete(l.id)}>Del</button>
                <button
                  disabled={!l.file_path}
                  onClick={() => onDownload(l.id)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
