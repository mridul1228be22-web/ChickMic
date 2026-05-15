import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function AccountPage() {
  const { user, updateUserProfile } = useAuth()
  const [message, setMessage] = useState('')
  const [form, setForm] = useState(() => ({
    displayName: user?.displayName || '',
    phone: user?.address?.phone || '',
    line1: user?.address?.line1 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
  }))

  if (!user) {
    return (
      <section className="empty-state">
        <h1>Please login first</h1>
        <Link className="btn btn-dark" to="/auth">
          Login
        </Link>
      </section>
    )
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    await updateUserProfile({
      displayName: form.displayName,
      address: {
        fullName: form.displayName,
        phone: form.phone,
        line1: form.line1,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country,
      },
    })
    setMessage('Profile updated successfully.')
  }

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={saveProfile}>
        <h1>My Account</h1>
        <input
          value={form.displayName}
          placeholder="Display name"
          onChange={(event) => setForm({ ...form, displayName: event.target.value })}
        />
        <input
          value={form.phone}
          placeholder="Phone"
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <input
          value={form.line1}
          placeholder="Address line"
          onChange={(event) => setForm({ ...form, line1: event.target.value })}
        />
        <input
          value={form.city}
          placeholder="City"
          onChange={(event) => setForm({ ...form, city: event.target.value })}
        />
        <input
          value={form.state}
          placeholder="State"
          onChange={(event) => setForm({ ...form, state: event.target.value })}
        />
        <input
          value={form.zip}
          placeholder="ZIP"
          onChange={(event) => setForm({ ...form, zip: event.target.value })}
        />
        <input
          value={form.country}
          placeholder="Country"
          onChange={(event) => setForm({ ...form, country: event.target.value })}
        />
        <button className="btn btn-dark full" type="submit">
          Save Profile
        </button>
        {message && <p className="success">{message}</p>}
      </form>
    </section>
  )
}
