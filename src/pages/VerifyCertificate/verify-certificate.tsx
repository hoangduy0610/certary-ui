import type React from "react"

import { BrowserQRCodeReader } from "@zxing/browser"
import { Button, Modal, Result, message } from "antd"
import { ethers } from "ethers"
import {
  Award,
  Building,
  Calendar,
  Camera,
  CheckCircle,
  Copy,
  Hash,
  QrCode,
  Search,
  Shield,
  Sparkles,
  Upload,
  User,
  XCircle,
} from "lucide-react"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { QrReader } from "react-qr-reader"
import { abi } from "../../common/NFTAbi"
import Footer from "../../components/Footer/footer"
import { Header } from "../../components/Header/Header"
import { Certificate, CertificateAPI, EnumCertificateStatus } from "../../services/certificateAPI"
import "./verify-certificate.scss"

export enum EnumNFTStatus {
  DRAFT,
  ISSUED,
  REVOKED
}

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isOpenNFTResult, setIsOpenNFTResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [certificate, setCertificate] = useState<Certificate>()
  const [isVerified, setIsVerified] = useState(false)
  const [mayVerifyNft, setMayVerifyNft] = useState(false)
  const [isNftVerified, setIsNftVerified] = useState(false)
  const [error, setError] = useState("")
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const initialCertificateId = queryParams.get("id") || "";

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    if (initialCertificateId) {
      setCertificateId(initialCertificateId);
      verifyCertificate(initialCertificateId)
    }
  }, [initialCertificateId])

  const startScanning = async () => {
    try {
      setIsScanning(true)
      setError("")

      // Start QR detection
      detectQRCode()
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
  }

  const detectQRCode = () => {

  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    const file = files ? files[0] : null;
    if (!file) return;

    setError('');
    const url = URL.createObjectURL(file);

    try {
      const codeReader = new BrowserQRCodeReader();
      const imageElement = document.createElement('img');

      imageElement.src = url;
      imageElement.onload = async () => {
        try {
          const decoded = await codeReader.decodeFromImageElement(imageElement);
          console.log(decoded.getText());
        } catch (err) {
          setError('Could not decode QR code.');
        }
      };
    } catch (err) {
      setError('Failed to process image.');
    }
  }

  const verifyCertificate = async (initialCertificateId?: string) => {
    const certId = initialCertificateId || certificateId;
    if (!certId.trim()) {
      setError("Please enter a certificate ID")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await CertificateAPI.verify(certId.trim())
      setCertificate(response.certificate)
      setIsVerified(response.valid)
      setMayVerifyNft(response.nftVerified)
    } catch (err) {
      setError("Certificate not found or verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const initWallet = async () => {
    if (!window.ethereum) {
      messageApi.error("Please install MetaMask or another Ethereum wallet to connect.")
      return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const t_provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await t_provider.getNetwork();
    if (network.chainId !== 17000) { // Holesky chain ID
      messageApi.error("Please switch to the Holesky test network (Chain ID: 17000).");
      return;
    }
    const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || "";
    const t_signer = t_provider.getSigner();
    const t_contract = new ethers.Contract(contractAddress, abi, t_signer);
    setContract(t_contract);
    setProvider(t_provider);
    setSigner(t_signer);
  }

  const verifyNft = async (certificateId?: string) => {
    if (!certificateId) {
      messageApi.error("Certificate ID is required to verify with NFT.")
      return
    }

    if (!provider || !signer || !contract) {
      messageApi.error("Provider or contract is not initialized. Please connect your wallet first.")
      return
    }

    const result: {
      valid: boolean
      expireAt?: BigInt
      issuedAt: BigInt,
      status: EnumNFTStatus,
      currentOwner: string,
    } = await contract?.verifyCertificate(certificateId);
    const isValid = result.valid && moment(parseInt(result.expireAt?.toString() || "0") * 1000).isAfter(moment())
    setIsNftVerified(isValid);
    setIsOpenNFTResult(true);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: EnumCertificateStatus) => {
    switch (status) {
      case EnumCertificateStatus.DRAFT:
        return 'bg-blue';
      case EnumCertificateStatus.REJECTED:
        return 'bg-orange';
      case EnumCertificateStatus.ISSUED:
        return 'bg-green';
      case EnumCertificateStatus.CLAIMED:
        return 'bg-purple';
      case EnumCertificateStatus.REVOKED:
        return 'bg-red';
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
      {contextHolder}
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
                <div className="input-group mb-0">
                  <label className="input-label">
                    <Hash className="w-4 h-4" />
                    Certificate ID
                  </label>
                </div>
                <div className="input-group">
                  <div className="input-wrapper w-100">
                    <input
                      type="text"
                      placeholder="Enter certificate ID (e.g., CERT-ABC123)"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="certificate-input"
                    />
                    <button onClick={() => verifyCertificate()} disabled={isLoading} className="verify-button">
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

                {/* <div className="divider">
                  <span className="divider-text">OR</span>
                </div>

                <div className="qr-section">
                  <label className="qr-label">
                    <QrCode className="w-4 h-4" />
                    QR Code Scanner
                  </label>

                  <div className="qr-buttons">
                    <button
                      onClick={isScanning ? stopScanning : startScanning}
                      className={`qr-button ${isScanning ? "scanning" : ""}`}
                    >
                      <Camera className="w-4 h-4" />
                      {isScanning ? "Stop Scanning" : "Scan QR Code"}
                    </button>

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
                    style={{ display: "none" }}
                  />
                </div> */}

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
                    {isScanning &&
                      <QrReader
                        constraints={{ facingMode: "user" }}
                        onResult={(result, error) => {
                          if (!isScanning) return;
                          console.log("QR Result:", result, "Error:", error);
                        }}
                      />
                    }
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
                    <p className="detail-value">{certificate.owner?.firstName} {certificate.owner?.lastName}</p>
                  </div>

                  <div className="detail-group">
                    <label className="detail-label">
                      <Building className="w-4 h-4" />
                      Issued By
                    </label>
                    <p className="detail-value">{certificate.issuer?.name}</p>
                  </div>

                  <div className="detail-group">
                    <label className="detail-label">
                      <Calendar className="w-4 h-4" />
                      Issue Date
                    </label>
                    <p className="detail-value">{moment(certificate.createdAt).format("DD-MM-YYYY")}</p>
                  </div>

                  {certificate.expiredAt && (
                    <div className="detail-group">
                      <label className="detail-label">
                        <Calendar className="w-4 h-4" />
                        Expiry Date
                      </label>
                      <p className="detail-value">{moment(certificate.expiredAt).format("DD-MM-YYYY")}</p>
                    </div>
                  )}

                  <div className="detail-group">
                    <label className="detail-label">
                      <Hash className="w-4 h-4" />
                      Certificate ID
                    </label>
                    <div className="detail-id">
                      <span className="id-text">{certificate.certificateId}</span>
                      <button className="copy-button" onClick={() => copyToClipboard(certificate.certificateId || "")}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="description-section">
                  <label className="section-label">Description</label>
                  <p className="description-text">{certificate.description}</p>
                </div>

                {/* <div className="skills-section">
                  <label className="section-label">Skills & Competencies</label>
                  <div className="skills-grid">
                    {certificate.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div> */}

                {/* <div className="hash-section">
                  <label className="section-label">Verification Hash</label>
                  <div className="hash-container">
                    <span className="hash-text">{certificate.verificationHash}</span>
                    <button className="copy-button" onClick={() => copyToClipboard(certificate.verificationHash)}>
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div> */}

                {isVerified && (
                  <div className="status-alert valid">
                    <CheckCircle className="h-5 w-5" />✨ This certificate is valid and has been successfully verified
                    through our secure system.
                  </div>
                )}

                {mayVerifyNft && (
                  <div className="status-alert valid mt-3">
                    <CheckCircle className="h-5 w-5" />✨ This certificate has NFT Validation, you can verify it now.
                    <Button
                      variant="outlined"
                      color="orange"
                      onClick={initWallet}
                      size="large"
                      disabled={!!provider}
                    >
                      <img src="https://etherscan.io/images/svg/brands/metamask.svg" alt="Metamask Icon" height={30} />
                      Connect with Metamask
                    </Button>
                    <Button
                      variant="outlined"
                      color="orange"
                      onClick={() => verifyNft(certificate.certificateId)}
                      size="large"
                      disabled={!provider}
                    >
                      <img src="https://etherscan.io/images/svg/brands/metamask.svg" alt="Metamask Icon" height={30} />
                      Verify NFT
                    </Button>
                  </div>
                )}

                {(certificate.expiredAt && moment(certificate.expiredAt).isBefore(moment())) && (
                  <div className="status-alert expired mt-3">
                    <XCircle className="h-5 w-5" />
                    ⚠️ This certificate has expired and is no longer valid.
                  </div>
                )}

                {certificate.status === "revoked" && (
                  <div className="status-alert revoked mt-3">
                    <XCircle className="h-5 w-5" />🚫 This certificate has been revoked and is no longer valid.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Certificate Verification Results"
        open={isOpenNFTResult}
        onCancel={() => setIsOpenNFTResult(false)}
        footer={[
          <Button key="close" onClick={() => setIsOpenNFTResult(false)}>
            Close
          </Button>,
        ]}
      >
        <Result
          status={isNftVerified ? "success" : "error"}
          title={isNftVerified ? "NFT Verification Successful!" : "NFT Verification Failed"}
          subTitle={
            isNftVerified
              ? (
                <div>
                  <p>Certificate is verified with NFT.</p>
                  <p>You can see NFT at: <a target="_blank" href={`https://holesky.etherscan.io/nft/${process.env.REACT_APP_NFT_CONTRACT_ADDRESS}/${certificate?.tokenId}`}>here</a></p>
                </div>
              )
              : "Please check the certificate ID or connect your wallet."
          }
        />
      </Modal>
      <Footer />
    </div>
  )
}
