import { Outlet } from 'react-router-dom'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="container page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
