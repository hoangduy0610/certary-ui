"use client"

import type React from "react"
import { useState } from "react"
import "./contact.scss"
import Footer from "../../components/Footer/footer"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean
    success: boolean
    message: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setFormStatus({ submitted: true, success: true, message: "Thank you! Your message has been sent successfully." })

    // Reset form after successful submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })

    // Clear success message after 5 seconds
    setTimeout(() => {
      setFormStatus(null)
    }, 5000)
  }

  return (
    <div className="contactPage">
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
          <a href="/contact" className="navLink active">
            Contact
          </a>
          <a href="/login" className="navLink">
            Login
          </a>
        </nav>
      </header>

      <div className="contactHero">
        <div className="contactHeroContent">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Our team is always here to help!</p>
        </div>
        <div className="heroShape"></div>
      </div>

      <div className="contactContainer">
        <div className="contactCard">
          <div className="contactContent">
            <div className="contactInfo">
              <h2>Contact Information</h2>
              <p className="contactSubtitle">
                Have questions or need assistance? Reach out to us through any of these channels.
              </p>

              <div className="infoItems">
                <div className="infoItem">
                  <div className="infoIcon">
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="infoContent">
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                    <p className="infoDetail">Monday - Friday, 9am - 5pm</p>
                  </div>
                </div>

                <div className="infoItem">
                  <div className="infoIcon">
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
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="infoContent">
                    <h3>Email</h3>
                    <p>support@certary.com</p>
                    <p className="infoDetail">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="infoItem">
                  <div className="infoIcon">
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
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="infoContent">
                    <h3>Office</h3>
                    <p>123 Certificate Way</p>
                    <p className="infoDetail">San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>

              <div className="socialLinks">
                <a href="#" className="socialLink">
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
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="socialLink">
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
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="socialLink">
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
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="socialLink">
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
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            <div className="contactForm">
              <h2>Send us a message</h2>

              {formStatus && (
                <div className={`formAlert ${formStatus.success ? "success" : "error"}`}>{formStatus.message}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="formRow">
                  <div className="formGroup">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                <div className="formGroup">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Type your message here..."
                    rows={5}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mapSection">
        <div className="mapContainer">
          <div className="mapHeader">
            <h2>Visit Our Office</h2>
            <p>We're located in the heart of San Francisco</p>
          </div>
          <div className="map">
            {/* This would be replaced with an actual map integration */}
            <div className="mapPlaceholder">
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
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p>Interactive map coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <div className="faqSection">
        <div className="faqContainer">
          <h2>Frequently Asked Questions</h2>
          <p className="faqSubtitle">Find quick answers to common questions about our services</p>

          <div className="faqGrid">
            <div className="faqItem">
              <h3>How do I get started with Certary?</h3>
              <p>
                Getting started is easy! Simply sign up for a free account, and you can immediately begin managing your
                certificates on our platform.
              </p>
            </div>

            <div className="faqItem">
              <h3>Is my certificate data secure?</h3>
              <p>
                Absolutely. We use industry-standard encryption and security practices to ensure your certificate data
                is always protected.
              </p>
            </div>

            <div className="faqItem">
              <h3>Can I export my certificates?</h3>
              <p>
                Yes, you can export your certificates in various formats including PDF, PNG, and our specialized secure
                format for verification purposes.
              </p>
            </div>

            <div className="faqItem">
              <h3>Do you offer enterprise solutions?</h3>
              <p>
                Yes, we offer customized enterprise solutions with additional features, dedicated support, and volume
                pricing. Contact our sales team for details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
