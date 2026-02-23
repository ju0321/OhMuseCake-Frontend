const BASE_URL = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const json = await res.json()
  if (!json.success) {
    throw new Error(json.message || '요청에 실패했습니다.')
  }
  return json.data
}

// 케이크
export const getBestCakes = () => request('/cakes/best')
export const getAllCakes = () => request('/cakes')
export const getCakeDetail = (cakeId) => request(`/cakes/${cakeId}`)

// 추가상품
export const getExtraProducts = () => request('/extra_products')

// 주문
export const createOrder = (body) =>
  request('/orders', { method: 'POST', body: JSON.stringify(body) })

export const getOrdersByPhone = (phone) =>
  request(`/orders/search?phone=${encodeURIComponent(phone)}`)

export const getOrderById = (orderId) => request(`/orders/${orderId}`)
