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
    <div className="loginPage">
      <div className="loginCardWrapper">
        <div className="loginCard">
          <form onSubmit={onSubmit} className="loginForm">
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
      </div>
    </div>
  )
}
