import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store'

export default function Protected({ roles = [] }) {
  const { user, isReady } = useSelector(selectAuth)

  if (!isReady) return null // ждём refresh (он запускается в App.jsx)

  if (!user) return <Navigate to="/" replace />

  if (roles.length && !roles.includes(user.role)) {
    return <div style={{ padding: 24 }}>Доступ запрещен</div>
  }

  return <Outlet />
}
