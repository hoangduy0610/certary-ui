"use client"

import { Award, ChevronRight, Shield, Sparkles, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../../hooks/useUserInfo"
import "../Welcome/styles/Welcome.scss"

export default function WelcomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  const { userInfo } = useUserInfo();

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="welcome-page">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Main Content */}
      <div className={`welcome-content ${isVisible ? "visible" : "hidden"}`}>
        {/* Welcome Icon */}
        <div className="welcome-icon-section">
          <div className="icon-container">
            <div className="main-icon">
              <Sparkles className="sparkles-icon" />
            </div>
            <div className="badge-icon">
              <Award className="award-icon" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="welcome-text">
          <h1 className="main-title">Welcome</h1>
          <h2 className="user-name">{userInfo.firstName} {userInfo.lastName}</h2>
          <p className="to-text">to</p>
          <div className="brand-name">Certary</div>
        </div>

        {/* Features Preview */}
        <div className="features-preview">
          <div className="feature-card">
            <div className="feature-icon manage-icon">
              <Award className="icon" />
            </div>
            <h3 className="feature-title">Manage Certificates</h3>
            <p className="feature-description">Organize and track all your certificates in one place</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon nft-icon">
              <Shield className="icon" />
            </div>
            <h3 className="feature-title">NFT Verification</h3>
            <p className="feature-description">Secure blockchain-based certificate verification</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon community-icon">
              <Users className="icon" />
            </div>
            <h3 className="feature-title">Community Forum</h3>
            <p className="feature-description">Connect with other professionals and share knowledge</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="cta-section">
          <button onClick={() => navigate("/onboarding")} className="get-started-btn">
            Get Started
            <ChevronRight className="chevron-icon" />
          </button>
        </div>

        {/* Skip Option */}
        <div className="skip-option">
          <button onClick={() => navigate("/")} className="skip-btn">
            Skip introduction
          </button>
        </div>
      </div>
    </div>
  )
}
