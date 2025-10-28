import React, { useState } from "react";

const EmailPage = () => {
  const [preview, setPreview] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const handleCsvUpload = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleAttachments = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const generateEmail = (e) => {
    e.preventDefault();
    const email = e.target.senderEmail.value;
    const subject = e.target.emailSubject.value;
    const body = e.target.emailBody.value;

    let filesList = attachments.length
      ? `<div><strong>Attachments:</strong> ${attachments.map(f => f.name).join(", ")}</div>`
      : "";

    let csvInfo = csvFile ? `<div><strong>CSV File:</strong> ${csvFile.name}</div>` : "";

    setPreview(
      `<div class="border-b pb-2 mb-2">
        <strong>From:</strong> ${email}<br/>
        <strong>Subject:</strong> ${subject}
      </div>
      <div class="whitespace-pre-wrap mb-2">${body}</div>
      ${csvInfo}
      ${filesList}`
    );
  };

  return (
    <div className="min-h-screen flex justify-center py-16">
      <div className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Generate Professional Emails Instantly
          </h2>
          <p className="text-gray-600">
            Fill in your details and generate structured emails easily.
          </p>
        </div>

        <form onSubmit={generateEmail} className="space-y-6">
          {/* Sender Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="senderEmail"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Password</label>
              <input
                type="password"
                name="emailPassword"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                placeholder="Your email password"
              />
            </div>
          </div>

          {/* Subject and Body */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              name="emailSubject"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
              placeholder="Email subject"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message Body</label>
            <textarea
              name="emailBody"
              rows="6"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent resize-none"
              placeholder="Write your email message here..."
              required
            />
          </div>

          {/* CSV Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CSV file </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attach PDFs/Files (Optional)</label>
            <input
              type="file"
              multiple
              onChange={handleAttachments}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="btn-hover w-full py-4 bg-gradient-to-r from-cyan-300 to-blue-300 text-gray-800 font-semibold rounded-2xl text-lg"
          >
            Generate Email
          </button>
        </form>

        {preview && (
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-4">Generated Email Preview:</h3>
            <div
              className="bg-white p-4 rounded-xl border text-sm"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPage;
