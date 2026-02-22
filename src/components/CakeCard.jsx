import { useNavigate } from 'react-router-dom'
import './CakeCard.css'

const CATEGORY_LABEL = {
  DESIGN: '디자인 케이크',
  HEART: '하트 케이크',
  FLOWER: '생화 케이크',
  FLOWER_JELLY: '생화 젤리 케이크',
  FLOWER_CUPCAKE: '생화 컵케이크',
  PETIT: '쁘띠 케이크',
}

export default function CakeCard({ cake }) {
  const navigate = useNavigate()

  return (
    <div className="cake-card" onClick={() => navigate(`/cakes/${cake.cakeId}`)}>
      <div className="cake-card-image-wrap">
        {cake.imageUrl ? (
          <img src={cake.imageUrl} alt={CATEGORY_LABEL[cake.cakeCategory]} className="cake-card-image" />
        ) : (
          <div className="cake-card-placeholder" />
        )}
      </div>
      <div className="cake-card-info">
        <span className="cake-card-category">{CATEGORY_LABEL[cake.cakeCategory] || cake.cakeCategory}</span>
        <span className="cake-card-price">{cake.price.toLocaleString()}원~</span>
      </div>
    </div>
  )
}
