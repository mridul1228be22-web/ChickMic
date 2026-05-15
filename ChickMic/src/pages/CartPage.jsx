import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart()
  const { user } = useAuth()
  const shipping = subtotal > 150 ? 0 : 12
  const total = subtotal + shipping

  if (!items.length) {
    return (
      <section className="empty-state">
        <h1>Your cart is empty</h1>
        <p>Add trending outfits and complete your look today.</p>
        <Link className="btn btn-dark" to="/shop">
          Continue Shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="cart-layout">
      <div>
        <h1>Shopping Cart</h1>
        {items.map((item) => (
          <article className="cart-item" key={item.cartKey}>
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              {(item.selectedSize || item.selectedColor) && (
                <p className="muted">
                  {item.selectedSize ? `Size: ${item.selectedSize}` : ''}{' '}
                  {item.selectedColor ? `Color: ${item.selectedColor}` : ''}
                </p>
              )}
              <div className="qty-row">
                <button
                  onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                  type="button"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => removeItem(item.cartKey)} type="button">
              Remove
            </button>
          </article>
        ))}
      </div>
      <aside className="order-box">
        <h2>Order Summary</h2>
        <div className="row-between">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="row-between">
          <span>Shipping</span>
          <strong>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</strong>
        </div>
        <hr />
        <div className="row-between">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <Link className="btn btn-dark full align-center" to={user ? '/checkout' : '/auth'}>
          {user ? 'Proceed to Checkout' : 'Login to Checkout'}
        </Link>
        <button className="btn btn-light full" onClick={clearCart} type="button">Clear Cart</button>
      </aside>
    </section>
  )
}
