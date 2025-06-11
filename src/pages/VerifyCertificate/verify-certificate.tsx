import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  QrCode,
  Search,
  CheckCircle,
  XCircle,
  Camera,
  Upload,
  Copy,
  Shield,
  Award,
  Calendar,
  User,
  Building,
  Hash,
  Sparkles,
} from "lucide-react"
import "./verify-certificate.scss"
import { Header } from "../../components/Header/Header"

interface Certificate {
  id: string
  title: string
  recipientName: string
  issuerName: string
  issueDate: string
  expiryDate?: string
  status: "valid" | "expired" | "revoked"
  description: string
  skills: string[]
  verificationHash: string
}

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [error, setError] = useState("")
  const [hasCamera, setHasCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .then((stream) => {
        setHasCamera(true)
        stream.getTracks().forEach((track) => track.stop())
      })
      .catch(() => setHasCamera(false))
  }, [])

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
        setError("")

        // Start QR detection
        detectQRCode()
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const detectQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)

      // In a real implementation, you would use a QR code detection library
      // For demo purposes, we'll simulate QR detection
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)

      // Simulate QR code detection (replace with actual QR library)
      setTimeout(() => {
        if (isScanning && Math.random() > 0.95) {
          // Simulate random detection
          const mockId = "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase()
          setCertificateId(mockId)
          stopScanning()
        }
      }, 100)
    }

    if (isScanning) {
      requestAnimationFrame(detectQRCode)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // In a real implementation, you would decode QR from the image
        // For demo purposes, simulate QR detection from image
        const mockId = "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase()
        setCertificateId(mockId)
      }
      reader.readAsDataURL(file)
    }
  }

  const verifyCertificate = async () => {
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID")
      return
    }

    setIsLoading(true)
    setError("")
    setCertificate(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock certificate data
      const mockCertificate: Certificate = {
        id: certificateId,
        title: "Advanced Web Development Certificate",
        recipientName: "John Doe",
        issuerName: "Tech Academy",
        issueDate: "2024-01-15",
        expiryDate: "2026-01-15",
        status: Math.random() > 0.3 ? "valid" : Math.random() > 0.5 ? "expired" : "revoked",
        description:
          "This certificate validates the completion of advanced web development course including React, Node.js, and database management.",
        skills: ["React", "Node.js", "MongoDB", "TypeScript", "REST APIs"],
        verificationHash: "sha256:" + Math.random().toString(36).substr(2, 32),
      }

      setCertificate(mockCertificate)
    } catch (err) {
      setError("Certificate not found or verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "valid"
      case "expired":
        return "expired"
      case "revoked":
        return "revoked"
      default:
        return ""
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-5 h-5" />
      case "expired":
        return <XCircle className="w-5 h-5" />
      case "revoked":
        return <XCircle className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="verify-certificate-page">
      {/* Hero Section */}
      <Header active="verify-certificate" />
      <div className="hero-section">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>

        <div className="container mx-auto px-4">
          <div className="hero-content">
            <div className="hero-badge">
              <Shield className="w-4 h-4" />
              <span>Secure Verification</span>
            </div>

            <h1 className="hero-title">
              Verify Certificate
              <Sparkles className="sparkle-icon w-8 h-8" />
            </h1>
            <p className="hero-subtitle">
              Instantly verify the authenticity of any certificate using our advanced verification system
            </p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container mx-auto px-4">
          {/* Centered Verification Section */}
          <div className="verification-container">
            <div className="verification-card">
              <div className="card-header">
                <div className="card-title">
                  <div className="title-icon">
                    <Search className="w-6 h-6" />
                  </div>
                  Certificate Verification
                </div>
                <p className="card-description">
                  Enter the certificate ID or use our QR scanner for instant verification
                </p>
              </div>
              <div className="card-content">
                <div className="input-group">
                  <label className="input-label">
                    <Hash className="w-4 h-4" />
                    Certificate ID
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Enter certificate ID (e.g., CERT-ABC123)"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="certificate-input"
                    />
                    <button onClick={verifyCertificate} disabled={isLoading} className="verify-button">
                      {isLoading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Verify
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="divider">
                  <span className="divider-text">OR</span>
                </div>

                <div className="qr-section">
                  <label className="qr-label">
                    <QrCode className="w-4 h-4" />
                    QR Code Scanner
                  </label>

                  <div className="qr-buttons">
                    {hasCamera && (
                      <button
                        onClick={isScanning ? stopScanning : startScanning}
                        className={`qr-button ${isScanning ? "scanning" : ""}`}
                      >
                        <Camera className="w-4 h-4" />
                        {isScanning ? "Stop Scanning" : "Scan QR Code"}
                      </button>
                    )}

                    <button onClick={() => fileInputRef.current?.click()} className="qr-button">
                      <Upload className="w-4 h-4" />
                      Upload QR Image
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {error && (
                  <div className="error-alert">
                    <XCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QR Scanner Section */}
          {isScanning && (
            <div className="flex justify-center mt-8">
              <div className="qr-scanner-card max-w-md w-full">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Code Scanner
                  </h3>
                  <div className="scanner-video">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="scanner-overlay">
                      <div className="corner top-left"></div>
                      <div className="corner top-right"></div>
                      <div className="corner bottom-left"></div>
                      <div className="corner bottom-right"></div>
                      <div className="scan-line"></div>
                    </div>
                  </div>
                  <p className="scanner-instruction">Position the QR code within the frame for automatic detection</p>
                </div>
              </div>
            </div>
          )}

          {/* Certificate Details */}
          {certificate && (
            <div className="certificate-details mt-8">
              <div className="certificate-header">
                <div className="header-content">
                  <div className="header-title">
                    <div className="status-icon">{getStatusIcon(certificate.status)}</div>
                    Certificate Details
                  </div>
                  <div className={`status-badge ${getStatusColor(certificate.status)}`}>
                    {certificate.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="certificate-content">
                <div className="details-grid">
                  <div className="detail-group">
                    <label className="detail-label">
                      <Award className="w-4 h-4" />
                      Certificate Title
                    </label>
                    <p className="detail-value">{certificate.title}</p>
                  </div>

                  <div className="detail-group">
                    <label className="detail-label">
                      <User className="w-4 h-4" />
                      Recipient
                    </label>
                    <p className="detail-value">{certificate.recipientName}</p>
                  </div>

                  <div className="detail-group">
                    <label className="detail-label">
                      <Building className="w-4 h-4" />
                      Issued By
                    </label>
                    <p className="detail-value">{certificate.issuerName}</p>
                  </div>

                  <div className="detail-group">
                    <label className="detail-label">
                      <Calendar className="w-4 h-4" />
                      Issue Date
                    </label>
                    <p className="detail-value">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                  </div>

                  {certificate.expiryDate && (
                    <div className="detail-group">
                      <label className="detail-label">
                        <Calendar className="w-4 h-4" />
                        Expiry Date
                      </label>
                      <p className="detail-value">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  <div className="detail-group">
                    <label className="detail-label">
                      <Hash className="w-4 h-4" />
                      Certificate ID
                    </label>
                    <div className="detail-id">
                      <span className="id-text">{certificate.id}</span>
                      <button className="copy-button" onClick={() => copyToClipboard(certificate.id)}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="description-section">
                  <label className="section-label">Description</label>
                  <p className="description-text">{certificate.description}</p>
                </div>

                <div className="skills-section">
                  <label className="section-label">Skills & Competencies</label>
                  <div className="skills-grid">
                    {certificate.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hash-section">
                  <label className="section-label">Verification Hash</label>
                  <div className="hash-container">
                    <span className="hash-text">{certificate.verificationHash}</span>
                    <button className="copy-button" onClick={() => copyToClipboard(certificate.verificationHash)}>
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {certificate.status === "valid" && (
                  <div className="status-alert valid">
                    <CheckCircle className="h-5 w-5" />✨ This certificate is valid and has been successfully verified
                    through our secure system.
                  </div>
                )}

                {certificate.status === "expired" && (
                  <div className="status-alert expired">
                    <XCircle className="h-5 w-5" />
                    ⚠️ This certificate has expired and is no longer valid.
                  </div>
                )}

                {certificate.status === "revoked" && (
                  <div className="status-alert revoked">
                    <XCircle className="h-5 w-5" />🚫 This certificate has been revoked and is no longer valid.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
