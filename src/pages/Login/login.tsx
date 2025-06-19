"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import "./login.scss"
import { authAPI } from "../../services/authAPI"
import { StorageKeys } from "../../common/StorageKeys"
import { Button, Form } from "antd"
import { useUserInfo } from "../../hooks/useUserInfo"

interface LoginFormData {
  email: string
  password: string
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { getUserInfo } = useUserInfo()

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setError("")

    try {
      const response = await authAPI.signin(formData)
      localStorage.setItem(StorageKeys.AUTH_TOKEN, response.token || "")
      localStorage.setItem(StorageKeys.USER_INFO, JSON.stringify(response.info || {}))
      console.log("Login successful:", response)
      getUserInfo()
      // Redirect to Welcome page
      if (response.isFirstLogin) {
        navigate("/welcome")
      } else {
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <Form className="login-form">
          <div className="form-header">
            <h1>Login</h1>
            <p>Welcome back</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#forgot" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="button" onClick={handleSubmit} className="submit-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="form-footer">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="register-link">
                Register now
              </a>
            </p>

            <p>
              Become an issuer?{" "}
              <a href="/issuer-register" className="register-link">
                Register as issuer
              </a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default LoginForm
