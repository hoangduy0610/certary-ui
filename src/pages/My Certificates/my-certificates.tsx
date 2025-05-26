"use client"

import { useNavigate } from "react-router-dom"
import Footer from "../../components/footer/footer"
import "./my-certificates.scss"
import { useState, useMemo } from "react"

export default function MyCertificates() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

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

  const certificates = [
    {
      id: 1,
      title: "Project Management Certificate",
      issuedBy: "Management Academy",
      issueDate: "15/03/2023",
      expiryDate: "15/03/2025",
      status: "Valid",
      category: "Management",
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      issuedBy: "Tech Institute",
      issueDate: "22/05/2023",
      expiryDate: "22/05/2026",
      status: "Valid",
      category: "Technology",
    },
    {
      id: 3,
      title: "Data Science Certification",
      issuedBy: "Data Analytics School",
      issueDate: "10/01/2023",
      expiryDate: "10/01/2025",
      status: "Valid",
      category: "Technology",
    },
    {
      id: 4,
      title: "Leadership Excellence",
      issuedBy: "Business Academy",
      issueDate: "05/07/2023",
      expiryDate: "05/07/2025",
      status: "Valid",
      category: "Management",
    },
    {
      id: 5,
      title: "Digital Marketing Specialist",
      issuedBy: "Marketing Institute",
      issueDate: "30/04/2023",
      expiryDate: "30/04/2025",
      status: "Valid",
      category: "Marketing",
    },
    {
      id: 6,
      title: "UX/UI Design Principles",
      issuedBy: "Design School",
      issueDate: "12/06/2023",
      expiryDate: "12/06/2025",
      status: "Valid",
      category: "Design",
    },
  ]

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
      cert.issuedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || cert.category.toLowerCase() === activeFilter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  return (
    <div className="certificatesPage">

      <header className="header">
        <a href="/" className="logo" style={{ textDecoration: "none" }}>
          Certary
        </a>
        <nav className="navigation">
          <a href="/my-certificates" className="navLink active">
            My Certificate
          </a>
          <a href="/forum" className="navLink">
            Forum
          </a>
          <a href="/contact" className="navLink">
            Contact
          </a>
          <a href="/login" className="navLink">
            Login
          </a>
        </nav>
      </header>

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
              <button
                className={`filterTab ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
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
              </button>
            </div>
          </div>

          <div className="certificatesStats">
            <div className="statCard">
              <div className="statValue">{certificates.length}</div>
              <div className="statLabel">Total Certificates</div>
            </div>
            <div className="statCard">
              <div className="statValue">{certificates.filter((c) => c.status === "Valid").length}</div>
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
                  <div className="certificateCategory">{cert.category}</div>
                  <h3>{cert.title}</h3>
                  <div className="certificateDetail">
                    <span className="detailLabel">Issued by:</span>
                    <span className="detailValue">{cert.issuedBy}</span>
                  </div>
                  <div className="certificateDetail">
                    <span className="detailLabel">Issue Date:</span>
                    <span className="detailValue">{cert.issueDate}</span>
                  </div>
                  <div className="certificateDetail">
                    <span className="detailLabel">Expiry Date:</span>
                    <span className="detailValue">{cert.expiryDate}</span>
                  </div>
                  <div className="certificateDetail">
                    <span className="detailLabel">Status:</span>
                    <span className="status-valid">{cert.status}</span>
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
    </div>
  )
}
