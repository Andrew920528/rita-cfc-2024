import React, {useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {Question} from "../../../schema/widget/worksheetWidgetContent";
import {getPdfService} from "../../../utils/service";
import styles from "./WorksheetWidget.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
// import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

// Set workerSrc for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreview = (props: {content: Question[]}) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const runOnce = useRef<boolean>(false);
  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;
    const fetchPdf = async () => {
      try {
        const response = await getPdfService(props.content);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, []);
  return (
    <div className={cx("pdf-preview")}>
      <p>預覽</p>
      {pdfUrl && (
        <iframe title="pdf" src={pdfUrl} width="100%" height="100%"></iframe>
      )}
    </div>
  );
};

export default PdfPreview;
