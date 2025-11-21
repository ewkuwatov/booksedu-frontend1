import { useDispatch, useSelector } from 'react-redux'
import { selectAdmin, selectUniver } from '../../../store'
import { useEffect, useState } from 'react'
import {
  fetchAllAdminsThunk,
  fetchCreateAdminThunk,
  fetchDeletedAdminThunk,
  fetchUpdateAdminThunk,
} from '../../../features/admins/adminSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'
import Input from '../../../components/UI/Input'
import Button from '../../../components/UI/Button'
import { useTranslation } from 'react-i18next'
import { usePagination } from '../../../hooks/usePagination'
import { ChevronLeft, ChevronRight, Pencil, Trash } from 'lucide-react'

const OwnerAdmins = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items: admins } = useSelector(selectAdmin)
  const { items: univers } = useSelector(selectUniver)

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'superadmin',
    university_id: null,
  })
  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    dispatch(fetchAllAdminsThunk())
    dispatch(fetchAllUniverThunk())
  }, [dispatch])

  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    admins,
    10
  )

  const resetForm = () => {
    setForm({
      email: '',
      role: 'superadmin',
      university_id: null,
    })
    setEditingId(null)
  }

  const startEditing = (a) => {
    setEditingId(a.id)
    setForm({ ...a })
    setOpenForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim()) return

    if (editingId) {
      await dispatch(
        fetchUpdateAdminThunk({ id: editingId, updated: form })
      ).unwrap()
    } else {
      await dispatch(fetchCreateAdminThunk(form)).unwrap()
    }
    await dispatch(fetchAllAdminsThunk()).unwrap()
    resetForm()
    setOpenForm(false)
  }

  const handleDeleteAdmin = async (id) => {
    await dispatch(fetchDeletedAdminThunk(id)).unwrap()
    await dispatch(fetchAllAdminsThunk()).unwrap()
  }

  return (
    <div className="admins-container">
      <button className="toggle-form-btn" onClick={() => setOpenForm(true)}>
        {t('add')}
      </button>

      {openForm && (
        <div className="modal-overlay">
          <form
            className="admin-form"
            onSubmit={handleSubmit}
            style={{ marginBottom: 20 }}
          >
            {['email', 'password'].map((field) => (
              <Input
                placeholder={field}
                key={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            ))}
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="owner">owner</option>
              <option value="superadmin">superadmin</option>
            </select>

            <select
              value={form.university_id || ''}
              onChange={(e) =>
                setForm({ ...form, university_id: e.target.value || null })
              }
            >
              <option value="">{t('unattached')}</option>
              {univers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="form-actions">
              <Button type="submit">{editingId ? t('save') : t('add')}</Button>
              <Button
                type="reset"
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

      <table className="admins-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('email')}</th>
            <th>{t('role')}</th>
            <th>{t('universities')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((a, index) => (
            <tr key={a.id}>
              <td>{index + 1}</td>
              <td>{a.email}</td>
              <td>{a.role}</td>
              <td>
                {univers.find((u) => u.id === a.university_id)?.name || '-'}
              </td>
              <td>
                <button className="edit-btn" onClick={() => startEditing(a)}>
                  <Pencil />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAdmin(a.id)}
                >
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

export default OwnerAdmins
