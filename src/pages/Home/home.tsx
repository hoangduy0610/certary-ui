"use client"

import { useState, useEffect } from "react"
import "./home.scss"

// Import the images
import homeImage1 from "../../components/images/homeImage1.png"
import homeImage2 from "../../components/images/homeImage2.jpg"
import homeImage3 from "../../components/images/homeImage3.jpg"
import Footer from "../../components/footer/footer"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const images = [homeImage1, homeImage2, homeImage3]

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="homePage">
      <header className="header">
        <a href="/" className="logo" style={{ textDecoration: "none" }}>
          Certary
        </a>
        <nav className="navigation">
          <a href="/my-certificates" className="navLink">
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

      <section className="heroSection">
        <div className="heroBackground">
          <div className="heroShape"></div>
        </div>
        <div className="heroContainer">
          <div className="heroContent">
            <h1>Manage Certificates Efficiently</h1>
            <p>A comprehensive platform to help you manage, issue, and track certificates easily and professionally.</p>
            <div className="heroButtons">
              <a href="/my-certificates" className="btn btn-primary">
                View My Certificates
              </a>
              <a href="#features" className="btn btn-secondary">
                Learn More
              </a>
            </div>
          </div>

          <div className="imageSlider">
            <div className="sliderContainer">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? "active" : ""}`}
                  style={{
                    backgroundImage: `url(${image})`,
                    transform: `translateX(${100 * (index - currentSlide)}%)`,
                  }}
                />
              ))}

              <button className="sliderArrow prevArrow" onClick={prevSlide}>
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
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="sliderArrow nextArrow" onClick={nextSlide}>
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
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <div className="sliderDots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentSlide ? "active" : ""}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="featuresSection">
        <div className="sectionHeader">
          <h2>Key Features</h2>
          <p className="featuresSubtitle">Discover features that make certificate management simple and effective</p>
        </div>

        <div className="featuresGrid">
          <div className="featureCard">
            <div className="featureIcon">
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Easy Management</h3>
            <p>Manage all your certificates in a single platform with intuitive organization tools</p>
          </div>

          <div className="featureCard">
            <div className="featureIcon">
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Automatic Issuance</h3>
            <p>Automatically issue certificates when users complete requirements with customizable templates</p>
          </div>

          <div className="featureCard">
            <div className="featureIcon">
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
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>High Security</h3>
            <p>Ensure authenticity and security for all certificates with blockchain verification</p>
          </div>
        </div>
      </section>

      <section className="testimonialsSection">
        <div className="sectionHeader">
          <h2>What Our Users Say</h2>
          <p>Trusted by thousands of organizations worldwide</p>
        </div>

        <div className="testimonialsGrid">
          <div className="testimonialCard">
            <div className="testimonialContent">
              <p>
                "Certary has transformed how we manage our professional certifications. The platform is intuitive and
                saves us countless hours every month."
              </p>
            </div>
            <div className="testimonialAuthor">
              <div className="testimonialAvatar">JD</div>
              <div className="testimonialInfo">
                <h4>John Doe</h4>
                <p>HR Director, TechCorp</p>
              </div>
            </div>
          </div>

          <div className="testimonialCard">
            <div className="testimonialContent">
              <p>
                "The verification system is outstanding. Our clients can instantly verify the authenticity of our
                certifications, which has boosted our credibility."
              </p>
            </div>
            <div className="testimonialAuthor">
              <div className="testimonialAvatar">JS</div>
              <div className="testimonialInfo">
                <h4>Jane Smith</h4>
                <p>CEO, Training Excellence</p>
              </div>
            </div>
          </div>

          <div className="testimonialCard">
            <div className="testimonialContent">
              <p>
                "We've reduced certificate management time by 75% since switching to Certary. The automated issuance
                feature is a game-changer for our organization."
              </p>
            </div>
            <div className="testimonialAuthor">
              <div className="testimonialAvatar">RJ</div>
              <div className="testimonialInfo">
                <h4>Robert Johnson</h4>
                <p>Operations Manager, EduCert</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ctaSection">
        <div className="ctaBackground">
          <div className="ctaShape"></div>
        </div>
        <div className="ctaContent">
          <h2>Start Managing Your Certificates Today</h2>
          <p>Join thousands of organizations using our platform for efficient certificate management</p>
          <div className="ctaButtons">
            <a href="/signup" className="btn btn-primary">
              Sign Up Free
            </a>
            <a href="/contact" className="btn btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
