import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { selectDirection, selectUniver } from '../../../store'
import {
  fetchAddDirectionThunk,
  fetchAllDirectionThunk,
  fetchDeleteDirectionThunk,
  fetchUpdateDirectionThunk,
} from '../../../features/admins/directionSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'

import { useCrud } from '../../../hooks/useCrud'
import Input from '../../../components/UI/Input'
import Button from '../../../components/UI/Button'
import { useTranslation } from 'react-i18next'

const OwnerDirections = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items: directions } = useSelector(selectDirection)
  const { items: univers } = useSelector(selectUniver)

  // ---- CRUD ХУК ----
  const {
    form,
    setForm,
    openForm,
    setOpenForm,
    editingId,
    startEditing,
    handleSubmit,
    handleDelete,
    resetForm,
  } = useCrud({
    initialForm: {
      number: '',
      name: '',
      course: 1,
      student_count: null,
      university_id: null,
    },
    fetchAll: () => dispatch(fetchAllDirectionThunk()).unwrap(),
    add: (data) => dispatch(fetchAddDirectionThunk(data)).unwrap(),
    update: (id, data) =>
      dispatch(fetchUpdateDirectionThunk({ id, updated: data })).unwrap(),
    remove: (id) => dispatch(fetchDeleteDirectionThunk(id)).unwrap(),
  })

  useEffect(() => {
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [dispatch])

  const [filterUniver, setFilterUniver] = useState('')

  const filtered = filterUniver
    ? directions.filter((d) => d.university_id === Number(filterUniver))
    : directions

  return (
    <div className="directions-container">
      <Button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
        className="toggle-form-btn"
      >
        Add Direction
      </Button>

      {/* ФИЛЬТР */}
      <div className="filter-block">
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
      </div>

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
              type="number"
              placeholder={t('students_count')}
              value={form.student_count ?? ''}
              onChange={(e) =>
                setForm({ ...form, student_count: Number(e.target.value) })
              }
            />

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
          {filtered.map((d, index) => (
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
                <button onClick={() => handleDelete(d.id)}>
                  {t('delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OwnerDirections
