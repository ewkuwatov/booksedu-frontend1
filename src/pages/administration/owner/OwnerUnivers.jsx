import { useSelector, useDispatch } from 'react-redux'
import { selectUniver } from '../../../store'
import { useEffect, useState } from 'react'
import {
  fetchAddUnvierThunk,
  fetchAllUniverThunk,
  fetchDeleteUniverThunk,
  fetchUpdateUnvierThunk,
} from '../../../features/admins/univerSlice'
import Button from '../../../components/UI/Button'
import CustomSelect from '../../../components/UI/CustomSelect'
import { UniverAddress } from '../../../utils/unums'

const OwnerUnivers = () => {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector(selectUniver)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    location: '',
  })

  useEffect(() => {
    dispatch(fetchAllUniverThunk())
  }, [dispatch])

  const addressOptions = Object.entries(UniverAddress).map(([label]) => ({
    value: label,
    label,
  }))

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      location: '',
    })
    setEditingId(null)
  }

  const openAddForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (u) => {
    setForm({ ...u })
    setEditingId(u.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingId) {
      await dispatch(
        fetchUpdateUnvierThunk({ id: editingId, updated: form })
      ).unwrap()
    } else {
      await dispatch(fetchAddUnvierThunk(form)).unwrap()
    }

    await dispatch(fetchAllUniverThunk()).unwrap()

    resetForm()
    setShowForm(false)
  }

  const handlerDelete = async (id) => {
    await dispatch(fetchDeleteUniverThunk(id)).unwrap()
    await dispatch(fetchAllUniverThunk()).unwrap()
  }

  return (
    <div>
      <h1>Университеты</h1>

      <Button onClick={openAddForm} style={{ marginBottom: 20 }}>
        Добавить университет
      </Button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc' }}
        >
          {/* ✅ Кастомный select */}
          <CustomSelect
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            options={addressOptions}
            placeholder="Выберите область"
          />

          {/* Остальные поля */}
          {['name', 'description', 'phone', 'email', 'location'].map(
            (field) => (
              <input
                key={field}
                placeholder={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                style={{ display: 'block', marginBottom: 8 }}
              />
            )
          )}

          <Button type="submit">{editingId ? 'Сохранить' : 'Добавить'}</Button>
          <Button
            type="button"
            onClick={() => {
              resetForm()
              setShowForm(false)
            }}
          >
            Отмена
          </Button>
        </form>
      )}

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {items.map((u) => (
          <li key={u.id} style={{ marginBottom: 10 }}>
            <strong>{u.name}</strong>
            <Button onClick={() => openEditForm(u)}>Редактировать</Button>
            <Button onClick={() => handlerDelete(u.id)}>Удалить</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OwnerUnivers
