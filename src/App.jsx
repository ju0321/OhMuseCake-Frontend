import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import LandingPage from './pages/LandingPage'
import MainPage from './pages/MainPage'
import OrderPage from './pages/OrderPage'
import OrderLookupPage from './pages/OrderLookupPage'
import CakeDetailPage from './pages/CakeDetailPage'
import ExtraProductPage from './pages/ExtraProductPage'
import './App.css'

function AppInner() {
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <div className="app">
      {!isLanding && <Header searchQuery={searchQuery} onSearch={setSearchQuery} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<MainPage searchQuery={searchQuery} />} />
        <Route path="/cakes/category/:category" element={<CakeDetailPage />} />
        <Route path="/cakes/:id" element={<CakeDetailPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order-lookup" element={<OrderLookupPage />} />
        <Route path="/extra-products" element={<ExtraProductPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
