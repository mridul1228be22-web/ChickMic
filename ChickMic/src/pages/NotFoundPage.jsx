import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="empty-state">
      <h1>Page not found</h1>
      <p>This page does not exist yet. Let us get you back to fashion.</p>
      <Link className="btn btn-dark" to="/">
        Back Home
      </Link>
    </section>
  )
}
