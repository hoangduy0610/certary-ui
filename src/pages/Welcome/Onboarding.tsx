"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight, Info, Wallet, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react"
import "../Welcome/styles/Onboarding.scss"

export default function OnboardingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="onboarding-page">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className={`onboarding-container ${isVisible ? "visible" : "hidden"}`}>
        {/* Header */}
        <div className="header-section">
          <div className="header-icon">
            <Info className="info-icon" />
          </div>
          <h1 className="main-title">Important Information</h1>
          <p className="subtitle">Learn about key features and how to get the most out of Certary</p>
        </div>

        {/* Main Content Card */}
        <div className="main-content-card">
          {/* NFT Verification Section */}
          <div className="nft-section">
            <div className="section-header">
              <div className="section-icon">
                <Shield className="shield-icon" />
              </div>
              <h2 className="section-title">NFT Certificate Verification</h2>
            </div>

            <div className="nft-info-card">
              <div className="info-content">
                <div className="info-icon">
                  <Zap className="zap-icon" />
                </div>
                <div className="info-text">
                  <p className="description">
                    If you want to activate the NFT certificate verification feature on your account, please connect
                    your wallet by clicking{" "}
                    <button onClick={() => navigate("/connect-wallet")} className="connect-wallet-btn">
                      here
                      <ArrowRight className="arrow-icon" />
                    </button>
                  </p>

                  <div className="features-grid">
                    <div className="feature-item">
                      <CheckCircle className="check-icon" />
                      <span>Blockchain-secured certificates</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle className="check-icon" />
                      <span>Tamper-proof verification</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle className="check-icon" />
                      <span>Global accessibility</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle className="check-icon" />
                      <span>Instant verification</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="additional-features">
            <div className="feature-card certificate-card">
              <div className="card-icon">
                <CheckCircle className="icon" />
              </div>
              <h3 className="card-title">Certificate Management</h3>
              <p className="card-description">
                Organize, track, and manage all your certificates in one secure platform with advanced filtering and
                search capabilities.
              </p>
            </div>

            <div className="feature-card wallet-card">
              <div className="card-icon">
                <Wallet className="icon" />
              </div>
              <h3 className="card-title">Wallet Integration</h3>
              <p className="card-description">
                Connect your MetaMask wallet to enable blockchain features and secure your certificates with NFT
                technology.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={() => navigate("/connect-wallet")} className="primary-btn">
              <Wallet className="wallet-icon" />
              Connect Wallet Now
              <ChevronRight className="chevron-icon" />
            </button>

            <button onClick={() => navigate("/")} className="secondary-btn">
              Skip for Now
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-dots">
            <div className="dot active"></div>
            <div className="line"></div>
            <div className="dot inactive"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
