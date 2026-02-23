import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBestCakes, getAllCakes } from '../api/api'
import CakeCard from '../components/CakeCard'
import CategoryTabs from '../components/CategoryTabs'
import headerImg from '../assets/header.jpg'
import './MainPage.css'

export default function MainPage({ searchQuery = '' }) {
  const [bestCakes, setBestCakes] = useState([])
  const [allCakes, setAllCakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getBestCakes(), getAllCakes()])
      .then(([best, all]) => {
        setBestCakes(best)
        setAllCakes(all)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredCakes = useMemo(() => {
    let cakes = allCakes
    if (activeCategory !== 'ALL') {
      cakes = cakes.filter((c) => c.cakeCategory === activeCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      cakes = cakes.filter((c) => c.cakeCategory.toLowerCase().includes(q))
    }
    return cakes
  }, [allCakes, activeCategory, searchQuery])

  const isDefault = activeCategory === 'ALL' && !searchQuery

  if (error) return <div className="page-error">{error}</div>

  return (
    <>
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      <main className="main-page">
        {loading ? (
          <div className="page-loading">로딩 중...</div>
        ) : (
          <>
            {/* Hero */}
            {isDefault && (
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
            )}

            {/* Best */}
            {isDefault && bestCakes.length > 0 && (
              <section className="section">
                <h2 className="section-title">Best</h2>
                <div className="cake-grid">
                  {bestCakes.map((cake) => (
                    <CakeCard key={cake.cakeId} cake={cake} />
                  ))}
                </div>
              </section>
            )}

            {/* 상품 목록 */}
            <section className="section">
              {isDefault && <h2 className="section-title">Products</h2>}
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
            {isDefault && (
              <section className="cta-section">
                <p className="cta-text">주문은 카카오톡 채널 또는 주문서로 접수됩니다.</p>
                <button className="cta-btn" onClick={() => navigate('/order')}>
                  주문서 작성하기
                </button>
              </section>
            )}
          </>
        )}
      </main>
    </>
  )
}
