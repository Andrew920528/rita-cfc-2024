import React, {useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

// Set workerSrc for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreview = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const runOnce = useRef<boolean>(false);
  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;
    const fetchPdf = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/test-get-pdf");
        // const blob = await response.blob();
        // const url = URL.createObjectURL(blob);
        // setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, []);
  return (
    <div>
      <p>預覽</p>
      {/* {pdfUrl && (
        // <Document file={pdfUrl}>
        //   <Page />
        // </Document>
        <iframe title="pdf" src={pdfUrl} width="100%" height="100%"></iframe>
      )} */}
    </div>
  );
};

export default PdfPreview;
