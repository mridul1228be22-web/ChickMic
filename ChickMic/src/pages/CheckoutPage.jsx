import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'
import { useOrders } from '../hooks/useOrders.js'

export default function CheckoutPage() {
  const { user, updateUserProfile } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const { placeOrder } = useOrders()
  const navigate = useNavigate()

  const [coupon, setCoupon] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [address, setAddress] = useState(() => ({
    fullName: user?.address?.fullName || user?.displayName || '',
    phone: user?.address?.phone || '',
    line1: user?.address?.line1 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
  }))

  const discount = useMemo(() => (coupon.trim().toUpperCase() === 'CHIC10' ? subtotal * 0.1 : 0), [coupon, subtotal])
  const shipping = subtotal > 150 ? 0 : 12
  const finalTotal = subtotal + shipping - discount

  if (!user) {
    return (
      <section className="empty-state">
        <h1>Login required</h1>
        <p>Please login to continue checkout.</p>
        <Link className="btn btn-dark" to="/auth">
          Go to Login
        </Link>
      </section>
    )
  }

  if (!items.length) {
    return (
      <section className="empty-state">
        <h1>No items in cart</h1>
        <p>Add products before proceeding to checkout.</p>
        <Link className="btn btn-dark" to="/shop">
          Shop Now
        </Link>
      </section>
    )
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    await updateUserProfile({ address })
    const order = placeOrder({
      userId: user.uid,
      customer: { name: address.fullName, email: user.email, address },
      items,
      summary: {
        subtotal,
        shipping,
        discount,
        total: finalTotal,
      },
      paymentMethod,
    })
    clearCart()
    navigate(`/orders?order=${order.id}`)
  }

  return (
    <section className="cart-layout">
      <form className="order-box" onSubmit={handlePlaceOrder}>
        <h1>Checkout</h1>
        <div className="form-grid">
          <input placeholder="Full name" required value={address.fullName} onChange={(event) => setAddress({ ...address, fullName: event.target.value })} />
          <input placeholder="Phone" required value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} />
          <input placeholder="Address line" required value={address.line1} onChange={(event) => setAddress({ ...address, line1: event.target.value })} />
          <input placeholder="City" required value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} />
          <input placeholder="State" required value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value })} />
          <input placeholder="Zip code" required value={address.zip} onChange={(event) => setAddress({ ...address, zip: event.target.value })} />
          <input placeholder="Country" required value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} />
        </div>
        <div className="tabs">
          {['UPI', 'Card', 'Cash on Delivery'].map((method) => (
            <button
              key={method}
              type="button"
              className={paymentMethod === method ? 'active' : ''}
              onClick={() => setPaymentMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>
        <button className="btn btn-dark full" type="submit">
          Place Order
        </button>
      </form>
      <aside className="order-box">
        <h2>Payment Summary</h2>
        <div className="row-between">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="row-between">
          <span>Shipping</span>
          <strong>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</strong>
        </div>
        <div className="row-between">
          <span>Discount</span>
          <strong>- ${discount.toFixed(2)}</strong>
        </div>
        <input
          placeholder="Coupon code (try CHIC10)"
          value={coupon}
          onChange={(event) => setCoupon(event.target.value)}
        />
        <hr />
        <div className="row-between">
          <span>Total</span>
          <strong>${finalTotal.toFixed(2)}</strong>
        </div>
      </aside>
    </section>
  )
}
