import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrdersByPhone } from '../api/api'
import './OrderLookupPage.css'

const STATUS_LABEL = {
  REQUEST: '주문 요청',
  CONFIRMED: '주문 확인',
  IN_PROGRESS: '제작 중',
  COMPLETED: '완료',
  CANCELLED: '취소',
}

export default function OrderLookupPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone.trim()) return

    setLoading(true)
    setError(null)
    setOrders(null)

    try {
      const data = await getOrdersByPhone(phone.trim())
      setOrders(data)
    } catch (err) {
      setError(err.message || '주문 내역을 찾을 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lookup-page">
      <h1 className="lookup-title">주문 조회</h1>
      <p className="lookup-desc">주문 시 입력하신 전화번호로 주문 내역을 확인하실 수 있습니다.</p>

      <form className="lookup-form" onSubmit={handleSubmit}>
        <div className="lookup-input-row">
          <input
            className="lookup-input"
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="lookup-btn" type="submit" disabled={loading || !phone.trim()}>
            {loading ? '조회 중…' : '조회'}
          </button>
        </div>
      </form>

      {error && <p className="lookup-error">{error}</p>}

      {orders && orders.length === 0 && (
        <p className="lookup-empty">해당 전화번호로 등록된 주문이 없습니다.</p>
      )}

      {orders && orders.length > 0 && (
        <div className="lookup-results">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-card-header">
                <span className="order-card-id">#{order.orderId}</span>
                <span className={`order-status order-status--${order.orderStatus}`}>
                  {STATUS_LABEL[order.orderStatus] ?? order.orderStatus}
                </span>
              </div>

              <div className="order-card-body">
                <Row label="주문자" value={order.customerName} />
                <Row label="픽업일" value={`${order.pickupDate} ${order.pickupTime}`} />
                <Row label="케이크 종류" value={order.cakeCategory} />
                <Row label="사이즈" value={order.cakeSize} />
                <Row label="맛" value={order.cakeFlavor} />
                {order.cakeOptions && order.cakeOptions.length > 0 && (
                  <Row label="케이크 옵션" value={order.cakeOptions.join(', ')} />
                )}
                {order.extraOptions && order.extraOptions.length > 0 && (
                  <Row label="추가 옵션" value={order.extraOptions.join(', ')} />
                )}
                {order.letteringText && (
                  <Row label="레터링" value={order.letteringText} />
                )}
                {order.requestNote && (
                  <Row label="요청사항" value={order.requestNote} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="order-row">
      <span className="order-row-label">{label}</span>
      <span className="order-row-value">{value}</span>
    </div>
  )
}
