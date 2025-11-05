import { createBrowserRouter } from 'react-router-dom'
import Protected from './components/Protected'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import App from './App'
import MainLayout from './layouts/MainLayout'
import AdminPanel from './pages/administration/AdminPanel'
import OwnerUnivers from './pages/administration/owner/ownerUnivers'
import AdminLayout from './layouts/AdminLayout'
import OwnerAdmins from './pages/administration/owner/OwnerAdmins'
import AdminUnivers from './pages/administration/superadmin/AdminUnivers'
import OwnerUsers from './pages/administration/owner/OwnerUsers'

export const router = createBrowserRouter([
  // Публичные страницы
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [{ index: true, element: <Dashboard /> }],
      },

      { path: '/login', element: <Login /> },

      // Приватные
      {
        element: <Protected />,
        children: [
          { path: '/profile', element: <Profile /> },
          {
            path: '/admin-panel',
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminPanel /> }, // главная админки
              { path: 'universities', element: <OwnerUnivers /> },
              { path: 'admins', element: <OwnerAdmins /> },
              { path: 'users', element: <OwnerUsers/> },

              { path: 'univer-profile', element: <AdminUnivers /> },
            ],
          },
          // { path: '/admin-panel/all-universities', element: <OwnerUnivers /> },
        ],
      },
    ],
  },
])
