import type React from "react"
import { useState, useRef } from "react"
import {Type, ImageIcon, Square, Circle, Save, ArrowLeft, Trash2, Move, RotateCcw, AlignLeft, AlignCenter, AlignRight,
} from "lucide-react"
import "./certificate-editor.scss"

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

interface CertificateEditorProps {
  template: CertificateTemplate
  onSave: (template: CertificateTemplate) => void
  onCancel: () => void
}

export default function CertificateEditor({ template, onSave, onCancel }: CertificateEditorProps) {
  const [currentTemplate, setCurrentTemplate] = useState<CertificateTemplate>({
    ...template,
    width: template.width || 800,
    height: template.height || 600,
    backgroundColor: template.backgroundColor || "#ffffff",
  })
  const [selectedElement, setSelectedElement] = useState<CertificateElement | null>(null)
  const [draggedElement, setDraggedElement] = useState<CertificateElement | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activePropertiesTab, setActivePropertiesTab] = useState("general")
  const canvasRef = useRef<HTMLDivElement>(null)

  const addElement = (type: CertificateElement["type"]) => {
    const newElement: CertificateElement = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100,
      width: type === "text" ? 200 : 100,
      height: type === "text" ? 40 : 100,
      content: type === "text" ? "Sample text" : undefined,
      fontSize: type === "text" ? 16 : undefined,
      fontFamily: type === "text" ? "Arial" : undefined,
      fontWeight: type === "text" ? "normal" : undefined,
      color: type === "text" ? "#000000" : "#000000",
      backgroundColor: type === "shape" ? "#f0f0f0" : "transparent",
      borderColor: "#cccccc",
      borderWidth: 1,
      borderRadius: 0,
      rotation: 0,
      opacity: 1,
      textAlign: type === "text" ? "left" : undefined,
      shapeType: type === "shape" ? "rectangle" : undefined,
    }

    setCurrentTemplate((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }))
    setSelectedElement(newElement)
  }

  const updateElement = (elementId: string, updates: Partial<CertificateElement>) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === elementId ? { ...el, ...updates } : el)),
    }))

    if (selectedElement?.id === elementId) {
      setSelectedElement((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }

  const deleteElement = (elementId: string) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== elementId),
    }))
    if (selectedElement?.id === elementId) {
      setSelectedElement(null)
    }
  }

  const handleMouseDown = (e: React.MouseEvent, element: CertificateElement) => {
    e.preventDefault()
    setSelectedElement(element)
    setDraggedElement(element)

    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - element.x,
        y: e.clientY - rect.top - element.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedElement && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const newX = e.clientX - rect.left - dragOffset.x
      const newY = e.clientY - rect.top - dragOffset.y

      updateElement(draggedElement.id, { x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setDraggedElement(null)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleSave = () => {
    const updatedTemplate = {
      ...currentTemplate,
      lastModified: new Date().toISOString().split("T")[0],
    }
    onSave(updatedTemplate)
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
      cursor: "move",
      border: selectedElement?.id === element.id ? "2px solid #3b82f6" : "none",
      zIndex: selectedElement?.id === element.id ? 10 : 1,
    }

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            className={`editor-element editor-element--text ${selectedElement?.id === element.id ? "editor-element--selected" : ""}`}
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
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {element.content}
          </div>
        )

      case "shape":
        return (
          <div
            key={element.id}
            className={`editor-element editor-element--shape ${element.shapeType === "circle" ? "circle" : ""} ${selectedElement?.id === element.id ? "editor-element--selected" : ""}`}
            style={{
              ...style,
              backgroundColor: element.backgroundColor,
              borderColor: element.borderColor,
              borderWidth: element.borderWidth,
              borderStyle: "solid",
              borderRadius: element.shapeType === "circle" ? "50%" : element.borderRadius,
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          />
        )

      case "image":
        return (
          <div
            key={element.id}
            className={`editor-element editor-element--image ${selectedElement?.id === element.id ? "editor-element--selected" : ""}`}
            style={{
              ...style,
              borderRadius: element.borderRadius,
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {element.imageUrl ? (
              <img
                src={element.imageUrl || "/placeholder.svg"}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="placeholder">
                <ImageIcon className="icon" />
                <span className="text">Image</span>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="certificate-editor">
      {/* Header */}
      <div className="certificate-editor__header">
        <div className="certificate-editor__title-section">
          <button onClick={onCancel} className="certificate-editor__back-button">
            <ArrowLeft className="icon" />
            Back
          </button>
          <div className="certificate-editor__title-info">
            <h2 className="certificate-editor__title">{currentTemplate.name}</h2>
            <p className="certificate-editor__subtitle">Edit certificate template</p>
          </div>
        </div>
        <div className="certificate-editor__actions">
          <button className="certificate-editor__action-button certificate-editor__action-button--outline">
            <RotateCcw className="icon" />
            Undo
          </button>
          <button
            onClick={handleSave}
            className="certificate-editor__action-button certificate-editor__action-button--primary"
          >
            <Save className="icon" />
            Save Template
          </button>
        </div>
      </div>

      <div className="certificate-editor__content">
        {/* Toolbar */}
        <div className="editor-toolbar">
          <div className="editor-toolbar__header">
            <h3 className="editor-toolbar__title">Tools</h3>
          </div>
          <div className="editor-toolbar__content">
            <div className="editor-toolbar__section">
              <h4 className="editor-toolbar__section-title">Add Element</h4>
              <div className="editor-toolbar__tools-grid">
                <button onClick={() => addElement("text")} className="editor-toolbar__tool-button">
                  <Type className="icon" />
                  <span className="label">Text</span>
                </button>
                <button onClick={() => addElement("image")} className="editor-toolbar__tool-button">
                  <ImageIcon className="icon" />
                  <span className="label">Image</span>
                </button>
                <button onClick={() => addElement("shape")} className="editor-toolbar__tool-button">
                  <Square className="icon" />
                  <span className="label">Shape</span>
                </button>
                <button onClick={() => addElement("signature")} className="editor-toolbar__tool-button">
                  <Circle className="icon" />
                  <span className="label">Signature</span>
                </button>
              </div>
            </div>

            {/* Template Settings */}
            <div className="editor-toolbar__section">
              <h4 className="editor-toolbar__section-title">Template Settings</h4>
              <div className="editor-toolbar__form-group">
                <label className="editor-toolbar__label">Template Name</label>
                <input
                  type="text"
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate((prev) => ({ ...prev, name: e.target.value }))}
                  className="editor-toolbar__input"
                />
              </div>
              <div className="editor-toolbar__form-group">
                <label className="editor-toolbar__label">Type</label>
                <select
                  value={currentTemplate.type}
                  onChange={(e) => setCurrentTemplate((prev) => ({ ...prev, type: e.target.value }))}
                  className="editor-toolbar__select"
                >
                  <option value="completion">Completion</option>
                  <option value="participation">Participation</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
              <div className="editor-toolbar__form-group">
                <label className="editor-toolbar__label">Background Color</label>
                <input
                  type="color"
                  value={currentTemplate.backgroundColor}
                  onChange={(e) => setCurrentTemplate((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                  className="editor-toolbar__input editor-toolbar__input--color"
                />
              </div>
            </div>

            {/* Element Properties */}
            {selectedElement && (
              <div className="properties-panel">
                <div className="properties-panel__header">
                  <h4 className="properties-panel__title">Element Properties</h4>
                  <button onClick={() => deleteElement(selectedElement.id)} className="properties-panel__delete-button">
                    <Trash2 className="icon" />
                  </button>
                </div>

                <div className="properties-panel__tabs">
                  <div className="tabs-list">
                    <button
                      className={`tabs-trigger ${activePropertiesTab === "general" ? "tabs-trigger--active" : ""}`}
                      onClick={() => setActivePropertiesTab("general")}
                    >
                      General
                    </button>
                    <button
                      className={`tabs-trigger ${activePropertiesTab === "style" ? "tabs-trigger--active" : ""}`}
                      onClick={() => setActivePropertiesTab("style")}
                    >
                      Style
                    </button>
                  </div>

                  {activePropertiesTab === "general" && (
                    <div className="tabs-content">
                      {selectedElement.type === "text" && (
                        <>
                          <div className="editor-toolbar__form-group">
                            <label className="editor-toolbar__label">Content</label>
                            <textarea
                              value={selectedElement.content || ""}
                              onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                              className="editor-toolbar__textarea"
                            />
                          </div>
                          <div className="editor-toolbar__form-group">
                            <label className="editor-toolbar__label">Font Size</label>
                            <input
                              type="number"
                              value={selectedElement.fontSize || 16}
                              onChange={(e) =>
                                updateElement(selectedElement.id, { fontSize: Number.parseInt(e.target.value) })
                              }
                              className="editor-toolbar__input"
                            />
                          </div>
                          <div className="editor-toolbar__form-group">
                            <label className="editor-toolbar__label">Font Family</label>
                            <select
                              value={selectedElement.fontFamily || "Arial"}
                              onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                              className="editor-toolbar__select"
                            >
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Helvetica">Helvetica</option>
                              <option value="Georgia">Georgia</option>
                            </select>
                          </div>
                        </>
                      )}

                      <div className="editor-toolbar__grid">
                        <div className="editor-toolbar__form-group">
                          <label className="editor-toolbar__label">X</label>
                          <input
                            type="number"
                            value={selectedElement.x}
                            onChange={(e) => updateElement(selectedElement.id, { x: Number.parseInt(e.target.value) })}
                            className="editor-toolbar__input"
                          />
                        </div>
                        <div className="editor-toolbar__form-group">
                          <label className="editor-toolbar__label">Y</label>
                          <input
                            type="number"
                            value={selectedElement.y}
                            onChange={(e) => updateElement(selectedElement.id, { y: Number.parseInt(e.target.value) })}
                            className="editor-toolbar__input"
                          />
                        </div>
                      </div>

                      <div className="editor-toolbar__grid">
                        <div className="editor-toolbar__form-group">
                          <label className="editor-toolbar__label">Width</label>
                          <input
                            type="number"
                            value={selectedElement.width}
                            onChange={(e) =>
                              updateElement(selectedElement.id, { width: Number.parseInt(e.target.value) })
                            }
                            className="editor-toolbar__input"
                          />
                        </div>
                        <div className="editor-toolbar__form-group">
                          <label className="editor-toolbar__label">Height</label>
                          <input
                            type="number"
                            value={selectedElement.height}
                            onChange={(e) =>
                              updateElement(selectedElement.id, { height: Number.parseInt(e.target.value) })
                            }
                            className="editor-toolbar__input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activePropertiesTab === "style" && (
                    <div className="tabs-content">
                      <div className="editor-toolbar__form-group">
                        <label className="editor-toolbar__label">Text/Border Color</label>
                        <input
                          type="color"
                          value={selectedElement.color || "#000000"}
                          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                          className="editor-toolbar__input editor-toolbar__input--color"
                        />
                      </div>

                      <div className="editor-toolbar__form-group">
                        <label className="editor-toolbar__label">Background Color</label>
                        <input
                          type="color"
                          value={selectedElement.backgroundColor || "#ffffff"}
                          onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                          className="editor-toolbar__input editor-toolbar__input--color"
                        />
                      </div>

                      <div className="editor-toolbar__form-group">
                        <label className="editor-toolbar__label">
                          Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%
                        </label>
                        <div className="properties-panel__slider-container">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(selectedElement.opacity || 1) * 100}
                            onChange={(e) =>
                              updateElement(selectedElement.id, { opacity: Number.parseInt(e.target.value) / 100 })
                            }
                            className="slider"
                          />
                        </div>
                      </div>

                      <div className="editor-toolbar__form-group">
                        <label className="editor-toolbar__label">Rotation: {selectedElement.rotation || 0}°</label>
                        <div className="properties-panel__slider-container">
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={selectedElement.rotation || 0}
                            onChange={(e) =>
                              updateElement(selectedElement.id, { rotation: Number.parseInt(e.target.value) })
                            }
                            className="slider"
                          />
                        </div>
                      </div>

                      {selectedElement.type === "text" && (
                        <div className="properties-panel__button-group">
                          <button
                            className={`align-button ${selectedElement.textAlign === "left" ? "align-button--active" : ""}`}
                            onClick={() => updateElement(selectedElement.id, { textAlign: "left" })}
                          >
                            <AlignLeft className="icon" />
                          </button>
                          <button
                            className={`align-button ${selectedElement.textAlign === "center" ? "align-button--active" : ""}`}
                            onClick={() => updateElement(selectedElement.id, { textAlign: "center" })}
                          >
                            <AlignCenter className="icon" />
                          </button>
                          <button
                            className={`align-button ${selectedElement.textAlign === "right" ? "align-button--active" : ""}`}
                            onClick={() => updateElement(selectedElement.id, { textAlign: "right" })}
                          >
                            <AlignRight className="icon" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="editor-canvas">
          <div className="editor-canvas__header">
            <h3 className="editor-canvas__title">
              Canvas - {currentTemplate.width} x {currentTemplate.height}px
            </h3>
            <div className="editor-canvas__controls">
              <span className="editor-canvas__zoom-badge">Zoom: 100%</span>
              <button className="editor-canvas__move-button">
                <Move className="icon" />
              </button>
            </div>
          </div>
          <div className="editor-canvas__content">
            <div className="editor-canvas__viewport">
              <div
                ref={canvasRef}
                className="editor-canvas__certificate editor-canvas__certificate--with-grid"
                style={{
                  width: currentTemplate.width,
                  height: currentTemplate.height,
                  backgroundColor: currentTemplate.backgroundColor,
                  backgroundImage: currentTemplate.backgroundImage
                    ? `url(${currentTemplate.backgroundImage})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedElement(null)
                  }
                }}
              >
                {currentTemplate.elements.map(renderElement)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
