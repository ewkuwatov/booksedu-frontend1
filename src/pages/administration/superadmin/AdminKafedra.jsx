import { useDispatch, useSelector } from 'react-redux'
import { selectAuth, selectKafedra } from '../../../store'
import { useCrud } from '../../../hooks/useCrud'
import {
  fetchAddKafedrasThunk,
  fetchAllKafedrasThunk,
  fetchDeleteKafedrasThunk,
  fetchUpdateKafedrasThunk,
} from '../../../features/admins/kafedraSlice'
import { useEffect, useState } from 'react'
import Button from '../../../components/UI/Button'
import Input from '../../../components/UI/Input'

const AdminKafedra = () => {
  const dispatch = useDispatch()
  const { items: kafedras } = useSelector(selectKafedra)
  const { user } = useSelector(selectAuth)
  const [filtered, setFiltered] = useState([])

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
      university_id: user?.university_id ?? null,
    },
    fetchAll: () => dispatch(fetchAllKafedrasThunk()).unwrap(),
    add: (data) => dispatch(fetchAddKafedrasThunk(data)).unwrap(),
    update: (id, data) =>
      dispatch(fetchUpdateKafedrasThunk({ id, updated: data })).unwrap(),
    remove: (id) => dispatch(fetchDeleteKafedrasThunk(id)).unwrap(),
  })

  useEffect(() => {
    dispatch(fetchAllKafedrasThunk()).unwrap()
  }, [dispatch])

  useEffect(() => {
    if (kafedras.length > 0 && user?.university_id) {
      setFiltered(
        kafedras.filter((k) => k.university_id === user.university_id)
      )
    }
  }, [kafedras, user])

  return (
    <div>
      <h1>Кафедры</h1>
      <Button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
      >
        Add Kafedra
      </Button>

      {openForm && (
        <form onSubmit={handleSubmit}>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Button type={'submit'}>{editingId ? 'Save' : 'Add'}</Button>
        </form>
      )}
      <ul>
        {filtered.map((k) => (
          <li key={k.id}>
            {k.name}
            <Button onClick={() => startEditing(k)}>Edit</Button>
            <Button onClick={() => handleDelete(k.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminKafedra
