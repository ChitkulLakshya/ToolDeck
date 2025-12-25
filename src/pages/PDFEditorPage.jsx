import React, { useRef, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Tldraw } from 'tldraw';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileText, Download, Trash2, FileDown } from 'lucide-react';
import 'tldraw/tldraw.css';

// Set worker source - using local file for offline support and stability
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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

    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }

    originalPdfFileRef.current = file;
    toast.info('Loading PDF...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/cmaps/',
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const scale = 1.5;
      let currentY = 0;
      const BATCH_SIZE = 3;
      const DELAY_BETWEEN_PAGES = 100;

      const renderPage = async (pageNum) => {
        try {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { willReadFrequently: false });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = { canvasContext: context, viewport: viewport };
          await page.render(renderContext).promise;

          const dataUrl = canvas.toDataURL('image/png', 0.8);
          const assetId = `asset:${Date.now()}_${pageNum}`;
          
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

          editor.createShape({
            type: 'image',
            x: 50,
            y: currentY,
            props: { w: viewport.width, h: viewport.height, assetId: assetId },
            meta: { pageNumber: pageNum },
          });

          currentY += viewport.height + 50;
          canvas.width = 0;
          canvas.height = 0;
          return true;
        } catch (err) {
          console.error(`Error rendering page ${pageNum}:`, err);
          return false;
        }
      };

      toast.info(`Rendering first ${Math.min(BATCH_SIZE, numPages)} pages...`);
      for (let i = 1; i <= Math.min(BATCH_SIZE, numPages); i++) {
        await renderPage(i);
      }

      onFileLoaded(true);
      editor.zoomToFit();
      toast.success(`PDF loaded! Rendering remaining pages in background...`);

      if (numPages > BATCH_SIZE) {
        const loadRemainingPages = async () => {
          for (let i = BATCH_SIZE + 1; i <= numPages; i++) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_PAGES));
            await renderPage(i);
          }
          toast.success("All pages rendered successfully");
        };
        loadRemainingPages();
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast.error('Failed to load PDF.');
      onFileLoaded(false);
      originalPdfFileRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSavePdf = async () => {
    if (!originalPdfFileRef.current || !editor) {
      toast.error('No PDF file or editor available');
      return;
    }

    try {
      toast.info('Preparing PDF for download...');
      const arrayBuffer = await originalPdfFileRef.current.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const originalName = originalPdfFileRef.current.name;
      const nameWithoutExt = originalName.replace(/\.pdf$/i, '');
      link.download = `${nameWithoutExt}_edited.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF saved successfully');
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('Failed to save PDF.');
    }
  };

  const handleExportWithAnnotations = async () => {
    if (!editor) {
      toast.error('Editor not ready');
      return;
    }

    try {
      toast.info('Exporting canvas with annotations...');
      const svg = await editor.getSvg(editor.getCurrentPageShapeIds());
      if (!svg) {
        toast.error('Failed to export canvas');
        return;
      }
      const svgString = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
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
      toast.error('Failed to export canvas.');
    }
  };

  const handleClearCanvas = () => {
    if (!editor) return;
    const allShapes = editor.getCurrentPageShapes();
    if (allShapes.length > 0) {
      editor.deleteShapes(allShapes.map(shape => shape.id));
      toast.success('Canvas cleared');
    }
    originalPdfFileRef.current = null;
    onFileLoaded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-card-background border-b border-border shadow-sm" style={{zIndex: 1000}}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-text-heading m-0">PDF Editor</h1>
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
            editor ? 'bg-success cursor-pointer hover:opacity-90 hover:shadow-xl' : 'bg-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <Upload size={16} />
          Upload PDF
        </button>
        <button
          onClick={handleExportWithAnnotations}
          disabled={!editor || !originalPdfFileRef.current}
          className={`flex items-center gap-2 px-4 py-2.5 text-white border-0 rounded-lg font-semibold text-sm shadow-lg transition-all ${
            editor && originalPdfFileRef.current ? 'bg-secondary-accent cursor-pointer hover:opacity-90 hover:shadow-xl' : 'bg-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <FileDown size={16} />
          Export SVG
        </button>
        <button
          onClick={handleClearCanvas}
          disabled={!editor || !originalPdfFileRef.current}
          className={`flex items-center gap-2 px-4 py-2.5 text-white border-0 rounded-lg font-semibold text-sm shadow-lg transition-all ${
            editor && originalPdfFileRef.current ? 'bg-error cursor-pointer hover:opacity-90 hover:shadow-xl' : 'bg-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <Trash2 size={16} />
          Clear
        </button>
        <button
          onClick={handleSavePdf}
          disabled={!originalPdfFileRef.current}
          className={`flex items-center gap-2 px-4 py-2.5 text-white border-0 rounded-lg font-semibold text-sm shadow-lg transition-all ${
            originalPdfFileRef.current ? 'bg-primary-accent cursor-pointer hover:opacity-90 hover:shadow-xl' : 'bg-text-muted cursor-not-allowed opacity-50'
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
    setEditor(editorInstance);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <PDFEditorControls editor={editor} onFileLoaded={setPdfLoaded} toast={toast} />
      
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {!pdfLoaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', zIndex: 10 }}>
            <div className="text-center p-12 max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 bg-primary-accent/10 rounded-full flex items-center justify-center">
                <FileText size={48} className="text-primary-accent" />
              </div>
              <h2 className="text-3xl font-bold text-text-heading mb-3">PDF Editor</h2>
              <p className="text-base text-text-body mb-8 leading-relaxed">Upload a PDF to begin editing.</p>
            </div>
          </div>
        )}
        
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <Tldraw onMount={handleEditorMount} />
        </div>
      </div>
    </div>
  );
};

export default PDFEditorPage;
