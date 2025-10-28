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
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      zIndex: 1000,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <h1 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#111827',
          margin: 0,
        }}>
          PDF Editor
        </h1>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
        >
          <Upload size={16} />
          Upload PDF
        </button>
        <button
          onClick={handleSavePdf}
          disabled={!originalPdfFileRef.current}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: originalPdfFileRef.current ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: originalPdfFileRef.current ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            fontSize: '0.875rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (originalPdfFileRef.current) {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }
          }}
          onMouseLeave={(e) => {
            if (originalPdfFileRef.current) {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }
          }}
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
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '64px', // Account for fixed header
    }}>
      <PDFEditorControls editor={editor} onFileLoaded={setPdfLoaded} toast={toast} />
      
      <div style={{ 
        flexGrow: 1,
        position: 'relative',
      }}>
        {!pdfLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            zIndex: 10,
          }}>
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              maxWidth: '28rem',
            }}>
              <div style={{
                width: '6rem',
                height: '6rem',
                margin: '0 auto 1.5rem',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileText size={48} style={{ color: '#3b82f6' }} />
              </div>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.75rem',
              }}>
                PDF Editor
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginBottom: '2rem',
                lineHeight: '1.5',
              }}>
                Upload a PDF file to start editing. You can add annotations, edit text, and more using the powerful drawing tools.
              </p>
              <div style={{
                padding: '2rem',
                border: '2px dashed #d1d5db',
                borderRadius: '0.75rem',
                backgroundColor: 'white',
              }}>
                <Upload size={32} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
                <p style={{
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  marginBottom: '1rem',
                }}>
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
