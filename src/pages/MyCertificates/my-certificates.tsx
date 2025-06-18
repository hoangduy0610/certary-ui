"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../../components/Footer/footer"
import { Certificate, CertificateAPI } from "../../services/certificateAPI"
import "./my-certificates.scss"
import moment from "moment"
import { Header } from "../../components/Header/Header"

export default function MyCertificates() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [certificates, setCertificates] = useState<Certificate[]>([])

  const fetchCertificates = async () => {
    // Simulating an API call to fetch certificates
    const data = await CertificateAPI.getAll();
    setCertificates(data)
  }

  useEffect(() => {
    // Fetch certificates when component mounts
    fetchCertificates()
  }, [])

  const mapBackgroundColorStatus = (status: string) => {
    switch (status) {
      case "claimed":
        return "#4ade80" // Green
      case "issued":
        return "#60a5fa" // Blue
      case "revoked":
        return "#f87171" // Red
      case "rejected":
        return "#fbbf24" // Yellow
      case "draft":
        return "#a78bfa" // Purple
      case "expired":
        return "#f87171" // Red for expired
      default:
        return "#9ca3af" // Gray for unknown status
    }
  }

  // Function to generate harmonious gradient colors
  const generateGradient = () => {
    // Base colors in the purple/indigo family to match the theme
    const baseColors = [
      ["#4338ca", "#6366f1"], // Indigo to purple
      ["#4f46e5", "#818cf8"], // Indigo to lighter purple
      ["#6d28d9", "#a78bfa"], // Purple to lavender
      ["#7c3aed", "#c4b5fd"], // Violet to lavender
      ["#5b21b6", "#8b5cf6"], // Purple to violet
      ["#4c1d95", "#7c3aed"], // Deep purple to violet
    ]

    // Pick a random color pair from our harmonious options
    return baseColors[Math.floor(Math.random() * baseColors.length)]
  }

  const navigate = useNavigate()

  // Generate random gradients for each certificate
  const certificateGradients = useMemo(() => {
    return certificates.map(() => {
      const [color1, color2] = generateGradient()
      return `linear-gradient(90deg, ${color1}, ${color2})`
    })
  }, [certificates])

  // Filter certificates based on search query and active filter
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all"
    return matchesSearch && matchesFilter
  })

  return (
    <div className="certificatesPage">
      <Header active="my-certificates" />

      <div className="certificatesHero">
        <div className="certificatesHeroContent">
          <h1>My Certificates</h1>
          <p>Manage and track all your professional certifications in one place</p>
        </div>
        <div className="heroShape"></div>
      </div>

      <div className="certificatesContainer">
        <div className="certificatesCard">
          <div className="certificatesActions">
            <div className="searchContainer">
              <input
                type="text"
                placeholder="Search Certificates"
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

              <button
                className="btn btn-secondary claimBtn"
                onClick={() => (window.location.href = "/claim-certificate")}
              >
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
                  className="claimIcon"
                >
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                  <path d="M3 12v7c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-7"></path>
                </svg>
                Claim Certificate
              </button>
              {/* <button
                className={`filterTab ${activeFilter === "technology" ? "active" : ""}`}
                onClick={() => setActiveFilter("technology")}
              >
                Technology
              </button>
              <button
                className={`filterTab ${activeFilter === "management" ? "active" : ""}`}
                onClick={() => setActiveFilter("management")}
              >
                Management
              </button>
              <button
                className={`filterTab ${activeFilter === "marketing" ? "active" : ""}`}
                onClick={() => setActiveFilter("marketing")}
              >
                Marketing
              </button> */}
            </div>
          </div>

          <div className="certificatesStats">
            <div className="statCard">
              <div className="statValue">{certificates.length}</div>
              <div className="statLabel">Total Certificates</div>
            </div>
            <div className="statCard">
              <div className="statValue">{certificates.filter((c) => ["claimed", "issued"].includes(c.status)).length}</div>
              <div className="statLabel">Valid Certificates</div>
            </div>
            <div className="statCard">
              <div className="statValue">0</div>
              <div className="statLabel">Expiring Soon</div>
            </div>
          </div>

          <div className="certificatesGrid">
            {filteredCertificates.map((cert, index) => (
              <div key={cert.id} className="certificateCard">
                <div className="certificateHeader">
                  <div className="certificateColorBar" style={{ background: certificateGradients[index] }}></div>
                </div>
                <div className="certificateBody">
                  <div className="certificateCategory">Certificate</div>
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
                    <span className="detailValue">{cert.expiredAt ? moment(cert.expiredAt).format("YYYY-MM-DD") : "No Expire"}</span>
                  </div>
                  <div className="certificateDetail">
                    <span className="detailLabel">Status:</span>
                    <span className="status-valid" style={{
                      backgroundColor: mapBackgroundColorStatus((!cert.expiredAt || moment(cert.expiredAt).isAfter(moment())) ? cert.status : "expired"),
                    }}>{(!cert.expiredAt || moment(cert.expiredAt).isAfter(moment())) ? cert.status : "expired"}</span>
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
                    <button className="btnLink downloadBtn">
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div >
  )
}
