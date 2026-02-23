import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import MainPage from './pages/MainPage'
import OrderPage from './pages/OrderPage'
import OrderLookupPage from './pages/OrderLookupPage'
import CakeDetailPage from './pages/CakeDetailPage'
import './App.css'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <BrowserRouter>
      <div className="app">
        <Header searchQuery={searchQuery} onSearch={setSearchQuery} />
        <Routes>
          <Route path="/" element={<MainPage searchQuery={searchQuery} />} />
          <Route path="/cakes/:id" element={<CakeDetailPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/order-lookup" element={<OrderLookupPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
