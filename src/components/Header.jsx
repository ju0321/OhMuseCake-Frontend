import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import './Header.css'

export default function Header({ searchQuery, onSearch }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearchToggle = () => {
    setSearchOpen((prev) => {
      if (prev) onSearch('')
      return !prev
    })
  }

  const handleSearchChange = (e) => {
    onSearch(e.target.value)
    navigate('/')
  }

  return (
    <header className="header-wrap">
      <div className="header">
        <Link to="/" className="header-logo" onClick={() => { onSearch(''); setSearchOpen(false) }}>
          <img src={logo} alt="Oh, Muse Cake" className="header-logo-img" />
          <span className="header-logo-text">Oh, muse cake</span>
        </Link>
        <div className="header-icons">
          <button className="icon-btn" aria-label="검색" onClick={handleSearchToggle}>
            {searchOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            )}
          </button>
          <button className="icon-btn" aria-label="채팅">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="icon-btn" aria-label="주문 조회" onClick={() => navigate('/order-lookup')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="8" y1="9" x2="16" y2="9" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="12" y2="17" />
            </svg>
          </button>
          <button className="icon-btn" aria-label="주문서" onClick={() => navigate('/order')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="9" y1="16" x2="13" y2="16" />
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="케이크 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
        </div>
      )}
    </header>
  )
}
