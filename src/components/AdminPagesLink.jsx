import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store'

const AdminPagesLink = () => {
  const { t } = useTranslation()
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
          <Link to="/admin-panel/universities">{t('universities')}</Link>
          <Link to="/admin-panel/admins">{t('admins')}</Link>
          <Link to="/admin-panel/users">Users</Link>
          <Link to="/admin-panel/directions">{t('directions')}</Link>
          <Link to="/admin-panel/kafedras">{t('kafedras')}</Link>
          <Link to="/admin-panel/subjects">{t('subjects')}</Link>
          <Link to="/admin-panel/literatures">{t('literature')}</Link>
        </>
      )}

      {user?.role === 'superadmin' && (
        <>
          <Link to="/admin-panel/university-data">{t('universities')}</Link>
          <Link to="/admin-panel/direction-data">{t('directions')}</Link>
          <Link to="/admin-panel/kafedra-data">{t('kafedras')}</Link>
          <Link to="/admin-panel/subject-data">{t('subjects')}</Link>
          <Link to="/admin-panel/literature-data">{t('literature')}</Link>
        </>
      )}
    </div>
  )
}

export default AdminPagesLink
