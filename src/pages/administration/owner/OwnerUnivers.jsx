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
import { useTranslation } from 'react-i18next'
import { Pencil, Trash } from 'lucide-react'

const OwnerUnivers = () => {
  const { t } = useTranslation()
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

  const addressOptions = Object.entries(UniverAddress).map(([key, value]) => ({
    value: key, // в базу идёт ключ
    label: value, // в UI показываем value
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
    <div className="universities-admin">
      <h1>{t('universities')}</h1>

      <Button className="toggle-form-btn" onClick={openAddForm}>
        {t('add')}
      </Button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSubmit} className="univer-form">
              {/* Остальные поля */}
              {[
                t('name'),
                t('description'),
                t('phone'),
                t('email'),
                t('location'),
              ].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  style={{ display: 'block', marginBottom: 8 }}
                />
              ))}
              {/* ✅ Кастомный select */}
              <CustomSelect
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                options={addressOptions}
                placeholder={t('region')}
              />

              <div className="form-actions">
                <Button type="submit">
                  {editingId ? t('save') : t('add')}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                >
                  {t('cancel')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul className="univer-list">
        {items.map((u, index) => (
          <li key={u.id} style={{ marginBottom: 10 }}>
            <div className="univer-header">
              <p>{index + 1}</p>
              <strong style={{ cursor: 'pointer' }}>{u.name}</strong>
              <Button onClick={() => openEditForm(u)}>
                <Pencil />
              </Button>
              <Button onClick={() => handlerDelete(u.id)}>
                <Trash />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OwnerUnivers
