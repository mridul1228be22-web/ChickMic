import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Sparkles, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginWithEmail, registerWithEmail, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      if (isLogin) await loginWithEmail(email, password)
      else await registerWithEmail(name, email, password)
      navigate('/shop')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <section className="auth-page">
        <div className="auth-loading">Loading...</div>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <div className="auth-visual">
        <p className="eyebrow">Members Club</p>
        <h1>Your wardrobe, synced everywhere.</h1>
        <p className="muted">
          Save wishlists, track orders, and checkout faster with your profile.
        </p>
        <ul className="auth-benefits">
          <li>
            <Sparkles size={18} /> Early access to new drops
          </li>
          <li>
            <Lock size={18} /> Secure sign-in
          </li>
          <li>
            <Mail size={18} /> Order updates on your profile
          </li>
        </ul>
        <Link className="btn btn-guest" to="/shop">
          Browse as guest
        </Link>
      </div>

      <form className="auth-card auth-card-elevated" onSubmit={handleSubmit}>
        <div>
          <h2>{isLogin ? 'Welcome back' : 'Join Chickmic'}</h2>
          <p className="muted">
            {isLogin ? 'Sign in to your account.' : 'Create your account in seconds.'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? 'active' : ''}
            onClick={() => {
              setIsLogin(true)
              setMessage('')
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? 'active' : ''}
            onClick={() => {
              setIsLogin(false)
              setMessage('')
            }}
          >
            Sign up
          </button>
        </div>

        {!isLogin && (
          <label className="field">
            <span>Full name</span>
            <div className="input-wrap">
              <User size={18} />
              <input
                required
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </label>
        )}

        <label className="field">
          <span>Email</span>
          <div className="input-wrap">
            <Mail size={18} />
            <input
              required
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div className="input-wrap">
            <Lock size={18} />
            <input
              required
              minLength={6}
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <button className="btn btn-dark full" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
        </button>

        {message && <p className="error">{message}</p>}
      </form>
    </section>
  )
}
