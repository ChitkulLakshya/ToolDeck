import React, { useState, useRef } from "react";
import { useToast } from "../contexts/ToastContext";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, RefreshCw, Settings, Palette, Eye, Share2, Printer, Link as LinkIcon, Mail, Phone, MapPin, Wifi, Sparkles, CheckCircle } from "lucide-react";

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
    { name: "Blue", fg: "#2563eb", bg: "#dbeafe" },
    { name: "Purple", fg: "#9333ea", bg: "#fae8ff" },
    { name: "Green", fg: "#16a34a", bg: "#dcfce7" },
    { name: "Red", fg: "#dc2626", bg: "#fee2e2" },
    { name: "Cyan", fg: "#0891b2", bg: "#cffafe" },
    { name: "Dark", fg: "#ffffff", bg: "#1f2937" },
    { name: "Gold", fg: "#ca8a04", bg: "#fef9c3" }
  ];

  const generateQR = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    let qrContent = "";
    
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
    
    if (!qrContent || qrContent.length === 0) {
      toast.warning("Please enter some content for the QR code");
      setIsGenerating(false);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
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
      // SVG download logic would go here, simplified for now
      toast.info("SVG download requires additional logic");
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
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>
          <img src="${canvas.toDataURL()}" />
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
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
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedStatus(true);
        setTimeout(() => setCopiedStatus(false), 2000);
        toast.success("QR Code copied!");
      });
    } catch (err) {
      console.error('Failed to copy QR code:', err);
      toast.error('Failed to copy QR code.');
    }
  };

  const applyColorPreset = (preset) => {
    setQrSettings({ ...qrSettings, fgColor: preset.fg, bgColor: preset.bg });
  };

  const resetForm = () => {
    setQrPreview("");
    setQrSettings({ size: 256, fgColor: "#000000", bgColor: "#ffffff", level: "M", includeMargin: true });
    setQrType("text");
    setCopiedStatus(false);
  };

  const renderQRTypeInput = () => {
    switch(qrType) {
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-body mb-1">Email Address</label>
              <input
                type="email"
                value={templateData.email.to}
                onChange={(e) => setTemplateData({ ...templateData, email: { ...templateData.email, to: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-body mb-1">Subject</label>
              <input
                type="text"
                value={templateData.email.subject}
                onChange={(e) => setTemplateData({ ...templateData, email: { ...templateData.email, subject: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="block text-sm text-text-body mb-1">Message Body</label>
              <textarea
                rows="3"
                value={templateData.email.body}
                onChange={(e) => setTemplateData({ ...templateData, email: { ...templateData.email, body: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body resize-none"
                placeholder="Email message"
              />
            </div>
          </div>
        );
      case "phone":
        return (
          <div>
            <label className="block text-sm text-text-body mb-1">Phone Number</label>
            <input
              type="tel"
              value={templateData.phone.number}
              onChange={(e) => setTemplateData({ ...templateData, phone: { number: e.target.value } })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
              placeholder="+1234567890"
              required
            />
          </div>
        );
      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-body mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={templateData.wifi.ssid}
                onChange={(e) => setTemplateData({ ...templateData, wifi: { ...templateData.wifi, ssid: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                placeholder="My WiFi Network"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-body mb-1">Password</label>
              <input
                type="text"
                value={templateData.wifi.password}
                onChange={(e) => setTemplateData({ ...templateData, wifi: { ...templateData.wifi, password: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                placeholder="WiFi password"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-body mb-1">Encryption</label>
              <select
                value={templateData.wifi.encryption}
                onChange={(e) => setTemplateData({ ...templateData, wifi: { ...templateData.wifi, encryption: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
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
                <label className="block text-sm text-text-body mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={templateData.location.lat}
                  onChange={(e) => setTemplateData({ ...templateData, location: { ...templateData.location, lat: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                  placeholder="40.7128"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-text-body mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={templateData.location.lng}
                  onChange={(e) => setTemplateData({ ...templateData, location: { ...templateData.location, lng: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                  placeholder="-74.0060"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-body mb-1">Location Label (Optional)</label>
              <input
                type="text"
                value={templateData.location.label}
                onChange={(e) => setTemplateData({ ...templateData, location: { ...templateData.location, label: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                placeholder="My Location"
              />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <label className="block text-sm text-text-body mb-1">
              Enter {qrType === "url" ? "URL" : "Text"}
            </label>
            <textarea
              name="qrInput"
              rows="4"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body resize-none"
              placeholder={qrType === "url" ? "https://example.com" : "Enter any text here..."}
              required
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-heading mb-2">QR Code Generator</h1>
          <p className="text-text-body">Create customizable QR codes instantly.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-card-background rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-heading">Configuration</h2>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-body hover:bg-background rounded-lg transition-colors border border-border"
              >
                <Settings className="w-4 h-4" />
                {showSettings ? "Hide Settings" : "Customize"}
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-text-body mb-2">Type</label>
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
                      onClick={() => { setQrType(type.value); setQrPreview(""); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        qrType === type.value
                          ? 'border-primary-accent bg-primary-accent/5 text-primary-accent'
                          : 'border-border hover:bg-background text-text-body'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={generateQR} className="space-y-6">
              {renderQRTypeInput()}

              {showSettings && (
                <div className="bg-background rounded-lg p-4 border border-border space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-text-muted" />
                    <h3 className="font-medium text-text-heading text-sm">Customization</h3>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-text-muted mb-2">Presets</label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => applyColorPreset(preset)}
                          className="p-2 rounded border border-border hover:border-primary-accent transition-colors flex justify-center"
                          title={preset.name}
                        >
                          <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: preset.fg }}></div>
                            <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: preset.bg }}></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Size</label>
                      <select
                        value={qrSettings.size}
                        onChange={(e) => setQrSettings({...qrSettings, size: parseInt(e.target.value)})}
                        className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background text-text-body"
                      >
                        <option value={128}>Small</option>
                        <option value={256}>Medium</option>
                        <option value={512}>Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Error Level</label>
                      <select
                        value={qrSettings.level}
                        onChange={(e) => setQrSettings({...qrSettings, level: e.target.value})}
                        className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background text-text-body"
                      >
                        <option value="L">Low</option>
                        <option value="M">Medium</option>
                        <option value="Q">Quartile</option>
                        <option value="H">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 py-3 bg-primary-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate QR Code
                </button>
                
                {qrPreview && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 border border-border rounded-lg hover:bg-background transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-text-body" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-card-background rounded-xl p-6 border border-border flex flex-col h-full">
            <h2 className="text-xl font-semibold text-text-heading mb-6">Preview</h2>
            
            {qrPreview ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center bg-white p-8 rounded-lg border border-border">
                  <div ref={qrRef}>
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

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => downloadQR('png')}
                    className="flex items-center justify-center gap-2 py-2 border border-border rounded-lg hover:bg-background transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                  <button
                    onClick={copyQRToClipboard}
                    className="flex items-center justify-center gap-2 py-2 border border-border rounded-lg hover:bg-background transition-colors text-sm font-medium"
                  >
                    {copiedStatus ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    {copiedStatus ? "Copied" : "Copy Image"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                <Eye className="w-12 h-12 mb-4 opacity-20" />
                <p>QR Code preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
