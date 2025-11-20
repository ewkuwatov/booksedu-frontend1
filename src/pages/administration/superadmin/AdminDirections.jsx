import { useDispatch, useSelector } from 'react-redux'
import { selectDirection, selectAuth, selectUniver } from '../../../store'
import { useEffect, useState } from 'react'
import {
  fetchAddDirectionThunk,
  fetchAllDirectionThunk,
  fetchUpdateDirectionThunk,
} from '../../../features/admins/directionSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'
import Input from '../../../components/UI/Input'
import { useCrud } from '../../../hooks/useCrud'
import Button from '../../../components/UI/Button'
import { useTranslation } from 'react-i18next'
import { usePagination } from '../../../hooks/usePagination'

const AdminDirections = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items: directions } = useSelector(selectDirection)
  const { items: univers } = useSelector(selectUniver)
  const { user } = useSelector(selectAuth)
  const [filtered, setFiltered] = useState([])

  const {
    form,
    setForm,
    openForm,
    setOpenForm,
    editingId,
    startEditing,
    handleSubmit,
    resetForm,
  } = useCrud({
    initialForm: {
      number: '',
      name: '',
      course: 1,
      student_count: null,
      university_id: user?.university_id ?? null,
    },
    fetchAll: () => dispatch(fetchAllDirectionThunk()).unwrap(),
    add: (data) => dispatch(fetchAddDirectionThunk(data)).unwrap(),
    update: (id, data) =>
      dispatch(fetchUpdateDirectionThunk({ id, updated: data })).unwrap(),
  })

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

  // === ПАГИНАЦИЯ ===
  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    filtered,
    10
  )

  return (
    <div>
      <Button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
      >
        {t('add')}
      </Button>

      {openForm && (
        <div className="modal-overlay">
          <form className="directions-form" onSubmit={handleSubmit}>
            <Input
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder={t('cipher')}
            />
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('directions_name')}
            />

            <select
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: Number(e.target.value) })
              }
            >
              <option value={1}>1 {t('course')}</option>
              <option value={2}>2 {t('course')}</option>
              <option value={3}>3 {t('course')}</option>
              <option value={4}>4 {t('course')}</option>
            </select>
            <Input
              value={form.student_count || ''}
              onChange={(e) =>
                setForm({ ...form, student_count: Number(e.target.value) })
              }
              placeholder={t('students_count')}
            />

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
                <button onClick={() => startEditing(d)}>{t('edit')}</button>
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

export default AdminDirections
