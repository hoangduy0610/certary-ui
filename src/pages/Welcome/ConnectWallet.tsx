"use client"

import { AlertCircle, ArrowLeft, CheckCircle, ExternalLink, Shield, Wallet, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import metamaskLogo from "../../components/images/metamask.png"
import { useUserInfo } from "../../hooks/useUserInfo"
import "../Welcome/styles/ConnectWallet.scss"
import { UserAPI } from "../../services/userAPI"

export default function ConnectWalletPage() {
    const [isVisible, setIsVisible] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState("")
    const [error, setError] = useState("")
    const { userInfo } = useUserInfo()

    // Get search params
    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    useEffect(() => {
        setIsVisible(true)
        checkWalletConnection()
    }, [userInfo])

    const checkWalletConnection = async () => {
        if (userInfo?.walletAddress) {
            setWalletAddress(userInfo.walletAddress)
            setIsConnected(true)
            return
        }
    }

    const connectWallet = async () => {
        if (typeof window === "undefined" || !(window as any).ethereum) {
            setError("MetaMask is not installed. Please install MetaMask to continue.")
            return
        }

        setIsConnecting(true)
        setError("")

        try {
            const accounts = await (window as any).ethereum.request({
                method: "eth_requestAccounts",
            })

            if (accounts.length > 0) {
                const response = await UserAPI.updateWallet({ walletAddress: accounts[0] });
                setWalletAddress(response?.walletAddress || accounts[0])
                setIsConnected(true)
                setIsConnecting(false)
            }
        } catch (error: any) {
            setIsConnecting(false)
            if (error.code === 4001) {
                setError("Connection rejected. Please try again.")
            } else {
                setError("Failed to connect wallet. Please try again.")
            }
        }
    }

    return (
        <div className="connect-wallet-page">
            {/* Background Elements */}
            <div className="background-elements">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
            </div>

            <div className={`wallet-container ${isVisible ? "visible" : "hidden"}`}>
                {/* Back Button */}
                <div className="back-button">
                    <button onClick={() => navigate(searchParams?.get("redirect") || "/onboarding")} className="back-btn">
                        <ArrowLeft className="arrow-icon" />
                        Back to {searchParams?.get("backTitle") || "Onboarding"}
                    </button>
                </div>

                {/* Header */}
                <div className="header-section">
                    <div className="header-icon">
                        <Wallet className="wallet-icon" />
                    </div>
                    <h1 className="main-title">Connect Your Wallet</h1>
                    <p className="subtitle">Connect your MetaMask wallet to enable NFT certificate verification</p>
                </div>

                {/* Main Card */}
                <div className="main-card">
                    {!isConnected ? (
                        <div className="disconnected-state">
                            {/* MetaMask Info */}
                            <div className="metamask-info">
                                <div className="metamask-logo">
                                    <img src={metamaskLogo} alt="MetaMask" className="logo-img" />
                                </div>
                                <h2 className="metamask-title">MetaMask Wallet</h2>
                                <p className="metamask-description">
                                    Connect your MetaMask wallet to access blockchain features and secure your certificates with NFT
                                    technology.
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="benefits-section">
                                <div className="benefit-card security-card">
                                    <div className="benefit-icon">
                                        <Shield className="icon" />
                                    </div>
                                    <div className="benefit-content">
                                        <h3 className="benefit-title">Secure Verification</h3>
                                        <p className="benefit-description">Blockchain-based certificate authentication</p>
                                    </div>
                                </div>

                                <div className="benefit-card access-card">
                                    <div className="benefit-icon">
                                        <Zap className="icon" />
                                    </div>
                                    <div className="benefit-content">
                                        <h3 className="benefit-title">Instant Access</h3>
                                        <p className="benefit-description">Quick and easy certificate verification</p>
                                    </div>
                                </div>

                                <div className="benefit-card recognition-card">
                                    <div className="benefit-icon">
                                        <CheckCircle className="icon" />
                                    </div>
                                    <div className="benefit-content">
                                        <h3 className="benefit-title">Global Recognition</h3>
                                        <p className="benefit-description">Internationally accepted verification standard</p>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="error-message">
                                    <AlertCircle className="error-icon" />
                                    <p className="error-text">{error}</p>
                                </div>
                            )}

                            {/* Connect Button Section */}
                            <div className="connect-section">
                                <button onClick={connectWallet} disabled={isConnecting} className="connect-btn">
                                    {isConnecting ? (
                                        <>
                                            <div className="loading-spinner"></div>
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <Wallet className="wallet-icon" />
                                            Connect with MetaMask
                                        </>
                                    )}
                                </button>

                                <p className="install-link">
                                    Don't have MetaMask?{" "}
                                    <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="link">
                                        Install here
                                        <ExternalLink className="external-icon" />
                                    </a>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="connected-state">
                            {/* Connected State */}
                            <div className="success-icon">
                                <CheckCircle className="check-icon" />
                            </div>
                            <h2 className="success-title">Wallet Connected!</h2>
                            <p className="success-description">Your MetaMask wallet has been successfully connected.</p>

                            <div className="address-display">
                                <p className="address-label">Connected Address:</p>
                                <p className="address-value">
                                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                </p>
                            </div>

                            <div className="action-buttons">
                                <button onClick={() => navigate(searchParams?.get("redirect") || "/")} className="continue-btn">
                                    {searchParams?.get("continueText") || "Continue to Dashboard"}
                                </button>
                                {/* <button onClick={disconnectWallet} className="disconnect-btn">
                                    Disconnect
                                </button> */}
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Indicator */}
                {
                    false &&
                    <div className="progress-indicator">
                        <div className="progress-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="line"></div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
