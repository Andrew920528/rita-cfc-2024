// TEMP FILE TODO: refactor
import React from "react";

const FileDownload = () => {
  const downloadFile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/test-send-file", {
        method: "GET",
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "custom_filename.docx"); // Filename you want to download
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div>
      <button onClick={downloadFile}>Download File</button>
    </div>
  );
};

export default FileDownload;
