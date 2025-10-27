import React, { useState, useRef } from "react";
import { Mail, Paperclip, FileText, Send, Download, Eye, Sparkles, Zap } from "lucide-react";

const EmailPage = () => {
  const [preview, setPreview] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleAttachments = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const generateEmail = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const email = e.target.senderEmail.value;
    const subject = e.target.emailSubject.value;
    const body = e.target.emailBody.value;

    let filesList = attachments.length
      ? `<div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
           <div class="flex items-center gap-2 mb-2">
             <Paperclip class="w-4 h-4 text-blue-600" />
             <strong class="text-blue-800">Attachments:</strong>
           </div>
           <div class="text-sm text-blue-700">${attachments.map(f => f.name).join(", ")}</div>
         </div>`
      : "";

    let csvInfo = csvFile 
      ? `<div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
           <div class="flex items-center gap-2 mb-2">
             <FileText class="w-4 h-4 text-green-600" />
             <strong class="text-green-800">CSV File:</strong>
           </div>
           <div class="text-sm text-green-700">${csvFile.name}</div>
         </div>`
      : "";

    setPreview(
      `<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div class="border-b border-gray-200 pb-4 mb-4">
          <div class="flex items-center gap-2 mb-2">
            <Mail class="w-4 h-4 text-gray-600" />
            <strong class="text-gray-800">From:</strong>
            <span class="text-gray-700">${email}</span>
          </div>
          <div class="flex items-center gap-2">
            <strong class="text-gray-800">Subject:</strong>
            <span class="text-gray-700">${subject}</span>
          </div>
        </div>
        <div class="prose prose-sm max-w-none">
          <div class="whitespace-pre-wrap text-gray-700 leading-relaxed">${body}</div>
        </div>
        ${csvInfo}
        ${filesList}
      </div>`
    );
    
    setIsGenerating(false);
    setShowPreview(true);
  };

  const downloadEmail = () => {
    const emailContent = `
From: ${document.querySelector('[name="senderEmail"]').value}
Subject: ${document.querySelector('[name="emailSubject"]').value}

${document.querySelector('[name="emailBody"]').value}

${csvFile ? `CSV File: ${csvFile.name}` : ''}
${attachments.length ? `Attachments: ${attachments.map(f => f.name).join(', ')}` : ''}
    `;
    
    const blob = new Blob([emailContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-draft.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setPreview("");
    setCsvFile(null);
    setAttachments([]);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Professional Email Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create professional emails with attachments and CSV data. Perfect for business communication and outreach campaigns.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Compose Email</h2>
            </div>

            <form onSubmit={generateEmail} className="space-y-6">
              {/* Sender Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="senderEmail"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Password
                  </label>
                  <input
                    type="password"
                    name="emailPassword"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    placeholder="Your email password"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Subject Line
                </label>
                <input
                  type="text"
                  name="emailSubject"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                  placeholder="Enter your email subject"
                  required
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Message Body
                </label>
                <textarea
                  name="emailBody"
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all resize-none"
                  placeholder="Write your professional email message here..."
                  required
                />
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload CSV File
                  </label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all hover:border-gray-400"
                    />
                    {csvFile && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <FileText className="w-4 h-4" />
                        <span>{csvFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Attach Files (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleAttachments}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all hover:border-gray-400"
                    />
                    {attachments.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                        <Paperclip className="w-4 h-4" />
                        <span>{attachments.length} file(s) selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl text-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate Email
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
              <Eye className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Email Preview</h2>
            </div>
            
            {showPreview ? (
              <div className="space-y-6">
                {/* Email Preview */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div dangerouslySetInnerHTML={{ __html: preview }} />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={downloadEmail}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Email Draft
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Your email is ready! Copy the content or download as a text file.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Email Generated</h3>
                <p className="text-gray-500">Fill in the form and click "Generate Email" to see your preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Email Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">CSV Integration</h4>
              <p className="text-sm text-gray-600">Upload CSV files for bulk email campaigns</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Paperclip className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">File Attachments</h4>
              <p className="text-sm text-gray-600">Attach PDFs, images, and documents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Export Options</h4>
              <p className="text-sm text-gray-600">Download email drafts as text files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
