import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
  selectAuth,
  selectDirection,
  selectKafedra,
  selectSubject,
} from '../../../store'

import {
  fetchAllGetSubjectsThunk,
  fetchDeleteSubjectsThunk,
  fetchAddSubjectsThunkBulk,
  fetchUpdateSubjectsThunk,
} from '../../../features/admins/subjectSlice'

import { fetchAllKafedrasThunk } from '../../../features/admins/kafedraSlice'
import { fetchAllDirectionThunk } from '../../../features/admins/directionSlice'
import { useTranslation } from 'react-i18next'

const AdminSubjects = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { user } = useSelector(selectAuth)
  const { items: kafedras } = useSelector(selectKafedra)
  const { items: directions } = useSelector(selectDirection)
  const { items: subjects } = useSelector(selectSubject)

  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState(null)

  const univerId = user?.university_id ?? null

  const [subjectsForm, setSubjectsForm] = useState([
    {
      name: '',
      university_id: univerId,
      kafedra_id: null,
      direction_ids: [],
      error: false,
    },
  ])

  useEffect(() => {
    if (univerId) {
      dispatch(fetchAllKafedrasThunk()).unwrap()
      dispatch(fetchAllDirectionThunk()).unwrap()
      dispatch(fetchAllGetSubjectsThunk()).unwrap()
    }
  }, [dispatch, univerId])

  const checkDuplicate = (name, kafedra_id) => {
    return subjects.some(
      (s) =>
        s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        s.university_id === univerId &&
        s.kafedra_id === kafedra_id
    )
  }

  const updateField = (index, field, value) => {
    setSubjectsForm((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
              error:
                field !== 'name' && field !== 'kafedra_id'
                  ? item.error
                  : checkDuplicate(
                      field === 'name' ? value : item.name,
                      field === 'kafedra_id' ? value : item.kafedra_id
                    ),
            }
          : item
      )
    )
  }

  const toggleDirection = (index, id) => {
    setSubjectsForm((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              direction_ids: item.direction_ids.includes(id)
                ? item.direction_ids.filter((x) => x !== id)
                : [...item.direction_ids, id],
            }
          : item
      )
    )
  }

  const addFormRow = () => {
    setSubjectsForm((prev) => [
      ...prev,
      {
        name: '',
        university_id: univerId,
        kafedra_id: null,
        direction_ids: [],
        error: false,
      },
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valid = subjectsForm.filter((s) => s.name && s.kafedra_id && !s.error)
    if (!valid.length) return alert(t('fix_errors'))

    await dispatch(fetchAddSubjectsThunkBulk(valid)).unwrap()
    await dispatch(fetchAllGetSubjectsThunk()).unwrap()

    setSubjectsForm([
      {
        name: '',
        university_id: univerId,
        kafedra_id: null,
        direction_ids: [],
        error: false,
      },
    ])
    setOpenForm(false)
  }

  const handleDelete = async (id) => {
    await dispatch(fetchDeleteSubjectsThunk(id)).unwrap()
  }

  const startEditing = (subject) => {
    setEditingId(subject.id)
    setEditData({
      name: subject.name,
      kafedra_id: subject.kafedra_id,
      direction_ids: subject.direction_ids || [],
    })
  }

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleEditDirection = (id) => {
    setEditData((prev) => ({
      ...prev,
      direction_ids: prev.direction_ids.includes(id)
        ? prev.direction_ids.filter((x) => x !== id)
        : [...prev.direction_ids, id],
    }))
  }

  const handleSaveEdit = async (id) => {
    await dispatch(
      fetchUpdateSubjectsThunk({
        id,
        updated: { ...editData, university_id: univerId },
      })
    ).unwrap()

    setEditingId(null)
    setEditData(null)
    await dispatch(fetchAllGetSubjectsThunk()).unwrap()
  }

  const availableKafedras = kafedras.filter((k) => k.university_id === univerId)
  const availableDirections = directions.filter(
    (d) => d.university_id === univerId
  )

  return (
    <div className="subjects-admin">
      <h1>
        📚 {t('subjects')} — {t('university')} ID: {univerId}
      </h1>

      <button className="primary-btn" onClick={() => setOpenForm(true)}>
        ➕ {t('add')}
      </button>

      {openForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="subjects-form">
            {subjectsForm.map((subj, index) => (
              <div key={index} className="subject-item">
                <input
                  placeholder={t('name')}
                  value={subj.name}
                  onChange={(e) => updateField(index, 'name', e.target.value)}
                  className="subject-input"
                />

                <select
                  value={subj.kafedra_id ?? ''}
                  onChange={(e) =>
                    updateField(index, 'kafedra_id', Number(e.target.value))
                  }
                  className="subject-select"
                >
                  <option value="">{t('kafedra')}</option>
                  {availableKafedras.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
                  ))}
                </select>

                {subj.error && (
                  <p style={{ color: 'red', fontSize: 12 }}>
                    ❗ {t('duplicate_subject')}
                  </p>
                )}

                <div className="direction-checkboxes">
                  <strong className="directionBtn">{t('directions')}</strong>
                  {availableDirections.map((d) => (
                    <label key={d.id} style={{ display: 'block' }}>
                      <input
                        type="checkbox"
                        checked={subj.direction_ids.includes(d.id)}
                        onChange={() => toggleDirection(index, d.id)}
                      />
                      {d.name} ({d.course} {t('course')})
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button type="button" onClick={addFormRow}>
              ➕ {t('add_more')}
            </button>
            <button type="submit">✅ {t('save')}</button>
            <button type="button" onClick={() => setOpenForm(false)}>
              ✖ {t('cancel')}
            </button>
          </form>
        </div>
      )}

      <table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('name')}</th>
            <th>{t('kafedra')}</th>
            <th>{t('directions')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {subjects
            .filter((s) => s.university_id === univerId)
            .map((s, index) => (
              <tr key={s.id}>
                <td>{index + 1}</td>

                <td>
                  {editingId === s.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                    />
                  ) : (
                    s.name
                  )}
                </td>

                <td>
                  {editingId === s.id ? (
                    <select
                      value={editData.kafedra_id ?? ''}
                      onChange={(e) =>
                        handleEditChange('kafedra_id', Number(e.target.value))
                      }
                    >
                      <option value="">{t('kafedra')}</option>
                      {availableKafedras.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    availableKafedras.find((k) => k.id === s.kafedra_id)
                      ?.name || '-'
                  )}
                </td>

                <td>
                  {editingId === s.id ? (
                    <div>
                      {availableDirections.map((d) => (
                        <label key={d.id} style={{ display: 'block' }}>
                          <input
                            type="checkbox"
                            checked={editData.direction_ids.includes(d.id)}
                            onChange={() => toggleEditDirection(d.id)}
                          />
                          {d.name} ({d.course} {t('course')})
                        </label>
                      ))}
                    </div>
                  ) : (
                    (s.direction_ids ?? [])
                      .map((id) => {
                        const d = availableDirections.find((x) => x.id === id)
                        return d
                          ? `${d.name} (${d.course} ${t('course')})`
                          : null
                      })
                      .filter(Boolean)
                      .join(', ') || '-'
                  )}
                </td>

                <td>
                  {editingId === s.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(s.id)}>
                        💾 {t('save')}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditData(null)
                        }}
                      >
                        ❌ {t('cancel')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(s)}>
                        ✏️ {t('edit')}
                      </button>
                      <button onClick={() => handleDelete(s.id)}>
                        🗑 {t('delete')}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminSubjects
