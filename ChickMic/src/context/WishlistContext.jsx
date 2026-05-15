import { useCallback, useEffect, useMemo, useState } from 'react'
import { WishlistContext } from './wishlist-context.js'

const WISHLIST_KEY = 'chickmic_wishlist'

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const raw = localStorage.getItem(WISHLIST_KEY)
    return raw ? JSON.parse(raw) : []
  })

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const isInWishlist = useCallback(
    (id) => wishlistItems.some((item) => item.id === id),
    [wishlistItems],
  )

  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id)
      }
      return [...prev, product]
    })
  }, [])

  const clearWishlist = useCallback(() => setWishlistItems([]), [])

  const value = useMemo(
    () => ({ wishlistItems, isInWishlist, toggleWishlist, clearWishlist }),
    [wishlistItems, isInWishlist, toggleWishlist, clearWishlist],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
