import { Heart, Package, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'
import { useWishlist } from '../hooks/useWishlist.js'

export default function Navbar() {
  const { totalItems } = useCart()
  const { wishlistItems } = useWishlist()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <NavLink className="brand" to="/">
          Chickmic Fashion
        </NavLink>
        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </nav>
        <div className="topbar-actions">
          <NavLink to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <Heart size={18} />
            <span className="badge">{wishlistItems.length}</span>
          </NavLink>
          <NavLink to="/cart" className="icon-btn" aria-label="Cart">
            <ShoppingBag size={18} />
            <span className="badge">{totalItems}</span>
          </NavLink>
          <NavLink to="/orders" className="icon-btn" aria-label="Orders">
            <Package size={18} />
          </NavLink>
          {user ? (
            <>
              <NavLink className="btn btn-light" to="/account">
                Account
              </NavLink>
              <button className="btn btn-ghost" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/auth" className="icon-btn" aria-label="Login">
              <UserRound size={18} />
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}
