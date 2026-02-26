import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExtraProducts } from '../api/api'
import garland from '../assets/extra/garland.jpg'
import clearBox from '../assets/extra/clear-box.jpg'
import candle1 from '../assets/extra/candle-1.jpg'
import candle2 from '../assets/extra/candle-2.jpg'
import './ExtraProductPage.css'

const EXTRA_IMAGES = [garland, clearBox, candle1, candle2]

export default function ExtraProductPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getExtraProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="extra-loading">로딩 중...</div>
  if (error) return <div className="extra-error">{error}</div>

  return (
    <main className="extra-page">
      <div className="extra-header">
        <h1 className="extra-title">EXTRA OPTIONS</h1>
        <p className="extra-desc-line">* 추가 옵션은 주문서 작성 시 함께 선택하실 수 있습니다.</p>
      </div>

      <div className="extra-grid">
        {EXTRA_IMAGES.map((src, i) => (
          <div key={i} className="extra-grid-item">
            <img src={src} alt={`extra-option-${i + 1}`} />
          </div>
        ))}
      </div>

      <ul className="extra-list">
        {products.map((product) => (
          <li key={product.id} className="extra-item">
            <span className="extra-item-name">{product.productName}</span>
            {product.description && product.description !== '-' && (
              <span className="extra-item-desc">{product.description}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="extra-order-wrap">
        <button
          className="extra-order-btn"
          onClick={() => navigate('/order')}
        >
          Begin Your Order →
        </button>
      </div>
    </main>
  )
}
