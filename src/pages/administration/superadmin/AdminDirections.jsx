import { useDispatch, useSelector } from 'react-redux'
import { selectDirection, selectAuth, selectUniver } from '../../../store'
import { useEffect, useState } from 'react'
import {
  fetchAddDirectionThunk,
  fetchAllDirectionThunk,
  fetchDeleteDirectionThunk,
} from '../../../features/admins/directionSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'

import Input from '../../../components/UI/Input'
import Button from '../../../components/UI/Button'
import { useCrud } from '../../../hooks/useCrud'
import { useTranslation } from 'react-i18next'
import { usePagination } from '../../../hooks/usePagination'
import { Pencil, ChevronLeft, ChevronRight, Trash } from 'lucide-react'

const AdminDirections = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items: directions } = useSelector(selectDirection)
  const { items: univers } = useSelector(selectUniver)
  const { user } = useSelector(selectAuth)

  const [filtered, setFiltered] = useState([])

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
      courses: [], // [{course, students}]
      university_id: user?.university_id ?? null,
    },

    fetchAll: () => dispatch(fetchAllDirectionThunk()).unwrap(),

    // CREATE MULTIPLE
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
          })
        ).unwrap()
      }
    },

    // UPDATE = delete old → create new
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
          })
        ).unwrap()
      }
    },

    remove: (id) => dispatch(fetchDeleteDirectionThunk(id)).unwrap(),
  })

  // Load data
  useEffect(() => {
    dispatch(fetchAllDirectionThunk()).unwrap()
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [dispatch])

  useEffect(() => {
    if (directions.length > 0 && user?.university_id) {
      setFiltered(
        directions.filter((dir) => dir.university_id === user.university_id)
      )
    }
  }, [directions, user])

  // Pagination
  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    filtered,
    10
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    baseHandleSubmit(e)
  }

  return (
    <div className="directions-container">
      <h1>{t('directions')}</h1>

      <Button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
      >
        {t('add')}
      </Button>

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
                                (c) => c.course !== course
                              ),
                            })
                          }
                        }}
                      />
                      <span>{course}-курс</span>

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
                            value = value.replace(/\D+/g, '')
                            value = value.replace(/^0+/, '')

                            setForm({
                              ...form,
                              courses: form.courses.map((c) =>
                                c.course === course
                                  ? {
                                      ...c,
                                      students:
                                        value === '' ? null : Number(value),
                                    }
                                  : c
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

      {filtered.length === 0 && <p>Нет направлений</p>}

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

export default AdminDirections
