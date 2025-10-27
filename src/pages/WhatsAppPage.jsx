import React, { useState, useRef } from "react";
import { MessageSquare, Send, Clock, Phone, Sparkles, CheckCircle, AlertCircle, Eye } from "lucide-react";

const WhatsappPage = () => {
  const [preview, setPreview] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const fileInputRef = useRef(null);

  const sendWhatsApp = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessageStatus("Preparing message...");
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const phone = e.target.phoneNumber.value;
    const message = e.target.whatsappMessage.value;
    const delay = e.target.messageDelay.value || 0;

    setPreview(
      `<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div class="border-b border-gray-200 pb-4 mb-4">
          <div class="flex items-center gap-2 mb-2">
            <Phone class="w-4 h-4 text-green-600" />
            <strong class="text-gray-800">To:</strong>
            <span class="text-gray-700">${phone}</span>
          </div>
          <div class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-blue-600" />
            <strong class="text-gray-800">Delay:</strong>
            <span class="text-gray-700">${delay} seconds</span>
          </div>
        </div>
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <MessageSquare class="w-4 h-4 text-green-600" />
            <strong class="text-green-800">Message:</strong>
          </div>
          <div class="text-green-700 whitespace-pre-wrap">${message}</div>
        </div>
        <div class="mt-4 flex items-center gap-2 text-green-600 font-semibold">
          <CheckCircle class="w-4 h-4" />
          <span>Message ready to send!</span>
        </div>
      </div>`
    );
    
    setIsSending(false);
    setShowPreview(true);
    setMessageStatus("Message prepared successfully!");

    // Open WhatsApp after delay
    setTimeout(() => {
      const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setMessageStatus("WhatsApp opened in new tab!");
    }, delay * 1000);
  };

  const resetForm = () => {
    setPreview("");
    setShowPreview(false);
    setMessageStatus("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            WhatsApp Message Sender
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Send WhatsApp messages instantly without saving contacts. Perfect for quick communication and outreach.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Send className="w-5 h-5 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Compose Message</h2>
            </div>

            <form onSubmit={sendWhatsApp} className="space-y-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Phone Number (with country code)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all"
                    placeholder="+1234567890"
                    required
                    onChange={(e) => {
                      e.target.value = formatPhoneNumber(e.target.value);
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Include country code (e.g., +1 for US, +91 for India)
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Message Content
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="whatsappMessage"
                    rows="6"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all resize-none"
                    placeholder="Type your WhatsApp message here..."
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  You can use emojis and line breaks in your message
                </p>
              </div>

              {/* Delay */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Send Delay (in seconds) - Optional
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="messageDelay"
                    min="0"
                    max="60"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
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
                    className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-900">Message Preview</h2>
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
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Message Prepared</h3>
                <p className="text-gray-500">Fill in the form and click "Send Message" to see your preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">WhatsApp Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">No Contact Saving</h4>
              <p className="text-sm text-gray-600">Send messages without adding contacts to your phone</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Delayed Sending</h4>
              <p className="text-sm text-gray-600">Set a delay before opening WhatsApp</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Rich Messages</h4>
              <p className="text-sm text-gray-600">Support for emojis, line breaks, and formatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappPage;
