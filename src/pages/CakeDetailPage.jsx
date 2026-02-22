import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCakeDetail } from '../api/api'
import './CakeDetailPage.css'

const CATEGORY_LABEL = {
  DESIGN: '디자인 케이크',
  HEART: '하트 케이크',
  FLOWER: '생화 케이크',
  FLOWER_JELLY: '생화 젤리 케이크',
  FLOWER_CUPCAKE: '생화 컵케이크',
  PETIT: '쁘띠 케이크',
}

const SIZE_LABEL = {
  MINI: '미니 (2~3인)',
  TALL_MINI: '높은 미니',
  SIZE_1: '1호 (4~5인)',
  SIZE_2: '2호 (6~8인)',
  SIZE_3: '3호 (10~12인)',
  SET_2: '2구',
  SET_4: '4구',
}

const FLAVOR_LABEL = {
  VANILLA: '바닐라',
  VANILLA_CRISPY: '바닐라 + 벨기에 크리스피볼',
  CHOCOLATE: '진한 초코',
  CARAMEL_CRUNCH: '카라멜 크런치',
}

export default function CakeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cake, setCake] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getCakeDetail(id)
      .then(setCake)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="detail-loading">로딩 중...</div>
  if (error) return <div className="detail-error">{error}</div>

  return (
    <main className="detail-page">
      {/* 이미지 */}
      <div className="detail-image-wrap">
        {cake.imageUrl ? (
          <img src={cake.imageUrl} alt={CATEGORY_LABEL[cake.cakeCategory]} className="detail-image" />
        ) : (
          <div className="detail-image-placeholder" />
        )}
      </div>

      {/* 정보 */}
      <div className="detail-body">
        <p className="detail-category">{CATEGORY_LABEL[cake.cakeCategory] || cake.cakeCategory}</p>
        <p className="detail-price">{cake.price.toLocaleString()}원~</p>

        <div className="detail-divider" />

        {/* 스펙 */}
        <ul className="detail-spec">
          <li>
            <span className="spec-label">사이즈</span>
            <span className="spec-value">{SIZE_LABEL[cake.cakeSize] || cake.cakeSize}</span>
          </li>
          <li>
            <span className="spec-label">맛</span>
            <span className="spec-value">{FLAVOR_LABEL[cake.cakeFlavor] || cake.cakeFlavor}</span>
          </li>
        </ul>

        {/* 설명 */}
        {cake.description && (
          <p className="detail-desc">{cake.description}</p>
        )}

        <div className="detail-divider" />

        {/* 주문 버튼 */}
        <button
          className="detail-order-btn"
          onClick={() => navigate(`/order?cakeCategory=${cake.cakeCategory}`)}
        >
          주문하기
        </button>

        <button className="detail-back-btn" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </div>
    </main>
  )
}
