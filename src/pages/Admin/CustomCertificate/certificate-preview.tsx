"use client"

import type React from "react"

import { ArrowLeft, Edit, Download, Share, Printer, Info } from "lucide-react"
import "./certificate-preview.scss"

interface CertificateElement {
  id: string
  type: "text" | "image" | "shape" | "signature"
  x: number
  y: number
  width: number
  height: number
  content?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  textAlign?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  rotation?: number
  opacity?: number
  imageUrl?: string
  shapeType?: "rectangle" | "circle" | "line"
}

interface CertificateTemplate {
  id: string
  name: string
  type: string
  description: string
  lastModified: string
  status: "active" | "draft"
  elements: CertificateElement[]
  backgroundColor?: string
  backgroundImage?: string
  width?: number
  height?: number
}

interface CertificatePreviewProps {
  template: CertificateTemplate
  onBack: () => void
  onEdit: () => void
}

export default function CertificatePreview({ template, onBack, onEdit }: CertificatePreviewProps) {
  const sampleData = {
    recipientName: "Nguyễn Văn An",
    courseName: "Khóa học Lập trình Web Frontend",
    completionDate: "15/01/2024",
    organizationName: "Trung tâm Đào tạo ABC",
    instructorName: "Trần Thị Bình",
    certificateId: "CERT-2024-001",
  }

  const renderElement = (element: CertificateElement) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation || 0}deg)`,
      opacity: element.opacity || 1,
    }

    // Replace placeholders with sample data
    let content = element.content || ""
    content = content.replace(/\{recipientName\}/g, sampleData.recipientName)
    content = content.replace(/\{courseName\}/g, sampleData.courseName)
    content = content.replace(/\{completionDate\}/g, sampleData.completionDate)
    content = content.replace(/\{organizationName\}/g, sampleData.organizationName)
    content = content.replace(/\{instructorName\}/g, sampleData.instructorName)
    content = content.replace(/\{certificateId\}/g, sampleData.certificateId)

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            className="preview-element preview-element--text"
            style={{
              ...style,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              color: element.color,
              backgroundColor: element.backgroundColor,
              textAlign: element.textAlign as any,
              borderRadius: element.borderRadius,
            }}
          >
            {content}
          </div>
        )

      case "shape":
        return (
          <div
            key={element.id}
            className={`preview-element preview-element--shape ${element.shapeType === "circle" ? "circle" : ""}`}
            style={{
              ...style,
              backgroundColor: element.backgroundColor,
              borderColor: element.borderColor,
              borderWidth: element.borderWidth,
              borderStyle: "solid",
              borderRadius: element.shapeType === "circle" ? "50%" : element.borderRadius,
            }}
          />
        )

      case "image":
        return (
          <div
            key={element.id}
            className="preview-element preview-element--image"
            style={{
              ...style,
              borderRadius: element.borderRadius,
            }}
          >
            {element.imageUrl ? (
              <img
                src={element.imageUrl || "/placeholder.svg"}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="placeholder">
                <div className="text">Logo/Hình ảnh</div>
              </div>
            )}
          </div>
        )

      case "signature":
        return (
          <div
            key={element.id}
            className="preview-element preview-element--signature"
            style={{
              ...style,
              borderRadius: element.borderRadius,
            }}
          >
            <div className="text">Chữ ký</div>
          </div>
        )

      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    const types = {
      completion: "Completion",
      participation: "Participation",
      achievement: "Achievement",
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
    <div className="certificate-preview">
      {/* Header */}
      <div className="certificate-preview__header">
        <div className="certificate-preview__title-section">
          <button onClick={onBack} className="certificate-preview__back-button">
            <ArrowLeft className="icon" />
            Back
          </button>
          <div className="certificate-preview__title-info">
            <div className="certificate-preview__title">{template.name}</div>
            <div className="certificate-preview__badges">
              <span className={`badge ${getTypeColor(template.type)}`}>{getTypeLabel(template.type)}</span>
              <span className={`badge ${template.status === "active" ? "badge--active" : "badge--draft"}`}>
                {template.status === "active" ? "Active" : "Draft"}
              </span>
            </div>
            <p className="certificate-preview__subtitle">Preview certificate with sample data</p>
          </div>
        </div>
        <div className="certificate-preview__actions">
          <button
            onClick={onEdit}
            className="certificate-preview__action-button certificate-preview__action-button--primary"
          >
            <Edit className="icon" />
            Edit
          </button>
          <button className="certificate-preview__action-button">
            <Download className="icon" />
            Download
          </button>
          <button className="certificate-preview__action-button">
            <Share className="icon" />
            Share
          </button>
          <button className="certificate-preview__action-button">
            <Printer className="icon" />
            Print
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="certificate-preview__content">
        {/* Sample Data */}
        <div className="sample-data">
          <div className="sample-data__header">
            <h3 className="sample-data__title">Sample Data</h3>
          </div>
          <div className="sample-data__content">
            <div className="sample-data__field">
              <label className="sample-data__label">Recipient Name</label>
              <p className="sample-data__value">{sampleData.recipientName}</p>
            </div>
            <div className="sample-data__field">
              <label className="sample-data__label">Course Name</label>
              <p className="sample-data__value">{sampleData.courseName}</p>
            </div>
            <div className="sample-data__field">
              <label className="sample-data__label">Completion Date</label>
              <p className="sample-data__value">{sampleData.completionDate}</p>
            </div>
            <div className="sample-data__field">
              <label className="sample-data__label">Organization</label>
              <p className="sample-data__value">{sampleData.organizationName}</p>
            </div>
            <div className="sample-data__field">
              <label className="sample-data__label">Instructor</label>
              <p className="sample-data__value">{sampleData.instructorName}</p>
            </div>
            <div className="sample-data__field">
              <label className="sample-data__label">Certificate ID</label>
              <p className="sample-data__value">{sampleData.certificateId}</p>
            </div>

            <div className="sample-data__placeholders">
              <h4 className="title">Available Placeholders:</h4>
              <div className="list">
                <p>
                  {"{"}recipientName{"}"}
                </p>
                <p>
                  {"{"}courseName{"}"}
                </p>
                <p>
                  {"{"}completionDate{"}"}
                </p>
                <p>
                  {"{"}organizationName{"}"}
                </p>
                <p>
                  {"{"}instructorName{"}"}
                </p>
                <p>
                  {"{"}certificateId{"}"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="certificate-canvas">
          <div className="certificate-canvas__header">
            <h3 className="certificate-canvas__title">Preview Certificate</h3>
          </div>
          <div className="certificate-canvas__content">
            <div className="certificate-canvas__viewport">
              <div
                className="certificate-canvas__certificate"
                style={{
                  width: template.width || 800,
                  height: template.height || 600,
                  backgroundColor: template.backgroundColor || "#ffffff",
                  backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {template.elements.map(renderElement)}
              </div>
            </div>

            <div className="instructions-panel">
              <h4 className="instructions-panel__title">
                <Info className="icon" />
                Instructions:
              </h4>
              <ul className="instructions-panel__list">
                <li>
                  Use placeholders like{" "}
                  <code>
                    {"{"}recipientName{"}"}
                  </code>{" "}
                  in the text to automatically replace data
                </li>
                <li>The certificate will be automatically generated with real data when issued</li>
                <li>It can be downloaded as a PDF or image</li>
                <li>he template can be copied and edited for other purposes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
