import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCakes } from '../api/api'
import CakeCard from '../components/CakeCard'
import headerImg from '../assets/header.jpg'
import bestHeart      from '../assets/cakes/best/heart-best.jpg'
import bestFlower     from '../assets/cakes/best/flower-best.jpg'
import bestFlowerJelly from '../assets/cakes/best/flower-jelly-best.jpg'
import './MainPage.css'

const BEST_ITEMS = [
  {
    src: bestHeart,
    title: 'Heart Cake',
    desc: [
      '하트 모양의 케이크로 특별한 날을 더욱 빛나게 해드립니다.',
      '웨딩 드레스, 하트, 꽃, 파스텔 컬러 등 다양한 테마로 제작 가능합니다.',
    ],
  },
  {
    src: bestFlower,
    title: 'Flower Cake',
    desc: [
      '자연에서 온 생화를 올린 케이크입니다.',
      '소독 및 세척을 거친 신선한 생화로 우아하고 자연스러운 분위기를 연출합니다.',
    ],
  },
  {
    src: bestFlowerJelly,
    title: 'Flower Jelly Cake',
    desc: [
      '생화 젤리 케이크는 프러포즈나 특별한 날을 위한 케이크입니다.',
      '젤리 속 꽃이 오랫동안 보존되어 소중한 순간을 기억에 남겨드립니다.',
    ],
  },
]

export default function MainPage({ searchQuery = '' }) {
  const [allCakes, setAllCakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAllCakes()
      .then(setAllCakes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredCakes = useMemo(() => {
    if (!searchQuery) return allCakes
    const q = searchQuery.toLowerCase()
    return allCakes.filter((c) => c.cakeCategory.toLowerCase().includes(q))
  }, [allCakes, searchQuery])

  if (error) return <div className="page-error">{error}</div>

  return (
    <main className="main-page">
      {loading ? (
        <div className="page-loading">로딩 중...</div>
      ) : (
        <>
          {/* Hero */}
          <section className="hero">
            <div className="hero-banner">
              <img src={headerImg} alt="Oh, Muse Cake" className="hero-img" />
            </div>
            <div className="hero-content">
              <h1 className="hero-title">세상에 단 하나뿐인,<br />당신을 위한 특별한 케이크</h1>
              <p className="hero-sub-en">A cake as unique as you are.<br />More than cake, it's an experience.</p>
              <p className="hero-desc">
                우리는 단순히 케이크를 만드는 것이 아니라,<br />
                당신의 특별한 순간을 예술처럼 디자인합니다.<br />
                정교한 디테일, 고급스러운 맛, 그리고 진심 어린 손길로<br />
                세상에 단 하나뿐인 케이크를 선물합니다.
              </p>
            </div>
          </section>

          {/* Best */}
          <section className="section best-section">
            <h2 className="section-title best-title">Best Cakes</h2>
            <div className="best-list">
              {BEST_ITEMS.map((item, i) => (
                <div key={i} className={`best-item${i % 2 === 1 ? ' best-item--reverse' : ''}`}>
                  <div className="best-item-text">
                    <h3 className="best-item-title">{item.title}</h3>
                    {item.desc.map((line, j) => (
                      <p key={j} className="best-item-desc">{line}</p>
                    ))}
                  </div>
                  <div className="best-item-img">
                    <img src={item.src} alt={item.title} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 상품 목록 */}
          <section className="section">
            <h2 className="section-title">Products</h2>
            {filteredCakes.length === 0 ? (
              <p className="no-result">해당하는 상품이 없습니다.</p>
            ) : (
              <div className="cake-grid">
                {filteredCakes.map((cake) => (
                  <CakeCard key={cake.cakeId} cake={cake} />
                ))}
              </div>
            )}
          </section>

          {/* Order CTA */}
          <section className="cta-section">
            <p className="cta-text">주문은 카카오톡 채널 또는 주문서로 접수됩니다.</p>
            <button className="cta-btn" onClick={() => navigate('/order')}>
              주문서 작성하기
            </button>
          </section>
        </>
      )}
    </main>
  )
}
