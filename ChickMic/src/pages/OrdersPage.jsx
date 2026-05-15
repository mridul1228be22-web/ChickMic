import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useOrders } from '../hooks/useOrders.js'

export default function OrdersPage() {
  const { user } = useAuth()
  const { getOrdersByUser } = useOrders()
  const [searchParams] = useSearchParams()
  const highlightOrderId = searchParams.get('order')

  if (!user) {
    return (
      <section className="empty-state">
        <h1>Login to view orders</h1>
        <Link className="btn btn-dark" to="/auth">
          Login
        </Link>
      </section>
    )
  }

  const orders = getOrdersByUser(user.uid)

  if (!orders.length) {
    return (
      <section className="empty-state">
        <h1>No orders yet</h1>
        <p>Your order history will appear here after checkout.</p>
        <Link className="btn btn-dark" to="/shop">
          Start Shopping
        </Link>
      </section>
    )
  }

  return (
    <section>
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <article
            key={order.id}
            className={`order-card ${highlightOrderId === order.id ? 'order-highlight' : ''}`}
          >
            <div className="row-between">
              <strong>{order.id}</strong>
              <span className="chip">{order.status}</span>
            </div>
            <p className="muted">
              {new Date(order.createdAt).toLocaleString()} | {order.paymentMethod}
            </p>
            <p>{order.items.length} item(s)</p>
            <div className="row-between">
              <span>Total paid</span>
              <strong>${order.summary.total.toFixed(2)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
