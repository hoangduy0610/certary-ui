"use client"

import { useState } from "react"
import { Plus, Edit, Copy, Trash2, Eye, Award, Users, FileText } from "lucide-react"
import CertificateEditor from "./certificate-editor"
import CertificatePreview from "./certificate-preview"
import AdminHeader from "../../../components/AdminHeader/adminHeader"
import "./certificate-custom.scss"

interface CertificateTemplate {
  id: string
  name: string
  type: string
  description: string
  lastModified: string
  status: "active" | "draft"
  elements: any[]
}

// Khai báo props cho CertificateEditor để ép kiểu rõ ràng
type CertificateEditorProps = {
  template: CertificateTemplate
  onSave: (template: CertificateTemplate) => void
  onCancel: () => void
}

// Ép kiểu component
const TypedCertificateEditor = CertificateEditor as React.FC<CertificateEditorProps>

export default function CertificateManagement() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null)
  const [templates, setTemplates] = useState<CertificateTemplate[]>([
    {
      id: "1",
      name: "Chứng chỉ Hoàn thành Khóa học",
      type: "completion",
      description: "Template cho chứng chỉ hoàn thành khóa học",
      lastModified: "2024-01-15",
      status: "active",
      elements: [],
    },
    {
      id: "2",
      name: "Chứng chỉ Tham gia Sự kiện",
      type: "participation",
      description: "Template cho chứng chỉ tham gia sự kiện",
      lastModified: "2024-01-10",
      status: "draft",
      elements: [],
    },
    {
      id: "3",
      name: "Chứng chỉ Thành tích Xuất sắc",
      type: "achievement",
      description: "Template cho chứng chỉ thành tích xuất sắc",
      lastModified: "2024-01-08",
      status: "active",
      elements: [],
    },
  ])

  const handleEditTemplate = (template: CertificateTemplate) => {
    setSelectedTemplate(template)
    setActiveTab("editor")
  }

  const handleCreateNew = () => {
    const newTemplate: CertificateTemplate = {
      id: Date.now().toString(),
      name: "Template mới",
      type: "completion",
      description: "Mô tả template",
      lastModified: new Date().toISOString().split("T")[0],
      status: "draft",
      elements: [],
    }
    setSelectedTemplate(newTemplate)
    setActiveTab("editor")
  }

  const handleSaveTemplate = (template: CertificateTemplate) => {
    const updatedTemplates = templates.some((t) => t.id === template.id)
      ? templates.map((t) => (t.id === template.id ? template : t))
      : [...templates, template]

    setTemplates(updatedTemplates)
    setActiveTab("dashboard")
  }

  const handlePreview = (template: CertificateTemplate) => {
    setSelectedTemplate(template)
    setActiveTab("preview")
  }

  const handleDuplicate = (template: CertificateTemplate) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      status: "draft" as const,
      lastModified: new Date().toISOString().split("T")[0],
    }
    setTemplates([...templates, duplicated])
  }

  const handleDelete = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
  }

  const getTypeLabel = (type: string) => {
    const types = {
      completion: "Hoàn thành",
      participation: "Tham gia",
      achievement: "Thành tích",
    }
    return types[type as keyof typeof types] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      completion: "badge--completion",
      participation: "badge--participation",
      achievement: "badge--achievement",
    }
    return colors[type as keyof typeof colors] || "badge--completion"
  }

  return (
    <div className="certificate-management">
      <AdminHeader />

      <div className="certificate-management__header">
        <div className="certificate-management__header-content">
          <div className="certificate-management__title-section">
            <h1 className="certificate-management__title">Custom Certificate</h1>
            <p className="certificate-management__subtitle">
              Create and manage certificate templates for your organization
            </p>
          </div>

          {/* <div className="certificate-management__tabs">
            <div className="tabs-list">
              <button
                className={`tabs-trigger ${activeTab === "dashboard" ? "tabs-trigger--active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <FileText className="icon" />
                Dashboard
              </button>
              <button
                className={`tabs-trigger ${activeTab === "editor" ? "tabs-trigger--active" : ""}`}
                onClick={() => setActiveTab("editor")}
              >
                <Edit className="icon" />
                Editor
              </button>
              <button
                className={`tabs-trigger ${activeTab === "preview" ? "tabs-trigger--active" : ""}`}
                onClick={() => setActiveTab("preview")}
              >
                <Eye className="icon" />
                Preview
              </button>
            </div>
          </div> */}
        </div>
      </div>

      <div className="certificate-management__content">
        {activeTab === "dashboard" && (
          <div className="dashboard">
            <div className="dashboard__stats">
              <div className="stats-card">
                <div className="stats-card__header">
                  <h3 className="stats-card__title">Total Templates</h3>
                  <FileText className="stats-card__icon" />
                </div>
                <div className="stats-card__value">{templates.length}</div>
              </div>
              <div className="stats-card">
                <div className="stats-card__header">
                  <h3 className="stats-card__title">Active Templates</h3>
                  <Award className="stats-card__icon" />
                </div>
                <div className="stats-card__value">{templates.filter((t) => t.status === "active").length}</div>
              </div>
              <div className="stats-card">
                <div className="stats-card__header">
                  <h3 className="stats-card__title">Draft Templates</h3>
                  <Edit className="stats-card__icon" />
                </div>
                <div className="stats-card__value">{templates.filter((t) => t.status === "draft").length}</div>
              </div>
              <div className="stats-card">
                <div className="stats-card__header">
                  <h3 className="stats-card__title">Template Types</h3>
                  <Users className="stats-card__icon" />
                </div>
                <div className="stats-card__value">{new Set(templates.map((t) => t.type)).size}</div>
              </div>
            </div>

            <div className="dashboard__templates-section">
              <div className="dashboard__section-header">
                <div>
                  <h2 className="dashboard__section-title">Certificate Templates</h2>
                  <p className="dashboard__section-description">Manage and customize certificate templates</p>
                </div>
                <button onClick={handleCreateNew} className="dashboard__create-button">
                  <Plus className="icon" />
                  New Template
                </button>
              </div>

              <div className="dashboard__templates-grid">
                {templates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-card__header">
                      <h3 className="template-card__title">{template.name}</h3>
                      <div className="template-card__badges">
                        <span className={`badge ${getTypeColor(template.type)}`}>{getTypeLabel(template.type)}</span>
                        <span className={`badge ${template.status === "active" ? "badge--active" : "badge--draft"}`}>
                          {template.status === "active" ? "Active" : "Draft"}
                        </span>
                      </div>
                      <p className="template-card__description">{template.description}</p>
                      <p className="template-card__date">Cập nhật: {template.lastModified}</p>
                    </div>

                    <div className="template-card__actions">
                      <button onClick={() => handleEditTemplate(template)} className="template-card__primary-action">
                        <Edit className="icon" />
                        Edit
                      </button>
                      <button onClick={() => handlePreview(template)} className="template-card__secondary-action">
                        <Eye className="icon" />
                      </button>
                      <button onClick={() => handleDuplicate(template)} className="template-card__secondary-action">
                        <Copy className="icon" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="template-card__secondary-action template-card__secondary-action--danger"
                      >
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "editor" && selectedTemplate && (
          <TypedCertificateEditor
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "preview" && selectedTemplate && (
          <CertificatePreview
            template={selectedTemplate}
            onBack={() => setActiveTab("dashboard")}
            onEdit={() => setActiveTab("editor")}
          />
        )}
      </div>
    </div>
  )
}
