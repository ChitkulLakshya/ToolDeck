// PDFEditorPage.jsx
import React, { useRef, useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FileText, Upload, Download, Save, RefreshCw, Eye, Settings, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

// set worker (uses CDN - you can host locally if preferred)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

export default function PDFEditorPage() {
  const [file, setFile] = useState(null);
  const [pageItems, setPageItems] = useState([]);
  const [renderScale, setRenderScale] = useState(1.3);
  const [loadedPageSize, setLoadedPageSize] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const canvasRef = useRef(null);
  const overlaysRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== "application/pdf") {
      setMessage("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setMessage("");
    setIsLoading(true);
    await renderFirstPage(f);
    setIsLoading(false);
  };

  async function renderFirstPage(file) {
    setPageItems([]);
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
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
      const tx = pdfjsLib.Util.transform;
      const transform = t.transform;
      const x = transform[4] * renderScale;
      const y = viewport.height - transform[5] * renderScale;
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

  const handleOverlayInput = (id, newText) => {
    setPageItems((prev) => prev.map((it) => (it.id === id ? { ...it, str: newText } : it)));
  };

  const handleSave = async () => {
    if (!file) return setMessage("No PDF loaded.");
    try {
      setIsSaving(true);
      setMessage("Preparing edited PDF...");
      
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");
      const res = await fetch(dataUrl);
      const imgBytes = await res.arrayBuffer();

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([loadedPageSize.width, loadedPageSize.height]);
      const pngImage = await pdfDoc.embedPng(imgBytes);
      
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: loadedPageSize.width,
        height: loadedPageSize.height,
      });

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      pageItems.forEach((it) => {
        const drawX = it.x;
        const drawY = loadedPageSize.height - it.y - it.fontSize;
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
      URL.revokeObjectURL(url);
      setMessage("✅ Edited PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create edited PDF.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetEditor = () => {
    setFile(null);
    setPageItems([]);
    setLoadedPageSize(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            PDF Editor
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload a PDF, edit text visually, and download your edited document. Perfect for quick PDF modifications.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Controls</h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload PDF File
                  </label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFile}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all hover:border-gray-400"
                    />
                    {file && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{file.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Render Scale: {renderScale}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={renderScale}
                        onChange={(e) => setRenderScale(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => file && renderFirstPage(file)}
                    disabled={!file || isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Re-render Page
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!file || isSaving}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Save Edited PDF
                      </>
                    )}
                  </button>

                  {file && (
                    <button
                      onClick={resetEditor}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset Editor
                    </button>
                  )}
                </div>

                {/* Status Message */}
                {message && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    message.includes('✅') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : message.includes('❌')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {message.includes('✅') ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : message.includes('❌') ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Eye className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">PDF Viewer & Editor</h2>
              </div>

              {file ? (
                <div className="space-y-4">
                  {/* PDF Canvas Container */}
                  <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 overflow-auto max-h-[600px]">
                    <div className="relative inline-block">
                      {/* Canvas */}
                      <canvas 
                        ref={canvasRef} 
                        className="shadow-lg rounded-lg"
                        style={{ 
                          display: file ? "block" : "none", 
                          maxWidth: "100%", 
                          height: "auto" 
                        }} 
                      />

                      {/* Text Overlays */}
                      <div
                        ref={overlaysRef}
                        className="absolute top-0 left-0 pointer-events-none"
                        style={{
                          width: loadedPageSize?.width ?? 0,
                          height: loadedPageSize?.height ?? 0,
                        }}
                      >
                        {pageItems.map((it) => {
                          const style = {
                            position: "absolute",
                            left: it.x,
                            top: it.y - it.fontSize,
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
                              className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                              style={{
                                ...style,
                                fontSize: Math.max(10, Math.min(24, it.fontSize)),
                                lineHeight: 1.1,
                                background: "rgba(255,255,255,0.0)",
                                padding: "2px 4px",
                                outline: "1px dashed rgba(0,0,0,0.1)",
                                cursor: "text",
                                borderRadius: "4px",
                              }}
                              dangerouslySetInnerHTML={{ __html: it.str.replace(/\n/g, "<br/>") }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">How to Edit:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Click on any text to edit it directly</li>
                      <li>• Use the controls panel to adjust settings</li>
                      <li>• Click "Save Edited PDF" to download your changes</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No PDF Loaded</h3>
                  <p className="text-gray-500">Upload a PDF file to start editing</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">PDF Editor Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Visual Editing</h4>
              <p className="text-sm text-gray-600">Edit text directly on the PDF with visual feedback</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Download</h4>
              <p className="text-sm text-gray-600">Download your edited PDF immediately</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Customizable</h4>
              <p className="text-sm text-gray-600">Adjust render scale and other settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
