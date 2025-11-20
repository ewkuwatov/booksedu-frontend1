import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useMemo } from 'react'

import {
  selectSubject,
  selectUniver,
  selectKafedra,
  selectDirection,
} from '../../../store'

import {
  fetchAllGetSubjectsThunk,
  fetchDeleteSubjectsThunk,
  fetchAddSubjectsThunkBulk,
} from '../../../features/admins/subjectSlice'

import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'
import { fetchAllKafedrasThunk } from '../../../features/admins/kafedraSlice'
import { fetchAllDirectionThunk } from '../../../features/admins/directionSlice'
import { useTranslation } from 'react-i18next'
import { usePagination } from '../../../hooks/usePagination'

const OwnerSubjects = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { items: subjects } = useSelector(selectSubject)
  const { items: univers } = useSelector(selectUniver)
  const { items: kafedras } = useSelector(selectKafedra)
  const { items: directions } = useSelector(selectDirection)
  const [filterUniver, setFilterUniver] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [subjectsForm, setSubjectsForm] = useState([
    {
      name: '',
      university_id: null,
      kafedra_id: null,
      direction_ids: [],
      error: false,
    },
  ])

  useEffect(() => {
    dispatch(fetchAllUniverThunk()).unwrap()
    dispatch(fetchAllKafedrasThunk()).unwrap()
    dispatch(fetchAllDirectionThunk()).unwrap()
    dispatch(fetchAllGetSubjectsThunk()).unwrap()
  }, [dispatch])

  const filteredSubjects = useMemo(
    () =>
      filterUniver
        ? subjects.filter((s) => s.university_id === Number(filterUniver))
        : subjects,
    [subjects, filterUniver]
  )

  const checkDuplicate = (name, university_id, kafedra_id) => {
    return subjects.some(
      (s) =>
        s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        s.university_id === university_id &&
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
                field !== 'name' &&
                field !== 'kafedra_id' &&
                field !== 'university_id'
                  ? item.error
                  : checkDuplicate(
                      field === 'name' ? value : item.name,
                      field === 'university_id' ? value : item.university_id,
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
        university_id: null,
        kafedra_id: null,
        direction_ids: [],
        error: false,
      },
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const valid = subjectsForm.filter(
      (s) => s.name && s.university_id && s.kafedra_id && !s.error
    )
    if (!valid.length) return alert('Исправьте ошибки в форме ✅')

    await dispatch(fetchAddSubjectsThunkBulk(valid)).unwrap()
    await dispatch(fetchAllGetSubjectsThunk()).unwrap()

    setSubjectsForm([
      {
        name: '',
        university_id: null,
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

    // === ПАГИНАЦИЯ ===
    const { page, maxPage, currentData, next, prev, goTo } = usePagination(
      filteredSubjects,
      10
    )

  return (
    <div className="subjects-admin">
      <h1>📚 Subjects</h1>
      <button className="primary-btn" onClick={() => setOpenForm(true)}>
        {t('add')}
      </button>
      {openForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="subjects-form">
            {subjectsForm.map((subj, index) => {
              const availableKafedras = kafedras.filter(
                (k) => k.university_id === subj.university_id
              )
              const availableDirections = directions.filter(
                (d) => d.university_id === subj.university_id
              )

              return (
                <div key={index} className="subject-item">
                  <input
                    placeholder={t('name')}
                    value={subj.name}
                    onChange={(e) => updateField(index, 'name', e.target.value)}
                    className="subject-input"
                  />

                  <select
                    value={subj.university_id ?? ''}
                    onChange={(e) =>
                      updateField(
                        index,
                        'university_id',
                        Number(e.target.value)
                      )
                    }
                    className="subject-select"
                  >
                    <option value="">{t('university')}</option>
                    {univers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={subj.kafedra_id ?? ''}
                    disabled={!subj.university_id}
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
                      ❗ Такой предмет уже существует в этом университете и
                      кафедре
                    </p>
                  )}

                  <div className="direction-checkboxes">
                    <strong className="directionBtn">Направления:</strong>
                    {availableDirections.map((d) => (
                      <label key={d.id} style={{ display: 'block' }}>
                        <input
                          type="checkbox"
                          checked={subj.direction_ids.includes(d.id)}
                          onChange={() => toggleDirection(index, d.id)}
                        />
                        {d.name} ({d.course} курс)
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}

            <button type="button" onClick={addFormRow}>
              {t('add_more')}
            </button>
            <button type="submit">{t('save')}</button>
            <button type="button" onClick={() => setOpenForm(false)}>
              {t('cancel')}
            </button>
          </form>
        </div>
      )}

      <select
        value={filterUniver}
        onChange={(e) => setFilterUniver(e.target.value)}
        style={{ marginTop: 20 }}
      >
        <option value="">Все</option>
        {univers.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('name')}</th>
            <th>{t('kafedra')}</th>
            <th>{t('university')}</th>
            <th>{t('directions')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((s, index) => (
            <tr key={s.id}>
              <td>{index + 1}</td>
              <td>{s.name}</td>
              <td>
                {kafedras.find((k) => k.id === s.kafedra_id)?.name || '-'}
              </td>
              <td>
                {univers.find((u) => u.id === s.university_id)?.name || '-'}
              </td>
              <td>
                {(s.direction_ids ?? [])
                  .map((id) => {
                    const d = directions.find((x) => x.id === id)
                    return d ? `${d.name} (${d.course}-курс)` : null
                  })
                  .filter(Boolean)
                  .join(', ') || '-'}
              </td>

              <td>
                <button onClick={() => handleDelete(s.id)}>
                  {t('delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ПАГИНАЦИЯ */}
      <div className="pagination">
        <button onClick={prev} disabled={page === 1}>
          ←
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
          →
        </button>
      </div>
    </div>
  )
}

export default OwnerSubjects
