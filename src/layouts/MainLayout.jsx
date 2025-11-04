import { Outlet } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

export default function MainLayout() {
  return (
    <div className="layout">
      <Header />

      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
