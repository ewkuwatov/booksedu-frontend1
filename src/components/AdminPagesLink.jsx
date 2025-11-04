import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store'

const AdminPagesLink = () => {
  const { user } = useSelector(selectAuth)

  return (
    <div>
      {['owner'].includes(user?.role) && (
        <>
          <Link to="/admin-panel/all-universities">Universities</Link>
          <Link to="/admin-panel/all-universities">Universities</Link>
          <Link to="/admin-panel/all-universities">Universities</Link>
          <Link to="/admin-panel/all-universities">Universities</Link>
          <Link to="/admin-panel/all-universities">Universities</Link>
        </>
      )}
      {['superadmin'].includes(user?.role) && (
        <Link to="/admin-panel/universities-profile">University profile</Link>
      )}
    </div>
  )
}

export default AdminPagesLink
