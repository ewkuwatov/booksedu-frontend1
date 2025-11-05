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

const OwnerAdmins = () => {
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
    <div>
      <h1>All Admins</h1>

      <button onClick={() => setOpenForm(true)}>Add admin</button>

      {openForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
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
            <option value="">Без привязки</option>
            {univers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <Button type="submit">{editingId ? 'Save' : 'Add'}</Button>
          <Button
            type="reset"
            onClick={() => {
              resetForm()
              setOpenForm()
            }}
          >
            back
          </Button>
        </form>
      )}

      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Role</th>
            <th>University</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.email}</td>
              <td>{a.role}</td>
              <td>
                {univers.find((u) => u.id === a.university_id)?.name || '-'}
              </td>
              <td>
                <button onClick={() => handleDeleteAdmin(a.id)}>delete</button>
                <button onClick={() => startEditing(a)}>edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OwnerAdmins
