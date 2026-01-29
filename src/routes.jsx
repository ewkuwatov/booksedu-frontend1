import { createBrowserRouter } from 'react-router-dom'
import Protected from './components/Protected'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import App from './App'
import MainLayout from './layouts/MainLayout'
import AdminPanel from './pages/administration/AdminPanel'
import OwnerUnivers from './pages/administration/owner/OwnerUnivers'
import AdminLayout from './layouts/AdminLayout'
import OwnerAdmins from './pages/administration/owner/OwnerAdmins'
import AdminUnivers from './pages/administration/superadmin/AdminUnivers'
import OwnerUsers from './pages/administration/owner/OwnerUsers'
import OwnerDirections from './pages/administration/owner/OwnerDirections'
import OwnerKafedras from './pages/administration/owner/OwnerKafedras'
import OwnerSubjects from './pages/administration/owner/OwnerSubjects'
import OwnerLiteratures from './pages/administration/owner/OwnerLiteratures'
import AdminDirections from './pages/administration/superadmin/AdminDirections'
import AdminKafedra from './pages/administration/superadmin/AdminKafedra'
import AdminSubjects from './pages/administration/superadmin/AdminSubjects'
import AdminLiteratures from './pages/administration/superadmin/AdminLiteratures'
import InProgress from './pages/InProgress'
import PagesLayout from './layouts/PagesLayout'

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

      {
        element: <PagesLayout />,
        children: [{ path: '/InProcess', element: <InProgress /> }],
      },

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
              { path: 'users', element: <OwnerUsers /> },

              { path: 'directions', element: <OwnerDirections /> },
              { path: 'kafedras', element: <OwnerKafedras /> },
              { path: 'subjects', element: <OwnerSubjects /> },
              { path: 'literatures', element: <OwnerLiteratures /> },
              { path: 'university-data', element: <AdminUnivers /> },
              { path: 'direction-data', element: <AdminDirections /> },
              { path: 'kafedra-data', element: <AdminKafedra /> },
              { path: 'subject-data', element: <AdminSubjects /> },
              { path: 'literature-data', element: <AdminLiteratures /> },
            ],
          },
          // { path: '/admin-panel/all-universities', element: <OwnerUnivers /> },
        ],
      },
    ],
  },
])
