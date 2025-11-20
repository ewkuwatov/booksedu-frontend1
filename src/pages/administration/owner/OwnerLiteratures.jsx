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

import { selectSubject, selectUniver } from '../../../store'
import { fetchAllGetSubjectsThunk } from '../../../features/admins/subjectSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'
import { useTranslation } from 'react-i18next'

// enums (должны совпадать со значениями в бэке)
const LANGUAGE_OPTIONS = ['uzbek', 'russian', 'karakalpak', 'english']
const FONT_OPTIONS = ['kirill', 'latin', 'english']
const CONDITION_OPTIONS = ['actual', 'unactual']
const USAGE_OPTIONS = ['use', 'unused']

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

  // для multipart
  file: null,
}

export default function OwnerLiteratures() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items: literatures, loading, error } = useSelector(selectLiterature)
  const { items: subjects } = useSelector(selectSubject)
  const { items: univers } = useSelector(selectUniver)

  const [filterUniver, setFilterUniver] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [useFileMode, setUseFileMode] = useState(false) // JSON или multipart

  useEffect(() => {
    dispatch(fetchAllUniverThunk()).unwrap()
    dispatch(fetchAllGetSubjectsThunk()).unwrap()
    dispatch(fetchAllLiteraturesThunk()).unwrap()
  }, [dispatch])

  const filtered = useMemo(() => {
    let x = literatures
    if (filterUniver)
      x = x.filter((i) => i.university_id === Number(filterUniver))
    if (filterSubject)
      x = x.filter((i) => i.subject_id === Number(filterSubject))
    return x
  }, [literatures, filterUniver, filterSubject])

  const getName = (arr, id) => arr.find((a) => a.id === id)?.name || '-'

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
      language: item.language ?? 'uzbek',
      font_type: item.font_type ?? 'latin',
      year: item.year ?? new Date().getFullYear(),
      printed_count: item.printed_count ?? '',
      condition: item.condition ?? 'actual',
      usage_status: item.usage_status ?? 'use',
      image: item.image ?? '',
      file_path: item.file_path ?? '',
      subject_id: item.subject_id ?? null,
      university_id: item.university_id ?? null,
      file: null,
    })
    setOpenForm(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      printed_count: form.printed_count ? Number(form.printed_count) : null,
      year: Number(form.year),
      subject_id: Number(form.subject_id),
      university_id: Number(form.university_id),
    }

    if (
      !payload.title ||
      !payload.kind ||
      !payload.subject_id ||
      !payload.university_id
    )
      return

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
        ).unwrap()
      }
    } else {
      if (useFileMode && form.file) {
        await dispatch(
          createLiteratureUploadThunk({ ...payload, file: form.file })
        ).unwrap()
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
      <h1>Literatures</h1>

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <select
          value={filterUniver}
          onChange={(e) => setFilterUniver(e.target.value)}
        >
          <option value="">{t('all_univers')}</option>
          {univers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
        >
          <option value="">{t('all_subjects')}</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button onClick={startAdd}>{t('add')}</button>
      </div>

      {openForm && (
        <div className="modal-overlay">
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

            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              {LANGUAGE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <select
              value={form.font_type}
              onChange={(e) => setForm({ ...form, font_type: e.target.value })}
            >
              {FONT_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />

            <input
              type="number"
              placeholder="Printed count"
              value={form.printed_count ?? ''}
              onChange={(e) =>
                setForm({ ...form, printed_count: e.target.value })
              }
            />

            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            >
              {CONDITION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <select
              value={form.usage_status}
              onChange={(e) =>
                setForm({ ...form, usage_status: e.target.value })
              }
            >
              {USAGE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <select
              value={form.university_id ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  university_id: Number(e.target.value) || null,
                })
              }
            >
              <option value="">University</option>
              {univers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <select
              value={form.subject_id ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject_id: Number(e.target.value) || null,
                })
              }
            >
              <option value="">Subject</option>
              {subjects
                .filter(
                  (s) =>
                    !form.university_id ||
                    s.university_id === form.university_id
                )
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label>
                <input
                  type="checkbox"
                  checked={useFileMode}
                  onChange={(e) => setUseFileMode(e.target.checked)}
                />{' '}
                Attach file
              </label>

              <input
                type="file"
                disabled={!useFileMode}
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files?.[0] || null })
                }
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit">{editingId ? t('save') : t('add')}</button>
              <button
                type="button"
                onClick={() => {
                  setOpenForm(false)
                  setEditingId(null)
                  setForm(emptyForm)
                }}
              >
                {t('cancel')}
              </button>
            </div>

            {error ? (
              <div style={{ color: 'crimson' }}>{String(error)}</div>
            ) : null}
          </form>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('title')}</th>
            <th>{t('kind')}</th>
            <th>{t('language')}</th>
            <th>{t('font')}</th>
            <th>{t('year')}</th>
            <th>{t('university')}</th>
            <th>{t('subject')}</th>
            <th>{t('file')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l, index) => (
            <tr key={l.id}>
              <td>{index + 1}</td>
              <td>{l.title}</td>
              <td>{l.kind}</td>
              <td>{l.language}</td>
              <td>{l.font_type}</td>
              <td>{l.year}</td>
              <td>{getName(univers, l.university_id)}</td>
              <td>{getName(subjects, l.subject_id)}</td>
              <td>{l.file_path ? '✓' : '-'}</td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => startEdit(l)}>{t('edit')}</button>
                <button onClick={() => onDelete(l.id)}>{t('delete')}</button>
                <button
                  disabled={!l.file_path}
                  onClick={() => onDownload(l.id)}
                >
                  {t('download')}
                </button>
              </td>
            </tr>
          ))}
          {!loading && !filtered.length && (
            <tr>
              <td
                colSpan={9}
                style={{ textAlign: 'center', opacity: 0.7, padding: 12 }}
              >
                Пусто
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
