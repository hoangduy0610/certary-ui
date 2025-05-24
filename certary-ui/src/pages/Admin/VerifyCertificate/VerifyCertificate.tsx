import type React from "react"
import { useState, useEffect } from "react"
import { Input, Button, Card, Tag, Divider, Typography, Row, Col, Alert, Statistic, Spin } from "antd"
import {
  QrcodeOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import "./VerifyCertificate.scss"

const { Title, Paragraph, Text } = Typography

interface VerifyCertificateProps {
  initialId?: string
  onBack?: () => void
}

const VerifyCertificate: React.FC<VerifyCertificateProps> = ({ initialId = "", onBack }) => {
  const [certificateId, setCertificateId] = useState(initialId)
  const [isLoading, setIsLoading] = useState(false)

  // Get certificate ID from URL parameters if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const idFromUrl = urlParams.get("id")
    if (idFromUrl && !initialId) {
      setCertificateId(idFromUrl)
    }
  }, [initialId])

  const handleScanQR = () => {
    alert("QR Scanner will be implemented soon!")
  }

  const handleLookup = async () => {
    if (!certificateId.trim()) {
      alert("Please enter a certificate ID")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      alert(`Verifying certificate ID: ${certificateId}`)
      setIsLoading(false)
    }, 1500)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }



  const stats = [
    { title: "50K+", description: "Certificates Verified" },
    { title: "99.9%", description: "Accuracy Rate" },
    { title: "24/7", description: "System Availability" },
    { title: "<2s", description: "Average Response" },
  ]

  return (
    <div className="verify-certificate-container">
      <div className="background-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="header-section">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} className="back-button" size="large">
            Back to Certificates
          </Button>

          <Tag icon={<CheckOutlined />} color="success" className="security-tag">
            Secure Verification
          </Tag>
        </div>

        {/* Main Card */}
        <Card className="main-verification-card" bordered={false}>
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-icon">
              <div className="icon-background">
                <CheckOutlined />
              </div>
            </div>

            <Title level={1} className="hero-title">
              Certificate Verification Portal
            </Title>
          </div>

          <Divider className="section-divider" />

          {/* Verification Form */}
          <div className="verification-section">
            <div className="section-header">
              <Title level={3}>Start Verification Process</Title>
              <Paragraph>Choose your preferred verification method below</Paragraph>
            </div>

            <div className="form-section">
              <div className="input-section">
                <Text strong className="input-label">
                  Certificate ID
                </Text>
                <Input
                  size="large"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter your certificate ID (e.g., CERT-2024-ABC123)"
                  className="certificate-input"
                  suffix={<SearchOutlined className="input-icon" />}
                  onPressEnter={handleLookup}
                />
                <Text type="secondary" className="input-help">
                  Certificate IDs are typically 10-20 characters long and may contain letters, numbers, and hyphens.
                </Text>
              </div>

              <Row gutter={16} className="action-buttons">
                <Col xs={24} sm={12}>
                  <Button size="large" icon={<QrcodeOutlined />} onClick={handleScanQR} className="qr-button" block>
                    Scan QR Code
                  </Button>
                </Col>
                <Col xs={24} sm={12}>
                  <Button
                    type="primary"
                    size="large"
                    icon={isLoading ? <Spin size="small" /> : <SearchOutlined />}
                    onClick={handleLookup}
                    disabled={!certificateId.trim() || isLoading}
                    className="verify-button"
                    block
                    loading={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify Certificate"}
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VerifyCertificate
