import type React from "react"
import { useState } from "react"
import "./ForgotPasswordForm.scss"
import { authAPI } from "../../services/authAPI"

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError("")
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Invalid email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      await authAPI.sendEmailReset(email)
      setSuccess(true)
    } catch (err: any) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    window.location.href = "/login"
  }

  const handleResendEmail = async () => {
    if (!email) return

    setLoading(true)
    try {
      await authAPI.sendEmailReset(email)
      setSuccess(true)
      setError("")
    } catch (err: any) {
      setError("Unable to resend email")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="success-content">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 12l6 6L20 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Email Sent!</h2>
            <p>We have sent a password reset link to:</p>
            <div className="email-display">{email}</div>
            <p className="instruction">
              Please check your inbox (and spam folder) for our email. The link will expire in{" "}
              <strong>30 minutes</strong>.
            </p>

            <div className="action-buttons">
              <button className="resend-button" onClick={handleResendEmail} disabled={loading}>
                {loading ? "Sending..." : "Resend email"}
              </button>
              <button className="back-button" onClick={handleBackToLogin}>
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="back-arrow" onClick={handleBackToLogin}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1>Forgot password?</h1>
            <p>Enter your email address and we'll send you a reset link</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              autoFocus
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>

          <div className="form-footer">
            <p>
              Remember your password?{" "}
              <button type="button" className="login-link" onClick={handleBackToLogin}>
                Back to login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
