import React, { useState, useRef } from "react";
import { useToast } from "../contexts/ToastContext";
import { MessageSquare, Send, Clock, Phone, Eye, RefreshCw, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

const WhatsappPage = () => {
  const toast = useToast();
  const [preview, setPreview] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneInput, setPhoneInput] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const fileInputRef = useRef(null);

  // Enhanced phone validation
  const validatePhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 0) return { valid: false, error: "Phone number is required" };
    if (cleaned.length < 7) return { valid: false, error: "Phone number must be at least 7 digits" };
    if (cleaned.length > 15) return { valid: false, error: "Phone number is too long" };
    return { valid: true, cleaned };
  };

  // Validate message
  const validateMessage = (message) => {
    if (!message || message.trim().length === 0) return { valid: false, error: "Message cannot be empty" };
    if (message.trim().length < 3) return { valid: false, error: "Message must be at least 3 characters" };
    if (message.length > 65536) return { valid: false, error: "Message is too long" };
    return { valid: true };
  };

  // Validate delay
  const validateDelay = (delay) => {
    const delayNum = parseInt(delay);
    if (isNaN(delayNum)) return { valid: false, error: "Delay must be a number" };
    if (delayNum < 0) return { valid: false, error: "Delay cannot be negative" };
    if (delayNum > 60) return { valid: false, error: "Delay cannot exceed 60 seconds" };
    return { valid: true, delay: delayNum };
  };

  const sendWhatsApp = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessageStatus("Validating input...");
    setValidationErrors({});
    
    const cleanPhone = phoneInput.replace(/\D/g, '');
    const fullPhone = phoneInput.startsWith('+') ? phoneInput : `${countryCode}${cleanPhone}`;
    
    const message = e.target.whatsappMessage.value;
    const delay = e.target.messageDelay.value || 0;

    const phoneValidation = validatePhoneNumber(fullPhone);
    const messageValidation = validateMessage(message);
    const delayValidation = validateDelay(delay);

    const errors = {};
    if (!phoneValidation.valid) errors.phone = phoneValidation.error;
    if (!messageValidation.valid) errors.message = messageValidation.error;
    if (!delayValidation.valid) errors.delay = delayValidation.error;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSending(false);
      setMessageStatus("Please fix the errors above");
      return;
    }

    setMessageStatus("Preparing message...");
    await new Promise(resolve => setTimeout(resolve, 500));

    const cleanedPhone = phoneValidation.cleaned;

    setPreview(
      `<div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div class="border-b border-gray-200 pb-3 mb-3">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-gray-900">WhatsApp Message</div>
              <div class="text-xs text-gray-500">Ready to send</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2 bg-gray-50 p-2 rounded">
              <span class="text-gray-500">To:</span>
              <span class="text-gray-900 font-medium">${fullPhone}</span>
            </div>
            <div class="flex items-center gap-2 bg-blue-50 p-2 rounded">
              <span class="text-gray-500">Delay:</span>
              <span class="text-blue-700 font-medium">${delayValidation.delay}s</span>
            </div>
          </div>
        </div>
        <div class="bg-green-50 border-l-4 border-green-500 p-3 rounded">
          <div class="text-green-700 whitespace-pre-wrap bg-white p-3 rounded border border-green-200 text-sm">${message}</div>
        </div>
      </div>`
    );
    
    setIsSending(false);
    setShowPreview(true);
    setMessageStatus("✅ Message prepared successfully!");
    toast.success("Message prepared!");

    setTimeout(() => {
      const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (newWindow) {
        setMessageStatus("✅ WhatsApp opened in new tab!");
      } else {
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
        setMessageStatus("✅ WhatsApp link triggered!");
      }
    }, delayValidation.delay * 1000);
  };

  const resetForm = () => {
    setPreview("");
    setShowPreview(false);
    setMessageStatus("");
    setValidationErrors({});
    setPhoneInput("");
    setMessageLength(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length > 0 && !phoneNumber.startsWith('1') && !phoneNumber.startsWith('91')) {
      return `+${phoneNumber}`;
    }
    return phoneNumber.length > 0 ? `+${phoneNumber}` : '';
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-heading mb-2">WhatsApp Direct</h1>
          <p className="text-text-body">Send WhatsApp messages without saving contacts.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-card-background rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-text-heading mb-6">Compose Message</h2>

            <form onSubmit={sendWhatsApp} className="space-y-6">
              <div>
                <label className="block text-sm text-text-body mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={phoneInput}
                    className="w-full pl-10 pr-4 py-2 border border-border bg-background text-text-body rounded-lg focus:ring-1 focus:ring-primary-accent"
                    placeholder="+1234567890"
                    required
                    onChange={(e) => setPhoneInput(e.target.value)}
                    onBlur={(e) => setPhoneInput(formatPhoneNumber(e.target.value))}
                  />
                </div>
                {validationErrors.phone && <p className="text-xs text-warning mt-1">{validationErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm text-text-body mb-1">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                  <textarea
                    name="whatsappMessage"
                    rows="6"
                    className="w-full pl-10 pr-4 py-2 border border-border bg-background text-text-body rounded-lg focus:ring-1 focus:ring-primary-accent resize-none"
                    placeholder="Type your message..."
                    required
                  />
                </div>
                {validationErrors.message && <p className="text-xs text-warning mt-1">{validationErrors.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-text-body mb-1">Delay (seconds)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="number"
                    name="messageDelay"
                    min="0"
                    max="60"
                    className="w-full pl-10 pr-4 py-2 border border-border bg-background text-text-body rounded-lg focus:ring-1 focus:ring-primary-accent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 py-3 bg-success text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSending ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSending ? "Preparing..." : "Send Message"}
                </button>
                
                {showPreview && (
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
            
            {showPreview ? (
              <div className="space-y-6 flex-1">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div dangerouslySetInnerHTML={{ __html: preview }} />
                </div>

                {messageStatus && (
                  <div className={`p-3 rounded-lg flex items-center gap-2 ${
                    messageStatus.includes('successfully') 
                      ? 'bg-success/10 text-success border border-success/20' 
                      : 'bg-primary-accent/10 text-primary-accent border border-primary-accent/20'
                  }`}>
                    {messageStatus.includes('successfully') ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{messageStatus}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                <Eye className="w-12 h-12 mb-4 opacity-20" />
                <p>Message preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappPage;
