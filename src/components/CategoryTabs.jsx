import './CategoryTabs.css'

const TABS = [
  { value: 'ALL', label: '전체' },
  { value: 'DESIGN', label: '디자인' },
  { value: 'HEART', label: '하트' },
  { value: 'FLOWER', label: '생화' },
  { value: 'FLOWER_JELLY', label: '생화 젤리' },
  { value: 'FLOWER_CUPCAKE', label: '생화 컵케이크' },
  { value: 'PETIT', label: '쁘띠' },
]

export default function CategoryTabs({ active, onChange }) {
  return (
    <nav className="category-tabs">
      <div className="category-tabs-inner">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={`category-tab${active === tab.value ? ' active' : ''}`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
