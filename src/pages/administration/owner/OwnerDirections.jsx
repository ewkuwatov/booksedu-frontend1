import { useDispatch, useSelector } from 'react-redux'
import { selectDirection, selectUniver } from '../../../store'
import { useEffect, useState } from 'react'
import {
  fetchAddDirectionThunk,
  fetchAllDirectionThunk,
  fetchDeleteDirectionThunk,
  fetchUpdateDirectionThunk,
} from '../../../features/admins/directionSlice'
import Input from '../../../components/UI/Input'
import Button from '../../../components/UI/Button'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'

const OwnerDirections = () => {
  const dispatch = useDispatch()
  const { items: directions } = useSelector(selectDirection)
  const { items: univers } = useSelector(selectUniver)
  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterUniver, setFilterUniver] = useState('')
  const [form, setForm] = useState({
    number: '',
    name: '',
    course: 1,
    student_count: null,
    university_id: null,
  })

  useEffect(() => {
    dispatch(fetchAllDirectionThunk()).unwrap()
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [dispatch])

  const resetForm = () => {
    setForm({
      number: '',
      name: '',
      course: 1,
      student_count: null,
      university_id: null,
    })
  }

  const startEditing = (d) => {
    setEditingId(d.id)
    setForm({ ...d })
    setOpenForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.number.trim() && !form.name.trim()) return

    if (editingId) {
      await dispatch(
        fetchUpdateDirectionThunk({ id: editingId, updated: form })
      ).unwrap()
    } else {
      await dispatch(fetchAddDirectionThunk(form)).unwrap()
    }

    await dispatch(fetchAllDirectionThunk()).unwrap()
    resetForm()
    setOpenForm(false)
  }

  const handleDelete = async (id) => {
    await dispatch(fetchDeleteDirectionThunk(id)).unwrap()
    dispatch(fetchAllDirectionThunk()).unwrap()
  }

  const filteredDirections = filterUniver
    ? directions.filter((d) => d.university_id === Number(filterUniver))
    : directions

  return (
    <div>
      <button onClick={() => setOpenForm(true)}>Add</button>

      {/* ✅ ФИЛЬТР */}

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

      {openForm && (
        <form onSubmit={handleSubmit}>
          <Input
            placeholder={'Number'}
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
          <Input
            placeholder={'Name'}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>

          <Input
            type={'number'}
            placeholder={'Student Count'}
            value={form.student_count}
            onChange={(e) =>
              setForm({ ...form, student_count: e.target.value })
            }
          />

          <select
            value={form.university_id || '-'}
            onChange={(e) =>
              setForm({
                ...form,
                university_id: Number(e.target.value) || null,
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

          <Button type={'Submit'}>{editingId ? 'Save' : 'Add'}</Button>
          <Button
            type={'Reset'}
            onClick={() => {
              resetForm()
              setOpenForm(false)
            }}
          >
            Back
          </Button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Direction number</th>
            <th>Name</th>
            <th>course</th>
            <th>Student count</th>
            <th>University</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDirections.map((d) => (
            <tr key={d.id}>
              <td>{d.number}</td>
              <td>{d.name}</td>
              <td>{d.course}</td>
              <td>{d.student_count}</td>
              <td>
                {univers.find((u) => u.id === d.university_id)?.name || '-'}
              </td>
              <td>
                <button onClick={() => startEditing(d)}>edit</button>
                <button onClick={() => handleDelete(d.id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OwnerDirections
