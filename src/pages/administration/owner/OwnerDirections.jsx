import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { selectDirection, selectUniver } from '../../../store'
import {
  fetchAddDirectionThunk,
  fetchAllDirectionThunk,
  fetchDeleteDirectionThunk,
} from '../../../features/admins/directionSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'

import { useCrud } from '../../../hooks/useCrud'
import Input from '../../../components/UI/Input'
import Button from '../../../components/UI/Button'
import { useTranslation } from 'react-i18next'
import { usePagination } from '../../../hooks/usePagination'
import { Pencil, ChevronLeft, ChevronRight, Trash } from 'lucide-react'

const OwnerDirections = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { items: directions } = useSelector(selectDirection)
  const { items: univers } = useSelector(selectUniver)

  // ---- SEARCH & FILTER ----
  const [search, setSearch] = useState('')
  const [filterUniver, setFilterUniver] = useState('')

  // ---- CRUD ----
  const {
    form,
    setForm,
    openForm,
    setOpenForm,
    editingId,
    startEditing,
    handleDelete,
    resetForm,
    handleSubmit: baseHandleSubmit,
  } = useCrud({
    initialForm: {
      number: '',
      name: '',
      courses: [],
      university_id: null,
    },

    fetchAll: () => dispatch(fetchAllDirectionThunk()).unwrap(),

    add: async (data) => {
      const { number, name, university_id, courses } = data

      for (const item of courses) {
        await dispatch(
          fetchAddDirectionThunk({
            number,
            name,
            university_id,
            course: item.course,
            student_count:
              item.students === null ? null : Number(item.students),
          }),
        ).unwrap()
      }
    },

    update: async (id, data) => {
      const { number, name, university_id, courses } = data

      await dispatch(fetchDeleteDirectionThunk(id)).unwrap()

      for (const item of courses) {
        await dispatch(
          fetchAddDirectionThunk({
            number,
            name,
            university_id,
            course: item.course,
            student_count:
              item.students === null ? null : Number(item.students),
          }),
        ).unwrap()
      }
    },

    remove: (id) => dispatch(fetchDeleteDirectionThunk(id)).unwrap(),
  })

  useEffect(() => {
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [dispatch])

  // ---- FILTER + SEARCH LOGIC ----
  const filtered = directions.filter((d) => {
    const byUniver = filterUniver
      ? d.university_id === Number(filterUniver)
      : true

    const univerName = univers.find((u) => u.id === d.university_id)?.name || ''

    const bySearch = search
      ? d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.number?.toLowerCase().includes(search.toLowerCase()) ||
        univerName.toLowerCase().includes(search.toLowerCase())
      : true

    return byUniver && bySearch
  })

  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    filtered,
    10,
  )

  useEffect(() => {
    goTo(1)
  }, [search, filterUniver])

  const handleSubmit = (e) => {
    e.preventDefault()
    baseHandleSubmit(e)
  }

  return (
    <div className="directions-container">
      <h2>{t('directions')}</h2>
      {/* FILTERS */}
      <div className="filter-block">
        <Button
          onClick={() => {
            resetForm()
            setOpenForm(true)
          }}
          className="toggle-form-btn"
        >
          {t('add')}
        </Button>
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

        <Input
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FORM */}
      {openForm && (
        <div className="modal-overlay">
          <form className="directions-form" onSubmit={handleSubmit}>
            <Input
              placeholder={t('cipher')}
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />

            <Input
              placeholder={t('directions_name')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* COURSES */}
            <div style={{ marginTop: '10px' }}>
              {[1, 2, 3, 4].map((course) => {
                const selected = form.courses.some((c) => c.course === course)
                return (
                  <div key={course} style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              courses: [
                                ...form.courses,
                                { course, students: null },
                              ],
                            })
                          } else {
                            setForm({
                              ...form,
                              courses: form.courses.filter(
                                (c) => c.course !== course,
                              ),
                            })
                          }
                        }}
                      />
                      <span>{course}-kurs</span>

                      {selected && (
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder={t('students_count')}
                          value={
                            form.courses.find((c) => c.course === course)
                              ?.students ?? ''
                          }
                          onChange={(e) => {
                            let value = e.target.value
                              .replace(/\D+/g, '')
                              .replace(/^0+/, '')

                            setForm({
                              ...form,
                              courses: form.courses.map((c) =>
                                c.course === course
                                  ? {
                                      ...c,
                                      students:
                                        value === '' ? null : Number(value),
                                    }
                                  : c,
                              ),
                            })
                          }}
                          style={{ width: '120px' }}
                        />
                      )}
                    </label>
                  </div>
                )
              })}
            </div>

            <select
              value={form.university_id ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  university_id: e.target.value ? Number(e.target.value) : null,
                })
              }
            >
              <option value="">{t('universities')}</option>
              {univers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="form-actions">
              <Button type="submit">{editingId ? t('save') : t('add')}</Button>
              <Button
                type="button"
                onClick={() => {
                  resetForm()
                  setOpenForm(false)
                }}
              >
                {t('back')}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <table className="directions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('cipher')}</th>
            <th>{t('directions')}</th>
            <th>{t('course')}</th>
            <th>{t('students_count')}</th>
            <th>{t('university')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((d, index) => (
            <tr key={d.id}>
              <td>{index + 1}</td>
              <td>{d.number}</td>
              <td>{d.name}</td>
              <td>{d.course}</td>
              <td>{d.student_count}</td>
              <td>
                {univers.find((u) => u.id === d.university_id)?.name || '-'}
              </td>
              <td>
                <button onClick={() => startEditing(d)}>
                  <Pencil />
                </button>
                <button onClick={() => handleDelete(d.id)}>
                  <Trash />
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

        {Array.from({ length: maxPage }).map((_, i) => (
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

export default OwnerDirections
