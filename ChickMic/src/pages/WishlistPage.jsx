import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useWishlist } from '../hooks/useWishlist.js'

export default function WishlistPage() {
  const { wishlistItems, clearWishlist } = useWishlist()

  if (!wishlistItems.length) {
    return (
      <section className="empty-state">
        <h1>Your wishlist is empty</h1>
        <p>Save products you love and come back to buy them later.</p>
        <Link className="btn btn-dark" to="/shop">
          Browse Collection
        </Link>
      </section>
    )
  }

  return (
    <section>
      <div className="section-heading">
        <h1>Wishlist</h1>
        <button className="btn btn-light" onClick={clearWishlist} type="button">
          Clear Wishlist
        </button>
      </div>
      <div className="grid-products">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
