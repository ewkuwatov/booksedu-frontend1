import { useDispatch, useSelector } from 'react-redux'
import { selectAdmin, selectUniver } from '../../../store'
import { useEffect, useState } from 'react'
import {
  fetchAllAdminsThunk,
  fetchCreateAdminThunk,
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
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    if (!form.email.trim()) return

    await dispatch(fetchCreateAdminThunk(form)).unwrap()
    await dispatch(fetchAllAdminsThunk()).unwrap()
    resetForm()
  }

  return (
    <div>
      <h1>All Admins</h1>

      <form onSubmit={handleAddAdmin} style={{ marginBottom: 20 }}>
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
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

        <Button type="submit">Add</Button>
      </form>

      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Role</th>
            <th>University</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OwnerAdmins
