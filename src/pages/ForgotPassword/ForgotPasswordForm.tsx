"use client"

import type React from "react"
import { useState } from "react"
import "./ForgotPasswordForm.scss"

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
      setError("Vui lòng nhập địa chỉ email")
      return
    }

    if (!validateEmail(email)) {
      setError("Địa chỉ email không hợp lệ")
      return
    }

    setLoading(true)
    setError("")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Forgot password request for:", email)
      setSuccess(true)
    } catch (err: any) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
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
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Resend email to:", email)
    } catch (err: any) {
      setError("Không thể gửi lại email")
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
            <h2>Email đã được gửi!</h2>
            <p>Chúng tôi đã gửi link đặt lại mật khẩu đến địa chỉ email:</p>
            <div className="email-display">{email}</div>
            <p className="instruction">
              Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) để tìm email từ chúng tôi. Link sẽ hết hạn sau{" "}
              <strong>15 phút</strong>.
            </p>

            <div className="action-buttons">
              <button className="resend-button" onClick={handleResendEmail} disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi lại email"}
              </button>
              <button className="back-button" onClick={handleBackToLogin}>
                Quay lại đăng nhập
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
            <h1>Quên mật khẩu?</h1>
            <p>Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Địa chỉ email</label>
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
                Đang gửi...
              </>
            ) : (
              "Gửi link đặt lại mật khẩu"
            )}
          </button>

          <div className="form-footer">
            <p>
              Nhớ mật khẩu rồi?{" "}
              <button type="button" className="login-link" onClick={handleBackToLogin}>
                Quay lại đăng nhập
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
