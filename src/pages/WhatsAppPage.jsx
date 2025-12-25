import React, { useState, useRef } from "react";
import { useToast } from "../contexts/ToastContext";
import { MessageSquare, Send, Clock, Phone, Eye, RefreshCw, Globe, Users, Copy, Info, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

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
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);

  // Popular country codes
  const countryCodes = [
    { code: "+1", country: "US/Canada", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  ];

  // Enhanced phone validation
  const validatePhoneNumber = (phone) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if empty
    if (cleaned.length === 0) {
      return { valid: false, error: "Phone number is required" };
    }
    
    // Check minimum length (at least 7 digits)
    if (cleaned.length < 7) {
      return { valid: false, error: "Phone number must be at least 7 digits" };
    }
    
    // Check maximum length (usually not more than 15 digits)
    if (cleaned.length > 15) {
      return { valid: false, error: "Phone number is too long" };
    }
    
    return { valid: true, cleaned };
  };

  // Validate message
  const validateMessage = (message) => {
    if (!message || message.trim().length === 0) {
      return { valid: false, error: "Message cannot be empty" };
    }
    
    if (message.trim().length < 3) {
      return { valid: false, error: "Message must be at least 3 characters" };
    }
    
    // WhatsApp message limit is around 65,536 characters
    if (message.length > 65536) {
      return { valid: false, error: "Message is too long (max 65,536 characters)" };
    }
    
    return { valid: true };
  };

  // Validate delay
  const validateDelay = (delay) => {
    const delayNum = parseInt(delay);
    
    if (isNaN(delayNum)) {
      return { valid: false, error: "Delay must be a number" };
    }
    
    if (delayNum < 0) {
      return { valid: false, error: "Delay cannot be negative" };
    }
    
    if (delayNum > 60) {
      return { valid: false, error: "Delay cannot exceed 60 seconds" };
    }
    
    return { valid: true, delay: delayNum };
  };

  const sendWhatsApp = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessageStatus("Validating input...");
    setValidationErrors({});
    
    // Get form values
    // Use state for phone input instead of form element to ensure we get the current value
    // If countryCode is already in phoneInput, don't add it again
    const cleanPhone = phoneInput.replace(/\D/g, '');
    const fullPhone = phoneInput.startsWith('+') ? phoneInput : `${countryCode}${cleanPhone}`;
    
    const message = e.target.whatsappMessage.value;
    const delay = e.target.messageDelay.value || 0;

    // Validate all inputs
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

    // Simulate processing time for better UX
    setMessageStatus("Preparing message...");
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanedPhone = phoneValidation.cleaned;

    setPreview(
      `<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div class="border-b border-gray-200 pb-4 mb-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-gray-900">WhatsApp Message</div>
              <div class="text-xs text-gray-500">Ready to send</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500">To:</span>
              <span class="text-gray-900 font-medium">${fullPhone}</span>
            </div>
            <div class="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
              <span class="text-gray-500">Delay:</span>
              <span class="text-blue-700 font-medium">${delayValidation.delay}s</span>
            </div>
          </div>
        </div>
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <strong class="text-green-800">Message Preview:</strong>
          </div>
          <div class="text-green-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-green-200">${message}</div>
          <div class="mt-3 text-xs text-green-600 flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>Message length: ${message.length} characters</span>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2 text-green-600 font-semibold bg-green-50 p-3 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Ready to send! WhatsApp will open in ${delayValidation.delay} second${delayValidation.delay !== 1 ? 's' : ''}</span>
        </div>
      </div>`
    );
    
    setIsSending(false);
    setShowPreview(true);
    setMessageStatus("✅ Message prepared successfully!");

    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Open WhatsApp after delay
    setTimeout(() => {
      const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
      
      // Try to open in new window/tab
      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      
      if (newWindow) {
        setMessageStatus("✅ WhatsApp opened in new tab!");
      } else {
        // Fallback: create link element
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatPhoneInput = (value) => {
    // Remove all non-numeric characters
    return value.replace(/\D/g, '');
  };

  const copyMessageTemplate = () => {
    const template = "Hi! I'm reaching out from [Your Organization]. We'd love to connect with you!";
    navigator.clipboard.writeText(template);
    toast.success("Message template copied to clipboard!");
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Add country code if not present
    if (phoneNumber.length > 0 && !phoneNumber.startsWith('1') && !phoneNumber.startsWith('91')) {
      return `+${phoneNumber}`;
    }
    
    return phoneNumber.length > 0 ? `+${phoneNumber}` : '';
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            WhatsApp Message Sender
          </h1>
          <p className="text-text-body text-lg max-w-2xl mx-auto">
            Send WhatsApp messages instantly without saving contacts. Perfect for quick communication and outreach.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-card-background rounded-3xl p-8 shadow-xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Send className="w-5 h-5 text-green-600" />
              <h2 className="text-2xl font-bold text-text-heading">Compose Message</h2>
            </div>

            <form onSubmit={sendWhatsApp} className="space-y-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-text-body mb-3">
                  Phone Number (with country code)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={phoneInput}
                    className="w-full pl-12 pr-4 py-3 border-2 border-border bg-input-background text-text-heading rounded-xl focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-all"
                    placeholder="+1234567890"
                    required
                    onChange={(e) => {
                      // Only update state, do not force format on every keystroke to avoid cursor jumping
                      setPhoneInput(e.target.value);
                    }}
                    onBlur={(e) => {
                      // Format on blur (when user leaves the field)
                      setPhoneInput(formatPhoneNumber(e.target.value));
                    }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Include country code (e.g., +1 for US, +91 for India)
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-text-body mb-3">
                  Message Content
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                  <textarea
                    name="whatsappMessage"
                    rows="6"
                    className="w-full pl-12 pr-4 py-3 border-2 border-border bg-input-background text-text-heading rounded-xl focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-all resize-none"
                    placeholder="Type your WhatsApp message here..."
                    required
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">
                  You can use emojis and line breaks in your message
                </p>
              </div>

              {/* Delay */}
              <div>
                <label className="block text-sm font-semibold text-text-body mb-3">
                  Send Delay (in seconds) - Optional
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="number"
                    name="messageDelay"
                    min="0"
                    max="60"
                    className="w-full pl-12 pr-4 py-3 border-2 border-border bg-input-background text-text-heading rounded-xl focus:ring-2 focus:ring-primary-accent focus:border-primary-accent transition-all"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Delay before opening WhatsApp (0-60 seconds)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl text-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
                
                {showPreview && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 bg-secondary-button text-text-body font-semibold rounded-xl hover:bg-opacity-80 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-card-background rounded-3xl p-8 shadow-xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-emerald-600" />
              <h2 className="text-2xl font-bold text-text-heading">Message Preview</h2>
            </div>
            
            {showPreview ? (
              <div className="space-y-6">
                {/* Message Preview */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div dangerouslySetInnerHTML={{ __html: preview }} />
                </div>

                {/* Status Message */}
                {messageStatus && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    messageStatus.includes('successfully') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {messageStatus.includes('successfully') ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{messageStatus}</span>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Next Steps:</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• WhatsApp will open in a new tab</li>
                    <li>• Review your message before sending</li>
                    <li>• Click send in WhatsApp to deliver the message</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-card-hover rounded-2xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-12 h-12 text-text-muted" />
                </div>
                <h3 className="text-xl font-semibold text-text-heading mb-2">No Message Prepared</h3>
                <p className="text-text-muted">Fill in the form and click "Send Message" to see your preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-card-background rounded-3xl p-8 shadow-xl border border-border">
          <h3 className="text-2xl font-bold text-text-heading mb-6 text-center">WhatsApp Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-text-heading mb-2">No Contact Saving</h4>
              <p className="text-sm text-text-body">Send messages without adding contacts to your phone</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-text-heading mb-2">Delayed Sending</h4>
              <p className="text-sm text-text-body">Set a delay before opening WhatsApp</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-text-heading mb-2">Rich Messages</h4>
              <p className="text-sm text-text-body">Support for emojis, line breaks, and formatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappPage;
