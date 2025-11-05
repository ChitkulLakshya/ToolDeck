import React, { useState, useRef } from "react";
import { useToast } from "../contexts/ToastContext";
import { QRCodeCanvas } from "qrcode.react";
import { 
  Download, 
  Copy, 
  RefreshCw, 
  Settings, 
  Palette, 
  Eye, 
  Share2,
  Printer,
  CheckCircle,
  Sparkles,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Wifi
} from "lucide-react";

const QRCodePage = () => {
  const [qrPreview, setQrPreview] = useState("");
  const [qrSettings, setQrSettings] = useState({
    size: 256,
    fgColor: "#000000",
    bgColor: "#ffffff",
    level: "M",
    includeMargin: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [qrType, setQrType] = useState("text");
  const [templateData, setTemplateData] = useState({
    email: { to: "", subject: "", body: "" },
    phone: { number: "" },
    wifi: { ssid: "", password: "", encryption: "WPA" },
    location: { lat: "", lng: "", label: "" }
  });
  const qrRef = useRef(null);

  const toast = useToast();

  // Predefined color schemes
  const colorPresets = [
    { name: "Classic", fg: "#000000", bg: "#ffffff" },
    { name: "Blue Wave", fg: "#2563eb", bg: "#dbeafe" },
    { name: "Purple Dream", fg: "#9333ea", bg: "#fae8ff" },
    { name: "Green Nature", fg: "#16a34a", bg: "#dcfce7" },
    { name: "Sunset", fg: "#dc2626", bg: "#fee2e2" },
    { name: "Ocean", fg: "#0891b2", bg: "#cffafe" },
    { name: "Dark Mode", fg: "#ffffff", bg: "#1f2937" },
    { name: "Gold", fg: "#ca8a04", bg: "#fef9c3" }
  ];

  const generateQR = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    let qrContent = "";
    
    // Generate content based on QR type
    switch(qrType) {
      case "text":
      case "url":
        qrContent = e.target.qrInput?.value || "";
        break;
      case "email":
        qrContent = `mailto:${templateData.email.to}?subject=${encodeURIComponent(templateData.email.subject)}&body=${encodeURIComponent(templateData.email.body)}`;
        break;
      case "phone":
        qrContent = `tel:${templateData.phone.number}`;
        break;
      case "wifi":
        qrContent = `WIFI:T:${templateData.wifi.encryption};S:${templateData.wifi.ssid};P:${templateData.wifi.password};;`;
        break;
      case "location":
        qrContent = `geo:${templateData.location.lat},${templateData.location.lng}${templateData.location.label ? `?q=${encodeURIComponent(templateData.location.label)}` : ''}`;
        break;
      default:
        qrContent = e.target.qrInput?.value || "";
    }
    
    // Validate content
    if (!qrContent || qrContent.length === 0) {
      toast.warning("Please enter some content for the QR code");
      setIsGenerating(false);
      return;
    }
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setQrPreview(qrContent);
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

  const printQR = () => {
    if (!qrRef.current) return;
    
    const printWindow = window.open('', '_blank');
    const canvas = qrRef.current.querySelector('canvas');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh;
              margin: 0;
              background: white;
            }
            canvas { 
              max-width: 90vw; 
              max-height: 90vh; 
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <img src="${canvas.toDataURL()}" />
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const shareQR = async () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    
    try {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'QR Code',
            text: 'Check out this QR code!',
            files: [file]
          });
        } else {
          // Fallback to download
          downloadQR('png');
        }
      });
    } catch (err) {
      console.error('Error sharing QR code:', err);
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
        
        setCopiedStatus(true);
        setTimeout(() => setCopiedStatus(false), 2000);
      });
    } catch (err) {
      console.error('Failed to copy QR code:', err);
      toast.error('Failed to copy QR code. Please try downloading instead.');
    }
  };

  const applyColorPreset = (preset) => {
    setQrSettings({
      ...qrSettings,
      fgColor: preset.fg,
      bgColor: preset.bg
    });
  };

  const resetForm = () => {
    setQrPreview("");
    setQrSettings({
      size: 256,
      fgColor: "#000000",
      bgColor: "#ffffff",
      level: "M",
      includeMargin: true
    });
    setQrType("text");
    setCopiedStatus(false);
  };

  // QR Type Templates
  const renderQRTypeInput = () => {
    switch(qrType) {
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-body mb-2">Email Address</label>
              <input
                type="email"
                value={templateData.email.to}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  email: { ...templateData.email, to: e.target.value }
                })}
                className="w-full px-4 py-3 border-2 border-border bg-input-background text-text-heading rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-body mb-2">Subject</label>
              <input
                type="text"
                value={templateData.email.subject}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  email: { ...templateData.email, subject: e.target.value }
                })}
                className="w-full px-4 py-3 border-2 border-border bg-input-background text-text-heading rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-body mb-2">Message Body</label>
              <textarea
                rows="3"
                value={templateData.email.body}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  email: { ...templateData.email, body: e.target.value }
                })}
                className="w-full px-4 py-3 border-2 border-border bg-input-background text-text-heading rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 resize-none"
                placeholder="Email message"
              />
            </div>
          </div>
        );
      
      case "phone":
        return (
          <div>
            <label className="block text-sm font-medium text-text-body mb-2">Phone Number (with country code)</label>
            <input
              type="tel"
              value={templateData.phone.number}
              onChange={(e) => setTemplateData({
                ...templateData,
                phone: { number: e.target.value }
              })}
              className="w-full px-4 py-3 border-2 border-border bg-input-background text-text-heading rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
              placeholder="+1234567890"
              required
            />
          </div>
        );
      
      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Name (SSID)</label>
              <input
                type="text"
                value={templateData.wifi.ssid}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  wifi: { ...templateData.wifi, ssid: e.target.value }
                })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                placeholder="My WiFi Network"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="text"
                value={templateData.wifi.password}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  wifi: { ...templateData.wifi, password: e.target.value }
                })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                placeholder="WiFi password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
              <select
                value={templateData.wifi.encryption}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  wifi: { ...templateData.wifi, encryption: e.target.value }
                })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open)</option>
              </select>
            </div>
          </div>
        );
      
      case "location":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={templateData.location.lat}
                  onChange={(e) => setTemplateData({
                    ...templateData,
                    location: { ...templateData.location, lat: e.target.value }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                  placeholder="40.7128"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={templateData.location.lng}
                  onChange={(e) => setTemplateData({
                    ...templateData,
                    location: { ...templateData.location, lng: e.target.value }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                  placeholder="-74.0060"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Label (Optional)</label>
              <input
                type="text"
                value={templateData.location.label}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  location: { ...templateData.location, label: e.target.value }
                })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                placeholder="My Location"
              />
            </div>
          </div>
        );
      
      default: // text or url
        return (
          <div>
            <label className="block text-sm font-semibold text-text-body mb-3">
              Enter {qrType === "url" ? "URL" : "Text"}
            </label>
            <textarea
              name="qrInput"
              rows="4"
              className="w-full px-4 py-4 border-2 border-dashed border-border bg-input-background text-text-heading rounded-2xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-center text-lg resize-none transition-all"
              placeholder={qrType === "url" ? "https://example.com" : "Enter any text here..."}
              required
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            QR Code Generator
          </h1>
          <p className="text-text-body text-lg max-w-2xl mx-auto">
            Create beautiful, customizable QR codes instantly. Perfect for sharing links, contact info, WiFi credentials, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-card-background rounded-3xl p-8 shadow-xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-heading">Create QR Code</h2>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-body hover:text-text-heading hover:bg-card-hover rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4" />
                Customize
              </button>
            </div>

            {/* QR Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-body mb-3">QR Code Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "text", icon: Sparkles, label: "Text" },
                  { value: "url", icon: LinkIcon, label: "URL" },
                  { value: "email", icon: Mail, label: "Email" },
                  { value: "phone", icon: Phone, label: "Phone" },
                  { value: "wifi", icon: Wifi, label: "WiFi" },
                  { value: "location", icon: MapPin, label: "Location" }
                ].map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setQrType(type.value);
                        setQrPreview("");
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        qrType === type.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                          : 'border-border hover:border-border-hover text-text-body'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={generateQR} className="space-y-6">
              {/* Dynamic Input Based on QR Type */}
              {renderQRTypeInput()}

              {/* Settings Panel */}
              {showSettings && (
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-6 space-y-6 border border-purple-100 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-text-heading">Customization Options</h3>
                  </div>
                  
                  {/* Color Presets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Color Presets</label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => applyColorPreset(preset)}
                          className="group relative p-3 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all hover:scale-105"
                          title={preset.name}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <div 
                              className="w-6 h-6 rounded-lg border border-gray-300"
                              style={{ backgroundColor: preset.fg }}
                            ></div>
                            <div 
                              className="w-6 h-6 rounded-lg border border-gray-300"
                              style={{ backgroundColor: preset.bg }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 text-center truncate">{preset.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <select
                        value={qrSettings.size}
                        onChange={(e) => setQrSettings({...qrSettings, size: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                      >
                        <option value={100}>Tiny (100px)</option>
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
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={qrSettings.fgColor}
                          onChange={(e) => setQrSettings({...qrSettings, fgColor: e.target.value})}
                          className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={qrSettings.fgColor}
                          onChange={(e) => setQrSettings({...qrSettings, fgColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 font-mono text-sm"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={qrSettings.bgColor}
                          onChange={(e) => setQrSettings({...qrSettings, bgColor: e.target.value})}
                          className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={qrSettings.bgColor}
                          onChange={(e) => setQrSettings({...qrSettings, bgColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 font-mono text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="includeMargin"
                      checked={qrSettings.includeMargin}
                      onChange={(e) => setQrSettings({...qrSettings, includeMargin: e.target.checked})}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="includeMargin" className="text-sm font-medium text-text-body">
                      Include margin around QR code
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl text-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate QR Code
                    </>
                  )}
                </button>
                
                {qrPreview && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 bg-secondary-button text-text-body font-semibold rounded-2xl hover:bg-opacity-80 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* QR Code Display Section */}
          <div className="bg-card-background rounded-3xl p-8 shadow-xl border border-border">
            <h2 className="text-2xl font-bold text-text-heading mb-6">Your QR Code</h2>
            
            {qrPreview ? (
              <div className="space-y-6">
                {/* QR Code Display */}
                <div className="flex justify-center">
                  <div 
                    ref={qrRef}
                    className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-shadow duration-300"
                  >
                    <QRCodeCanvas
                      value={qrPreview}
                      size={qrSettings.size}
                      fgColor={qrSettings.fgColor}
                      bgColor={qrSettings.bgColor}
                      level={qrSettings.level}
                      includeMargin={qrSettings.includeMargin}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => downloadQR('png')}
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      PNG
                    </button>
                    
                    <button
                      onClick={() => downloadQR('svg')}
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      SVG
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={copyQRToClipboard}
                      className={`flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg ${
                        copiedStatus 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                      }`}
                    >
                      {copiedStatus ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>

                    <button
                      onClick={printQR}
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>

                    <button
                      onClick={shareQR}
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                {/* QR Code Info */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                  <h3 className="font-semibold text-text-heading mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-600" />
                    QR Code Details
                  </h3>
                  <div className="text-sm text-text-body space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-text-heading min-w-[80px]">Type:</span>
                      <span className="capitalize">{qrType}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-text-heading min-w-[80px]">Content:</span>
                      <span className="break-all">{qrPreview.length > 50 ? `${qrPreview.substring(0, 50)}...` : qrPreview}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-text-heading min-w-[80px]">Size:</span>
                      <span>{qrSettings.size}px × {qrSettings.size}px</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-text-heading min-w-[80px]">Error Level:</span>
                      <span>{qrSettings.level} - {
                        qrSettings.level === 'L' ? 'Low (7%)' :
                        qrSettings.level === 'M' ? 'Medium (15%)' :
                        qrSettings.level === 'Q' ? 'Quartile (25%)' : 'High (30%)'
                      }</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl flex items-center justify-center mb-4">
                  <Eye className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-text-heading mb-2">No QR Code Generated</h3>
                <p className="text-text-muted max-w-sm">Select a type and enter your content to generate a custom QR code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
