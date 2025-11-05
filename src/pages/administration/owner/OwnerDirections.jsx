import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { selectDirection, selectUniver } from '../../../store'
import {
  fetchAddDirectionThunk,
  fetchAllDirectionThunk,
  fetchDeleteDirectionThunk,
  fetchUpdateDirectionThunk,
} from '../../../features/admins/directionSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'

import { useCrud } from '../../../hooks/useCrud'
import Input from '../../../components/UI/Input'
import Button from '../../../components/UI/Button'

const OwnerDirections = () => {
  const dispatch = useDispatch()
  const { items: directions } = useSelector(selectDirection)
  const { items: univers } = useSelector(selectUniver)

  // ---- CRUD ХУК ----
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
      number: '',
      name: '',
      course: 1,
      student_count: null,
      university_id: null,
    },
    fetchAll: () => dispatch(fetchAllDirectionThunk()).unwrap(),
    add: (data) => dispatch(fetchAddDirectionThunk(data)).unwrap(),
    update: (id, data) =>
      dispatch(fetchUpdateDirectionThunk({ id, updated: data })).unwrap(),
    remove: (id) => dispatch(fetchDeleteDirectionThunk(id)).unwrap(),
  })

  useEffect(() => {
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [dispatch])

  const [filterUniver, setFilterUniver] = useState('')

  const filtered = filterUniver
    ? directions.filter((d) => d.university_id === Number(filterUniver))
    : directions

  return (
    <div>
      <Button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
      >
        Add Direction
      </Button>

      {/* ФИЛЬТР */}
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
            placeholder="Number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />

          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            value={form.course}
            onChange={(e) =>
              setForm({ ...form, course: Number(e.target.value) })
            }
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>

          <Input
            type="number"
            placeholder="Student Count"
            value={form.student_count ?? ''}
            onChange={(e) =>
              setForm({ ...form, student_count: Number(e.target.value) })
            }
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

          <Button type="submit">{editingId ? 'Save' : 'Add'}</Button>
          <Button
            type="button"
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
            <th>Number</th>
            <th>Name</th>
            <th>Course</th>
            <th>Students</th>
            <th>University</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.id}>
              <td>{d.number}</td>
              <td>{d.name}</td>
              <td>{d.course}</td>
              <td>{d.student_count}</td>
              <td>
                {univers.find((u) => u.id === d.university_id)?.name || '-'}
              </td>
              <td>
                <button onClick={() => startEditing(d)}>Edit</button>
                <button onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OwnerDirections
