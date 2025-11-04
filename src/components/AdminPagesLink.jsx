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
          <Link to="/admin-panel/all-universities">Все университеты</Link>
          <Link to="/admin-panel/">Статистика</Link>
          <Link to="/admin-panel/">Менеджеры</Link>
          <Link to="/admin-panel/">Учителя</Link>
          <Link to="/admin-panel/">Студенты</Link>
        </>
      )}

      {user?.role === 'superadmin' && (
        <Link to="/admin-panel/universities-profile">Панель супер-админа</Link>
      )}
    </div>
  )
}

export default AdminPagesLink
