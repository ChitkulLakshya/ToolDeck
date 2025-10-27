import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, RefreshCw, Settings, Palette, Eye } from "lucide-react";

const QRCodePage = () => {
  const [qrPreview, setQrPreview] = useState("");
  const [qrSettings, setQrSettings] = useState({
    size: 256,
    fgColor: "#000000",
    bgColor: "#ffffff",
    level: "M"
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef(null);

  const generateQR = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    const input = e.target.qrInput.value;
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setQrPreview(input);
    setIsGenerating(false);
  };

  const downloadQR = (format = 'png') => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else if (format === 'svg') {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.svg`;
        link.href = svgUrl;
        link.click();
        URL.revokeObjectURL(svgUrl);
      }
    }
  };

  const copyQRToClipboard = async () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        // Show success feedback
        const button = document.querySelector('[data-copy-btn]');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('bg-green-500');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-green-500');
        }, 2000);
      });
    } catch (err) {
      console.error('Failed to copy QR code:', err);
    }
  };

  const resetForm = () => {
    setQrPreview("");
    setQrSettings({
      size: 256,
      fgColor: "#000000",
      bgColor: "#ffffff",
      level: "M"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            QR Code Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create beautiful, customizable QR codes instantly. Perfect for sharing links, contact info, or any text content.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create QR Code</h2>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4" />
                Customize
              </button>
            </div>

            <form onSubmit={generateQR} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter URL or Text
                </label>
                <textarea
                  name="qrInput"
                  rows="4"
                  className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-center text-lg resize-none transition-all"
                  placeholder="Paste your URL here or type any text..."
                  required
                />
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Customization Options</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <select
                        value={qrSettings.size}
                        onChange={(e) => setQrSettings({...qrSettings, size: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                      >
                        <option value={128}>Small (128px)</option>
                        <option value={256}>Medium (256px)</option>
                        <option value={384}>Large (384px)</option>
                        <option value={512}>Extra Large (512px)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Error Level</label>
                      <select
                        value={qrSettings.level}
                        onChange={(e) => setQrSettings({...qrSettings, level: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                      >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Foreground Color</label>
                      <input
                        type="color"
                        value={qrSettings.fgColor}
                        onChange={(e) => setQrSettings({...qrSettings, fgColor: e.target.value})}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <input
                        type="color"
                        value={qrSettings.bgColor}
                        onChange={(e) => setQrSettings({...qrSettings, bgColor: e.target.value})}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl text-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      Generate QR Code
                    </>
                  )}
                </button>
                
                {qrPreview && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* QR Code Display Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your QR Code</h2>
            
            {qrPreview ? (
              <div className="space-y-6">
                {/* QR Code Display */}
                <div className="flex justify-center">
                  <div 
                    ref={qrRef}
                    className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100"
                  >
                    <QRCodeCanvas
                      value={qrPreview}
                      size={qrSettings.size}
                      fgColor={qrSettings.fgColor}
                      bgColor={qrSettings.bgColor}
                      level={qrSettings.level}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => downloadQR('png')}
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG
                    </button>
                    
                    <button
                      onClick={() => downloadQR('svg')}
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download SVG
                    </button>
                  </div>
                  
                  <button
                    data-copy-btn
                    onClick={copyQRToClipboard}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </button>
                </div>

                {/* QR Code Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">QR Code Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Content:</span> {qrPreview.length > 50 ? `${qrPreview.substring(0, 50)}...` : qrPreview}</p>
                    <p><span className="font-medium">Size:</span> {qrSettings.size}px × {qrSettings.size}px</p>
                    <p><span className="font-medium">Error Level:</span> {qrSettings.level}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Eye className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No QR Code Generated</h3>
                <p className="text-gray-500">Enter some text or a URL to generate your QR code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
