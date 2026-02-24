import { useState, useEffect, useRef } from 'react'
import { createOrder } from '../api/api'
import './OrderPage.css'

const CAKE_CATEGORY = [
  { value: 'DESIGN', label: '디자인 케이크' },
  { value: 'HEART', label: '하트 케이크' },
  { value: 'FLOWER', label: '생화 케이크' },
  { value: 'FLOWER_JELLY', label: '생화 젤리 케이크' },
  { value: 'FLOWER_CUPCAKE', label: '생화 컵케이크' },
  { value: 'PETIT', label: '쁘띠 케이크' },
]

const CAKE_SIZE = [
  { value: 'MINI', label: '미니 (2~3인)' },
  { value: 'TALL_MINI', label: '높은 미니' },
  { value: 'SIZE_1', label: '1호' },
  { value: 'SIZE_2', label: '2호' },
  { value: 'SIZE_3', label: '3호' },
  { value: 'SET_2', label: '2구' },
  { value: 'SET_4', label: '4구' },
]

const CAKE_FLAVOR = [
  { value: 'VANILLA', label: '바닐라' },
  { value: 'VANILLA_CRISPY', label: '바닐라 + 벨기에 크리스피볼' },
  { value: 'CHOCOLATE', label: '진한 초코' },
  { value: 'CARAMEL_CRUNCH', label: '카라멜 크런치' },
]

// CakeOption enum (NONE 제외, 중복 선택 가능)
const CAKE_OPTIONS = [
  { value: 'CREAM_COLOR_CHANGE', label: '생크림 색 변경' },
  { value: 'CREAM_COLOR_CHANGE_DARK', label: '생크림 색 변경 - 짙은 색상' },
  { value: 'JELLY_ADD', label: '젤리 추가' },
  { value: 'FLOWER_ADD', label: '생화 추가' },
]

const LETTERING_OPTIONS = [
  { value: 'NONE', label: '없음', price: 0 },
  { value: 'SHORT', label: '판 레터링 10~13글자', price: 1000 },
  { value: 'LONG', label: '판 레터링 14~20글자', price: 2000 },
]

const BAG_OPTIONS = [
  { value: 'NONE', label: '없음' },
  { value: 'MINI', label: '미니' },
  { value: 'SIZE_1_2', label: '1~2호' },
  { value: 'SIZE_3', label: '3호' },
]

// ExtraOption enum 하드코딩
const EXTRA_OPTIONS = [
  { value: 'HANDWRITING_GARLAND', label: '손글씨 가랜더' },
  { value: 'HANDWRITING_CANDLE', label: '손글씨 초 추가' },
  { value: 'CLEAR_BOX', label: '투명 상자' },
]

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })

function getTimeOptions(dateStr) {
  if (!dateStr) return []
  const day = new Date(dateStr).getDay() // 0=일, 6=토
  const startH = 11
  const endH = day === 6 ? 18 : 19 // 토요일 18시, 나머지 19시
  const options = []
  for (let m = startH * 60; m <= endH * 60; m += 30) {
    const h = String(Math.floor(m / 60)).padStart(2, '0')
    const min = String(m % 60).padStart(2, '0')
    options.push(`${h}:${min}`)
  }
  return options
}

const INITIAL_FORM = {
  customerName: '',
  phone: '',
  pickupDate: '',
  pickupTime: '',
  cakeCategory: '',
  cakeSize: '',
  cakeFlavor: '',
  cakeOptions: [],
  letteringType: 'NONE',
  letteringText: '',
  bagOption: 'NONE',
  extraOptions: [],
  designDetail: '',
  referenceImageUrl: '',
}

export default function OrderPage() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [extraDropdownOpen, setExtraDropdownOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const extraDropdownRef = useRef(null)
  const letteringInputRef = useRef(null)

  useEffect(() => {
    if (letteringInputRef.current) {
      letteringInputRef.current.value = form.letteringText
    }
  }, [form.letteringText === ''])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (extraDropdownRef.current && !extraDropdownRef.current.contains(e.target)) {
        setExtraDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const toggleCakeOption = (value) => {
    setForm((f) => ({
      ...f,
      cakeOptions: f.cakeOptions.includes(value)
        ? f.cakeOptions.filter((v) => v !== value)
        : [...f.cakeOptions, value],
    }))
  }

  const toggleExtraOption = (value) => {
    setForm((f) => ({
      ...f,
      extraOptions: f.extraOptions.includes(value)
        ? f.extraOptions.filter((v) => v !== value)
        : [...f.extraOptions, value],
    }))
  }

  const buildLetteringText = () => {
    if (form.letteringType === 'NONE') return null
    return form.letteringText || null
  }

  const buildRequestNote = () => {
    const parts = []
    if (form.letteringType !== 'NONE') {
      const option = LETTERING_OPTIONS.find((o) => o.value === form.letteringType)
      if (option) parts.push(`[레터링 옵션] ${option.label} (+${option.price.toLocaleString()}원)`)
    }
    if (form.designDetail) parts.push(`[디자인 디테일] ${form.designDetail}`)
    if (form.bagOption !== 'NONE') {
      const bag = BAG_OPTIONS.find((o) => o.value === form.bagOption)
      if (bag) parts.push(`[보냉백] ${bag.label}`)
    }
    return parts.join('\n') || null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const payload = {
        customerName: form.customerName,
        phone: form.phone,
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        cakeCategory: form.cakeCategory,
        cakeSize: form.cakeSize,
        cakeFlavor: form.cakeFlavor,
        cakeOptions: form.cakeOptions,
        letteringText: buildLetteringText(),
        extraOptions: form.extraOptions,
        requestNote: buildRequestNote(),
        referenceImageUrl: form.referenceImageUrl || null,
      }
      const orderId = await createOrder(payload)
      setSubmitResult({ success: true, orderId })
      setForm(INITIAL_FORM)
    } catch (err) {
      setSubmitResult({ success: false, message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitResult?.success) {
    return (
      <div className="order-success">
        <p className="order-success-icon">✓</p>
        <h2 className="order-success-title">주문서가 접수되었습니다</h2>
        <p className="order-success-sub">
          주문 번호: <strong>#{submitResult.orderId}</strong>
        </p>
        <p className="order-success-desc">
          주문서를 확인 후 카카오톡으로 안내드립니다.<br />
          모든 주문은 픽업 사용일 전날 위고 동의한 것으로 간주되어 진행됩니다.
        </p>
        <button className="order-success-btn" onClick={() => setSubmitResult(null)}>
          새 주문서 작성
        </button>
      </div>
    )
  }

  return (
    <main className="order-page">
      <h1 className="order-title">Order Form</h1>

      <form className="order-form" onSubmit={handleSubmit} noValidate>

        {/* 이름 */}
        <div className="form-group">
          <label className="form-label">이름 / 입금자명</label>
          <input
            className="form-input"
            type="text"
            placeholder="홍길동"
            value={form.customerName}
            onChange={(e) => set('customerName', e.target.value)}
            required
          />
        </div>

        {/* 연락처 */}
        <div className="form-group">
          <label className="form-label">연락처</label>
          <input
            className="form-input"
            type="tel"
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            required
          />
        </div>

        {/* 픽업 날짜 & 시간 */}
        <div className="form-group">
          <label className="form-label">픽업 날짜 &amp; 시간</label>
          <div className="pickup-row">
            <input
              className="form-input"
              type="date"
              min={today}
              value={form.pickupDate}
              onChange={(e) => setForm((f) => ({ ...f, pickupDate: e.target.value, pickupTime: '' }))}
              required
            />
            <select
              className="form-select"
              value={form.pickupTime}
              onChange={(e) => set('pickupTime', e.target.value)}
              disabled={!form.pickupDate}
              required
            >
              <option value="" disabled>시간 선택</option>
              {getTimeOptions(form.pickupDate).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 케이크 종류 */}
        <div className="form-group">
          <label className="form-label required">케이크 종류</label>
          <select
            className="form-select"
            value={form.cakeCategory}
            onChange={(e) => set('cakeCategory', e.target.value)}
            required
          >
            <option value="" disabled>Value</option>
            {CAKE_CATEGORY.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* 사이즈 / 수량 */}
        <div className="form-group">
          <label className="form-label required">사이즈 / 수량</label>
          <p className="form-hint">* 사이즈에 따라 가격이 달라집니다</p>
          <select
            className="form-select"
            value={form.cakeSize}
            onChange={(e) => set('cakeSize', e.target.value)}
            required
          >
            <option value="" disabled>Value</option>
            {CAKE_SIZE.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* 케이크 맛 */}
        <div className="form-group">
          <label className="form-label required">케이크 맛</label>
          <select
            className="form-select"
            value={form.cakeFlavor}
            onChange={(e) => set('cakeFlavor', e.target.value)}
            required
          >
            <option value="" disabled>Value</option>
            {CAKE_FLAVOR.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* 케이크 옵션 변경 (복수 선택) */}
        <div className="form-group">
          <label className="form-label">케이크 옵션 변경</label>
          <p className="form-hint">* 중복 선택 가능</p>
          <div className="checkbox-group">
            {CAKE_OPTIONS.map((opt) => (
              <label key={opt.value} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={form.cakeOptions.includes(opt.value)}
                  onChange={() => toggleCakeOption(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 레터링 */}
        <div className="form-group">
          <label className="form-label">레터링</label>
          <div className="radio-group">
            {LETTERING_OPTIONS.map((opt) => (
              <label key={opt.value} className="radio-item">
                <input
                  type="radio"
                  name="lettering"
                  value={opt.value}
                  checked={form.letteringType === opt.value}
                  onChange={() => set('letteringType', opt.value)}
                />
                <span>
                  {opt.label}
                  {opt.price > 0 && <span className="price-badge"> (+{opt.price.toLocaleString()})</span>}
                </span>
              </label>
            ))}
          </div>
          {form.letteringType !== 'NONE' && (
            <input
              ref={letteringInputRef}
              className="form-input"
              type="text"
              placeholder="레터링 문구 입력"
              defaultValue={form.letteringText}
              onChange={(e) => {
                if (!e.nativeEvent.isComposing) set('letteringText', e.target.value)
              }}
              onCompositionEnd={(e) => set('letteringText', e.target.value)}
              style={{ marginTop: '10px' }}
            />
          )}
        </div>

        {/* 다회용 보냉백 */}
        <div className="form-group">
          <label className="form-label">다회용 보냉백</label>
          <div className="radio-group radio-group--grid">
            {BAG_OPTIONS.map((opt) => (
              <label key={opt.value} className="radio-item">
                <input
                  type="radio"
                  name="bag"
                  value={opt.value}
                  checked={form.bagOption === opt.value}
                  onChange={() => set('bagOption', opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 추가 옵션 — 드롭다운 */}
        <div className="form-group">
          <label className="form-label">추가 옵션(중복 선택 가능)</label>
          <div className="extra-dropdown" ref={extraDropdownRef}>
            <button
              type="button"
              className="extra-dropdown-trigger"
              onClick={() => setExtraDropdownOpen((v) => !v)}
            >
              <span className="extra-dropdown-value">
                {form.extraOptions.length === 0
                  ? 'Value'
                  : EXTRA_OPTIONS.filter((o) => form.extraOptions.includes(o.value))
                      .map((o) => o.label)
                      .join(', ')}
              </span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {extraDropdownOpen && (
              <div className="extra-dropdown-menu">
                {EXTRA_OPTIONS.map((opt) => (
                  <label key={opt.value} className="extra-dropdown-item">
                    <input
                      type="checkbox"
                      checked={form.extraOptions.includes(opt.value)}
                      onChange={() => toggleExtraOption(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 디자인 디테일 */}
        <div className="form-group">
          <label className="form-label">디자인 디테일</label>
          <textarea
            className="form-textarea"
            placeholder="원하시는 디자인을 자세히 적어주세요"
            value={form.designDetail}
            onChange={(e) => set('designDetail', e.target.value)}
            rows={4}
          />
        </div>

        {/* 안내 문구 */}
        <div className="order-notice">
          <p>* 주문서를 보고 만듭니다. 누락 방지를 위해 성함 후 변경 사항이 있을 시 변경된 내용 변경 후 다시 전송 부탁드립니다.</p>
          <p>* 모든 주문은 픽업 사용일 전날 위고 동의한 것으로 간주되어 진행됩니다.</p>
        </div>

        {/* 에러 */}
        {submitResult?.success === false && (
          <p className="order-error">{submitResult.message}</p>
        )}

        {/* 제출 */}
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? '제출 중...' : 'Submit'}
        </button>
      </form>
    </main>
  )
}
