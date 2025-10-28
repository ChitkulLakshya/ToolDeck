import React, { useState, useRef } from "react";
import { generateEmail, sendEmail } from "../api/api";
import { 
  Mail, 
  Upload, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Eye, 
  Image as ImageIcon,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Users,
  FileUp,
  Zap,
  Wand2
} from "lucide-react";

const EmailPage = () => {
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [context, setContext] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState({ subject: "", body: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [sendMode, setSendMode] = useState("single"); // single or bulk
  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const attachmentInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle CSV upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert("Please upload a valid CSV file");
        return;
      }
      setCsvFile(file);
    }
  };

  // Handle attachments
  const handleAttachments = (e) => {
    const files = Array.from(e.target.files);
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    
    if (totalSize > 10 * 1024 * 1024) {
      alert("Total attachment size should be less than 10MB");
      return;
    }
    
    setAttachments(files);
  };

  // Generate AI email using API utility
  const generateAIEmail = async () => {
    if (!eventImage && !context) {
      alert("Please upload an event image or provide context");
      return;
    }

    setIsGenerating(true);
    setStatusMessage("🤖 AI is analyzing your event...");

    try {
      const result = await generateEmail({
        eventImage,
        context
      });
      
      setGeneratedEmail({
        subject: result.subject,
        body: result.body
      });
      
      setShowPreview(true);
      setStatusMessage("✅ Email generated successfully!");
      
    } catch (error) {
      console.error("Error generating email:", error);
      setStatusMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Send email using API utility
  const sendEmailHandler = async () => {
    if (!generatedEmail.subject || !generatedEmail.body) {
      alert("Please generate an email first");
      return;
    }

    if (!senderEmail || !senderName) {
      alert("Please provide sender details");
      return;
    }

    if (sendMode === "single" && !recipientEmail) {
      alert("Please provide recipient email");
      return;
    }

    if (sendMode === "bulk" && !csvFile) {
      alert("Please upload a CSV file for bulk sending");
      return;
    }

    setIsSending(true);
    setStatusMessage("📧 Sending email...");

    try {
      const result = await sendEmail({
        senderEmail,
        senderName,
        subject: generatedEmail.subject,
        body: generatedEmail.body,
        sendMode,
        recipientEmail: sendMode === "single" ? recipientEmail : undefined,
        csvFile: sendMode === "bulk" ? csvFile : undefined,
        attachments
      });

      setStatusMessage(`✅ ${result.message}`);
      
      // Reset form after successful send
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      console.error("Error sending email:", error);
      setStatusMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Reset form
  const resetForm = () => {
    setEventImage(null);
    setImagePreview(null);
    setContext("");
    setGeneratedEmail({ subject: "", body: "" });
    setShowPreview(false);
    setStatusMessage("");
    setCsvFile(null);
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (csvInputRef.current) csvInputRef.current.value = "";
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            AI Email Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload your event banner, provide context, and let AI craft perfect professional emails instantly. Perfect for clubs, events, and organizations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-cyan-600" />
              <h2 className="text-2xl font-bold text-gray-900">Generate Email</h2>
            </div>

            <div className="space-y-6">
              {/* Sender Details */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-600" />
                  Sender Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Event Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Event Banner (Optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-cyan-400 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Event banner" 
                        className="max-h-48 mx-auto rounded-lg shadow-lg"
                      />
                      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Image uploaded successfully
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto">
                        <ImageIcon className="w-8 h-8 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop event banner here or click to upload
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          AI will analyze the image to understand your event
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Context Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Event Context / Purpose
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 resize-none"
                  placeholder="Example: 'Tech club orientation event for freshers. Casual and welcoming tone. Include registration link and date.'"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Be specific about tone, audience, and key details
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateAIEmail}
                disabled={isGenerating || (!eventImage && !context)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-2xl text-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Email with AI
                  </>
                )}
              </button>

              {/* Status Message */}
              {statusMessage && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                  statusMessage.includes('✅') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : statusMessage.includes('❌')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {statusMessage.includes('✅') ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : statusMessage.includes('❌') ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  <span className="text-sm font-medium">{statusMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Preview & Send Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Email Preview & Send</h2>
            </div>

            {showPreview ? (
              <div className="space-y-6">
                {/* Generated Email Preview */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="space-y-4">
                    {/* Subject */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700">Subject</label>
                        <button
                          onClick={() => copyToClipboard(generatedEmail.subject)}
                          className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                      <input
                        type="text"
                        value={generatedEmail.subject}
                        onChange={(e) => setGeneratedEmail({...generatedEmail, subject: e.target.value})}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 font-medium"
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700">Email Body</label>
                        <button
                          onClick={() => copyToClipboard(generatedEmail.body)}
                          className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                      <textarea
                        value={generatedEmail.body}
                        onChange={(e) => setGeneratedEmail({...generatedEmail, body: e.target.value})}
                        rows="12"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Send Mode Selection */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Send className="w-4 h-4 text-purple-600" />
                    Send Options
                  </h3>
                  
                  {/* Mode Toggle */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setSendMode("single")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        sendMode === "single"
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Single Send
                    </button>
                    <button
                      onClick={() => setSendMode("bulk")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        sendMode === "bulk"
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Bulk Send
                    </button>
                  </div>

                  {/* Recipient Input */}
                  {sendMode === "single" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300"
                        placeholder="recipient@example.com"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
                      <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        CSV format: email,name (one recipient per line)
                      </p>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Attachments (Optional)
                  </label>
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    multiple
                    onChange={handleAttachments}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-100 file:text-cyan-700 hover:file:bg-cyan-200"
                  />
                  {attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <div className="flex gap-3">
                  <button
                    onClick={sendEmailHandler}
                    disabled={isSending}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl text-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Email
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetForm}
                    className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-12 h-12 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Email Generated</h3>
                <p className="text-gray-500 max-w-sm">Upload an event banner and provide context to generate your email</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">AI Email Features</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Wand2 className="w-6 h-6 text-cyan-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600">Advanced AI analyzes your event and generates perfect emails</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Bulk Sending</h4>
              <p className="text-sm text-gray-600">Send to multiple recipients via CSV upload</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Generation</h4>
              <p className="text-sm text-gray-600">Get professional emails in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileUp className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Attachments</h4>
              <p className="text-sm text-gray-600">Include PDFs, images, and other files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
