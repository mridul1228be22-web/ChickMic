import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { categories, products } from '../data/products.js'

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  const [activeCategory, setActiveCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : 'All',
  )
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  const visibleProducts = useMemo(
    () =>
      products
        .filter((product) => {
          const categoryMatch =
            activeCategory === 'All' || product.category === activeCategory
          const searchMatch = product.name.toLowerCase().includes(search.toLowerCase())
          return categoryMatch && searchMatch
        })
        .sort((a, b) => {
          if (sortBy === 'price-asc') return a.price - b.price
          if (sortBy === 'price-desc') return b.price - a.price
          if (sortBy === 'rating') return b.rating - a.rating
          return Number(b.trending) - Number(a.trending)
        }),
    [activeCategory, search, sortBy],
  )

  return (
    <section>
      <div className="section-heading">
        <h1>Shop Collection</h1>
      </div>
      <div className="shop-toolbar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search outfits..."
        />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="featured">Featured</option>
          <option value="rating">Top Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <div className="tabs">
          {categories.map((category) => (
            <button
              className={category === activeCategory ? 'active' : ''}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="grid-products">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
