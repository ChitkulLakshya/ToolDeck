import React, { useRef, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Tldraw } from 'tldraw';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';
import { Upload, FileText, Save, Download, Trash2, FileDown } from 'lucide-react';
import 'tldraw/tldraw.css';

// Set worker source - using jsdelivr CDN with proper CORS headers
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Component for toolbar controls - no longer needs to be inside Tldraw
const PDFEditorControls = ({ editor, onFileLoaded, toast }) => {
  const originalPdfFileRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.warning('No file selected');
      return;
    }

    if (!editor) {
      toast.error('Editor not ready. Please wait and try again.');
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }

    // Store the file
    originalPdfFileRef.current = file;
    
    // Show loading state
    toast.info('Loading PDF...');

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document with better error handling
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0, // Reduce console spam
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/cmaps/',
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      
      const numPages = pdf.numPages;
      const scale = 1.5; // Scale for better quality (reduced from 2.0 for performance)
      
      let currentY = 0;

      // Loop through each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        // Create in-memory canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: false });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Get dataURL from canvas
        const dataUrl = canvas.toDataURL('image/png', 0.9); // Add compression quality

        // Create a unique asset ID
        const assetId = `asset:${Date.now()}_${pageNum}`;
        
        // Create the asset
        editor.createAssets([{
          id: assetId,
          type: 'image',
          typeName: 'asset',
          props: {
            name: `page-${pageNum}.png`,
            src: dataUrl,
            w: viewport.width,
            h: viewport.height,
            mimeType: 'image/png',
            isAnimated: false,
          },
          meta: {},
        }]);

        // Create image shape on tldraw canvas with the asset
        editor.createShape({
          type: 'image',
          x: 50, // Add some padding from left
          y: currentY,
          props: {
            w: viewport.width,
            h: viewport.height,
            assetId: assetId,
          },
          meta: {
            pageNumber: pageNum,
          },
        });

        // Position next page vertically below
        currentY += viewport.height + 50; // Add some spacing between pages
      }

      // Zoom to fit all pages
      editor.zoomToFit();
      
      // Notify parent that file is loaded AFTER successful rendering
      onFileLoaded(true);
      
      toast.success(`PDF loaded successfully: ${numPages} page(s)`);
    } catch (error) {
      console.error('Error loading PDF:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to load PDF. ';
      if (error.message?.includes('Invalid PDF')) {
        errorMessage += 'The file appears to be corrupted or invalid.';
      } else if (error.message?.includes('password')) {
        errorMessage += 'Password-protected PDFs are not supported.';
      } else {
        errorMessage += 'Please make sure it is a valid PDF file and try again.';
      }
      
      toast.error(errorMessage);
      
      // Reset state if loading failed
      onFileLoaded(false);
      originalPdfFileRef.current = null;
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSavePdf = async () => {
    if (!originalPdfFileRef.current || !editor) {
      toast.error('No PDF file or editor available');
      return;
    }

    try {
      toast.info('Preparing PDF for download...');
      
      // Load original PDF using pdf-lib
      const arrayBuffer = await originalPdfFileRef.current.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // For now, we'll save the original PDF with any annotations
      // In the future, we can add logic to embed tldraw annotations
      
      const pages = pdfDoc.getPages();
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();

      // Trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use original filename with "_edited" suffix
      const originalName = originalPdfFileRef.current.name;
      const nameWithoutExt = originalName.replace(/\.pdf$/i, '');
      link.download = `${nameWithoutExt}_edited.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`PDF saved successfully: ${pages.length} page(s)`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('Failed to save PDF. Please try again.');
    }
  };

  const handleExportWithAnnotations = async () => {
    if (!editor) {
      toast.error('Editor not ready');
      return;
    }

    try {
      toast.info('Exporting canvas with annotations...');
      
      // Export the current canvas as SVG
      const svg = await editor.getSvg(editor.getCurrentPageShapeIds());
      
      if (!svg) {
        toast.error('Failed to export canvas');
        return;
      }

      // Convert SVG to data URL
      const svgString = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pdf_with_annotations.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Canvas exported successfully as SVG');
    } catch (error) {
      console.error('Error exporting canvas:', error);
      toast.error('Failed to export canvas. Please try again.');
    }
  };

  const handleClearCanvas = () => {
    if (!editor) return;
    
    // Clear all shapes from canvas
    const allShapes = editor.getCurrentPageShapes();
    if (allShapes.length > 0) {
      editor.deleteShapes(allShapes.map(shape => shape.id));
      toast.success('Canvas cleared');
    }
    
    // Clear file reference
    originalPdfFileRef.current = null;
    
    // Reset loaded state
    onFileLoaded(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-card-background border-b border-border shadow-sm" style={{zIndex: 1000}}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-text-heading m-0">
          PDF Editor
        </h1>
      </div>
      
      <div className="flex gap-3 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="pdf-file-input"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!editor}
          className={`flex items-center gap-2 px-4 py-2.5 text-white border-0 rounded-lg font-semibold text-sm shadow-lg transition-all ${
            editor
              ? 'bg-success cursor-pointer hover:opacity-90 hover:shadow-xl'
              : 'bg-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <Upload size={16} />
          Upload PDF
        </button>
        <button
          onClick={handleExportWithAnnotations}
          disabled={!editor || !originalPdfFileRef.current}
          className={`flex items-center gap-2 px-4 py-2.5 text-white border-0 rounded-lg font-semibold text-sm shadow-lg transition-all ${
            editor && originalPdfFileRef.current
              ? 'bg-secondary-accent cursor-pointer hover:opacity-90 hover:shadow-xl'
              : 'bg-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <FileDown size={16} />
          Export SVG
        </button>
        <button
          onClick={handleClearCanvas}
          disabled={!editor || !originalPdfFileRef.current}
          className={`flex items-center gap-2 px-4 py-2.5 text-white border-0 rounded-lg font-semibold text-sm shadow-lg transition-all ${
            editor && originalPdfFileRef.current
              ? 'bg-error cursor-pointer hover:opacity-90 hover:shadow-xl'
              : 'bg-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <Trash2 size={16} />
          Clear
        </button>
        <button
          onClick={handleSavePdf}
          disabled={!originalPdfFileRef.current}
          className={`flex items-center gap-2 px-4 py-2.5 text-white border-0 rounded-lg font-semibold text-sm shadow-lg transition-all ${
            originalPdfFileRef.current 
              ? 'bg-primary-accent cursor-pointer hover:opacity-90 hover:shadow-xl' 
              : 'bg-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <Download size={16} />
          Save PDF
        </button>
      </div>
    </header>
  );
};

const PDFEditorPage = () => {
  const toast = useToast();
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [editor, setEditor] = useState(null);

  const handleEditorMount = (editorInstance) => {
    console.log('Tldraw editor mounted:', editorInstance ? 'Success' : 'Failed');
    setEditor(editorInstance);
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <PDFEditorControls editor={editor} onFileLoaded={setPdfLoaded} toast={toast} />
      
      <div style={{ 
        flex: 1,
        position: 'relative',
        minHeight: 0 // Important for flex sizing
      }}>
        {!pdfLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-background)',
            zIndex: 10
          }}>
            <div className="text-center p-12 max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 bg-primary-accent/10 rounded-full flex items-center justify-center">
                <FileText size={48} className="text-primary-accent" />
              </div>
              <h2 className="text-3xl font-bold text-text-heading mb-3">
                PDF Editor
              </h2>
              <p className="text-base text-text-body mb-8 leading-relaxed">
                Upload a PDF file to start editing. You can add annotations, draw, and use powerful editing tools.
              </p>
              <div className="p-8 border-2 border-dashed border-border rounded-xl bg-card-background">
                <Upload size={32} className="text-text-muted mx-auto mb-4" />
                <p className="text-sm text-text-muted mb-4">
                  Click "Upload PDF" button in the toolbar to get started
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div style={{ 
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}>
          <Tldraw onMount={handleEditorMount} />
        </div>
      </div>
    </div>
  );
};

export default PDFEditorPage;
