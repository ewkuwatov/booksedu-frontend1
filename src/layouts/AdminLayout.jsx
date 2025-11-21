import { useTranslation } from 'react-i18next'
import AdminPagesLink from '../components/AdminPagesLink'
import OwnerStatistics from '../pages/administration/owner/OwnerStatistics'
import { Outlet, Link } from 'react-router-dom'

const AdminLayout = () => {
  const { t } = useTranslation()
  return (
    <div className="adminLayout">
      {/* ЛЕВАЯ СТОРОНА - МЕНЮ */}
      <aside className="aside">
        <div>
          <AdminPagesLink />
          <OwnerStatistics />
        </div>

        <Link className="backToSite" to="/">
          {t('exit')}
        </Link>
      </aside>

      {/* ПРАВАЯ СТОРОНА - КОНТЕНТ */}
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
