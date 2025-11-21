import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../../store'
import { useEffect } from 'react'
import { fetchAllUsersThunk } from '../../../features/admins/userSlice'
import { usePagination } from '../../../hooks/usePagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const OwnerUsers = () => {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector(selectUser)

  useEffect(() => {
    dispatch(fetchAllUsersThunk()).unwrap()
  }, [])

  // === ПАГИНАЦИЯ ===
  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    items,
    10
  )

  // Сбрасываем страницу при изменении items
  useEffect(() => {
    goTo(1)
  }, [items])

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
          {currentData.map((u) => (
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
      {/* ПАГИНАЦИЯ */}
      <div className="pagination">
        <button onClick={prev} disabled={page === 1}>
          <ChevronLeft />
        </button>

        {[...Array(maxPage)].map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            className={page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={next} disabled={page === maxPage}>
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

export default OwnerUsers
