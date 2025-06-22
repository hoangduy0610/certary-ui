"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./ResetPasswordForm.scss"

interface ResetPasswordFormProps {
  token?: string
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
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

    // Simulate token validation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock validation - you can change this for testing
      const isValidToken = token.length > 10 // Simple mock validation

      if (isValidToken) {
        setTokenValid(true)
        console.log("Token is valid:", token)
      } else {
        setTokenValid(false)
        setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn")
      }
    } catch (err: any) {
      setTokenValid(false)
      setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn")
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
      setError("Vui lòng nhập mật khẩu mới")
      return false
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return false
    }

    if (!formData.confirmPassword.trim()) {
      setError("Vui lòng xác nhận mật khẩu")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
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
      // Simulate reset password API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Password reset successful for token:", token)
      console.log("New password:", formData.password)
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = "/login"
      }, 3000)
    } catch (err: any) {
      setError("Có lỗi xảy ra khi đặt lại mật khẩu")
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
            <h2>Đang xác thực...</h2>
            <p>Vui lòng chờ trong giây lát</p>
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
            <h2>Link đã hết hạn</h2>
            <p>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.</p>

            <div className="action-buttons">
              <button className="primary-button" onClick={handleRequestNewLink}>
                Yêu cầu link mới
              </button>
              <button className="secondary-button" onClick={handleBackToLogin}>
                Quay lại đăng nhập
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
                <path d="M4 12l6 6L20 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Đặt lại mật khẩu thành công!</h2>
            <p>
              Mật khẩu của bạn đã được cập nhật thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát.
            </p>

            <div className="countdown">
              <div className="countdown-circle">
                <span>3</span>
              </div>
            </div>

            <button className="login-button" onClick={handleBackToLogin}>
              Đăng nhập ngay
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
            <h1>Đặt lại mật khẩu</h1>
            <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="password">Mật khẩu mới</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật mật khẩu"
            )}
          </button>

          <div className="form-footer">
            <button type="button" className="back-link" onClick={handleBackToLogin}>
              ← Quay lại đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordForm
