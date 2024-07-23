import React from "react";

const PdfPreview = () => {
  const pdfUrl = "http://127.0.0.1:5000/test-get-pdf";

  return (
    <div>
      <h1>PDF Preview</h1>
      <iframe
        src={pdfUrl}
        width="20%"
        height="400px"
        title="PDF Preview"
      ></iframe>
    </div>
  );
};

export default PdfPreview;
