import { ArrowDownOutlined, ArrowUpOutlined, BorderOutlined, ClearOutlined, CopyOutlined, DeleteOutlined, EyeOutlined, FontSizeOutlined, HarmonyOSOutlined, LineOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ColorPicker, Modal, Select, Space, Tooltip, Upload } from 'antd';
import * as fabric from 'fabric';
import { useEffect, useRef, useState } from 'react';
import { PlaceholderButtonGroup } from './PlaceholderButtonGroup';
import './certificate-editor.scss';



const CertificateEditor = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);

  const [templateId, setTemplateId] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(24);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showPreview, setShowPreview] = useState(false);
  const [tempLayout, setTempLayout] = useState<any>(null);

  const buttons = [
    { title: 'Recipient Name', onPress: () => addText('{{recipientName}}') },
    { title: 'Date', onPress: () => addText('{{date}}') },
    { title: 'Course Name', onPress: () => addText('{{courseName}}') },
  ];

  const saveToUndo = () => {
    if (fabricRef.current) {
      undoStack.current.push(JSON.stringify(fabricRef.current.toJSON()));
      redoStack.current = [];
    }
  };

  const handleUndoRedo = (action: 'undo' | 'redo') => {
    if (!fabricRef.current) return;

    const stack = action === 'undo' ? undoStack : redoStack;
    const oppositeStack = action === 'undo' ? redoStack : undoStack;

    if (stack.current.length === 0) return;

    const state = stack.current.pop() || '{}';
    oppositeStack.current.push(JSON.stringify(fabricRef.current.toJSON()));
    fabricRef.current.loadFromJSON(state, () => fabricRef.current?.renderAll());
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    const canvas = fabricRef.current;
    const active = canvas?.getActiveObject();

    if (!canvas || (active instanceof fabric.Textbox && active.isEditing)) return;

    const keyActions: Record<string, () => void> = {
      'a': () => {
        canvas.discardActiveObject();
        const selection = new fabric.ActiveSelection(canvas.getObjects(), { canvas });
        canvas.setActiveObject(selection);
        canvas.requestRenderAll();
      },
      'Escape': () => {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      },
      'Delete': () => deleteObject(),
      'Backspace': () => deleteObject(),
      'ArrowUp': () => moveObject(active, 0, -1, e.shiftKey),
      'ArrowDown': () => moveObject(active, 0, 1, e.shiftKey),
      'ArrowLeft': () => moveObject(active, -1, 0, e.shiftKey),
      'ArrowRight': () => moveObject(active, 1, 0, e.shiftKey),
    };

    if (e.ctrlKey || e.metaKey) {
      const ctrlActions: Record<string, () => void> = {
        'c': () => copyObject(active),
        'x': () => cutObject(active),
        'v': () => pasteObject(),
        'z': () => handleUndoRedo('undo'),
        'y': () => handleUndoRedo('redo'),
        'd': () => duplicateObject(active),
      };
      ctrlActions[e.key]?.();
    } else {
      keyActions[e.key]?.();
    }
  };

  const moveObject = (obj: fabric.Object | undefined, dx: number, dy: number, shift: boolean) => {
    if (!obj) return;
    const delta = shift ? 10 : 1;
    obj.left = (obj.left ?? 0) + dx * delta;
    obj.top = (obj.top ?? 0) + dy * delta;
    obj.setCoords();
    fabricRef.current?.requestRenderAll();
  };

  const copyObject = async (obj: fabric.Object | undefined) => {
    if (obj) {
      const cloned = await obj.clone();
      (fabricRef.current as any).__clipboard = cloned;
    }
  };

  const cutObject = async (obj: fabric.Object | undefined) => {
    if (obj) {
      const cloned = await obj.clone();
      (fabricRef.current as any).__clipboard = cloned;
      fabricRef.current?.remove(obj);
      fabricRef.current?.requestRenderAll();
    }
  };

  const pasteObject = async () => {
    const clip = (fabricRef.current as any).__clipboard;
    if (clip) {
      const cloned = await clip.clone();
      cloned.set({
        left: (clip.left ?? 100) + 20,
        top: (clip.top ?? 100) + 20,
      });
      fabricRef.current?.add(cloned);
      fabricRef.current?.setActiveObject(cloned);
      fabricRef.current?.requestRenderAll();
      saveToUndo();
    }
  };

  const duplicateObject = async (obj: fabric.Object | undefined) => {
    if (obj) {
      const cloned = await obj.clone();
      cloned.set({
        left: (obj.left ?? 100) + 30,
        top: (obj.top ?? 100) + 30,
      });
      fabricRef.current?.add(cloned);
      fabricRef.current?.setActiveObject(cloned);
      fabricRef.current?.requestRenderAll();
      saveToUndo();
    }
  };

  const deleteObject = () => {
    const active = fabricRef.current?.getActiveObject();
    if (active) {
      fabricRef.current?.remove(active);
      fabricRef.current?.discardActiveObject();
      fabricRef.current?.requestRenderAll();
      saveToUndo();
    }
  };

  const updateActiveStyles = () => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj instanceof fabric.Textbox) {
      setFontSize(obj.fontSize ?? 24);
      setSelectedColor(obj.fill as string ?? '#000000');
    }
  };

  const addText = (text?: string) => {
    const inpText = text || 'Your Text Here';
    const textbox = new fabric.Textbox(inpText, {
      left: 0,
      top: 0,
      width: inpText.length * 12,
      fontSize,
      fill: selectedColor,
    });
    fabricRef.current?.add(textbox);
  };

  const toggleTextStyle = (style: 'bold' | 'italic' | 'underline') => {
    const obj = fabricRef.current?.getActiveObject();
    if (!(obj instanceof fabric.Textbox)) return;

    switch (style) {
      case 'bold':
        obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
        break;
      case 'italic':
        obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic');
        break;
      case 'underline':
        obj.set('underline', !obj.underline);
        break;
    }

    fabricRef.current?.renderAll();
    saveToUndo();
  };

  const changeTextBackground = (color: string) => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj instanceof fabric.Textbox) {
      obj.set('textBackgroundColor', color);
      fabricRef.current?.renderAll();
      saveToUndo();
    }
  };

  const addShape = (shape: 'rect' | 'circle' | 'line') => {
    const shapeObj = createShape(shape);
    fabricRef.current?.add(shapeObj);
  };

  const createShape = (shape: 'rect' | 'circle' | 'line'): fabric.Object => {
    switch (shape) {
      case 'rect':
        return new fabric.Rect({ width: 100, height: 60, fill: selectedColor, left: 0, top: 0 });
      case 'circle':
        return new fabric.Circle({ radius: 40, fill: selectedColor, left: 0, top: 0 });
      case 'line':
        return new fabric.Line([10, 10, 60, 10], { stroke: selectedColor, strokeWidth: 3 });
    }
  };

  const uploadImage = (info: any) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = await fabric.FabricImage.fromURL(e.target?.result as string);
      img.set({ left: 200, top: 200, scaleX: 0.4, scaleY: 0.4 });
      fabricRef.current?.add(img);
    };
    reader.readAsDataURL(file);
  };

  const exportLayout = () => {
    const layout = fabricRef.current?.toJSON();
    console.log('Exported layout:', layout);
  };

  const clearCanvas = () => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = backgroundColor;
      canvas.requestRenderAll();
    }
  };

  const changeTextColor = (color: string) => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj && 'set' in obj) {
      obj.set('fill', color);
      obj.set('stroke', color);
      fabricRef.current?.renderAll();
    }
    setSelectedColor(color);
  };

  const changeFontSize = (size: number) => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj instanceof fabric.Textbox) {
      obj.set('fontSize', size);
      fabricRef.current?.renderAll();
    }
    setFontSize(size);
  };

  useEffect(() => {
    const canvasElement = document.getElementById('cert-canvas') as HTMLCanvasElement;
    const containerWidth = canvasElement.parentElement?.offsetWidth || 1000;

    const canvas = new fabric.Canvas('cert-canvas', {
      // width: containerWidth,
      width: 1000,
      height: 700,
      backgroundColor,
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    const resizeCanvas = () => {
      const newWidth = canvasElement.parentElement?.offsetWidth || 1000;
      canvas.setWidth(newWidth);
      canvas.requestRenderAll();
    };

    window.addEventListener('resize', resizeCanvas);

    canvas.on('selection:created', updateActiveStyles);
    canvas.on('selection:updated', updateActiveStyles);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.dispose();
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, [backgroundColor]);

  useEffect(() => {
    const handlePaste = (e: Event) => {
      const clipboardEvent = e as ClipboardEvent;
      const items = clipboardEvent.clipboardData?.items;
      if (!items) return;

      // Use for due to items not for...in support
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
              const dataUrl = event.target?.result as string;
              const img = await fabric.FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });
              img.set({ left: 0, top: 0, scaleX: 1, scaleY: 1 });
              fabricRef.current?.add(img);
              fabricRef.current?.setActiveObject(img);
              fabricRef.current?.requestRenderAll();
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="certificate-builder">
      {/* Sidebar trái */}
      <aside className="sidebar">
        <section>
          <h5>Actions</h5>
          <div className="button-grid">
            <Button icon={<SaveOutlined />} size="small" onClick={exportLayout}>Save</Button>
            <Button icon={<EyeOutlined />} size="small" onClick={() => setShowPreview(true)}>Preview</Button>
            <Button icon={<ClearOutlined />} size="small" onClick={clearCanvas}>Clear</Button>
            <Button icon={<DeleteOutlined />} size="small" danger onClick={deleteObject}>Delete</Button>
            <Button icon={<CopyOutlined />} size="small" onClick={() => duplicateObject(fabricRef.current?.getActiveObject())}>Clone</Button>
            <Button icon={<ArrowUpOutlined />} size="small" onClick={() => {
              const active = fabricRef.current?.getActiveObject();
              if (active) fabricRef.current?.bringObjectForward(active);
            }}>Forward</Button>
            <Button icon={<ArrowDownOutlined />} size="small" onClick={() => {
              const active = fabricRef.current?.getActiveObject();
              if (active) fabricRef.current?.sendObjectBackwards(active);
            }}>Backward</Button>
          </div>
        </section>

        <section>
          <h5>Add</h5>
          <Button type="text" icon={<FontSizeOutlined />} onClick={() => addText()}>Text</Button>
          <Button type="text" icon={<BorderOutlined />} onClick={() => addShape("rect")}>Rectangle</Button>
          <Button type="text" icon={<HarmonyOSOutlined />} onClick={() => addShape("circle")}>Circle</Button>
          <Button type="text" icon={<LineOutlined />} onClick={() => addShape("line")}>Line</Button>
          <Upload showUploadList={false} beforeUpload={() => false} onChange={uploadImage}>
            <Button type="text" icon={<UploadOutlined />}>Image</Button>
          </Upload>
        </section>

        <section>
          <h5>Format</h5>
          <div className="format-group">
            <label>Text Color</label>
            <ColorPicker value={selectedColor} onChange={(c) => changeTextColor(c.toHexString())} />

            <label>Background</label>
            <ColorPicker onChange={(c) => changeTextBackground(c.toHexString())} />

            <label>Font Size</label>
            <Select
              size="small"
              value={fontSize}
              onChange={changeFontSize}
              style={{ width: "100%" }}
            >
              {[12, 14, 16, 18, 24, 30, 36, 48].map((s) => (
                <Select.Option key={s} value={s}>{s}px</Select.Option>
              ))}
            </Select>

            <div className="text-style-buttons">
              <Button onClick={() => toggleTextStyle("bold")}><b>B</b></Button>
              <Button onClick={() => toggleTextStyle("italic")}><i>I</i></Button>
              <Button onClick={() => toggleTextStyle("underline")}><u>U</u></Button>
            </div>
          </div>
        </section>

        <section>
          <h5>Placeholders</h5>
          <PlaceholderButtonGroup buttons={buttons} />
        </section>
      </aside>

      {/* Canvas trung tâm */}
      <main className="canvas-area">
        <div className="canvas-container">
          <canvas id="cert-canvas" ref={canvasRef}></canvas>
        </div>
      </main>

      <Modal
        title="Certificate Preview"
        open={showPreview}
        onCancel={() => setShowPreview(false)}
        footer={null}
        width={1100}
      >
        <canvas id="preview-canvas" width={1000} height={700}></canvas>
      </Modal>
    </div>
  );
}

export default CertificateEditor;
