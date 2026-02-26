import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoLanding from '../assets/logo-landing.jpg'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="landing-page" onClick={() => navigate('/home')}>
      <div className="landing-content">
        <img src={logoLanding} alt="Oh, Muse Cake" className="landing-logo" />
      </div>
    </div>
  )
}
