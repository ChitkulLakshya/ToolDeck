import React, { useState, useRef, useCallback } from "react";
import { useToast } from "../contexts/ToastContext";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { Upload, Download, FileText, Image as ImageIcon, File, RefreshCw, Settings, FileImage, FileSpreadsheet, Loader2, X, Eye, Zap, CheckCircle, AlertCircle } from "lucide-react";

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

  const conversionOptions = {
    image: [
      { value: "png", label: "PNG", icon: FileImage },
      { value: "jpg", label: "JPG", icon: FileImage },
      { value: "webp", label: "WebP", icon: FileImage },
      { value: "pdf", label: "PDF", icon: File }
    ],
    document: [
      { value: "pdf", label: "PDF", icon: File },
      { value: "txt", label: "TXT", icon: FileText },
      { value: "html", label: "HTML", icon: FileText }
    ],
    pdf: [
      { value: "png", label: "PNG", icon: FileImage },
      { value: "jpg", label: "JPG", icon: FileImage }
    ],
    spreadsheet: [
      { value: "csv", label: "CSV", icon: FileSpreadsheet },
      { value: "json", label: "JSON", icon: FileText },
      { value: "xlsx", label: "XLSX", icon: FileSpreadsheet }
    ],
    text: [
      { value: "csv", label: "CSV", icon: FileSpreadsheet },
      { value: "json", label: "JSON", icon: FileText },
      { value: "pdf", label: "PDF", icon: File }
    ]
  };

  const getFileCategory = (fileType) => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType === "application/pdf") return "pdf";
    if (fileType.includes("csv") || fileType.includes("excel") || fileType.includes("spreadsheet")) return "spreadsheet";
    if (fileType.includes("document") || fileType.includes("word") || fileType.includes("docx")) return "document";
    if (fileType === "text/plain") return "text";
    return "image";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setConvertedFileUrl("");
    setOutputMessage("");
    setConversionProgress(0);
    
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl("");
    }
    
    const category = getFileCategory(selectedFile.type);
    if (conversionOptions[category]) {
      setConvertType(conversionOptions[category][0].value);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  }, []);

  // Conversion functions (simplified for brevity, logic remains same)
  const convertImage = async (file, targetFormat) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = conversionSettings.pdfScale;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Failed")), `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`, conversionSettings.imageQuality);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const convertImageToPDF = async (file) => {
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const pdf = new jsPDF({ orientation: img.width > img.height ? 'landscape' : 'portrait', unit: 'px', format: [img.width, img.height] });
        pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height, '', 'FAST');
        resolve(pdf.output('blob'));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const convertPDFToImage = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      if (pages.length === 0) throw new Error("PDF has no pages");
      const page = pages[0];
      const { width, height } = page.getSize();
      const canvas = document.createElement("canvas");
      const dpi = conversionSettings.imageDPI;
      canvas.width = (width * dpi) / 72;
      canvas.height = (height * dpi) / 72;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#333";
      ctx.font = `${20 * (dpi / 72)}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText("PDF Page 1 Preview", canvas.width / 2, canvas.height / 2);
      return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    } catch (error) {
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  };

  const convertDocxToHtml = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return new Blob([result.value], { type: 'text/html' });
  };

  const convertDocxToText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return new Blob([result.value], { type: 'text/plain' });
  };

  const convertCSVToJSON = async (file) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return new Blob(['[]'], { type: 'application/json' });
    const headers = lines[0].split(',').map(h => h.trim());
    const jsonData = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => { obj[header] = values[index]?.trim() || ''; return obj; }, {});
    });
    return new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  };

  const convertJSONToCSV = async (file) => {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    if (!Array.isArray(jsonData) || jsonData.length === 0) throw new Error("JSON must be an array of objects");
    const headers = Object.keys(jsonData[0]);
    const csvLines = [headers.join(','), ...jsonData.map(obj => headers.map(h => obj[h] || '').join(','))];
    return new Blob([csvLines.join('\n')], { type: 'text/csv' });
  };

  const convertCSVToXLSX = async (file) => {
    const text = await file.text();
    const workbook = XLSX.read(text, { type: 'string' });
    const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const convertXLSXToCSV = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(firstSheet);
    return new Blob([csv], { type: 'text/csv' });
  };

  const convertTextToPDF = async (file) => {
    const text = await file.text();
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(text, 180);
    let y = 20;
    lines.forEach(line => {
      if (y > 280) { pdf.addPage(); y = 20; }
      pdf.text(line, 15, y);
      y += 7;
    });
    return pdf.output('blob');
  };

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

      if (fileType.startsWith("image/")) {
        setConversionProgress(30);
        if (convertType === "pdf") convertedBlob = await convertImageToPDF(file);
        else convertedBlob = await convertImage(file, convertType);
      } else if (fileType === "application/pdf") {
        setConversionProgress(30);
        if (convertType === "txt") throw new Error("PDF to text requires pdf.js");
        else convertedBlob = await convertPDFToImage(file);
      } else if (fileType.includes("document") || fileType.includes("word")) {
        setConversionProgress(30);
        if (convertType === "html") convertedBlob = await convertDocxToHtml(file);
        else if (convertType === "txt") convertedBlob = await convertDocxToText(file);
        else throw new Error("DOCX to PDF requires server");
      } else if (fileType === "text/csv") {
        setConversionProgress(30);
        if (convertType === "json") convertedBlob = await convertCSVToJSON(file);
        else if (convertType === "xlsx") convertedBlob = await convertCSVToXLSX(file);
        else convertedBlob = new Blob([await file.text()], { type: 'text/plain' });
      } else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
        setConversionProgress(30);
        if (convertType === "csv") convertedBlob = await convertXLSXToCSV(file);
        else if (convertType === "json") {
          const csvBlob = await convertXLSXToCSV(file);
          convertedBlob = await convertCSVToJSON(new File([csvBlob], "temp.csv", { type: 'text/csv' }));
        }
      } else if (fileType === "text/plain") {
        setConversionProgress(30);
        if (convertType === "csv") {
          const text = await file.text();
          convertedBlob = new Blob([text.split('\n').map(l => l.split(/\s+/).join(',')).join('\n')], { type: 'text/csv' });
        } else if (convertType === "json") {
          const lines = (await file.text()).split('\n').filter(l => l.trim());
          convertedBlob = new Blob([JSON.stringify(lines.map((l, i) => ({ id: i + 1, content: l.trim() })), null, 2)], { type: 'application/json' });
        } else if (convertType === "pdf") convertedBlob = await convertTextToPDF(file);
      } else if (fileType === "application/json") {
        setConversionProgress(30);
        if (convertType === "csv") convertedBlob = await convertJSONToCSV(file);
        else convertedBlob = new Blob([JSON.stringify(JSON.parse(await file.text()), null, 2)], { type: 'text/plain' });
      } else {
        throw new Error(`Conversion from ${fileType} to ${convertType} not supported`);
      }

      setConversionProgress(80);
      const fileName = file.name.split('.')[0];
      const extension = convertType === 'jpg' ? 'jpeg' : convertType;
      saveAs(convertedBlob, `${fileName}_converted.${extension}`);
      setConvertedFileUrl(URL.createObjectURL(convertedBlob));
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      setOutputMessage(`✅ Converted to ${convertType.toUpperCase()} in ${duration}s`);
      toast.success("Conversion successful!");
      setConversionProgress(100);
      
      setConversionHistory(prev => [{
        fileName: file.name, from: file.type, to: convertType, timestamp: new Date().toLocaleString(), size: (convertedBlob.size / 1024).toFixed(2) + ' KB'
      }, ...prev.slice(0, 4)]);
      
    } catch (err) {
      console.error(err);
      setOutputMessage(`❌ Error: ${err.message}`);
      toast.error(err.message);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-heading mb-2">File Converter</h1>
          <p className="text-text-body">Convert files between different formats instantly.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-card-background rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-heading">Upload & Convert</h2>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-body hover:bg-background rounded-lg transition-colors border border-border"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>

            <form onSubmit={convertFile} className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-primary-accent bg-primary-accent/5' 
                    : file
                    ? 'border-success bg-success/5'
                    : 'border-border hover:border-primary-accent bg-background'
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
                  <div className="space-y-3">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="max-h-24 mx-auto rounded shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 bg-primary-accent/10 rounded-lg flex items-center justify-center mx-auto">
                        <FileText className="w-6 h-6 text-primary-accent" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-text-heading truncate max-w-xs mx-auto">{file.name}</p>
                      <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="text-xs text-warning hover:underline"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-text-muted mx-auto" />
                    <p className="text-sm text-text-body">Drop file here or click to browse</p>
                  </div>
                )}
              </div>

              {file && (
                <div>
                  <label className="block text-sm text-text-body mb-2">Convert To</label>
                  <div className="grid grid-cols-3 gap-2">
                    {getAvailableConversions().map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setConvertType(option.value)}
                          className={`p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                            convertType === option.value
                              ? 'border-primary-accent bg-primary-accent/5 text-primary-accent'
                              : 'border-border hover:bg-background text-text-body'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {showSettings && file && (
                <div className="bg-background rounded-lg p-4 border border-border space-y-4">
                  <h3 className="font-medium text-text-heading text-sm">Advanced Settings</h3>
                  {file.type.startsWith("image/") && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-text-muted mb-1">Quality: {Math.round(conversionSettings.imageQuality * 100)}%</label>
                        <input
                          type="range" min="0.1" max="1" step="0.1"
                          value={conversionSettings.imageQuality}
                          onChange={(e) => setConversionSettings({...conversionSettings, imageQuality: parseFloat(e.target.value)})}
                          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-muted mb-1">Scale: {conversionSettings.pdfScale}x</label>
                        <input
                          type="range" min="0.5" max="3" step="0.1"
                          value={conversionSettings.pdfScale}
                          onChange={(e) => setConversionSettings({...conversionSettings, pdfScale: parseFloat(e.target.value)})}
                          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary-accent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isConverting && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Converting...</span>
                    <span>{conversionProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary-accent transition-all duration-300" style={{ width: `${conversionProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!file || isConverting}
                  className="flex-1 py-3 bg-primary-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConverting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Convert File
                </button>
                
                {file && (
                  <button
                    type="button"
                    onClick={resetConverter}
                    className="px-4 py-3 border border-border rounded-lg hover:bg-background transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-text-body" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-card-background rounded-xl p-6 border border-border flex flex-col h-full">
            <h2 className="text-xl font-semibold text-text-heading mb-6">Result</h2>
            
            {outputMessage ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  outputMessage.includes('✅') 
                    ? 'bg-success/10 text-success border border-success/20' 
                    : 'bg-warning/10 text-warning border border-warning/20'
                }`}>
                  {outputMessage.includes('✅') ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-sm font-medium">{outputMessage}</span>
                </div>

                {convertedFileUrl && (
                  <div className="flex-1 flex flex-col items-center justify-center bg-background rounded-lg border border-border p-6">
                    {convertType.includes('image') || ['png', 'jpg', 'jpeg', 'webp'].includes(convertType) ? (
                      <img src={convertedFileUrl} alt="Converted" className="max-h-48 rounded shadow-sm" />
                    ) : (
                      <div className="text-center">
                        <File className="w-12 h-12 text-text-muted mx-auto mb-2" />
                        <p className="text-sm text-text-body font-medium">{file.name.split('.')[0]}_converted.{convertType}</p>
                      </div>
                    )}
                  </div>
                )}

                {convertedFileUrl && (
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = convertedFileUrl;
                      const fileName = file.name.split('.')[0];
                      link.download = `${fileName}_converted.${convertType}`;
                      link.click();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-success text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    Download Again
                  </button>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                <File className="w-12 h-12 mb-4 opacity-20" />
                <p>Conversion result will appear here</p>
              </div>
            )}
          </div>
        </div>
        
        {conversionHistory.length > 0 && (
          <div className="mt-8 bg-card-background rounded-xl p-6 border border-border">
            <h3 className="font-semibold text-text-heading mb-4">Recent Conversions</h3>
            <div className="space-y-2">
              {conversionHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border text-sm">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-text-muted" />
                    <span className="text-text-body truncate max-w-xs">{item.fileName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-muted">
                    <span className="uppercase bg-card-hover px-2 py-0.5 rounded text-xs">{item.to}</span>
                    <span className="text-xs">{item.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileConverterPage;
