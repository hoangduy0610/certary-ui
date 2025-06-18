"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../../components/Footer/footer"
import { type Certificate, CertificateAPI } from "../../services/certificateAPI"
import "./claim-certificate.scss"
import moment from "moment"
import { Header } from "../../components/Header/Header"

export default function ClaimCertificate() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [issuedCertificates, setIssuedCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const fetchIssuedCertificates = async () => {
    try {
      setLoading(true)
      // Fetch all certificates and filter for issued status
      const allCertificates = await CertificateAPI.getAll()
      const issued = allCertificates.filter((cert) => cert.status === "issued")
      setIssuedCertificates(issued)
    } catch (error) {
      console.error("Error fetching issued certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssuedCertificates()
  }, [])

  // Function to generate harmonious gradient colors for issued certificates
  const generateGradient = () => {
    const baseColors = [
      ["#10b981", "#34d399"], // Green gradient for ISSUED status
      ["#059669", "#10b981"], // Darker green gradient
      ["#047857", "#059669"], // Deep green gradient
      ["#065f46", "#047857"], // Very deep green gradient
      ["#22c55e", "#4ade80"], // Bright green gradient
      ["#16a34a", "#22c55e"], // Medium green gradient
    ]
    return baseColors[Math.floor(Math.random() * baseColors.length)]
  }

  // Generate random gradients for each certificate
  const certificateGradients = useMemo(() => {
    return issuedCertificates.map(() => {
      const [color1, color2] = generateGradient()
      return `linear-gradient(90deg, ${color1}, ${color2})`
    })
  }, [issuedCertificates])

  // Filter certificates based on search query and active filter
  const filteredCertificates = issuedCertificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer?.name.toLowerCase().includes(searchQuery.toLowerCase())

    // For now, we'll keep the filter simple since we're only showing issued certificates
    const matchesFilter = activeFilter === "all"
    return matchesSearch && matchesFilter
  })

  const smartContractClaimCertificate = async (certificateId: string) => {
    // TODO: improve later
  }

  const handleClaimCertificate = async (cert: Certificate) => {
    if (window.confirm(`Are you sure you want to claim "${cert.title}"?`)) {
      try {
        await smartContractClaimCertificate(cert.certificateId || '')

        // Refresh the list after claiming
        await fetchIssuedCertificates()
      } catch (error) {
        console.error("Error claiming certificate:", error)
        alert("Failed to claim certificate. Please try again.")
      }
    }
  }

  const handleBackToMyCertificates = () => {
    navigate("/my-certificates")
  }

  if (loading) {
    return (
      <div className="claimCertificatePage">
        <Header active="claim-certificate" />
        <div className="loadingContainer">
          <div className="loadingSpinner"></div>
          <p>Loading available certificates...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="claimCertificatePage">
      <Header active="claim-certificate" />

      <div className="claimHero">
        <div className="claimHeroContent">
          <h1>Claim Certificates</h1>
          <p>Discover and claim certificates that have been issued for you</p>
        </div>
        <div className="heroShape"></div>
      </div>

      <div className="claimContainer">
        <div className="claimCard">
          <div className="claimActions">
            <div className="searchContainer">
              <input
                type="text"
                placeholder="Search available certificates..."
                className="searchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="searchButton">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            <div className="filterTabs">
              {/* <button
                className={`filterTab ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button> */}
            </div>

            <button className="btn btn-secondary backBtn" onClick={handleBackToMyCertificates}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="backIcon"
              >
                <path d="M19 12H5"></path>
                <path d="M12 19l-7-7 7-7"></path>
              </svg>
              Back to My Certificates
            </button>
          </div>

          <div className="claimStats">
            <div className="statCard">
              <div className="statValue">{issuedCertificates.length}</div>
              <div className="statLabel">Available to Claim</div>
            </div>
            <div className="statCard">
              <div className="statValue">{filteredCertificates.length}</div>
              <div className="statLabel">Matching Search</div>
            </div>
            <div className="statCard">
              <div className="statValue">0</div>
              <div className="statLabel">Claimed Today</div>
            </div>
          </div>

          {filteredCertificates.length > 0 && (
            <div className="availableNotice">
              <div className="noticeIcon">
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
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                  <path d="M3 12v7c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-7"></path>
                </svg>
              </div>
              <div className="noticeContent">
                <h3>{filteredCertificates.length} certificates available to claim</h3>
                <p>Click "Claim this certificate" to add them to your collection</p>
              </div>
            </div>
          )}

          <div className="certificatesGrid">
            {filteredCertificates.map((cert, index) => (
              <div key={cert.id} className="certificateCard issued">
                <div className="certificateHeader">
                  <div className="certificateColorBar" style={{ background: certificateGradients[index] }}></div>
                </div>
                <div className="certificateBody">
                  <div className="certificateTop">
                    <div className="certificateCategory">Certificate</div>
                    <div className="certificateStatus issued">ISSUED</div>
                  </div>
                  <h3>{cert.title}</h3>
                  <div className="certificateDetail">
                    <span className="detailLabel">Issued by:</span>
                    <span className="detailValue">{cert?.issuer?.name}</span>
                  </div>
                  <div className="certificateDetail">
                    <span className="detailLabel">Issue Date:</span>
                    <span className="detailValue">{moment(cert.createdAt).format("YYYY-MM-DD")}</span>
                  </div>
                  <div className="certificateDetail">
                    <span className="detailLabel">Expiry Date:</span>
                    <span className="detailValue">
                      {cert.expiredAt ? moment(cert.expiredAt).format("YYYY-MM-DD") : "No Expire"}
                    </span>
                  </div>
                  <div className="certificateActions">
                    <button className="btnLink" onClick={() => navigate(`/certificate-details/${cert.id}`)}>
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
                        className="actionIcon"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details
                    </button>
                    <button className="btn btn-claim" onClick={() => handleClaimCertificate(cert)}>
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
                        className="claimIcon"
                      >
                        <path d="M9 12l2 2 4-4"></path>
                        <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                        <path d="M3 12v7c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-7"></path>
                      </svg>
                      Claim this certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCertificates.length === 0 && !loading && (
            <div className="emptyState">
              <div className="emptyIcon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                  <path d="M3 12v7c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-7"></path>
                </svg>
              </div>
              <h3>No certificates available to claim</h3>
              <p>
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "No certificates with 'issued' status are currently available to claim"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
