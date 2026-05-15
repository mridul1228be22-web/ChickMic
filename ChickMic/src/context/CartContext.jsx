import { useEffect, useMemo, useState } from 'react'
import { CartContext } from './cart-context.js'
const CART_KEY = 'chickmic_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    setItems((prevItems) => {
      const cartKey = `${product.id}-${product.selectedSize || 'default'}-${product.selectedColor || 'default'}`
      const existing = prevItems.find((item) => item.cartKey === cartKey)
      if (existing) {
        return prevItems.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prevItems, { ...product, cartKey, quantity: 1 }]
    })
  }

  const removeItem = (cartKey) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartKey !== cartKey))
  }

  const updateQuantity = (cartKey, quantity) => {
    if (quantity < 1) return removeItem(cartKey)
    setItems((prevItems) =>
      prevItems.map((item) => (item.cartKey === cartKey ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => setItems([])

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
