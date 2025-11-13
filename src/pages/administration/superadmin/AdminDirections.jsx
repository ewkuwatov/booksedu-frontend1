import { useDispatch, useSelector } from 'react-redux'
import { selectDirection, selectAuth, selectUniver } from '../../../store'
import { useEffect, useState } from 'react'
import {
  fetchAddDirectionThunk,
  fetchAllDirectionThunk,
  fetchDeleteDirectionThunk,
  fetchUpdateDirectionThunk,
} from '../../../features/admins/directionSlice'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'
import Input from '../../../components/UI/Input'
import { useCrud } from '../../../hooks/useCrud'
import Button from '../../../components/UI/Button'

const AdminDirections = () => {
  const dispatch = useDispatch()
  const { items: directions } = useSelector(selectDirection)
  const { items: univers } = useSelector(selectUniver)
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
      number: '',
      name: '',
      course: 1,
      student_count: null,
      university_id: user?.university_id ?? null,
    },
    fetchAll: () => dispatch(fetchAllDirectionThunk()).unwrap(),
    add: (data) => dispatch(fetchAddDirectionThunk(data)).unwrap(),
    update: (id, data) =>
      dispatch(fetchUpdateDirectionThunk({ id, updated: data })).unwrap(),
    remove: (id) => dispatch(fetchDeleteDirectionThunk(id)).unwrap(),
  })

  useEffect(() => {
    dispatch(fetchAllDirectionThunk()).unwrap()
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [dispatch])

  useEffect(() => {
    if (directions.length > 0 && user?.university_id) {
      setFiltered(
        directions.filter((dir) => dir.university_id === user.university_id)
      )
    }
  }, [directions, user])

  return (
    <div>
      <h1>Все направления вашего университета</h1>
      <Button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
      >
        Add Direction
      </Button>

      {openForm && (
        <div className="modal-overlay">
          <form className="directions-form" onSubmit={handleSubmit}>
            <Input
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder={'Number'}
            />
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={'Name'}
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
              value={form.student_count || ''}
              onChange={(e) =>
                setForm({ ...form, student_count: Number(e.target.value) })
              }
              placeholder="Students count"
            />

            <div className="form-actions">
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
            </div>
          </form>
        </div>
      )}

      {filtered.length === 0 && <p>Нет направлений</p>}

      <table className="directions-table">
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

export default AdminDirections
