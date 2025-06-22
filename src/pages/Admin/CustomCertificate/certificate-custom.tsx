"use client"

import { Award, Copy, Edit, FileText, Plus, Trash2, Users } from "lucide-react"
import moment from "moment"
import { useEffect, useState } from "react"
import AdminHeader from "../../../components/AdminHeader/adminHeader"
import { CertificateType, CertificateTypeAPI, CreateCertificateTypeDto } from "../../../services/certificateTypeAPI"
import "./certificate-custom.scss"
import TypedCertificateEditor from "./certificate-editor"

export default function CertificateManagement() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedTemplate, setSelectedTemplate] = useState<CreateCertificateTypeDto | null>(null)
  const [templates, setTemplates] = useState<CertificateType[]>([])

  const fetchTypes = async () => {
    const res = await CertificateTypeAPI.getAll();
    if (!res) {
      console.error("Failed to fetch certificate types");
      return;
    }
    setTemplates(res);
  }

  useEffect(() => {
    fetchTypes();
  }, [])

  const handleEditTemplate = (template: CertificateType) => {
    setSelectedTemplate(template)
    setActiveTab("editor")
  }

  const handleCreateNew = () => {
    const newTemplate: CreateCertificateTypeDto = {
      name: "Template mới",
      description: "Mô tả template",
    }
    setSelectedTemplate(newTemplate)
    setActiveTab("editor")
  }

  const handleSaveTemplate = (template: CreateCertificateTypeDto) => {
    if (selectedTemplate?.id) {
      updateType(template)
    } else {
      createType(template)
    }
  }

  // const handlePreview = (template: CertificateType) => {
  //   setSelectedTemplate(template)
  //   setActiveTab("preview")
  // }

  const handleDuplicate = (template: CertificateType) => {
    const duplicated: CreateCertificateTypeDto = {
      name: `Copy of ${template.name}`,
      description: `Copy of ${template.description}`,
      layoutJson: template.layoutJson,
    }
    setSelectedTemplate(duplicated)
    setActiveTab("editor")
  }

  const handleDelete = async (templateId: number) => {
    const confirmDelete = await window.confirm("Are you sure you want to delete this template?")
    if (confirmDelete) {
      try {
        await CertificateTypeAPI.delete(templateId)
        setTemplates(templates.filter((t) => t.id !== templateId))
        alert("Template deleted successfully")
      } catch (error) {
        console.error("Failed to delete template:", error)
        alert("Failed to delete template")
      }
    }
  }

  const createType = async (data: CreateCertificateTypeDto) => {
    try {
      const newTemplate = await CertificateTypeAPI.create(data)
      setTemplates([...templates, newTemplate])
      alert("Template created successfully")
      setActiveTab("dashboard")
    } catch (error) {
      console.error("Failed to create template:", error)
      alert("Failed to create template")
    }
  }

  const updateType = async (data: CreateCertificateTypeDto) => {
    if (!selectedTemplate?.id) return
    try {
      const updatedTemplate = await CertificateTypeAPI.update(selectedTemplate?.id, data)
      setTemplates(templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
      alert("Template updated successfully")
      setActiveTab("dashboard")
    } catch (error) {
      console.error("Failed to update template:", error)
      alert("Failed to update template")
    }
  }

  const getTypeLabel = (type?: string) => {
    return "Certificate";
  }

  const getTypeColor = (type?: string) => {
    return "badge--completion";
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
            <h1 className="certificate-management__title">Custom Certificate Templates</h1>
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
                <div className="stats-card__value">{templates.length}</div>
              </div>
              <div className="stats-card">
                <div className="stats-card__header">
                  <h3 className="stats-card__title">Draft Templates</h3>
                  <Edit className="stats-card__icon" />
                </div>
                <div className="stats-card__value">0</div>
              </div>
              <div className="stats-card">
                <div className="stats-card__header">
                  <h3 className="stats-card__title">Template Types</h3>
                  <Users className="stats-card__icon" />
                </div>
                <div className="stats-card__value">1</div>
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
                        <span className={`badge ${getTypeColor()}`}>{getTypeLabel()}</span>
                        <span className={`badge ${true ? "badge--active" : "badge--draft"}`}>
                          {/* {template.status === "active" ? "Active" : "Draft"} */}
                          Active
                        </span>
                      </div>
                      <p className="template-card__description">{template.description}</p>
                      <p className="template-card__date">Cập nhật: {moment(template.updatedAt).format("DD-MM-YYYY")}</p>
                    </div>

                    <div className="template-card__actions">
                      <button onClick={() => handleEditTemplate(template)} className="template-card__primary-action">
                        <Edit className="icon" />
                        Edit
                      </button>
                      {/* <button onClick={() => handlePreview(template)} className="template-card__secondary-action">
                        <Eye className="icon" />
                      </button> */}
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

        {/* {activeTab === "preview" && selectedTemplate && (
          <CertificatePreview
            template={selectedTemplate}
            onBack={() => setActiveTab("dashboard")}
            onEdit={() => setActiveTab("editor")}
          />
        )} */}
      </div>
    </div>
  )
}
