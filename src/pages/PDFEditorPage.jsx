import React, { useRef, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Tldraw } from 'tldraw';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';
import { Upload, FileText, Save, Download } from 'lucide-react';
import 'tldraw/tldraw.css';

// Set worker source - using jsdelivr CDN with proper CORS headers
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Component for toolbar controls - no longer needs to be inside Tldraw
const PDFEditorControls = ({ editor, onFileLoaded, toast }) => {
  const originalPdfFileRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !editor) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      console.error('Please select a valid PDF file');
      toast.error('Please select a valid PDF file');
      return;
    }

    // Store the file
    originalPdfFileRef.current = file;
    
    // Notify parent that file is being loaded
    onFileLoaded(true);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document with better error handling
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0 // Reduce console spam
      });
      
      const pdf = await loadingTask.promise;
      
      const numPages = pdf.numPages;
      const scale = 2.0; // Scale for better quality
      
      let currentY = 0;

      // Loop through each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        // Create in-memory canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Get dataURL from canvas
        const dataUrl = canvas.toDataURL('image/png');

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
          x: 0,
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

        // Note: Text extraction is currently disabled due to tldraw v4 API changes
        // The PDF pages will render as images which can be annotated
        
        /*
        // Get text content from the page
        const textContent = await page.getTextContent();
        
        // Transform PDF coordinates to canvas coordinates
        const transform = viewport.transform;
        
        // Create text shapes for each text item
        textContent.items.forEach((item) => {
          // Transform coordinates from PDF space to canvas space
          const tx = item.transform;
          
          // PDF uses bottom-left origin, convert to top-left origin
          const canvasX = tx[4];
          const canvasY = viewport.height - tx[5]; // Invert Y coordinate
          
          // Extract properties
          const str = item.str;
          const fontSize = Math.hypot(tx[0], tx[1]);
          const width = (item.width || 0) * (fontSize || 16);
          const height = fontSize * 1.2;

          // Create text shape on tldraw canvas
          editor.createShape({
            type: 'text',
            x: canvasX,
            y: currentY + canvasY, // Add currentY offset for vertical stacking
            props: {
              text: str,
              color: 'black',
              size: 'm',
            },
            meta: {
              isOriginalText: true,
              pageNumber: pageNum,
              originalX: tx[4],
              originalY: tx[5],
              originalWidth: width,
              originalHeight: height,
              originalFontSize: fontSize,
            },
          });
        });
        */

        // Position next page vertically below
        currentY += viewport.height + 50; // Add some spacing between pages
      }

      // Zoom to fit all pages
      editor.zoomToFit();
      
      console.log('PDF loaded successfully:', numPages, 'pages');
      toast.success(`PDF loaded successfully: ${numPages} page(s)`);
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast.error('Failed to load PDF. Please make sure it is a valid PDF file and try again.');
      // Reset state if loading failed
      onFileLoaded(false);
      originalPdfFileRef.current = null;
    }
  };

  const handleSavePdf = async () => {
    if (!originalPdfFileRef.current || !editor) {
      console.error('No PDF file or editor available');
      return;
    }

    try {
      // Load original PDF using pdf-lib
      const arrayBuffer = await originalPdfFileRef.current.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Get all shapes from tldraw editor once
      const allShapes = editor.getShapes();

      // Note: Text editing is currently disabled due to tldraw v4 API changes
      // For now, we'll just save the original PDF
      // You can add annotations using tldraw's drawing tools, but text extraction
      // and editing is not yet supported

      /* 
      // Loop through each page in the PDF
      pages.forEach((page, index) => {
        const pageNumber = index + 1;
        
        // Filter shapes that belong to this specific page
        const shapesForThisPage = allShapes.filter(
          shape => shape.meta?.pageNumber === pageNumber
        );

        // Get page height for coordinate conversion
        const pageHeight = page.getHeight();

        // Loop through all shapes for this page
        shapesForThisPage.forEach((shape) => {
          // Check if this is an original text shape
          if (shape.meta?.isOriginalText) {
            const meta = shape.meta;

            // Convert coordinates from top-left (tldraw) to bottom-left (pdf-lib)
            const pdfY = pageHeight - meta.originalY - meta.originalHeight;

            // Draw white rectangle to "erase" the original text
            page.drawRectangle({
              x: meta.originalX,
              y: pdfY,
              width: meta.originalWidth,
              height: meta.originalHeight,
              color: rgb(1, 1, 1), // White
            });

            // Draw the new text at the updated position
            const currentText = shape.props?.text || '';
            
            // Get the current shape position from tldraw
            const currentY = pageHeight - shape.y - meta.originalHeight;

            // Draw the text with updated content at new position
            page.drawText(currentText, {
              x: shape.x,
              y: currentY,
              size: meta.originalFontSize,
            });
          }
        });
      });
      */

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();

      // Trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('PDF saved successfully:', pages.length, 'pages');
      toast.success(`PDF saved successfully: ${pages.length} page(s)`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('Failed to save PDF. Please try again.');
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
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-success text-white border-0 rounded-lg cursor-pointer font-semibold text-sm shadow hover:opacity-90 transition-all"
        >
          <Upload size={16} />
          Upload PDF
        </button>
        <button
          onClick={handleSavePdf}
          disabled={!originalPdfFileRef.current}
          className={`flex items-center gap-2 px-4 py-2.5 text-white border-0 rounded-lg font-semibold text-sm shadow transition-all ${
            originalPdfFileRef.current 
              ? 'bg-primary-accent cursor-pointer hover:opacity-90' 
              : 'bg-gray-400 cursor-not-allowed opacity-50'
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

  return (
    <div className="w-screen h-screen flex flex-col pt-16">
      <PDFEditorControls editor={editor} onFileLoaded={setPdfLoaded} toast={toast} />
      
      <div className="flex-grow relative">
        {!pdfLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
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
        
        <Tldraw onMount={(editor) => setEditor(editor)}>
        </Tldraw>
      </div>
    </div>
  );
};

export default PDFEditorPage;
