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

import { fetchAllDirectionThunk } from '../../../features/admins/directionSlice'

import { fetchAllGetSubjectsThunk } from '../../../features/admins/subjectSlice'

import { selectAuth, selectDirection, selectSubject } from '../../../store'

import {
  LanguageEnum,
  FontTypeEnum,
  ConditionEnum,
  UsageStatusEnum,
} from '../../../utils/unums'

import { useTranslation } from 'react-i18next'

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
  image: '',
  file_path: '',

  subject_id: null,
  university_id: null,

  // для multipart
  file: null,
}

export default function AdminLiteratures() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { user } = useSelector(selectAuth)
  const { items: subjects } = useSelector(selectSubject)
  const { items: literatures } = useSelector((s) => s.literatures)
  const { items: directions } = useSelector(selectDirection)

  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [useFileMode, setUseFileMode] = useState(false)

  useEffect(() => {
    dispatch(fetchAllLiteraturesThunk()).unwrap()
    dispatch(fetchAllDirectionThunk()).unwrap()
    dispatch(fetchAllGetSubjectsThunk()).unwrap()
  }, [dispatch])

  const filtered = useMemo(
    () => literatures.filter((l) => l.university_id === user.university_id),
    [literatures, user]
  )

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
      <h1>
        {t('literatures')} — {user.university_name}
      </h1>

      <button onClick={startAdd}>{t('add')}</button>

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
            placeholder={t('title')}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder={t('kind')}
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
          />

          <input
            placeholder={t('author')}
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <input
            placeholder={t('publisher')}
            value={form.publisher}
            onChange={(e) => setForm({ ...form, publisher: e.target.value })}
          />

          <input
            type="number"
            placeholder={t('year')}
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

          <input
            type="number"
            placeholder={t('printed_count')}
            value={form.printed_count}
            onChange={(e) =>
              setForm({ ...form, printed_count: e.target.value })
            }
          />

          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          >
            <option value="">{t('language')}</option>
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
            <option value="">{t('font')}</option>
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

          <select
            value={form.subject_id ?? ''}
            onChange={(e) =>
              setForm({ ...form, subject_id: Number(e.target.value) || null })
            }
          >
            <option value="">{t('subjects')}</option>

            {subjects
              .filter((s) => s.university_id === user.university_id)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>

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
        </form>
      )}

      <table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('title')}</th>
            <th>{t('kind')}</th>
            <th>{t('subject')}</th>
            <th>{t('course')}</th>
            <th>{t('file')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((l, index) => (
            <tr key={l.id}>
              <td>{index + 1}</td>
              <td>{l.title}</td>
              <td>{l.kind}</td>
              <td>
                {subjects.find((s) => s.id === l.subject_id)?.name || '-'}
              </td>
              <td>
                {(() => {
                  const sub = subjects.find((s) => s.id === l.subject_id)
                  if (!sub) return '-'

                  const dirs = sub.direction_ids || []
                  const courses = dirs
                    .map((id) => directions.find((d) => d.id === id))
                    .filter(Boolean)
                    .map((d) => d.course)

                  return courses.length
                    ? courses.map((c) => `${c} ${t('course')}`).join(', ')
                    : '-'
                })()}
              </td>

              <td>{l.file_path ? '📄' : '-'}</td>

              <td>
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
        </tbody>
      </table>
    </div>
  )
}
