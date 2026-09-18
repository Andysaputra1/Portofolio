import { useEffect, useRef, useState } from "react";
import "./PDFViewer.css";

// Keep the API, worker and supporting assets on the same pinned version.
const PDFJS_BASE = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/";
type Viewport = { width: number; height: number };
type RenderTask = { promise: Promise<void>; cancel: () => void };
type PDFPage = {
  getViewport: (options: { scale: number }) => Viewport;
  getTextContent: () => Promise<{ items: { str?: string }[] }>;
  render: (options: { canvasContext: CanvasRenderingContext2D; viewport: Viewport; transform: number[] }) => RenderTask;
};
type PDFDocument = { numPages: number; getPage: (number: number) => Promise<PDFPage> };
type LoadingTask = { promise: Promise<PDFDocument>; destroy: () => Promise<void> };
type PDFLibrary = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (options: { url: string; cMapUrl: string; cMapPacked: boolean; standardFontDataUrl: string; isEvalSupported: boolean }) => LoadingTask;
};

async function loadLibrary(): Promise<PDFLibrary> {
  const url = `${PDFJS_BASE}legacy/build/pdf.min.mjs`;
  const library: PDFLibrary = await import(/* @vite-ignore */ url);
  library.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}legacy/build/pdf.worker.min.mjs`;
  return library;
}

function PDFPageView({ pdf, number, width }: { pdf: PDFDocument; number: number; width: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    let cancelled = false;
    let task: RenderTask | undefined;
    // A new canvas per render prevents resize/unmount races on the old canvas.
    const canvas = document.createElement("canvas");
    const container = host.current;
    async function render() {
      setError(false);
      try {
        const page = await pdf.getPage(number);
        if (cancelled || !container) return;
        const original = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: width / original.width });
        // Limit backing-store memory, especially on high-DPI mobile screens.
        const ratio = Math.min(window.devicePixelRatio || 1, 2, 4096 / Math.max(viewport.width, viewport.height), Math.sqrt(4_000_000 / (viewport.width * viewport.height)));
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        canvas.setAttribute("aria-hidden", "true");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        task = page.render({ canvasContext: context, viewport, transform: [ratio, 0, 0, ratio, 0, 0] });
        await task.promise;
        if (cancelled) return;
        container.replaceChildren(canvas);
        const content = await page.getTextContent();
        if (!cancelled) setText(content.items.map((item) => item.str ?? "").join(" "));
      } catch {
        if (!cancelled) setError(true);
      }
    }
    void render();
    return () => {
      cancelled = true;
      task?.cancel();
      canvas.remove();
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [pdf, number, width]);

  return <section className="pdf-viewer-page" aria-label={`Page ${number}`} style={{ width }}>
    <p className="pdf-viewer-page-label">Page {number} of {pdf.numPages}</p>
    {error ? <p role="alert">This page could not be displayed. Try reloading the preview.</p> : <div ref={host} className="pdf-viewer-canvas" />}
    <p className="pdf-viewer-accessible-text">{text}</p>
  </section>;
}

function PDFViewerDocument({ url, title }: { url: string; title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocument | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [width, setWidth] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(Math.max(1, element.clientWidth - 24)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let task: LoadingTask | undefined;
    async function load() {
      setError(false);
      setPdf(null);
      try {
        const library = await loadLibrary();
        if (cancelled) return;
        task = library.getDocument({ url, cMapUrl: `${PDFJS_BASE}cmaps/`, cMapPacked: true, standardFontDataUrl: `${PDFJS_BASE}standard_fonts/`, isEvalSupported: false });
        const document = await task.promise;
        if (!cancelled) setPdf(document);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    void load();
    return () => { cancelled = true; void task?.destroy().catch(() => {}); };
  }, [url, attempt]);

  return <div className="pdf-viewer" role="region" aria-label={title}>
    <div className="pdf-viewer-toolbar">
      <span role="status">{pdf ? `${pdf.numPages} pages · Scroll to read` : "PDF preview"}</span>
      <div className="pdf-viewer-zoom">
        <button type="button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - 0.25))}>−</button>
        <button type="button" aria-label="Fit PDF to width" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
        <button type="button" aria-label="Zoom in" disabled={zoom >= 2.5} onClick={() => setZoom((value) => Math.min(2.5, value + 0.25))}>+</button>
      </div>
    </div>
    <div className="pdf-viewer-scroll" ref={scrollRef} tabIndex={0} aria-label="PDF pages">
      {error ? <div className="pdf-viewer-message" role="alert"><p>Unable to load the PDF preview.</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Try again</button><a href={url} target="_blank" rel="noreferrer">Open PDF</a></div>
        : !pdf ? <p className="pdf-viewer-message" role="status">Loading PDF…</p>
          : width > 0 && Array.from({ length: pdf.numPages }, (_, index) => <PDFPageView key={index + 1} pdf={pdf} number={index + 1} width={Math.floor(Math.min(width, 1000) * zoom)} />)}
    </div>
  </div>;
}

export default function PDFViewer(props: { url: string; title: string }) {
  return <PDFViewerDocument key={props.url} {...props} />;
}
