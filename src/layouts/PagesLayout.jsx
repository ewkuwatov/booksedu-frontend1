import { Outlet } from 'react-router-dom'
import Footer from '../components/Layout/Footer'
import Navbar from '../components/Layout/Navbar/Navbar'

export default function PagesLayout() {
  return (
    <div className="layout">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
