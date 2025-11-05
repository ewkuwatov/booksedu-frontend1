import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store'

const AdminPagesLink = () => {
  const { user } = useSelector(selectAuth)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // расстояние между ссылками
      }}
    >
      {user?.role === 'owner' && (
        <>
          <Link to="/admin-panel/universities">Universities</Link>
          <Link to="/admin-panel/admins">Admins</Link>
          <Link to="/admin-panel/users">Users</Link>
        </>
      )}

      {user?.role === 'superadmin' && (
        <Link to="/admin-panel/univer-profile">Univer</Link>
      )}
    </div>
  )
}

export default AdminPagesLink
