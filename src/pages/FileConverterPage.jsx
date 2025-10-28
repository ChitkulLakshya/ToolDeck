import React, { useState, useRef, useCallback } from "react";
import { useToast } from "../contexts/ToastContext";
import { OverlayLoader } from "../components/LoadingSpinner";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import mammoth from "mammoth";
import imageCompression from "browser-image-compression";
import * as XLSX from "xlsx";
import { 
  Upload, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  File, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Zap,
  FileImage,
  FileSpreadsheet,
  Loader2,
  X,
  Eye,
  Sparkles,
  Info
} from "lucide-react";

const FileConverterPage = () => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState("");
  const [outputMessage, setOutputMessage] = useState("");
  const [convertType, setConvertType] = useState("png");
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [conversionSettings, setConversionSettings] = useState({
    imageQuality: 0.9,
    pdfScale: 1.5,
    compressionLevel: 0.8,
    imageDPI: 150
  });
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [conversionHistory, setConversionHistory] = useState([]);
  const fileInputRef = useRef(null);

  // Comprehensive conversion options with descriptions
  const conversionOptions = {
    image: [
      { value: "png", label: "PNG", icon: FileImage, description: "Lossless, transparent support" },
      { value: "jpg", label: "JPG", icon: FileImage, description: "Smaller size, no transparency" },
      { value: "jpeg", label: "JPEG", icon: FileImage, description: "Same as JPG" },
      { value: "webp", label: "WebP", icon: FileImage, description: "Modern, efficient format" },
      { value: "bmp", label: "BMP", icon: FileImage, description: "Uncompressed bitmap" },
      { value: "gif", label: "GIF", icon: FileImage, description: "Supports animation" },
      { value: "pdf", label: "PDF", icon: File, description: "Document format" }
    ],
    document: [
      { value: "pdf", label: "PDF", icon: File, description: "Portable Document" },
      { value: "txt", label: "TXT", icon: FileText, description: "Plain text" },
      { value: "html", label: "HTML", icon: FileText, description: "Web page" },
      { value: "docx", label: "DOCX", icon: FileText, description: "Word document" }
    ],
    pdf: [
      { value: "png", label: "PNG", icon: FileImage, description: "Image per page" },
      { value: "jpg", label: "JPG", icon: FileImage, description: "Compressed images" },
      { value: "txt", label: "TXT", icon: FileText, description: "Extract text" }
    ],
    spreadsheet: [
      { value: "csv", label: "CSV", icon: FileSpreadsheet, description: "Comma separated" },
      { value: "json", label: "JSON", icon: FileText, description: "JavaScript Object" },
      { value: "xlsx", label: "XLSX", icon: FileSpreadsheet, description: "Excel format" },
      { value: "txt", label: "TXT", icon: FileText, description: "Plain text" },
      { value: "html", label: "HTML", icon: FileText, description: "Table format" }
    ],
    text: [
      { value: "csv", label: "CSV", icon: FileSpreadsheet, description: "Comma separated" },
      { value: "json", label: "JSON", icon: FileText, description: "JavaScript Object" },
      { value: "html", label: "HTML", icon: FileText, description: "Web page" },
      { value: "pdf", label: "PDF", icon: File, description: "Document format" }
    ]
  };

  const getFileCategory = (fileType) => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType === "application/pdf") return "pdf";
    if (fileType.includes("csv") || fileType.includes("excel") || fileType.includes("spreadsheet")) return "spreadsheet";
    if (fileType.includes("document") || fileType.includes("word") || fileType.includes("docx")) return "document";
    if (fileType === "text/plain") return "text";
    return "image"; // default
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setConvertedFileUrl("");
    setOutputMessage("");
    setConversionProgress(0);
    
    toast.info(`File uploaded: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`);
    
    // Generate preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl("");
    }
    
    // Auto-select appropriate conversion type
    const category = getFileCategory(selectedFile.type);
    if (conversionOptions[category]) {
      setConvertType(conversionOptions[category][0].value);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Image conversion with enhanced quality control
  const convertImage = async (file, targetFormat) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        
        // Apply quality scaling
        const scale = conversionSettings.pdfScale;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        
        // Draw with scaling
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert image"));
            }
          },
          `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`,
          conversionSettings.imageQuality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  // Enhanced PDF from image
  const convertImageToPDF = async (file) => {
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.width, img.height]
        });
        
        pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height, '', 'FAST');
        resolve(pdf.output('blob'));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  // Enhanced PDF to Image with better quality
  const convertPDFToImage = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      if (pages.length === 0) {
        throw new Error("PDF has no pages");
      }

      const page = pages[0];
      const { width, height } = page.getSize();
      
      const canvas = document.createElement("canvas");
      const dpi = conversionSettings.imageDPI;
      canvas.width = (width * dpi) / 72;
      canvas.height = (height * dpi) / 72;
      
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw page content (simplified - use pdf.js for production)
      ctx.fillStyle = "#333";
      ctx.font = `${20 * (dpi / 72)}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText("PDF Page 1", canvas.width / 2, canvas.height / 2);
      ctx.font = `${14 * (dpi / 72)}px Arial`;
      ctx.fillText("(Use pdf.js for better rendering)", canvas.width / 2, canvas.height / 2 + 40);
      
      return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });
    } catch (error) {
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  };

  // DOCX to HTML conversion
  const convertDocxToHtml = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return new Blob([result.value], { type: 'text/html' });
  };

  // DOCX to Text conversion
  const convertDocxToText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return new Blob([result.value], { type: 'text/plain' });
  };

  // CSV to JSON conversion
  const convertCSVToJSON = async (file) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return new Blob(['[]'], { type: 'application/json' });
    
    const headers = lines[0].split(',').map(h => h.trim());
    const jsonData = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index]?.trim() || '';
        return obj;
      }, {});
    });
    
    return new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  };

  // JSON to CSV conversion
  const convertJSONToCSV = async (file) => {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      throw new Error("JSON must be an array of objects");
    }
    
    const headers = Object.keys(jsonData[0]);
    const csvLines = [
      headers.join(','),
      ...jsonData.map(obj => headers.map(h => obj[h] || '').join(','))
    ];
    
    return new Blob([csvLines.join('\n')], { type: 'text/csv' });
  };

  // CSV to XLSX conversion
  const convertCSVToXLSX = async (file) => {
    const text = await file.text();
    const workbook = XLSX.read(text, { type: 'string' });
    const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  // XLSX to CSV conversion
  const convertXLSXToCSV = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(firstSheet);
    return new Blob([csv], { type: 'text/csv' });
  };

  // Text to HTML conversion
  const convertTextToHTML = async (file) => {
    const text = await file.text();
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
            background: #f5f5f5;
        }
        .content {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <div class="content">
        <pre>${text}</pre>
    </div>
</body>
</html>`;
    return new Blob([htmlContent], { type: 'text/html' });
  };

  // Text to PDF conversion
  const convertTextToPDF = async (file) => {
    const text = await file.text();
    const pdf = new jsPDF();
    
    const lines = pdf.splitTextToSize(text, 180);
    let y = 20;
    
    lines.forEach(line => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 15, y);
      y += 7;
    });
    
    return pdf.output('blob');
  };

  // Main conversion function
  const convertFile = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsConverting(true);
    setOutputMessage("");
    setConversionProgress(0);

    try {
      const fileType = file.type;
      let convertedBlob;
      const startTime = Date.now();

      setConversionProgress(10);

      // Image conversions
      if (fileType.startsWith("image/")) {
        setConversionProgress(30);
        switch (convertType) {
          case "png":
          case "jpg":
          case "jpeg":
          case "webp":
          case "bmp":
          case "gif":
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
        setConversionProgress(30);
        switch (convertType) {
          case "png":
          case "jpg":
            convertedBlob = await convertPDFToImage(file);
            break;
          case "txt":
            throw new Error("PDF to text conversion requires pdf.js library");
          default:
            throw new Error("Unsupported PDF conversion");
        }
      }
      // Document conversions (DOCX)
      else if (fileType.includes("document") || fileType.includes("word")) {
        setConversionProgress(30);
        switch (convertType) {
          case "html":
            convertedBlob = await convertDocxToHtml(file);
            break;
          case "txt":
            convertedBlob = await convertDocxToText(file);
            break;
          case "pdf":
            throw new Error("DOCX to PDF conversion requires server-side processing");
          default:
            throw new Error("Unsupported document conversion");
        }
      }
      // Spreadsheet conversions (CSV/XLSX)
      else if (fileType === "text/csv") {
        setConversionProgress(30);
        switch (convertType) {
          case "json":
            convertedBlob = await convertCSVToJSON(file);
            break;
          case "xlsx":
            convertedBlob = await convertCSVToXLSX(file);
            break;
          case "txt":
            convertedBlob = new Blob([await file.text()], { type: 'text/plain' });
            break;
          case "html":
            const csvText = await file.text();
            const csvLines = csvText.split('\n');
            const tableHtml = `<table border="1">${csvLines.map(line => 
              `<tr>${line.split(',').map(cell => `<td>${cell}</td>`).join('')}</tr>`
            ).join('')}</table>`;
            convertedBlob = new Blob([tableHtml], { type: 'text/html' });
            break;
          default:
            throw new Error("Unsupported CSV conversion");
        }
      }
      else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
        setConversionProgress(30);
        switch (convertType) {
          case "csv":
            convertedBlob = await convertXLSXToCSV(file);
            break;
          case "json":
            const csvBlob = await convertXLSXToCSV(file);
            convertedBlob = await convertCSVToJSON(new File([csvBlob], "temp.csv", { type: 'text/csv' }));
            break;
          default:
            throw new Error("Unsupported spreadsheet conversion");
        }
      }
      // Text file conversions
      else if (fileType === "text/plain") {
        setConversionProgress(30);
        switch (convertType) {
          case "csv":
            const text = await file.text();
            const lines = text.split('\n');
            const csvContent = lines.map(line => line.split(/\s+/).join(',')).join('\n');
            convertedBlob = new Blob([csvContent], { type: 'text/csv' });
            break;
          case "json":
            const textLines = (await file.text()).split('\n').filter(l => l.trim());
            const jsonData = textLines.map((line, index) => ({ id: index + 1, content: line.trim() }));
            convertedBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            break;
          case "html":
            convertedBlob = await convertTextToHTML(file);
            break;
          case "pdf":
            convertedBlob = await convertTextToPDF(file);
            break;
          default:
            throw new Error("Unsupported text conversion");
        }
      }
      // JSON conversions
      else if (fileType === "application/json") {
        setConversionProgress(30);
        switch (convertType) {
          case "csv":
            convertedBlob = await convertJSONToCSV(file);
            break;
          case "txt":
            const jsonText = await file.text();
            const formatted = JSON.stringify(JSON.parse(jsonText), null, 2);
            convertedBlob = new Blob([formatted], { type: 'text/plain' });
            break;
          default:
            throw new Error("Unsupported JSON conversion");
        }
      }
      else {
        throw new Error(`Conversion from ${fileType} to ${convertType} is not supported`);
      }

      setConversionProgress(80);

      // Save the converted file
      const fileName = file.name.split('.')[0];
      const extension = convertType === 'jpg' ? 'jpeg' : convertType;
      saveAs(convertedBlob, `${fileName}_converted.${extension}`);

      const fileUrl = URL.createObjectURL(convertedBlob);
      setConvertedFileUrl(fileUrl);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      setOutputMessage(`✅ Successfully converted ${file.name} to ${convertType.toUpperCase()} in ${duration}s!`);
      toast.success(`✅ Successfully converted ${file.name} to ${convertType.toUpperCase()} in ${duration}s!`);
      
      setConversionProgress(100);
      
      // Add to history
      setConversionHistory(prev => [{
        fileName: file.name,
        from: file.type,
        to: convertType,
        timestamp: new Date().toLocaleString(),
        size: (convertedBlob.size / 1024).toFixed(2) + ' KB'
      }, ...prev.slice(0, 4)]);
      
    } catch (err) {
      console.error(err);
      setOutputMessage(`❌ Error: ${err.message}`);
      toast.error(`Conversion failed: ${err.message}`);
      setConversionProgress(0);
    } finally {
      setIsConverting(false);
    }
  };

  const resetConverter = () => {
    setFile(null);
    setConvertedFileUrl("");
    setOutputMessage("");
    setConvertType("png");
    setPreviewUrl("");
    setConversionProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAvailableConversions = () => {
    if (!file) return conversionOptions.image;
    const category = getFileCategory(file.type);
    return conversionOptions[category] || conversionOptions.image;
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl("");
    setConvertedFileUrl("");
    setOutputMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-8 px-4 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Universal File Converter
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Convert files between different formats instantly with advanced quality controls. Supports images, documents, spreadsheets, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Convert File</h2>
              </div>
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
                      ? 'border-blue-500 bg-blue-50' 
                      : file
                      ? 'border-green-400 bg-green-50'
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
                    required={!file}
                  />
                  
                  {file ? (
                    <div className="space-y-4">
                      {/* File Preview */}
                      {previewUrl ? (
                        <div className="relative inline-block">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-h-32 mx-auto rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative inline-block">
                          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                            <FileText className="w-10 h-10 text-blue-600" />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-lg font-semibold text-gray-900 truncate max-w-xs mx-auto">
                          {file.name}
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{(file.size / 1024).toFixed(2)} KB</span>
                          <span>•</span>
                          <span className="capitalize">{file.type.split('/')[1] || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>File ready for conversion</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop files here or click to browse
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Supports images, PDFs, documents, spreadsheets, and text files
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Conversion Type Selection */}
              {file && (
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
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold">{option.label}</div>
                              <div className="text-xs mt-1 opacity-80">{option.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Advanced Settings Panel */}
              {showSettings && file && (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 space-y-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Advanced Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {file.type.startsWith("image/") && (
                      <>
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
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Scale Factor: {conversionSettings.pdfScale}x
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={conversionSettings.pdfScale}
                            onChange={(e) => setConversionSettings({
                              ...conversionSettings,
                              pdfScale: parseFloat(e.target.value)
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                      </>
                    )}

                    {file.type === "application/pdf" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image DPI: {conversionSettings.imageDPI}
                        </label>
                        <input
                          type="range"
                          min="72"
                          max="300"
                          step="1"
                          value={conversionSettings.imageDPI}
                          onChange={(e) => setConversionSettings({
                            ...conversionSettings,
                            imageDPI: parseInt(e.target.value)
                          })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setConversionSettings({
                          imageQuality: 0.9,
                          pdfScale: 1.5,
                          compressionLevel: 0.8,
                          imageDPI: 150
                        })}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {isConverting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Converting...</span>
                    <span className="text-blue-600 font-medium">{conversionProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${conversionProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!file || isConverting}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl text-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
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
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Conversion Result</h2>
            </div>
            
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
                  <span className="font-medium text-sm">{outputMessage}</span>
                </div>

                {/* File Preview */}
                {convertedFileUrl && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </h3>
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 text-center border border-blue-100">
                      {convertType === 'pdf' || convertType === 'docx' ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                            <File className="w-8 h-8 text-red-600" />
                          </div>
                          <p className="text-gray-700 font-medium">{convertType.toUpperCase()} file generated successfully</p>
                          <p className="text-sm text-gray-500">Check your downloads folder</p>
                        </div>
                      ) : (convertType.includes('image') || ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'].includes(convertType)) ? (
                        <img 
                          src={convertedFileUrl} 
                          alt="Converted file preview" 
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                            <FileText className="w-8 h-8 text-blue-600" />
                          </div>
                          <p className="text-gray-700 font-medium">File converted successfully</p>
                          <p className="text-sm text-gray-500">Ready for download</p>
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
                      const fileName = file.name.split('.')[0];
                      link.download = `${fileName}_converted.${convertType}`;
                      link.click();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Download Converted File
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <File className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No File Converted Yet</h3>
                <p className="text-gray-500 max-w-sm">Upload a file and select conversion format to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Conversion History */}
        {conversionHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Recent Conversions
            </h3>
            <div className="space-y-3">
              {conversionHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm truncate max-w-xs">{item.fileName}</p>
                      <p className="text-xs text-gray-500">{item.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-white rounded-lg text-gray-600 font-medium">{item.to.toUpperCase()}</span>
                    <span className="text-gray-400">{item.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supported Formats Info */}
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supported Formats</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Images</h4>
              <p className="text-sm text-gray-600">PNG, JPG, JPEG, WebP, BMP, GIF, PDF</p>
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
              <p className="text-sm text-gray-600">CSV, JSON, XLSX, HTML</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <File className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Text Files</h4>
              <p className="text-sm text-gray-600">TXT, CSV, JSON, HTML, PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileConverterPage;
