import React, { useState, useRef } from "react";
import { generateEmail, sendEmail } from "../api/api";
import { useToast } from "../contexts/ToastContext";
import { InlineLoader } from "../components/LoadingSpinner";
import { Mail, Upload, Send, RefreshCw, Eye, Image as ImageIcon, FileText, Copy, Users, FileUp, Wand2, Sparkles, CheckCircle, AlertCircle, Zap } from "lucide-react";

const EmailPage = () => {
  const toast = useToast();
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [context, setContext] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState({ subject: "", body: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPassword, setSenderPassword] = useState(""); 
  const [useOwnAccount, setUseOwnAccount] = useState(false); 
  const [recipientEmail, setRecipientEmail] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [bccEmail, setBccEmail] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [sendMode, setSendMode] = useState("single"); 
  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const attachmentInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded successfully");
    }
  };

  // Handle CSV upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error("Please upload a valid CSV file");
        return;
      }
      setCsvFile(file);
      toast.success("CSV file uploaded");
    }
  };

  // Handle attachments
  const handleAttachments = (e) => {
    const files = Array.from(e.target.files);
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    
    if (totalSize > 10 * 1024 * 1024) {
      toast.error("Total attachment size should be less than 10MB");
      return;
    }
    
    setAttachments(files);
    toast.success(`${files.length} file(s) attached`);
  };

  // Generate AI email using API utility
  const generateAIEmail = async () => {
    // Validation: Ensure we have enough context for the AI
    if (!context || context.trim().length < 10) {
      toast.warning("Please provide at least 10 characters of context (e.g., Event Name, Date, Venue)");
      return;
    }

    // Validation: If no image, context must be substantial
    if (!eventImage && context.trim().length < 30) {
      toast.warning("Without an image, please provide more details (30+ chars) for better results");
      return;
    }

    setIsGenerating(true);
    toast.info("🤖 AI is analyzing your event...");

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
      toast.success("✅ Email generated successfully!");
      
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error(error.message || "Failed to generate email. Please check your backend connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Send email using API utility
  const sendEmailHandler = async () => {
    if (!generatedEmail.subject || !generatedEmail.body) {
      toast.warning("Please generate an email first");
      return;
    }

    if (!senderEmail || !senderName) {
      toast.warning("Please provide sender details");
      return;
    }

    if (useOwnAccount && !senderPassword) {
      toast.warning("Please provide your email password/app password");
      return;
    }

    if (sendMode === "single" && !recipientEmail) {
      toast.warning("Please provide recipient email");
      return;
    }

    if (sendMode === "bulk" && !csvFile) {
      toast.warning("Please upload a CSV file for bulk sending");
      return;
    }

    setIsSending(true);
    toast.info("📧 Sending email...");

    try {
      const result = await sendEmail({
        senderEmail,
        senderName,
        senderPassword: useOwnAccount ? senderPassword : undefined, // Only send if using own account
        useOwnAccount, // Flag to backend
        subject: generatedEmail.subject,
        body: generatedEmail.body,
        sendMode,
        recipientEmail: sendMode === "single" ? recipientEmail : undefined,
        cc: sendMode === "single" ? ccEmail : undefined,
        bcc: sendMode === "single" ? bccEmail : undefined,
        csvFile: sendMode === "bulk" ? csvFile : undefined,
        attachments
      });

      toast.success(`✅ ${result.message}`);
      
      // Reset form after successful send
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error.message || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Reset form
  const resetForm = () => {
    setEventImage(null);
    setImagePreview(null);
    setContext("");
    setGeneratedEmail({ subject: "", body: "" });
    setShowPreview(false);
    setCsvFile(null);
    setRecipientEmail("");
    setCcEmail("");
    setBccEmail("");
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (csvInputRef.current) csvInputRef.current.value = "";
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-heading mb-2">AI Email Generator</h1>
          <p className="text-text-body">Generate and send professional emails for your events.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-card-background rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-text-heading mb-6">1. Configure & Generate</h2>

            <div className="space-y-6">
              {/* Sender Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-text-heading">Sender Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-body mb-1">Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-body mb-1">Email</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useOwnAccount"
                    checked={useOwnAccount}
                    onChange={(e) => setUseOwnAccount(e.target.checked)}
                    className="rounded border-border text-primary-accent focus:ring-primary-accent"
                  />
                  <label htmlFor="useOwnAccount" className="text-sm text-text-body">Send from my own account (requires App Password)</label>
                </div>

                {useOwnAccount && (
                  <div>
                    <label className="block text-sm text-text-body mb-1">App Password</label>
                    <input
                      type="password"
                      value={senderPassword}
                      onChange={(e) => setSenderPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                      placeholder="•••• •••• •••• ••••"
                    />
                    <p className="text-xs text-warning mt-1">Do not use your main password.</p>
                  </div>
                )}
              </div>

              <hr className="border-border" />

              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-text-heading">Event Details</h3>
                
                <div>
                  <label className="block text-sm text-text-body mb-1">Event Banner (Optional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-accent/10 file:text-primary-accent hover:file:bg-primary-accent/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-body mb-1">Context / Prompt</label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body resize-none"
                    placeholder="Describe your event..."
                  />
                </div>
              </div>

              <button
                onClick={generateAIEmail}
                disabled={isGenerating || (!eventImage && !context)}
                className="w-full py-3 bg-primary-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? <InlineLoader /> : <Wand2 className="w-4 h-4" />}
                Generate Email
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-card-background rounded-xl p-6 border border-border flex flex-col h-full">
            <h2 className="text-xl font-semibold text-text-heading mb-6">2. Preview & Send</h2>

            {showPreview ? (
              <div className="flex-1 flex flex-col space-y-6">
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-text-heading text-sm">Draft Content</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={generateAIEmail}
                        disabled={isGenerating}
                        className="p-1.5 text-text-muted hover:text-primary-accent hover:bg-primary-accent/10 rounded transition-colors"
                        title="Regenerate"
                      >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`)}
                        className="p-1.5 text-text-muted hover:text-primary-accent hover:bg-primary-accent/10 rounded transition-colors"
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-text-body mb-1">Subject</label>
                    <input
                      type="text"
                      value={generatedEmail.subject}
                      onChange={(e) => setGeneratedEmail({...generatedEmail, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-text-body mb-1">Body</label>
                    <textarea
                      value={generatedEmail.body}
                      onChange={(e) => setGeneratedEmail({...generatedEmail, body: e.target.value})}
                      className="w-full h-64 px-3 py-2 border border-border rounded-lg bg-background text-text-body resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sendMode"
                        checked={sendMode === "single"}
                        onChange={() => setSendMode("single")}
                        className="text-primary-accent focus:ring-primary-accent"
                      />
                      <span className="text-sm text-text-body">Single Recipient</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sendMode"
                        checked={sendMode === "bulk"}
                        onChange={() => setSendMode("bulk")}
                        className="text-primary-accent focus:ring-primary-accent"
                      />
                      <span className="text-sm text-text-body">Bulk (CSV)</span>
                    </label>
                  </div>

                  {sendMode === "single" ? (
                    <div className="space-y-3 p-4 bg-background rounded-lg border border-border">
                      <h3 className="font-medium text-text-heading text-sm">Recipient Information</h3>
                      <div>
                        <label className="block text-sm text-text-body mb-1">To <span className="text-error">*</span></label>
                        <input
                          type="email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                          placeholder="recipient@example.com"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-text-body mb-1">CC</label>
                          <input
                            type="email"
                            value={ccEmail}
                            onChange={(e) => setCcEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                            placeholder="cc@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-text-body mb-1">BCC</label>
                          <input
                            type="email"
                            value={bccEmail}
                            onChange={(e) => setBccEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-body"
                            placeholder="bcc@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <input
                      ref={csvInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-accent/10 file:text-primary-accent hover:file:bg-primary-accent/20"
                    />
                  )}

                  <div>
                    <label className="block text-sm text-text-body mb-1">Attachments</label>
                    <input
                      ref={attachmentInputRef}
                      type="file"
                      multiple
                      onChange={handleAttachments}
                      className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-accent/10 file:text-primary-accent hover:file:bg-primary-accent/20"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={sendEmailHandler}
                      disabled={isSending || !generatedEmail.subject || !generatedEmail.body}
                      className="flex-1 py-3 bg-success text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSending ? <InlineLoader /> : <Send className="w-4 h-4" />}
                      {isSending ? "Sending..." : "Send Email"}
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-4 py-3 border border-border rounded-lg hover:bg-background transition-colors"
                      title="Reset Form"
                    >
                      <RefreshCw className="w-4 h-4 text-text-body" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                <Mail className="w-12 h-12 mb-4 opacity-20" />
                <p>Generated email preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
