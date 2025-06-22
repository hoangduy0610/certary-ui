import type React from "react"
import { useState } from "react"

import organizationsAPI from "../../services/organizationsAPI"
import "./issuer-register.scss"

interface IssuerRegisterFormData {
    organizationName: string
    email: string
    password: string
    description: string
    logo: string
    website: string
}

const IssuerRegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<IssuerRegisterFormData>({
        organizationName: "",
        email: "",
        password: "",
        description: "",
        logo: "",
        website: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setError("")
    }

    const validateForm = () => {
        if (!formData.organizationName.trim()) {
            setError("Organization name is required.")
            return false
        }
        if (!formData.email.trim()) {
            setError("Email is required.")
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Invalid email format.")
            return false
        }
        if (!formData.password.trim()) {
            setError("Password is required.")
            return false
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return false
        }
        if (!formData.description.trim()) {
            setError("Organization description is required.")
            return false
        }
        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            setError("Website must start with http:// or https://")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        setError("")

        try {
            const payload = {
                name: formData.organizationName,
                adminEmail: formData.email,
                adminPassword: formData.password,
                description: formData.description,
                // type: "Issuer",
                logo: formData.logo || undefined,
                website: formData.website || undefined,
            }

            const response = await organizationsAPI.create(payload)
            console.log("Issuer registration successful:", response)
            setSuccess(true)
            setFormData({
                organizationName: "",
                email: "",
                password: "",
                description: "",
                logo: "",
                website: "",
            })
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="issuer-register-container">
                <div className="issuer-register-card">
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <h2>Registration Successful!</h2>
                        <p>Your issuer account has been created successfully.</p>
                        <p>Please wait for approval from administrators.</p>
                        <button className="back-button" onClick={() => setSuccess(false)}>
                            Register another organization
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="issuer-register-container">
            <div className="issuer-register-card">
                <form className="issuer-register-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h1>Issuer Registration</h1>
                        <p>Create an account for your certificate-issuing organization</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="organizationName">
                            Organization Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="organizationName"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleChange}
                            placeholder="Enter organization name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Admin Email <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@organization.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password <span className="required">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password (min. 6 characters)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Organization Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your organization..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="logo">Logo URL</label>
                        <input
                            type="url"
                            id="logo"
                            name="logo"
                            value={formData.logo}
                            onChange={handleChange}
                            placeholder="https://example.com/logo.png"
                        />
                        <small className="form-hint">Organization logo URL (optional)</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="website">Website</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://organization.com"
                        />
                        <small className="form-hint">Official organization website (optional)</small>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" required />
                            <span className="checkmark"></span>
                            I agree to the{" "}
                            <a href="#terms" className="terms-link">
                                Terms of Use
                            </a>{" "}
                            and{" "}
                            <a href="#privacy" className="terms-link">
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Registering..." : "Register as Issuer"}
                    </button>

                    <div className="form-footer">
                        <p>
                            Already have an account?{" "}
                            <a href="/login" className="login-link">
                                Log in now
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default IssuerRegisterForm
