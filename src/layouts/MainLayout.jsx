import { Outlet } from 'react-router-dom'
import Header from '../components/Layout/Header/Header'
import Footer from '../components/Layout/Footer'
import Navbar from '../components/Layout/Navbar/Navbar'

export default function MainLayout() {
  return (
    <div className="layout">
      <Navbar />
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
