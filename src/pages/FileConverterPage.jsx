import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const FileConverterPage = () => {
  const [file, setFile] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState("");
  const [outputMessage, setOutputMessage] = useState("");
  const [convertType, setConvertType] = useState("png"); // default type

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setConvertedFileUrl("");
    setOutputMessage("");
  };

  const convertFile = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const fileType = file.type;

      // Image conversion
      if (fileType.startsWith("image/") && ["png", "jpg"].includes(convertType)) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              const url = URL.createObjectURL(blob);
              setConvertedFileUrl(url);
              setOutputMessage(`Converted ${file.name} to ${convertType.toUpperCase()}!`);

              const link = document.createElement("a");
              link.href = url;
              link.download = `converted.${convertType}`;
              link.click();
            },
            `image/${convertType}`,
            1
          );
        };
      } 

      // TXT → CSV
      else if (fileType === "text/plain" && convertType === "csv") {
        const text = await file.text();
        const csvText = text.replace(/\t/g, ",");
        const blob = new Blob([csvText], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        setConvertedFileUrl(url);
        setOutputMessage(`Converted ${file.name} to CSV!`);
        const link = document.createElement("a");
        link.href = url;
        link.download = `converted.csv`;
        link.click();
      }

      // PDF → PNG (first page)
      else if (fileType === "application/pdf" && convertType === "png") {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const page = pdfDoc.getPage(0);
        // Using pdf-lib alone doesn't render image. We'll display a message instead
        setOutputMessage("PDF → Image conversion requires external library. Preview not supported in free version.");
      }

      else {
        setOutputMessage(`Conversion of ${file.name} to ${convertType.toUpperCase()} is not supported yet.`);
      }
    } catch (err) {
      console.error(err);
      setOutputMessage("Error converting file. Try another file type.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-16 bg-gray-50">
      <div className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">File Converter</h2>
          <p className="text-gray-600">
            Upload a file and convert it to another format instantly.
          </p>
        </div>

        <form onSubmit={convertFile} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Convert To
            </label>
            <select
              value={convertType}
              onChange={(e) => setConvertType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              <option value="png">PNG (Images / PDF first page)</option>
              <option value="jpg">JPG (Images only)</option>
              <option value="csv">CSV (TXT only)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-hover w-full py-4 bg-gradient-to-r from-green-300 to-teal-300 text-gray-800 font-semibold rounded-2xl text-lg"
          >
            Convert File
          </button>
        </form>

        {outputMessage && (
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl text-center text-gray-700 font-medium">
            {outputMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileConverterPage;
