'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const router = useRouter()
  const [mode, setMode] = useState(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForgot, setShowForgot] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
  })

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('body-locked')
    } else {
      document.body.classList.remove('body-locked')
    }
    return () => document.body.classList.remove('body-locked')
  }, [isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let endpoint = ''
      let body = {}

      if (mode === 'login') {
        endpoint = '/api/auth/login'
        body = { email: formData.email, password: formData.password }
      } else if (mode === 'register') {
        endpoint = '/api/auth/register'
        body = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess(data.message)
      setTimeout(() => {
        setShowForgot(false)
        setFormData({ ...formData, newPassword: '', confirmPassword: '' })
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setSuccess('')
    setShowForgot(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="auth-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {!showForgot ? (
          <>
            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === 'login' ? 'is-active' : ''}`}
                onClick={() => switchMode('login')}
              >
                Login
              </button>
              <button
                className={`auth-tab ${mode === 'register' ? 'is-active' : ''}`}
                onClick={() => switchMode('register')}
              >
                Sign Up
              </button>
            </div>

            <div className="form-wrapper">
              {/* Login Form */}
              {mode === 'login' && (
                <form className="form-box" onSubmit={handleSubmit}>
                  <h2>Login</h2>
                  {error && <div className="auth-error">{error}</div>}
                  {success && <div className="auth-success">{success}</div>}
                  <div className="input-box">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button className="auth-btn" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <div className="forgot-row">
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => setShowForgot(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              )}

              {/* Sign Up Form */}
              {mode === 'register' && (
                <form className="form-box" onSubmit={handleSubmit}>
                  <h2>Sign Up</h2>
                  {error && <div className="auth-error">{error}</div>}
                  {success && <div className="auth-success">{success}</div>}
                  <div className="input-box">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                  <button className="auth-btn" type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          /* Forgot Password Panel */
          <div className="forgot-panel" style={{ display: 'block' }}>
            <button
              type="button"
              className="forgot-back"
              onClick={() => setShowForgot(false)}
            >
              ← Back to Login
            </button>
            <h2>Reset Password</h2>
            <p className="forgot-sub">
              Enter your account email and we&apos;ll update your password right away.
            </p>
            {error && <div className="forgot-msg forgot-msg--err">{error}</div>}
            {success && <div className="forgot-msg forgot-msg--ok">{success}</div>}
            <form className="forgot-form" onSubmit={handleForgotSubmit}>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
