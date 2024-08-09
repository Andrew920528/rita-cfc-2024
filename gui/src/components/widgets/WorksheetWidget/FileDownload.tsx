// TEMP FILE TODO: refactor
import React from "react";
import {getWordDocService} from "../../../utils/service";
import IconButton from "../../ui_components/IconButton/IconButton";
import {Download} from "@carbon/icons-react";

const FileDownload = () => {
  const downloadFile = async () => {
    try {
      const response = await getWordDocService();
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
      console.error("Error:", error);
      return;
    }
  };

  return (
    <div>
      <IconButton
        onClick={() => {
          downloadFile();
        }}
        mode={"primary"}
        icon={<Download />}
        text="Download File as .docx"
      />
    </div>
  );
};

export default FileDownload;
