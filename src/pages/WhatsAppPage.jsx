import React, { useState } from "react";

const WhatsappPage = () => {
  const [preview, setPreview] = useState("");

  const sendWhatsApp = (e) => {
    e.preventDefault();
    const phone = e.target.phoneNumber.value;
    const message = e.target.whatsappMessage.value;
    const delay = e.target.messageDelay.value || 0;

    setPreview(
      `<div class="mb-2"><strong>To:</strong> ${phone}</div>
       <div class="mb-2"><strong>Delay:</strong> ${delay} seconds</div>
       <div class="bg-white p-3 rounded-lg border-l-4 border-green-500">${message}</div>
       <div class="mt-3 text-green-600 font-semibold">✓ Message ready to send!</div>`
    );

    setTimeout(() => {
      const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }, delay * 1000);
  };

  return (
    <div className="min-h-screen flex justify-center py-16">
      <div className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Send Automated WhatsApp Messages
          </h2>
          <p className="text-gray-600">Instantly send WhatsApp messages without saving contacts.</p>
        </div>

        <form onSubmit={sendWhatsApp} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number (with country code)</label>
            <input
              type="tel"
              name="phoneNumber"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-300 focus:border-transparent"
              placeholder="+1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              name="whatsappMessage"
              rows="6"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-300 focus:border-transparent resize-none"
              placeholder="Type your WhatsApp message here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Delay (in seconds) - Optional</label>
            <input
              type="number"
              name="messageDelay"
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-300 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <button
            type="submit"
            className="btn-hover w-full py-4 bg-gradient-to-r from-green-300 to-emerald-300 text-gray-800 font-semibold rounded-2xl text-lg"
          >
            Send Message
          </button>
        </form>

        {preview && (
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-4">Message Preview:</h3>
            <div
              className="bg-green-100 p-4 rounded-xl border text-sm"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsappPage;
