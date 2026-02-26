import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCakeDetail } from '../api/api'
import CategoryTabs from '../components/CategoryTabs'
import './CakeDetailPage.css'

/* ─── 카테고리별 정적 정보 (피그마 기준) ─── */
const CATEGORY_INFO = {
  DESIGN: {
    title: 'DESIGN CAKE',
    desc: [
      '*흰색 바탕에 단일 컬러로 레터링하는 금액입니다.',
      '*겉크림은 크림치즈, 속 크림은 동물성 100%생크림이 들어갑니다.',
    ],
    prices: [
      '미니(지름 약12cm, 2-3인분) 40,000~',
      '1호(지름 약15cm, 4-5인분) 48,000~',
      '2호(지름 약18cm, 5-6인분) 58,000~',
      '3호(지름 약21cm, 7-8인분) 70,000~',
      '2단케이크(초미니+1호, 미니+2호, 1호+3호) 개별문의',
    ],
  },
  HEART: {
    title: 'HEART CAKE',
    desc: [
      '*동물성 100% 생크림 하트 케이크',
      '*올화이트 디자인에 원색 컬러로 레터링하는 금액입니다.',
    ],
    prices: [
      '< 올 화이트 기준 >',
      '미니 하트 45,000~',
      '1호 하트 53,000~',
      '2호 하트 65,000~',
      '*생크림 색상 변경 +1,000 / 짙은색상일 경우 크림치즈 색상 변경 +2,000',
      '*젤리 추가 +3,000',
      '*생화 추가 +6,000~20,000',
    ],
  },
  FLOWER: {
    title: 'FLOWER CAKE',
    desc: [
      '*아름다운 생화를 조합해서 제작해드리는 생화케이크입니다.',
      '*모든 생화는 소독 및 세척 후 올려드리며, 굵은 줄기의 생화일 경우 랩핑하여 꽂아드립니다.',
    ],
    prices: [
      '미니(지름 약12cm, 2인분) 56,000~',
      '높은 미니(지름 약12cm, 3인분) 59,000~',
      '1호(지름 약15cm, 4-5인분) 68,000~',
      '2호(지름 약18cm, 5-6인분) 80,000~',
      '3호(지름 약21cm, 7-8인분) 95,000~',
    ],
  },
  FLOWER_JELLY: {
    title: 'FLOWER JELLY CAKE',
    desc: [
      '*생화와 영롱한 복숭아 빛 젤리로 데코해드리는 케이크입니다.',
      '*모든 생화는 소독 및 세척 후 올려드리며, 굵은 줄기의 생화일 경우 랩핑하여 꽂아드립니다.',
    ],
    prices: [
      '미니(지름 약12cm, 2인분) 59,000~',
      '높은 미니(지름 약12cm, 3인분) 62,000~',
      '1호(지름 약15cm, 4-5인분) 71,000~',
      '2호(지름 약18cm, 6-8인분) 83,000~',
      '3호(지름 약21cm, 7-9인분) 98,000~',
    ],
  },
  FLOWER_CUPCAKE: {
    title: 'FLOWER CUPCAKE',
    desc: [
      '*다양한 이벤트나 답례 상품으로 좋은 생화 컵케이크입니다.',
    ],
    prices: [
      '바닐라 컵케이크 (바닐라 파운드 + 사과잼 + 크림치즈)',
      '초코 컵케이크 (초코 파운드 + 라즈베리잼 + 크림치즈)',
      '',
      '2구 생화 컵케이크',
      '바닐라 27,000원 / 초코 29,000원',
      '',
      '4구 생화 컵케이크',
      '바닐라 51,000원 / 초코 54,000원',
      '',
      '-투명상자 포장 / 기본 초, 성냥x',
      '-판레터링 +1,000',
    ],
  },
  PETIT: {
    title: 'PETIT CAKE',
    desc: [
      '*기본 맛만 가능합니다.',
      '*한입에 먹을 수 있는 초미니 케이크입니다.',
    ],
    prices: [
      '일반 한입 케이크보다 1.5배 더 큰 사이즈로 제작해드리는 쁘띠 케이크입니다.',
      '무유 생크림 + 크림치즈 크림 맛으로 제작해드립니다.',
      '동물, 캐릭터 등 커스텀 가능합니다.',
    ],
  },
}

/* ─── 카테고리별 이미지 (public 폴더 기준 정적 경로) ─── */
const designUrls      = Object.values(import.meta.glob('../assets/cakes/design/*.jpg',         { eager: true })).map(m => m.default)
const heartUrls       = Object.values(import.meta.glob('../assets/cakes/heart/*.jpg',          { eager: true })).map(m => m.default)
const flowerUrls      = Object.values(import.meta.glob('../assets/cakes/flower/*.jpg',         { eager: true })).map(m => m.default)
const jellyUrls       = Object.values(import.meta.glob('../assets/cakes/flower-jelly/*.jpg',   { eager: true })).map(m => m.default)
const cupcakeUrls     = Object.values(import.meta.glob('../assets/cakes/flower-cupcake/*.jpg', { eager: true })).map(m => m.default)
const petitUrls       = Object.values(import.meta.glob('../assets/cakes/petit/*.jpg',          { eager: true })).map(m => m.default)

const CATEGORY_IMAGES = {
  DESIGN:         designUrls,
  HEART:          heartUrls,
  FLOWER:         flowerUrls,
  FLOWER_JELLY:   jellyUrls,
  FLOWER_CUPCAKE: cupcakeUrls,
  PETIT:          petitUrls,
}

export default function CakeDetailPage() {
  const { id, category } = useParams()
  const navigate = useNavigate()
  const [cake, setCake] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (category) {
      setLoading(false)
      return
    }
    getCakeDetail(id)
      .then(setCake)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, category])

  if (loading) return <div className="detail-loading">로딩 중...</div>
  if (error)   return <div className="detail-error">{error}</div>

  const resolvedCategory = category ?? cake?.cakeCategory
  const info   = CATEGORY_INFO[resolvedCategory]
  const images = CATEGORY_IMAGES[resolvedCategory] ?? []

  return (
    <>
      <CategoryTabs active={resolvedCategory} onChange={() => {}} />
    <main className="detail-page">

      {/* 타이틀 */}
      <div className="detail-header">
        <h1 className="detail-title">{info?.title ?? resolvedCategory}</h1>
        {info?.desc.map((line, i) => (
          <p key={i} className="detail-desc-line">{line}</p>
        ))}
      </div>

      {/* 사진 그리드 */}
      {images.length > 0 && (
        <div className="detail-grid">
          {images.map((src, i) => (
            <div key={i} className="detail-grid-item">
              <img src={src} alt={`${info?.title ?? ''} ${i + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* 가격 정보 */}
      {info?.prices && (
        <div className="detail-price-section">
          <ul className="detail-price-list">
            {info.prices.map((line, i) =>
              line === '' ? (
                <li key={i} className="detail-price-gap" />
              ) : (
                <li key={i} className="detail-price-item">{line}</li>
              )
            )}
          </ul>
        </div>
      )}

      {/* 주문 버튼 */}
      <div className="detail-order-wrap">
        <button
          className="detail-order-btn"
          onClick={() => navigate(`/order?cakeCategory=${resolvedCategory}`)}
        >
          Begin Your Order →
        </button>
      </div>

    </main>
    </>
  )
}
