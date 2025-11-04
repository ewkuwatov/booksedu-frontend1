import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { refreshThunk } from './features/auth/authSlice'
import { selectAuth } from './store'
import { useEffect } from 'react'
import Header from './components/Layout/Header'

export default function App() {
  const dispatch = useDispatch()
  const { isReady } = useSelector(selectAuth)

  useEffect(() => {
    if (!isReady) dispatch(refreshThunk())
  }, [isReady, dispatch])

  if (!isReady) return null // Loader можно сюда

  return (
    <div>
      <Outlet />
    </div>
  )
}

