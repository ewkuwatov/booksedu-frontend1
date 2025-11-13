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
          <Link to="/admin-panel/directions">Directions</Link>
          <Link to="/admin-panel/kafedras">Kafedras</Link>
          <Link to="/admin-panel/subjects">Subjects</Link>
          <Link to="/admin-panel/literatures">Literatures</Link>
        </>
      )}

      {user?.role === 'superadmin' && (
        <>
          <Link to="/admin-panel/university-data">University</Link>
          <Link to="/admin-panel/direction-data">Directions</Link>
          <Link to="/admin-panel/kafedra-data">Kafedra</Link>
          <Link to="/admin-panel/subject-data">Subject</Link>
          <Link to="/admin-panel/literature-data">Literature</Link>
        </>
      )}

    </div>
  )
}

export default AdminPagesLink
