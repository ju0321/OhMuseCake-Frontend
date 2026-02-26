import { useEffect, useState, useMemo } from 'react'
import { getAllCakes } from '../api/api'
import CakeCard from '../components/CakeCard'
import CategoryTabs from '../components/CategoryTabs'
import './MainPage.css'

export default function AllProductsPage({ searchQuery = '' }) {
  const [allCakes, setAllCakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    <>
      <CategoryTabs active="ALL" />
      <main className="main-page">
        {loading ? (
          <div className="page-loading">로딩 중...</div>
        ) : (
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
        )}
      </main>
    </>
  )
}
