import { useDispatch, useSelector } from 'react-redux'
import { selectAuth, selectUniver } from '../../../store'
import { useEffect, useState } from 'react'
import {
  fetchUnvierByIdThunk,
  fetchUpdateUnvierThunk,
} from '../../../features/admins/univerSlice'
import Input from '../../../components/UI/Input'
import Button from '../../../components/UI/Button'
import { UniverAddress } from '../../../utils/unums'

const AdminUnivers = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const { selected, loading, error } = useSelector(selectUniver)
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    location: '',
  })

  useEffect(() => {
    if (user?.university_id) {
      dispatch(fetchUnvierByIdThunk(user.university_id)).unwrap()
    }
  }, [dispatch, user])

  useEffect(() => {
    if (selected) {
      setEditForm({
        id: selected.id,
        name: selected.name,
        description: selected.description,
        address: selected.address,
        phone: selected.phone,
        email: selected.email,
        location: selected.location,
      })
    }
  }, [selected])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!selected) return <p>У вас нет университета</p>

  const handleEditing = async () => {
    dispatch(fetchUpdateUnvierThunk({ id: editForm.id, updated: editForm }))
  }

  return (
    <div>
      <h1>Университет администратора</h1>
      <form onSubmit={handleEditing}>
        <Input
          placeholder={'Name'}
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
        />

        <textarea
          placeholder={'Description'}
          value={editForm.description}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
        />

        <select
          value={editForm.address}
          onChange={(e) =>
            setEditForm({ ...editForm, address: e.target.value })
          }
        >
          <option value="">None</option>
          {Object.entries(UniverAddress).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>

        <Input
          placeholder={'Phone'}
          value={editForm.phone}
          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
        />

        <Input
          placeholder={'Email'}
          value={editForm.email}
          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
        />

        <Input
          placeholder={'Location'}
          value={editForm.location}
          onChange={(e) =>
            setEditForm({ ...editForm, location: e.target.value })
          }
        />

        <Button type={'submit'}>Save</Button>
      </form>
    </div>
  )
}

export default AdminUnivers
