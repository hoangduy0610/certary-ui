import { MonitorOutlined } from "@ant-design/icons"
import { Button, Modal, Tag, Timeline, message } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Certificate, CertificateAPI, EnumCertificateStatus } from "../../services/certificateAPI"
import { handleDownloadCertificate } from "../../utils/file"
import { renderQr } from "../../utils/uri"
import "./certificate-details.scss"

interface CertificateDetailProps {
  onClose?: () => void
}

export default function CertificateDetail({ onClose }: CertificateDetailProps) {
  const { id: certificateId } = useParams();
  const [activeTab, setActiveTab] = useState("overview")
  const [cert, setCert] = useState<Certificate>();
  const [messageApi, contextHolder] = message.useMessage()
  const [showShareModal, setShowShareModal] = useState(false)
  const navigate = useNavigate()

  const fetchCertificate = async (id: string) => {
    try {
      if (!id) {
        console.error("Certificate ID is required")
        return
      }
      // Fetch certificate details by ID
      const intId = parseInt(id)
      const data = await CertificateAPI.getById(intId)
      setCert(data)
    } catch (error) {
      console.error("Error fetching certificate:", error)
    }
  }

  useEffect(() => {
    fetchCertificate(certificateId || "")
  }, [])

  const handleClose = () => {
    navigate("/my-certificates")
    onClose?.()
  }

  const mapStatusToColor = (status?: EnumCertificateStatus) => {
    switch (status) {
      case EnumCertificateStatus.DRAFT:
        return "#4ade80" // Green
      case EnumCertificateStatus.ISSUED:
        return "#60a5fa" // Blue
      case EnumCertificateStatus.CLAIMED:
        return "#f87171" // Red
      case EnumCertificateStatus.REVOKED:
        return "#fbbf24" // Yellow
      case EnumCertificateStatus.REJECTED:
        return "#a78bfa" // Purple
      case EnumCertificateStatus.EXPIRED:
        return "#f87171" // Red for expired
      default:
        return "#9ca3af" // Gray for unknown status
    }
  }

  const generateGradient = () => {
    const baseColors = [
      ["#4338ca", "#6366f1"],
      ["#4f46e5", "#818cf8"],
      ["#6d28d9", "#a78bfa"],
      ["#7c3aed", "#c4b5fd"],
      ["#5b21b6", "#8b5cf6"],
      ["#4c1d95", "#7c3aed"],
    ]
    return baseColors[Math.floor(Math.random() * baseColors.length)]
  }

  const [color1, color2] = generateGradient()
  const gradient = `linear-gradient(135deg, ${color1}, ${color2})`

  const handleDownload = async () => {
    if (!cert) {
      messageApi.error("Certificate data is not available")
      return
    }
    await handleDownloadCertificate(cert, messageApi)
  }

  const handleShare = () => {
    if (!cert) {
      messageApi.error("Certificate data is not available")
      return
    }
    setShowShareModal(true);
  }


  return (
    <div className="certificateDetailOverlay">
      {contextHolder}
      <div className="certificateDetailModal">
        <div className="modalHeader">
          <button className="closeButton" onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modalContent">
          <div className="certificatePreview">
            <div className="certificateFrame" style={{ flex: 1, background: gradient }}>
              <div className="certificateContent">
                <div className="certificateLogo">
                  <div className="logoPlaceholder">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="certificateTitle">{cert?.title}</h2>
                <p className="certificateIssuer">Issued by {cert?.issuer?.name}</p>
                <div className="certificateId">ID: {cert?.certificateId}</div>
                <div className="certificateDates">
                  <span>Issued: {moment(cert?.createdAt).format("YYYY-MM-DD")}</span>
                  <span>Expires: {cert?.expiredAt ? moment(cert?.expiredAt).format("YYYY-MM-DD") : "No Expire"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="certificateInfo">
            <div className="infoHeader">
              <div className="titleSection">
                <h1>{cert?.title}</h1>
                <div className="statusBadge">
                  {/* <span className={`status ${cert?.status.toLowerCase()}`}>{cert?.status}</span> */}
                  <Tag color={mapStatusToColor((!cert?.expiredAt || moment(cert?.expiredAt).isAfter(moment())) ? cert?.status : EnumCertificateStatus.EXPIRED)}>
                    {(!cert?.expiredAt || moment(cert?.expiredAt).isAfter(moment())) ? cert?.status : EnumCertificateStatus.EXPIRED}
                  </Tag>
                  <span className="category">Certificate</span>
                </div>
              </div>
              <div className="actionButtons">
                <button className="actionBtn primary" onClick={() => navigate(`/verify-certificate?id=${cert?.certificateId}`)}>
                  <MonitorOutlined />
                  Verify
                </button>
                <button className="actionBtn download" onClick={handleDownload}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>
                <button className="actionBtn secondary" onClick={handleShare}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share
                </button>
              </div>
            </div>

            <div className="tabNavigation">
              <button
                className={`tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              {/* <button
                className={`tab ${activeTab === "skills" ? "active" : ""}`}
                onClick={() => setActiveTab("skills")}
              >
                Skills
              </button> */}
            </div>

            <div className="tabContent">
              {activeTab === "overview" && (
                <div className="overviewTab">
                  <div className="section">
                    <h3>Description</h3>
                    <p>{cert?.description}</p>
                  </div>
                  <div className="section">
                    <h3>Key Information</h3>
                    <div className="infoGrid">
                      <div className="infoItem">
                        <span className="label">Issued By</span>
                        <span className="value">{cert?.issuer?.name}</span>
                      </div>
                      <div className="infoItem">
                        <span className="label">Issue Date</span>
                        <span className="value">{moment(cert?.createdAt).format("YYYY-MM-DD")}</span>
                      </div>
                      <div className="infoItem">
                        <span className="label">Expiry Date</span>
                        <span className="value">{cert?.expiredAt ? moment(cert?.expiredAt).format("YYYY-MM-DD") : "No Expire"}</span>
                      </div>
                      <div className="infoItem">
                        <span className="label">Credential ID</span>
                        <span className="value">{cert?.certificateId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="detailsTab">
                  <div className="section">
                    <h3>Certificate Details</h3>
                    <div className="detailsList">
                      <div className="detailItem">
                        <span className="label">Certificate Type</span>
                        <span className="value">{cert?.certificateType.name}</span>
                      </div>
                      <div className="detailItem">
                        <span className="label">Duration</span>
                        <span className="value">{cert?.expiredAt ? moment(cert?.expiredAt).diff(moment(cert?.createdAt), 'days') + ' days' : 'No Expiration'}</span>
                      </div>
                      {/* <div className="detailItem">
                        <span className="label">Level</span>
                        <span className="value">Intermediate</span>
                      </div>
                      <div className="detailItem">
                        <span className="label">CPE Credits</span>
                        <span className="value">40 Hours</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="section">
                    <h3>Certificate Logs</h3>
                    <Timeline
                      items={cert?.logs?.map((log) => ({
                        children: (<p><strong>[{log.event}] - </strong>{log.message}</p>),
                      })) || []}
                    />
                  </div>
                  {/* <div className="section">
                    <h3>Verification</h3>
                    <p>
                      This certificate can be verified using the credential ID above or by visiting the verification
                      URL.
                    </p>
                    {cert?.certificateId && (
                      <a
                        href={`https://verify.example.com/${cert.certificateId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="verificationLink"
                      >
                        Verify Certificate Online
                      </a>
                    )}
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Share Certificate"
        open={showShareModal}
        onCancel={() => setShowShareModal(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="shareModalContent d-flex flex-column justify-content-center align-items-center gap-2">
          <p>Share your certificate details with others:</p>
          <img src={renderQr(window.location.href)} alt="QR Code" className="qrCode" />
          <Button
            className="shareButton mt-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              messageApi.success("Certificate details copied to clipboard!")
              setShowShareModal(false)
            }}
          >
            Copy Link to Clipboard
          </Button>
        </div>
      </Modal>
    </div>
  )
}
