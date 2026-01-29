import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

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

import { usePagination } from '../../../hooks/usePagination'
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const OwnerSubjects = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { items: subjects } = useSelector(selectSubject)
  const { items: univers } = useSelector(selectUniver)
  const { items: kafedras } = useSelector(selectKafedra)
  const { items: directions } = useSelector(selectDirection)

  const [filterUniver, setFilterUniver] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [directionSearch, setDirectionSearch] = useState('')

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
    dispatch(fetchAllUniverThunk())
    dispatch(fetchAllKafedrasThunk())
    dispatch(fetchAllDirectionThunk())
    dispatch(fetchAllGetSubjectsThunk())
  }, [dispatch])

  /* ============================
     FILTERED DATA
  ============================ */

  const filteredSubjects = useMemo(() => {
    return filterUniver
      ? subjects.filter((s) => s.university_id === Number(filterUniver))
      : subjects
  }, [subjects, filterUniver])

  const filteredDirections = useMemo(() => {
    const q = directionSearch.toLowerCase()
    return directions.filter(
      (d) => d.name.toLowerCase().includes(q) || String(d.course).includes(q),
    )
  }, [directions, directionSearch])

  /* ============================
     HELPERS
  ============================ */

  const checkDuplicate = (name, university_id, kafedra_id) => {
    return subjects.some(
      (s) =>
        s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        s.university_id === university_id &&
        s.kafedra_id === kafedra_id,
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
                      field === 'kafedra_id' ? value : item.kafedra_id,
                    ),
            }
          : item,
      ),
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
          : item,
      ),
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
      (s) => s.name && s.university_id && s.kafedra_id && !s.error,
    )

    if (!valid.length) return alert('Исправьте ошибки')

    await dispatch(fetchAddSubjectsThunkBulk(valid))
    await dispatch(fetchAllGetSubjectsThunk())

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
    await dispatch(fetchDeleteSubjectsThunk(id))
  }

  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    filteredSubjects,
    10,
  )

  /* ============================
     JSX
  ============================ */

  return (
    <div className="subjects-admin">
      <h1>📚 Subjects</h1>

      <button onClick={() => setOpenForm(true)}>Добавить</button>

      {openForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="subjects-form">
            {subjectsForm.map((subj, index) => {
              const availableKafedras = kafedras.filter(
                (k) => k.university_id === subj.university_id,
              )

              const availableDirections = filteredDirections.filter(
                (d) => d.university_id === subj.university_id,
              )

              return (
                <div key={index} className="subject-item">
                  <input
                    placeholder="Название"
                    value={subj.name}
                    onChange={(e) => updateField(index, 'name', e.target.value)}
                  />

                  <select
                    value={subj.university_id ?? ''}
                    onChange={(e) =>
                      updateField(
                        index,
                        'university_id',
                        Number(e.target.value),
                      )
                    }
                  >
                    <option value="">Университет</option>
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
                  >
                    <option value="">Кафедра</option>
                    {availableKafedras.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>

                  <div className="direction-wrapper">
                    <input
                      type="text"
                      placeholder="🔍 Поиск направления..."
                      value={directionSearch}
                      onChange={(e) => setDirectionSearch(e.target.value)}
                      className="direction-search"
                    />

                    <div className="direction-list">
                      {availableDirections.map((d) => (
                        <label key={d.id} className="direction-item">
                          <input
                            type="checkbox"
                            checked={subj.direction_ids.includes(d.id)}
                            onChange={() => toggleDirection(index, d.id)}
                          />
                          <span>
                            {d.name} <b>({d.course} курс)</b>
                          </span>
                        </label>
                      ))}

                      {!availableDirections.length && (
                        <div className="empty">Ничего не найдено</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            <button type="button" onClick={addFormRow}>
              + Добавить ещё
            </button>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={() => setOpenForm(false)}>
              Отмена
            </button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Предмет</th>
            <th>Кафедра</th>
            <th>Университет</th>
            <th>Направления</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td>{s.name}</td>
              <td>
                {kafedras.find((k) => k.id === s.kafedra_id)?.name || '-'}
              </td>
              <td>
                {univers.find((u) => u.id === s.university_id)?.name || '-'}
              </td>
              <td>
                {(s.direction_ids || [])
                  .map((id) => {
                    const d = directions.find((x) => x.id === id)
                    return d ? `${d.name} (${d.course})` : null
                  })
                  .filter(Boolean)
                  .join(', ')}
              </td>
              <td>
                <button onClick={() => handleDelete(s.id)}>
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

export default OwnerSubjects
