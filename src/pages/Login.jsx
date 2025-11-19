import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../features/auth/authSlice'
import { useState } from 'react'
import { selectAuth } from '../store'
import { Navigate } from 'react-router-dom'

export default function Login() {
  const dispatch = useDispatch()
  const { user, status, error } = useSelector(selectAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (user) return <Navigate to="/" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginThunk({ email, password }))
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <form
        onSubmit={onSubmit}
        style={{ width: 360, display: 'grid', gap: 12 }}
      >
        <h2>Вход</h2>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={status === 'loading'}>
          {status === 'loading' ? 'Входим...' : 'Войти'}
        </button>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </form>
    </div>
  )
}
