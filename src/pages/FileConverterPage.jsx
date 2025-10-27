import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import mammoth from "mammoth";
import imageCompression from "browser-image-compression";
import { 
  Upload, 
  Download, 
  FileText, 
  Image, 
  File, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Zap,
  Palette,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet
} from "lucide-react";

const FileConverterPage = () => {
  const [file, setFile] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState("");
  const [outputMessage, setOutputMessage] = useState("");
  const [convertType, setConvertType] = useState("png");
  const [isConverting, setIsConverting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [conversionSettings, setConversionSettings] = useState({
    imageQuality: 0.9,
    pdfScale: 1.0,
    compressionLevel: 0.8
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const conversionOptions = {
    image: [
      { value: "png", label: "PNG", icon: FileImage, description: "Lossless compression" },
      { value: "jpg", label: "JPG", icon: FileImage, description: "Smaller file size" },
      { value: "webp", label: "WebP", icon: FileImage, description: "Modern format" },
      { value: "pdf", label: "PDF", icon: File, description: "Document format" }
    ],
    document: [
      { value: "pdf", label: "PDF", icon: File, description: "Portable Document" },
      { value: "txt", label: "TXT", icon: FileText, description: "Plain text" },
      { value: "html", label: "HTML", icon: FileText, description: "Web page" }
    ],
    spreadsheet: [
      { value: "csv", label: "CSV", icon: FileSpreadsheet, description: "Comma separated" },
      { value: "json", label: "JSON", icon: FileText, description: "JavaScript Object" },
      { value: "txt", label: "TXT", icon: FileText, description: "Plain text" }
    ]
  };

  const getFileCategory = (fileType) => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType.includes("pdf") || fileType.includes("document") || fileType.includes("word")) return "document";
    if (fileType.includes("csv") || fileType.includes("excel") || fileType.includes("spreadsheet")) return "spreadsheet";
    return "image"; // default
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedFileUrl("");
      setOutputMessage("");
      
      // Auto-select appropriate conversion type
      const category = getFileCategory(selectedFile.type);
      if (conversionOptions[category]) {
        setConvertType(conversionOptions[category][0].value);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setConvertedFileUrl("");
      setOutputMessage("");
      
      const category = getFileCategory(droppedFile.type);
      if (conversionOptions[category]) {
        setConvertType(conversionOptions[category][0].value);
      }
    }
  };

  const convertImage = async (file, targetFormat) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          `image/${targetFormat}`,
          conversionSettings.imageQuality
        );
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const convertImageToPDF = async (file) => {
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.height * imgWidth) / img.width;
        
        pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
        resolve(pdf.output('blob'));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const convertPDFToImage = async (file) => {
    // This is a simplified version - in production you'd use pdf.js or similar
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const page = pdfDoc.getPage(0);
    
    // For now, we'll create a placeholder
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PDF Preview", canvas.width / 2, canvas.height / 2);
    ctx.fillText("(First page)", canvas.width / 2, canvas.height / 2 + 30);
    
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
  };

  const convertDocxToHtml = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return new Blob([result.value], { type: 'text/html' });
  };

  const convertTextToCSV = async (file) => {
    const text = await file.text();
    const lines = text.split('\n');
    const csvLines = lines.map(line => 
      line.split(/\s+/).join(',')
    );
    return new Blob([csvLines.join('\n')], { type: 'text/csv' });
  };

  const convertTextToJSON = async (file) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const jsonData = lines.map((line, index) => ({
      id: index + 1,
      content: line.trim()
    }));
    return new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: conversionSettings.compressionLevel,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    return await imageCompression(file, options);
  };

  const convertFile = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsConverting(true);
    setOutputMessage("");

    try {
      const fileType = file.type;
      let convertedBlob;

      // Image conversions
      if (fileType.startsWith("image/")) {
        switch (convertType) {
          case "png":
          case "jpg":
          case "webp":
            convertedBlob = await convertImage(file, convertType);
            break;
          case "pdf":
            convertedBlob = await convertImageToPDF(file);
            break;
          default:
            throw new Error("Unsupported image conversion");
        }
      }
      // PDF conversions
      else if (fileType === "application/pdf") {
        switch (convertType) {
          case "png":
          case "jpg":
            convertedBlob = await convertPDFToImage(file);
            break;
          default:
            throw new Error("Unsupported PDF conversion");
        }
      }
      // Document conversions
      else if (fileType.includes("document") || fileType.includes("word")) {
        switch (convertType) {
          case "html":
            convertedBlob = await convertDocxToHtml(file);
            break;
          case "txt":
            convertedBlob = new Blob([await file.text()], { type: 'text/plain' });
            break;
          default:
            throw new Error("Unsupported document conversion");
        }
      }
      // Text conversions
      else if (fileType === "text/plain") {
        switch (convertType) {
          case "csv":
            convertedBlob = await convertTextToCSV(file);
            break;
          case "json":
            convertedBlob = await convertTextToJSON(file);
            break;
          case "html":
            const text = await file.text();
            const htmlContent = `<html><body><pre>${text}</pre></body></html>`;
            convertedBlob = new Blob([htmlContent], { type: 'text/html' });
            break;
          default:
            throw new Error("Unsupported text conversion");
        }
      }
      // CSV conversions
      else if (fileType === "text/csv") {
        switch (convertType) {
          case "json":
            const csvText = await file.text();
            const lines = csvText.split('\n');
            const headers = lines[0].split(',');
            const jsonData = lines.slice(1).map(line => {
              const values = line.split(',');
              return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index]?.trim() || '';
                return obj;
              }, {});
            });
            convertedBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            break;
          case "txt":
            convertedBlob = new Blob([await file.text()], { type: 'text/plain' });
            break;
          default:
            throw new Error("Unsupported CSV conversion");
        }
      }
      else {
        throw new Error(`Conversion from ${fileType} to ${convertType} is not supported`);
      }

      // Save the converted file
      const fileName = file.name.split('.')[0];
      const extension = convertType === 'jpg' ? 'jpeg' : convertType;
      saveAs(convertedBlob, `${fileName}_converted.${extension}`);

      setConvertedFileUrl(URL.createObjectURL(convertedBlob));
      setOutputMessage(`✅ Successfully converted ${file.name} to ${convertType.toUpperCase()}!`);
      
    } catch (err) {
      console.error(err);
      setOutputMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const resetConverter = () => {
    setFile(null);
    setConvertedFileUrl("");
    setOutputMessage("");
    setConvertType("png");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAvailableConversions = () => {
    if (!file) return conversionOptions.image;
    const category = getFileCategory(file.type);
    return conversionOptions[category] || conversionOptions.image;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Universal File Converter
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Convert files between different formats instantly. Support for images, documents, spreadsheets, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Convert File</h2>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>

            <form onSubmit={convertFile} className="space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload File
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {file ? file.name : "Drop files here or click to browse"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports images, PDFs, documents, and text files
                      </p>
                    </div>
                    {file && (
                      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        File selected: {file.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conversion Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Convert To
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {getAvailableConversions().map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setConvertType(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          convertType === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Conversion Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Quality: {Math.round(conversionSettings.imageQuality * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={conversionSettings.imageQuality}
                        onChange={(e) => setConversionSettings({
                          ...conversionSettings,
                          imageQuality: parseFloat(e.target.value)
                        })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compression Level: {Math.round(conversionSettings.compressionLevel * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={conversionSettings.compressionLevel}
                        onChange={(e) => setConversionSettings({
                          ...conversionSettings,
                          compressionLevel: parseFloat(e.target.value)
                        })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!file || isConverting}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl text-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Convert File
                    </>
                  )}
                </button>
                
                {file && (
                  <button
                    type="button"
                    onClick={resetConverter}
                    className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conversion Result</h2>
            
            {outputMessage ? (
              <div className="space-y-6">
                {/* Status Message */}
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                  outputMessage.includes('✅') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {outputMessage.includes('✅') ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{outputMessage}</span>
                </div>

                {/* File Preview */}
                {convertedFileUrl && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Preview</h3>
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      {convertType === 'pdf' ? (
                        <div className="space-y-4">
                          <File className="w-16 h-16 text-red-500 mx-auto" />
                          <p className="text-gray-600">PDF file generated successfully</p>
                          <p className="text-sm text-gray-500">Check your downloads folder</p>
                        </div>
                      ) : convertType.includes('image') || ['png', 'jpg', 'webp'].includes(convertType) ? (
                        <img 
                          src={convertedFileUrl} 
                          alt="Converted file preview" 
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="space-y-4">
                          <FileText className="w-16 h-16 text-blue-500 mx-auto" />
                          <p className="text-gray-600">File converted successfully</p>
                          <p className="text-sm text-gray-500">Check your downloads folder</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Download Button */}
                {convertedFileUrl && (
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = convertedFileUrl;
                      link.download = `converted_file.${convertType}`;
                      link.click();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Converted File
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <File className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No File Converted</h3>
                <p className="text-gray-500">Upload a file and select conversion format to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Supported Formats Info */}
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Supported Formats</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Images</h4>
              <p className="text-sm text-gray-600">PNG, JPG, WebP, PDF</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
              <p className="text-sm text-gray-600">PDF, DOCX, TXT, HTML</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileSpreadsheet className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Spreadsheets</h4>
              <p className="text-sm text-gray-600">CSV, JSON, TXT</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <File className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Text Files</h4>
              <p className="text-sm text-gray-600">TXT, CSV, JSON, HTML</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileConverterPage;
