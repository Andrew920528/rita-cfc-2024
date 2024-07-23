from flask import Flask, send_file, request, jsonify
import os
from docx import Document
from docx2pdf import convert
import tempfile
def download_file():
    # The path to your Word document
    doc_path = 'worksheet_tmp/Rita Test document.docx'

    # Ensure the file exists
    if os.path.exists(doc_path):
        try:
            # Send the file to the client
            return send_file(doc_path, as_attachment=True, download_name='your_document.docx')
        except Exception as e:
            return str(e)
    else:
        return jsonify({"error": "File not found"}), 404

download_file()


def convert_to_pdf():
    doc_path = 'worksheet_tmp/Rita Test document.docx'
    if os.path.exists(doc_path):
        try:
            temp_dir = tempfile.mkdtemp()
            pdf_path = os.path.join(temp_dir, 'your_document.pdf')
            convert(doc_path, pdf_path)
            return send_file(pdf_path, as_attachment=False)
        except Exception as e:
            return str(e)
    else:
        return jsonify({"error": "File not found"}), 404