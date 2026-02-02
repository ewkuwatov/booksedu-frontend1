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
    value: key,
    label: value,
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

  const openEditForm = (u) => {
    setForm({
      name: u.name || '',
      description: u.description || '',
      address: u.address || '',
      phone: u.phone || '',
      email: u.email || '',
      location: u.location || '',
    })
    setEditingId(u.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) return alert('Name is required')

    if (editingId) {
      await dispatch(
        fetchUpdateUnvierThunk({
          id: editingId,
          updated: form,
        }),
      ).unwrap()
    } else {
      await dispatch(fetchAddUnvierThunk(form)).unwrap()
    }

    await dispatch(fetchAllUniverThunk())
    resetForm()
    setShowForm(false)
  }

  const handlerDelete = async (id) => {
    await dispatch(fetchDeleteUniverThunk(id)).unwrap()
    await dispatch(fetchAllUniverThunk())
  }

  return (
    <div className="universities-admin">
      <h1>{t('universities')}</h1>

      <Button onClick={() => setShowForm(true)}>{t('add')}</Button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSubmit}>
              <input
                placeholder={t('name')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder={t('description')}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                placeholder={t('phone')}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                placeholder={t('email')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder={t('location')}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

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

      <ul>
        {items.map((u, i) => (
          <li key={u.id}>
            {i + 1}. {u.name}
            <div className="btnBox">
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
