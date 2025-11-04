import { useDispatch, useSelector } from 'react-redux'
import { selectAuth, selectUniver } from '../../../store'
import { useEffect } from 'react'
import { fetchUnvierByIdThunk } from '../../../features/admins/univerSlice'

const AdminUnivers = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const { selected, loading, error } = useSelector(selectUniver)

  useEffect(() => {
    if (user?.university_id) {
      dispatch(fetchUnvierByIdThunk(user.university_id)).unwrap()
    }
  }, [dispatch, user])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!selected) return <p>У вас нет университета</p>

  return (
    <div>
      <h1>Университет администратора</h1>

      <p>
        <strong>Name:</strong> {selected.name}
      </p>
      <p>
        <strong>Description:</strong> {selected.description}
      </p>
      <p>
        <strong>Address:</strong> {selected.address}
      </p>
      <p>
        <strong>Phone:</strong> {selected.phone}
      </p>
      <p>
        <strong>Email:</strong> {selected.email}
      </p>
      <p>
        <strong>Location:</strong> {selected.location}
      </p>
    </div>
  )
}

export default AdminUnivers
