import { useDispatch, useSelector } from 'react-redux'
import { useCrud } from '../../../hooks/useCrud'
import { selectKafedra, selectUniver } from '../../../store'
import {
  fetchAddKafedrasThunk,
  fetchAllKafedrasThunk,
  fetchDeleteKafedrasThunk,
  fetchUpdateKafedrasThunk,
} from '../../../features/admins/kafedraSlice'
import { useEffect, useState } from 'react'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'
import Input from '../../../components/UI/Input'

const OwnerKafedras = () => {
  const dispatch = useDispatch()
  const { items: kafedras } = useSelector(selectKafedra)
  const { items: univers } = useSelector(selectUniver)

  const [filterUniver, setFilterUniver] = useState('')

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
      name: '',
      university_id: null,
    },
    fetchAll: () => dispatch(fetchAllKafedrasThunk()).unwrap(),
    add: (data) => dispatch(fetchAddKafedrasThunk(data)).unwrap(),
    update: (id, data) =>
      dispatch(fetchUpdateKafedrasThunk({ id, updated: data })).unwrap(),
    remove: (id) => dispatch(fetchDeleteKafedrasThunk(id)).unwrap(),
  })

  useEffect(() => {
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [dispatch])

  const filtered = filterUniver
    ? kafedras.filter((d) => d.university_id === Number(filterUniver))
    : kafedras

  return (
    <div className="kafedra-admin">
      <button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
        className="primary-btn"
      >
        Add Kafedra
      </button>

      {openForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="kafedra-form">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={'Name'}
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
              <option value="">Без привязки</option>
              {univers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <button type={'submit'}>{editingId ? 'Save' : 'Add'}</button>
            <button
              type="button"
              onClick={() => {
                resetForm()
                setOpenForm(false)
              }}
            >
              Back
            </button>
          </form>
        </div>
      )}
      <div className="filter-block">
        <select
          value={filterUniver}
          onChange={(e) => setFilterUniver(e.target.value)}
        >
          <option value="">All Univers</option>
          {univers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <table className="kafedra-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>University</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((k) => (
            <tr key={k.id}>
              <td>#</td>
              <td>{k.name}</td>
              <td>
                {univers.find((u) => u.id === k.university_id)?.name || '-'}
              </td>
              <td>
                <button className="edit-btn" onClick={() => startEditing(k)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(k.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OwnerKafedras
