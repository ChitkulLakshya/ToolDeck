import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // <-- updated import

const QRCodePage = () => {
  const [qrPreview, setQrPreview] = useState("");

  const generateQR = (e) => {
    e.preventDefault();
    const input = e.target.qrInput.value;
    setQrPreview(input);
  };

  return (
    <div className="min-h-screen flex justify-center py-16">
      <div className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create a QR Code in Seconds</h2>
          <p className="text-gray-600">Enter any URL or text to instantly generate a QR code.</p>
        </div>

        <form onSubmit={generateQR} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL or Text</label>
            <input
              type="text"
              name="qrInput"
              className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-center text-lg"
              placeholder="Drop your URL here or type any text..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn-hover w-full py-4 bg-gradient-to-r from-pink-300 to-rose-300 text-gray-800 font-semibold rounded-2xl text-lg"
          >
            Generate QR Code
          </button>
        </form>

        {qrPreview && (
          <div className="mt-8 text-center p-6 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-4">Your QR Code:</h3>
            <div className="bg-gray-100 p-12 rounded-2xl inline-block">
              <QRCodeCanvas value={qrPreview} size={180} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodePage;
