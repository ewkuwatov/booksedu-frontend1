import AdminPagesLink from '../components/AdminPagesLink'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ЛЕВАЯ СТОРОНА - МЕНЮ */}
      <aside
        style={{
          width: '250px',
          borderRight: '1px solid #ddd',
          padding: '20px',
        }}
      >
        <AdminPagesLink />
      </aside>

      {/* ПРАВАЯ СТОРОНА - КОНТЕНТ */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
