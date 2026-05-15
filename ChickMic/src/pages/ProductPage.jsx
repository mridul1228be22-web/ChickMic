import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productMap, products } from '../data/products.js'
import { useCart } from '../hooks/useCart.js'
import { useWishlist } from '../hooks/useWishlist.js'

const reviewKey = (productId) => `chickmic_reviews_${productId}`

export default function ProductPage() {
  const { productId } = useParams()
  const product = productMap[productId]
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [size, setSize] = useState(product?.sizes?.[0] || '')
  const [color, setColor] = useState(product?.colors?.[0] || '')
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState(() => {
    const raw = localStorage.getItem(reviewKey(productId))
    return raw ? JSON.parse(raw) : []
  })

  const relatedProducts = useMemo(
    () =>
      products
        .filter((item) => item.category === product?.category && item.id !== product?.id)
        .slice(0, 3),
    [product],
  )

  if (!product) {
    return (
      <section className="empty-state">
        <h1>Product not found</h1>
        <Link className="btn btn-dark" to="/shop">
          Back to Shop
        </Link>
      </section>
    )
  }

  const addReview = () => {
    if (!reviewText.trim()) return
    const nextReviews = [{ id: crypto.randomUUID(), text: reviewText.trim() }, ...reviews]
    setReviews(nextReviews)
    localStorage.setItem(reviewKey(product.id), JSON.stringify(nextReviews))
    setReviewText('')
  }

  return (
    <section className="detail-page">
      <article className="detail-card">
        <img src={product.image} alt={product.name} />
        <div className="detail-content">
          <h1>{product.name}</h1>
          <p className="muted">{product.description}</p>
          <p>Rating: {product.rating} | In stock: {product.stock}</p>
          <strong>${product.price}</strong>
          <div className="tabs">
            {product.sizes.map((item) => (
              <button
                key={item}
                type="button"
                className={item === size ? 'active' : ''}
                onClick={() => setSize(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="tabs">
            {product.colors.map((item) => (
              <button
                key={item}
                type="button"
                className={item === color ? 'active' : ''}
                onClick={() => setColor(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="inline-actions">
            <button
              className="btn btn-dark"
              type="button"
              onClick={() => addItem({ ...product, selectedSize: size, selectedColor: color })}
            >
              Add to Cart
            </button>
            <button className="btn btn-light" type="button" onClick={() => toggleWishlist(product)}>
              {isInWishlist(product.id) ? 'Remove Wishlist' : 'Save Wishlist'}
            </button>
          </div>
        </div>
      </article>

      <article className="content-page">
        <h2>Customer Reviews</h2>
        <div className="inline-actions">
          <input
            value={reviewText}
            placeholder="Write your review..."
            onChange={(event) => setReviewText(event.target.value)}
          />
          <button className="btn btn-dark" type="button" onClick={addReview}>
            Submit
          </button>
        </div>
        {reviews.length ? (
          <div className="review-list">
            {reviews.map((review) => (
              <p key={review.id}>{review.text}</p>
            ))}
          </div>
        ) : (
          <p className="muted">No reviews yet. Be the first to review.</p>
        )}
      </article>

      <article>
        <div className="section-heading">
          <h2>Related picks</h2>
        </div>
        <div className="grid-products">
          {relatedProducts.map((related) => (
            <Link key={related.id} className="order-box" to={`/product/${related.id}`}>
              <p>{related.name}</p>
              <strong>${related.price}</strong>
            </Link>
          ))}
        </div>
      </article>
    </section>
  )
}
