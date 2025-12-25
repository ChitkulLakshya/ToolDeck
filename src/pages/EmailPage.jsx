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
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (csvInputRef.current) csvInputRef.current.value = "";
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-accent to-secondary-accent rounded-2xl mb-4 shadow-lg">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-accent to-secondary-accent bg-clip-text text-transparent mb-4">
            AI Email Generator
          </h1>
          <p className="text-text-body text-lg max-w-2xl mx-auto">
            Upload your event banner, provide context, and let AI craft perfect professional emails instantly. Perfect for clubs, events, and organizations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-card-background rounded-3xl p-8 shadow-xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary-accent" />
              <h2 className="text-2xl font-bold text-text-heading">Generate Email</h2>
            </div>

            <div className="space-y-6">
              {/* Sender Details */}
              <div className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-text-heading mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-accent" />
                  Sender Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-2">Your Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent focus:border-primary-accent bg-background text-text-body"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-2">Your Email</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent focus:border-primary-accent bg-background text-text-body"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  {/* Toggle for using own email account */}
                  <div className="flex items-center justify-between p-3 bg-card-background rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-body cursor-pointer" htmlFor="useOwnAccount">
                        Send from my email account
                      </label>
                      <span className="text-xs text-text-muted">(Use your credentials)</span>
                    </div>
                    <button
                      id="useOwnAccount"
                      type="button"
                      onClick={() => setUseOwnAccount(!useOwnAccount)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        useOwnAccount ? 'bg-primary-accent' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          useOwnAccount ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Show password field only if using own account */}
                  {useOwnAccount && (
                    <div className="space-y-3 p-4 bg-primary-accent/5 rounded-lg border border-primary-accent/20">
                      <div>
                        <label className="block text-sm font-medium text-text-body mb-2">
                          Email Password / App Password
                        </label>
                        <input
                          type="password"
                          value={senderPassword}
                          onChange={(e) => setSenderPassword(e.target.value)}
                          autoComplete="new-password"
                          className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent focus:border-primary-accent bg-background text-text-body"
                          placeholder="••••••••••••••••"
                          required
                        />
                        <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                              <strong>Security Warning:</strong> Do NOT use your main Google password. 
                              You must generate an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-500">App Password</a>.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-text-body mb-3">
                  Upload Event Banner (Optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary-accent transition-all bg-card-background"
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
                      <div className="flex items-center justify-center gap-2 text-sm text-success">
                        <CheckCircle className="w-4 h-4" />
                        Image uploaded successfully
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-card-background border border-border rounded-2xl flex items-center justify-center mx-auto">
                        <ImageIcon className="w-8 h-8 text-primary-accent" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-text-heading">
                          Drop event banner here or click to upload
                        </p>
                        <p className="text-sm text-text-muted mt-1">
                          AI will analyze the image to understand your event
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Context Input */}
              <div>
                <label className="block text-sm font-semibold text-text-body mb-3">
                  Event Context / Purpose
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent focus:border-primary-accent resize-none bg-background text-text-body"
                  placeholder="Example: 'Tech club orientation event for freshers. Casual and welcoming tone. Include registration link and date.'"
                  required
                />
                <p className="text-xs text-text-muted mt-2">
                  💡 Tip: Be specific about tone, audience, and key details
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateAIEmail}
                disabled={isGenerating || (!eventImage && !context)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-accent to-secondary-accent text-white font-semibold rounded-2xl text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <InlineLoader size="default" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Email with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview & Send Section */}
          <div className="bg-card-background rounded-3xl p-8 shadow-xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-secondary-accent" />
              <h2 className="text-2xl font-bold text-text-heading">Email Preview & Send</h2>
            </div>

            {showPreview ? (
              <div className="space-y-6">
                {/* Generated Email Preview */}
                <div className="bg-background rounded-2xl p-6 border border-border">
                  <div className="space-y-4">
                    {/* Subject */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-text-body">Subject</label>
                        <button
                          onClick={() => copyToClipboard(generatedEmail.subject)}
                          className="text-xs text-primary-accent hover:text-secondary-accent flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                      <input
                        type="text"
                        value={generatedEmail.subject}
                        onChange={(e) => setGeneratedEmail({...generatedEmail, subject: e.target.value})}
                        className="w-full px-4 py-3 bg-card-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent font-medium text-text-body"
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-text-body">Email Body</label>
                        <button
                          onClick={() => copyToClipboard(generatedEmail.body)}
                          className="text-xs text-primary-accent hover:text-secondary-accent flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                      <textarea
                        value={generatedEmail.body}
                        onChange={(e) => setGeneratedEmail({...generatedEmail, body: e.target.value})}
                        rows="12"
                        className="w-full px-4 py-3 bg-card-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent resize-none text-text-body"
                      />
                    </div>
                  </div>
                </div>

                {/* Send Mode Selection */}
                <div className="bg-background rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-text-heading mb-4 flex items-center gap-2">
                    <Send className="w-4 h-4 text-primary-accent" />
                    Send Options
                  </h3>
                  
                  {/* Mode Toggle */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setSendMode("single")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        sendMode === "single"
                          ? 'bg-primary-accent text-white shadow-lg'
                          : 'bg-card-background text-text-body border-2 border-border hover:border-primary-accent'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Single Send
                    </button>
                    <button
                      onClick={() => setSendMode("bulk")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        sendMode === "bulk"
                          ? 'bg-primary-accent text-white shadow-lg'
                          : 'bg-card-background text-text-body border-2 border-border hover:border-primary-accent'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Bulk Send
                    </button>
                  </div>

                  {/* Recipient Input */}
                  {sendMode === "single" ? (
                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Recipient Email</label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent bg-card-background text-text-body"
                        placeholder="recipient@example.com"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Upload CSV File</label>
                      <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-accent/10 file:text-primary-accent hover:file:bg-primary-accent/20 bg-card-background text-text-body"
                      />
                      <p className="text-xs text-text-muted mt-2">
                        CSV format: email,name (one recipient per line)
                      </p>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-semibold text-text-body mb-3">
                    Attachments (Optional)
                  </label>
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    multiple
                    onChange={handleAttachments}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-accent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-secondary-accent/10 file:text-secondary-accent hover:file:bg-secondary-accent/20 bg-card-background text-text-body"
                  />
                  {attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-card-background border border-border rounded-lg text-sm">
                          <FileText className="w-4 h-4 text-text-muted" />
                          <span className="text-text-body">{file.name}</span>
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
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-success to-emerald-500 text-white font-semibold rounded-2xl text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSending ? (
                      <>
                        <InlineLoader size="default" />
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
                    className="px-6 py-4 bg-card-background text-text-body border border-border font-semibold rounded-2xl hover:bg-background transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-card-background border border-border rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-12 h-12 text-primary-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text-heading mb-2">No Email Generated</h3>
                <p className="text-text-muted max-w-sm">Upload an event banner and provide context to generate your email</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-card-background rounded-3xl p-8 shadow-xl border border-border">
          <h3 className="text-2xl font-bold text-text-heading mb-6 text-center">AI Email Features</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-accent/10 border border-border rounded-xl flex items-center justify-center mx-auto mb-3">
                <Wand2 className="w-6 h-6 text-primary-accent" />
              </div>
              <h4 className="font-semibold text-text-heading mb-2">AI-Powered</h4>
              <p className="text-sm text-text-body">Advanced AI analyzes your event and generates perfect emails</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-accent/10 border border-border rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary-accent" />
              </div>
              <h4 className="font-semibold text-text-heading mb-2">Bulk Sending</h4>
              <p className="text-sm text-text-body">Send to multiple recipients via CSV upload</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 border border-border rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-semibold text-text-heading mb-2">Instant Generation</h4>
              <p className="text-sm text-text-body">Get professional emails in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-accent/10 border border-border rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileUp className="w-6 h-6 text-secondary-accent" />
              </div>
              <h4 className="font-semibold text-text-heading mb-2">Attachments</h4>
              <p className="text-sm text-text-body">Include PDFs, images, and other files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
