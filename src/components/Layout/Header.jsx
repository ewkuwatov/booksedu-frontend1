import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuth } from '../../store'
import { logoutThunk } from '../../features/auth/authSlice'

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(selectAuth)

  const handleLogout = async () => {
    dispatch(logoutThunk())
    navigate('/') // чтобы не остаться на приватной странице
  }
  console.log('👤 ROLE:', user?.role)

  return (
    <header style={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
      <h1>Header</h1>

      {user ? (
        <button onClick={handleLogout}>Выйти</button>
      ) : (
        <Link to="/login">Войти</Link>
      )}
      {['owner', 'superadmin'].includes(user?.role) && (
        <Link to="/admin-panel">Admin Panel</Link>
      )}
    </header>
  )
}
