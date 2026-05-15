import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, Undo2 } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { categories, products } from '../data/products.js'

const perks = [
  { icon: Truck, title: 'Free shipping', text: 'On orders over $120' },
  { icon: Undo2, title: 'Easy returns', text: '30-day hassle-free policy' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Encrypted payments & accounts' },
]

export default function HomePage() {
  const trending = products.filter((product) => product.trending).slice(0, 6)
  const newArrivals = products.slice(-4)

  return (
    <>
      <section className="hero-section hero-gradient">
        <div>
          <p className="eyebrow">New Season 2026</p>
          <h1>Style that speaks before you do.</h1>
          <p>
            Shop latest streetwear, premium essentials, and signature occasion looks at
            Chickmic Fashion — now with secure account login.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-dark" to="/shop">
              Shop Now
            </Link>
            <Link className="btn btn-light" to="/auth">
              Create Account
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>14+</strong>
              <span>Curated styles</span>
            </div>
            <div>
              <strong>4.7</strong>
              <span>Avg. rating</span>
            </div>
            <div>
              <strong>24h</strong>
              <span>Dispatch</span>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
          alt="Fashion storefront"
        />
      </section>

      <section className="perk-strip">
        {perks.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={22} />
            <div>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </div>
          </article>
        ))}
      </section>

      <section>
        <div className="section-heading">
          <h2>Shop by category</h2>
        </div>
        <div className="category-grid">
          {categories
            .filter((category) => category !== 'All')
            .map((category) => (
              <Link
                key={category}
                className="category-card"
                to={`/shop?category=${category}`}
              >
                <span>{category}</span>
                <ArrowRight size={18} />
              </Link>
            ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Trending right now</h2>
          <Link to="/shop">View all</Link>
        </div>
        <div className="grid-products">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="promo-banner">
        <div>
          <p className="eyebrow">Members offer</p>
          <h2>Get 10% off your first order</h2>
          <p className="muted">Sign up and use code CHIC10 at checkout.</p>
          <Link className="btn btn-dark" to="/auth">
            Join & save
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80"
          alt="Fashion model"
        />
      </section>

      <section>
        <div className="section-heading">
          <h2>New arrivals</h2>
          <Link to="/shop">See collection</Link>
        </div>
        <div className="grid-products">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="feature-grid">
        <article className="order-box">
          <h3>Wishlist</h3>
          <p className="muted">Save your favorite outfits and revisit anytime.</p>
          <Link className="btn btn-light" to="/wishlist">
            Open Wishlist
          </Link>
        </article>
        <article className="order-box">
          <h3>Fast Checkout</h3>
          <p className="muted">Checkout with saved address when you are logged in.</p>
          <Link className="btn btn-light" to="/checkout">
            Go to Checkout
          </Link>
        </article>
        <article className="order-box">
          <h3>Order Tracking</h3>
          <p className="muted">View your complete order history and status updates.</p>
          <Link className="btn btn-light" to="/orders">
            My Orders
          </Link>
        </article>
      </section>

      <section className="newsletter-card">
        <div>
          <h2>Stay in the loop</h2>
          <p className="muted">Drop alerts, restocks, and exclusive style guides.</p>
        </div>
        <form
          className="newsletter-form"
          onSubmit={(event) => {
            event.preventDefault()
            event.target.reset()
          }}
        >
          <input type="email" required placeholder="you@email.com" />
          <button className="btn btn-dark" type="submit">
            Subscribe
          </button>
        </form>
      </section>
    </>
  )
}
