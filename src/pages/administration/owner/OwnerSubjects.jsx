import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
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
  fetchUpdateSubjectsThunk,
} from '../../../features/admins/subjectSlice'

import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'
import { fetchAllKafedrasThunk } from '../../../features/admins/kafedraSlice'
import { fetchAllDirectionThunk } from '../../../features/admins/directionSlice'

import { usePagination } from '../../../hooks/usePagination'
import { ChevronLeft, ChevronRight, Trash, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/UI/Input'

const OwnerSubjects = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { items: subjects } = useSelector(selectSubject)
  const { items: univers } = useSelector(selectUniver)
  const { items: kafedras } = useSelector(selectKafedra)
  const { items: directions } = useSelector(selectDirection)

  const [openForm, setOpenForm] = useState(false)
  const [editId, setEditId] = useState(null)

  // search in FORM (directions)
  const [directionSearch, setDirectionSearch] = useState('')

  // search in TABLE
  const [search, setSearch] = useState('')

  const [subjectsForm, setSubjectsForm] = useState([
    {
      name: '',
      university_id: null,
      kafedra_id: null,
      direction_ids: [],
    },
  ])

  useEffect(() => {
    dispatch(fetchAllUniverThunk())
    dispatch(fetchAllKafedrasThunk())
    dispatch(fetchAllDirectionThunk())
    dispatch(fetchAllGetSubjectsThunk())
  }, [dispatch])

  /* ================= HELPERS ================= */

  const updateField = (index, field, value) => {
    setSubjectsForm((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
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

  const handleEdit = (subject) => {
    setSubjectsForm([
      {
        name: subject.name,
        university_id: subject.university_id,
        kafedra_id: subject.kafedra_id,
        direction_ids: subject.direction_ids || [],
      },
    ])
    setEditId(subject.id)
    setOpenForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const valid = subjectsForm.filter(
      (s) => s.name && s.university_id && s.kafedra_id,
    )

    if (!valid.length) return alert(t('no_data'))

    if (editId) {
      await dispatch(
        fetchUpdateSubjectsThunk({
          id: editId,
          updated: valid[0],
        }),
      )
    } else {
      await dispatch(fetchAddSubjectsThunkBulk(valid))
    }

    await dispatch(fetchAllGetSubjectsThunk())

    setSubjectsForm([
      {
        name: '',
        university_id: null,
        kafedra_id: null,
        direction_ids: [],
      },
    ])

    setEditId(null)
    setOpenForm(false)
  }

  const handleDelete = async (id) => {
    await dispatch(fetchDeleteSubjectsThunk(id))
  }

  /* ================= SEARCH + FILTER ================= */

  const filteredSubjects = subjects.filter((s) => {
    if (!search) return true

    const univerName = univers.find((u) => u.id === s.university_id)?.name || ''

    const kafedraName = kafedras.find((k) => k.id === s.kafedra_id)?.name || ''

    const directionNames = (s.direction_ids || [])
      .map((id) => directions.find((d) => d.id === id)?.name)
      .join(' ')

    const target = `
      ${s.name}
      ${univerName}
      ${kafedraName}
      ${directionNames}
    `.toLowerCase()

    return target.includes(search.toLowerCase())
  })

  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    filteredSubjects,
    10,
  )

  useEffect(() => {
    goTo(1)
  }, [search])

  /* ================= JSX ================= */

  return (
    <div className="subjects-admin">
      <h1>{t('subjects')}</h1>
      <div className="filter-block">
        <button onClick={() => setOpenForm(true)}>{t('add')}</button>
        {/* SEARCH */}
        <Input
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {openForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="subjects-form">
            {subjectsForm.map((subj, index) => {
              const availableKafedras = kafedras.filter(
                (k) => k.university_id === subj.university_id,
              )

              const availableDirections = directions.filter(
                (d) => d.university_id === subj.university_id,
              )

              return (
                <div key={index} className="subject-item">
                  <input
                    placeholder={t('subject')}
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
                    <option value="">{t('university')}</option>
                    {univers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={subj.kafedra_id ?? ''}
                    onChange={(e) =>
                      updateField(index, 'kafedra_id', Number(e.target.value))
                    }
                  >
                    <option value="">{t('kafedra')}</option>
                    {availableKafedras.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>

                  <div className="direction-wrapper">
                    <input
                      className="direction-search"
                      placeholder={t('directions')}
                      value={directionSearch}
                      onChange={(e) => setDirectionSearch(e.target.value)}
                    />

                    <div className="direction-list">
                      {availableDirections
                        .filter((d) =>
                          d.name
                            .toLowerCase()
                            .includes(directionSearch.toLowerCase()),
                        )
                        .map((d) => (
                          <label key={d.id} className="direction-item">
                            <input
                              type="checkbox"
                              checked={subj.direction_ids.includes(d.id)}
                              onChange={() => toggleDirection(index, d.id)}
                            />
                            <span>{d.name}</span>
                          </label>
                        ))}

                      {!availableDirections.length && (
                        <div className="empty">{t('no_data')}</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            <button type="submit">{editId ? t('save') : t('add')}</button>
            <button
              type="button"
              onClick={() => {
                setOpenForm(false)
                setEditId(null)
              }}
            >
              {t('cancel')}
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('subject')}</th>
            <th>{t('kafedra')}</th>
            <th>{t('university')}</th>
            <th>{t('directions')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td>{s.name}</td>
              <td>{kafedras.find((k) => k.id === s.kafedra_id)?.name}</td>
              <td>{univers.find((u) => u.id === s.university_id)?.name}</td>
              <td>
                {(s.direction_ids || [])
                  .map((id) => directions.find((d) => d.id === id)?.name)
                  .join(', ')}
              </td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(s)}>
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(s.id)}>
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
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
