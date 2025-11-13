import AdminPagesLink from '../components/AdminPagesLink'
import OwnerStatistics from '../pages/administration/owner/OwnerStatistics'
import { Outlet, Link } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="adminLayout">
      {/* ЛЕВАЯ СТОРОНА - МЕНЮ */}
      <aside className="aside">
        <div>
          <AdminPagesLink />
          <OwnerStatistics />
        </div>

        <Link className="backToSite" to="/">
          Exit
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
