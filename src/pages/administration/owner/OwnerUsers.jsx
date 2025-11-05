import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../../store'
import { useEffect } from 'react'
import { fetchAllUsersThunk } from '../../../features/admins/userSlice'

const OwnerUsers = () => {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector(selectUser)

  useEffect(() => {
    dispatch(fetchAllUsersThunk()).unwrap()
  }, [])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!items) return <p>У вас нет users</p>

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>email</th>
            <th>role</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                {u.first_name} {u.last_name}
              </td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OwnerUsers
