import { useSelector, useDispatch } from 'react-redux'
import { selectUniver } from '../../../store'
import { useEffect, useState, Fragment } from 'react'
import {
  fetchAddUnvierThunk,
  fetchAllUniverThunk,
  fetchDeleteUniverThunk,
  fetchUpdateUnvierThunk,
} from '../../../features/admins/univerSlice'
import Button from '../../../components/UI/Button'

const OwnerUnivers = () => {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector(selectUniver)

  const [showForm, setShowForm] = useState(false) // ✅ Одна форма
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

  const fields = [
    { name: 'name', placeholder: 'Название' },
    { name: 'description', placeholder: 'Описание' },
    { name: 'address', placeholder: 'Адрес' },
    { name: 'phone', placeholder: 'Телефон' },
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'location', placeholder: 'Локация' },
  ]

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

  // ✅ Открыть форму на добавление
  const openAddForm = () => {
    resetForm()
    setShowForm(true)
  }

  // ✅ Открыть форму на редактирование
  const openEditForm = (u) => {
    setForm({ ...u })
    setEditingId(u.id)
    setShowForm(true)
  }

  // ✅ Сохранение (добавление или редактирование)
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

      {/* ✅ ОДНА ФОРМА - условное отображение */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc' }}
        >
          {fields.map((f) => (
            <input
              key={f.name}
              type={f.type || 'text'}
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            />
          ))}

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
