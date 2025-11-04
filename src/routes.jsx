// import { createBrowserRouter } from 'react-router-dom'
// import Protected from './components/Protected'
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import App from './App'
// import MainLayout from './layouts/MainLayout'
// import Profile from './pages/Profile'

// export const router = createBrowserRouter([
//   // ПУБЛИЧНЫЙ Dashboard
//   {
//     element: <App />,
//     children: [
//       {
//         path: '/',
//         element: <MainLayout />,
//         children: [
//           { index: true, element: <Dashboard /> },
//           { path: 'login', element: <Login /> },
//         ],
//       },
//     ],
//   },

//   // Приватные
//   {
//     element: <Protected />,
//     children: [
//       {
//         path: '/',
//         element: <MainLayout />, // ✅ тот же Layout, но с защитой
//         children: [{ path: 'profile', element: <Profile /> }],
//       },
//     ],
//   },
// ])
import { createBrowserRouter } from 'react-router-dom'
import Protected from './components/Protected'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import App from './App'
import MainLayout from './layouts/MainLayout'
import AdminPanel from './pages/administration/adminPanel'

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
          { path: '/admin-panel', element: <AdminPanel /> },
        ],
      },
    ],
  },
])
