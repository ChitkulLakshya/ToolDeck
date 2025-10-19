// PDFEditorPage.jsx
import React, { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack"; // handles worker automatically
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// set worker (uses CDN - you can host locally if preferred)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

export default function PDFEditorPage() {
  const [file, setFile] = useState(null);
  const [pageItems, setPageItems] = useState([]); // {str, x, y, width, height, fontSize}
  const [renderScale, setRenderScale] = useState(1.3);
  const [loadedPageSize, setLoadedPageSize] = useState(null);
  const canvasRef = useRef(null);
  const overlaysRef = useRef(null);
  const [message, setMessage] = useState("");

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== "application/pdf") {
      setMessage("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setMessage("");
    await renderFirstPage(f);
  };

  async function renderFirstPage(file) {
    setPageItems([]);
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // load only first page for now
    const viewport = page.getViewport({ scale: renderScale });

    // render canvas
    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const renderContext = {
      canvasContext: ctx,
      viewport,
    };
    await page.render(renderContext).promise;

    setLoadedPageSize({ width: viewport.width, height: viewport.height });

    // extract text content and positions
    const textContent = await page.getTextContent();
    const items = textContent.items.map((t) => {
      // transform PDF text coords to canvas coords
      // t.transform is [a, b, c, d, e, f] where e,f are x,y in PDF coordinate system
      const tx = pdfjsLib.Util.transform;
      const transform = t.transform; // [a, b, c, d, e, f]
      const x = transform[4] * renderScale;
      // PDF y origin is bottom-left; convert
      const y = viewport.height - transform[5] * renderScale;
      // approximate font size
      const fontSize = Math.hypot(transform[0], transform[1]) * renderScale;
      return {
        str: t.str,
        x,
        y,
        fontSize,
        width: (t.width || (t.str.length * fontSize * 0.5)) * renderScale,
        height: fontSize * 1.2,
        id: Math.random().toString(36).slice(2, 9),
      };
    });

    setPageItems(items);
  }

  // update text when overlay changed
  const handleOverlayInput = (id, newText) => {
    setPageItems((prev) => prev.map((it) => (it.id === id ? { ...it, str: newText } : it)));
  };

  // Save: create new PDF with background image + edited text
  const handleSave = async () => {
    if (!file) return setMessage("No PDF loaded.");
    try {
      setMessage("Preparing edited PDF...");
      // convert canvas to PNG blob
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");
      const res = await fetch(dataUrl);
      const imgBytes = await res.arrayBuffer();

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([loadedPageSize.width, loadedPageSize.height]);
      const pngImage = await pdfDoc.embedPng(imgBytes);
      // draw background image (fit to page)
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: loadedPageSize.width,
        height: loadedPageSize.height,
      });

      // font for drawing text
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // draw each edited overlay
      pageItems.forEach((it) => {
        // PDF-lib's origin is bottom-left; our y already set accordingly to canvas coordinates (canvas origin is top-left),
        // so convert: pdf-lib expects bottom-left y, so do (pageHeight - it.y)
        // However earlier we converted PDF y to canvas coords; to place text at same visual place we do:
        const drawX = it.x;
        const drawY = loadedPageSize.height - it.y - it.fontSize; // adjust a bit
        // clamp font size to reasonable
        const size = Math.max(8, Math.min(36, it.fontSize));
        page.drawText(it.str, {
          x: drawX,
          y: drawY,
          size,
          font,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited_${file.name}`;
      a.click();
      setMessage("Edited PDF downloaded.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create edited PDF.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-16 bg-gray-50">
      <div className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">PDF Editor — Live Edit (Free)</h2>
          <p className="text-gray-600">Upload a PDF, edit lines visually, and download an edited PDF.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload PDF</label>
            <input type="file" accept="application/pdf" onChange={handleFile} className="w-full px-4 py-2 border rounded-2xl" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => renderFirstPage(file)}
              className="btn-hover px-4 py-2 bg-blue-200 rounded-2xl"
              disabled={!file}
            >
              Re-render Page
            </button>
            <button onClick={handleSave} className="btn-hover px-4 py-2 bg-cyan-300 rounded-2xl" disabled={!file}>
              Save Edited PDF
            </button>
          </div>

          <div className="mt-6 border rounded-lg p-4 relative">
            <div style={{ position: "relative", width: loadedPageSize?.width ?? 600 }}>
              {/* canvas */}
              <canvas ref={canvasRef} style={{ display: file ? "block" : "none", maxWidth: "100%", height: "auto" }} />

              {/* overlays container */}
              <div
                ref={overlaysRef}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "none", // allow clicking through unless contentEditable
                  width: loadedPageSize?.width ?? 0,
                  height: loadedPageSize?.height ?? 0,
                }}
              >
                {pageItems.map((it) => {
                  const style = {
                    position: "absolute",
                    left: it.x,
                    top: it.y - it.fontSize, // tune vertical alignment
                    minWidth: Math.max(20, it.width),
                    transformOrigin: "top left",
                    pointerEvents: "auto",
                  };
                  return (
                    <div
                      key={it.id}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => handleOverlayInput(it.id, e.currentTarget.textContent)}
                      style={{
                        ...style,
                        fontSize: Math.max(10, Math.min(24, it.fontSize)),
                        lineHeight: 1.1,
                        background: "rgba(255,255,255,0.0)",
                        padding: "0 2px",
                        outline: "1px dashed rgba(0,0,0,0.08)",
                        cursor: "text",
                      }}
                      dangerouslySetInnerHTML={{ __html: it.str.replace(/\n/g, "<br/>") }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <div className="mt-2 text-sm text-gray-600">{message}</div>
            <div className="mt-2 text-xs text-gray-500">
              Note: This creates an edited PDF by drawing the original page as an image and placing edited text on top.
              It simulates live editing visually. For real WYSIWYG editing of PDF text objects, a commercial SDK is required.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
