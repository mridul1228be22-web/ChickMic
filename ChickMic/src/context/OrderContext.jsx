import { useCallback, useEffect, useMemo, useState } from 'react'
import { OrderContext } from './order-context.js'

const ORDER_KEY = 'chickmic_orders'

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const raw = localStorage.getItem(ORDER_KEY)
    return raw ? JSON.parse(raw) : []
  })

  useEffect(() => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders))
  }, [orders])

  const placeOrder = useCallback(({ userId, customer, items, summary, paymentMethod }) => {
    const order = {
      id: `CM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      userId,
      customer,
      items,
      summary,
      paymentMethod,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    return order
  }, [])

  const getOrdersByUser = useCallback(
    (userId) => orders.filter((order) => order.userId === userId),
    [orders],
  )

  const value = useMemo(
    () => ({ orders, placeOrder, getOrdersByUser }),
    [orders, placeOrder, getOrdersByUser],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
