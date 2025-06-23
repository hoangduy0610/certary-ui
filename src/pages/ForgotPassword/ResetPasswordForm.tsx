import type React from "react"
import { useState, useEffect } from "react"
import "./ResetPasswordForm.scss"
import { authAPI } from "../../services/authAPI"

interface ResetPasswordFormProps {
  token?: string
}

const ResetPasswordForm = () => {
  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get("token") || ""
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    validateToken()
  }, [token])

  const validateToken = async () => {
    if (!token) {
      setTokenValid(false)
      setValidating(false)
      return
    }

    try {
      const validation = await authAPI.verifyResetToken(token)
      const isValidToken = !!validation?.id || false
      if (isValidToken) {
        setTokenValid(true)
        console.log("Token is valid:", token)
      } else {
        setTokenValid(false)
        setError("The reset link is invalid or has expired")
      }
    } catch (err: any) {
      setTokenValid(false)
      setError("The reset link is invalid or has expired")
    } finally {
      setValidating(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.password.trim()) {
      setError("Please enter a new password")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (!formData.confirmPassword.trim()) {
      setError("Please confirm your password")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await authAPI.resetPassword(token, formData.password)
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = "/login"
      }, 3000)
    } catch (err: any) {
      setError("An error occurred while resetting your password")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    window.location.href = "/login"
  }

  const handleRequestNewLink = () => {
    window.location.href = "/forgot-password"
  }

  // Loading state while validating token
  if (validating) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading-content">
            <div className="loading-spinner large"></div>
            <h2>Validating...</h2>
            <p>Please wait a moment</p>
          </div>
        </div>
      </div>
    )
  }

  // Invalid or expired token
  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="error-content">
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
                <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
              </svg>
            </div>
            <h2>Link has expired</h2>
            <p>This password reset link is invalid or has expired. Please request a new one.</p>

            <div className="action-buttons">
              <button className="primary-button" onClick={handleRequestNewLink}>
                Request new link
              </button>
              <button className="secondary-button" onClick={handleBackToLogin}>
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="success-content">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M4 12l6 6L20 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>Password reset successful!</h2>
            <p>Your password has been updated successfully. You will be redirected to the login page shortly.</p>

            <div className="countdown">
              <div className="countdown-circle">
                <span>3</span>
              </div>
            </div>

            <button className="login-button" onClick={handleBackToLogin}>
              Go to login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="lock-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                <circle cx="12" cy="16" r="1" strokeWidth="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
              </svg>
            </div>
            <h1>Reset Password</h1>
            <p>Enter a new password for your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="password">New password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password (at least 6 characters)"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Updating...
              </>
            ) : (
              "Reset password"
            )}
          </button>

          <div className="form-footer">
            <button type="button" className="back-link" onClick={handleBackToLogin}>
              ← Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordForm
