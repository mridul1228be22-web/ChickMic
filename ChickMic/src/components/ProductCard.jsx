import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart.js'
import { useWishlist } from '../hooks/useWishlist.js'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const wished = isInWishlist(product.id)

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-content">
        <div className="row-between">
          <span className="chip">{product.category}</span>
          {product.badge ? (
            <span className="chip hot">{product.badge}</span>
          ) : (
            product.trending && <span className="chip hot">Trending</span>
          )}
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="row-between">
          <span className="muted">Rating {product.rating}</span>
          <button
            className={`icon-btn ${wished ? 'icon-active' : ''}`}
            onClick={() => toggleWishlist(product)}
            type="button"
            aria-label="Toggle wishlist"
          >
            <Heart size={16} />
          </button>
        </div>
        <div className="row-between">
          <strong>${product.price}</strong>
          <div className="inline-actions">
            <Link className="btn btn-light" to={`/product/${product.id}`}>
              View
            </Link>
            <button className="btn btn-dark" onClick={() => addItem(product)} type="button">
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
