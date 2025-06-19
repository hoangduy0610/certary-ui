import {
  ArrowLeftOutlined,
  CheckOutlined,
  QrcodeOutlined,
  SearchOutlined
} from "@ant-design/icons"
import { Alert, Button, Card, Col, Divider, Input, Row, Spin, Tag, Typography, message } from "antd"
import { ethers, providers } from 'ethers'
import moment from "moment"
import type React from "react"
import { useEffect, useState } from "react"
import { abi } from "../../../common/NFTAbi"
import { Certificate, CertificateAPI, EnumCertificateStatus } from "../../../services/certificateAPI"
import "./VerifyCertificate.scss"

const { Title, Paragraph, Text } = Typography

interface VerifyCertificateProps {
  initialId?: string
  onBack?: () => void
  isForVerifier?: boolean
}

const VerifyCertificate: React.FC<VerifyCertificateProps> = ({ initialId = "", onBack, isForVerifier = false }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [certificateId, setCertificateId] = useState(initialId)
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<providers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [certificateData, setCertificateData] = useState<Certificate | null>(null)
  const [isNftVerified, setIsNftVerified] = useState<boolean | null>(null)

  // Get certificate ID from URL parameters if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const idFromUrl = urlParams.get("id")
    if (idFromUrl && !initialId) {
      setCertificateId(idFromUrl)
    }
  }, [initialId])

  const handleScanQR = () => {
    // Placeholder for QR code scanning logic
    messageApi.info("QR Code scanning is not implemented yet.")
  }

  const verifyCertificate = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await CertificateAPI.verify(id)
      if (response?.valid) {
        setCertificateData(response.certificate)
        messageApi.success("Certificate is valid and verified successfully.")
      } else {
        setCertificateData(null)
        messageApi.error("Certificate is invalid or not found.")
      }
    } catch (error) {
      console.error("Verification failed:", error)
      messageApi.error("Failed to verify the certificate. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLookup = async () => {
    if (!certificateId.trim()) {
      messageApi.error("Please enter a valid Certificate ID.")
      return
    }

    await verifyCertificate(certificateId)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  const initializeProvider = async () => {
    if (!window.ethereum) {
      messageApi.error("Please install MetaMask or another Ethereum wallet to connect.")
      return;
    }
    if (provider) return; // Provider already initialized
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const lprovider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(lprovider);
    const network = await lprovider.getNetwork();
    if (network.chainId !== 17000) { // Holesky chain ID
      messageApi.error("Please switch to the Holesky test network (Chain ID: 17000).");
      return;
    }

    const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || "";

    const lsigner = lprovider.getSigner();
    const lcontract = new ethers.Contract(contractAddress, abi, lsigner);

    setSigner(lsigner);
    setContract(lcontract);
    messageApi.success("Connected to MetaMask and contract initialized successfully.");
    messageApi.info(`Wallet address: ${await lsigner.getAddress()}`);
  };

  const verifyNft = async (certificateId?: string) => {
    if (!certificateId) {
      messageApi.error("Certificate ID is required to verify with NFT.")
      return
    }

    if (!provider || !signer || !contract) {
      messageApi.error("Provider or contract is not initialized. Please connect your wallet first.")
      return
    }

    const result = await contract?.verifyCertificate(certificateId);
    setIsNftVerified(result);
    if (result) {
      messageApi.success("NFT verification successful!")
    } else {
      messageApi.error("NFT verification failed. Please check the certificate ID.")
    }
  }

  return (
    <div className="verify-certificate-container">
      {contextHolder}
      <div className="background-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="header-section">
          {
            !isForVerifier &&
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} className="back-button" size="large">
              Back to Certificates
            </Button>
          }

          <Tag icon={<CheckOutlined />} color="success" className="security-tag" style={{ marginLeft: isForVerifier ? "auto" : "0" }}>
            Secure Verification
          </Tag>
        </div>

        {/* Main Card */}
        <Card className="main-verification-card" bordered={false}>
          {/* Top-Left button "Connect with Metamask" */}
          <Button
            variant="outlined"
            color="orange"
            style={{ position: "absolute", top: 16, right: 16 }}
            onClick={initializeProvider}
            size="large"
            disabled={!!provider}
          >
            <img src="https://etherscan.io/images/svg/brands/metamask.svg" alt="Metamask Icon" height={30} />
            Connect with Metamask
          </Button>

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

          <Divider className="section-divider" />

          {/* Verification result Section */}
          {certificateData && (
            <div className="verification-result-section">
              <Title level={3}>Verification Results</Title>

              <div className="result-details">
                <Alert
                  message={`Certificate ID: ${certificateData.certificateId}`}
                  description={
                    <p className="m-0">This certificate is valid and has been issued by <strong>{certificateData.issuer?.name || "Unknown"}</strong></p>
                  }
                  type="success"
                  showIcon
                  className="result-alert"
                />
                <Alert
                  className="certificate-info-alert mt-2"
                  type="info"
                  message={
                    <div className="certificate-info">
                      <Paragraph>
                        <Text strong>Owned by:</Text> {certificateData.owner?.firstName} {certificateData.owner?.lastName}
                      </Paragraph>
                      <Paragraph>
                        <Text strong>Issuer:</Text> {certificateData.issuer?.name || "Unknown Issuer"}
                      </Paragraph>
                      <Paragraph>
                        <Text strong>Date Issued:</Text> {moment(certificateData.createdAt).format("YYYY-MM-DD")}
                      </Paragraph>
                      <Paragraph>
                        <Text strong>Status:</Text>{" "}
                        <Tag color={[EnumCertificateStatus.ISSUED, EnumCertificateStatus.CLAIMED].includes(certificateData.status) ? "green" : "red"}>
                          {[EnumCertificateStatus.ISSUED, EnumCertificateStatus.CLAIMED].includes(certificateData.status) ? "Active" : "Revoked"}
                        </Tag>
                      </Paragraph>
                    </div>
                  }
                />

                {
                  isNftVerified !== null && (
                    <Alert
                      className="nft-verification-alert mt-2"
                      type={isNftVerified ? "success" : "error"}
                      message={
                        isNftVerified
                          ? "NFT verification successful! This certificate is linked to a valid NFT."
                          : "NFT verification failed. This certificate is not linked to a valid NFT."
                      }
                      showIcon
                    />
                  )
                }

                {/* Button Verified with NFT */}
                <Button
                  type="primary"
                  size="large"
                  className="nft-verification-button mt-2"
                  onClick={() => verifyNft(certificateData.certificateId)}
                >
                  Verify with NFT
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default VerifyCertificate
