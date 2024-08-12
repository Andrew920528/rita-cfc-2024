# pip install docx2pdf
from docx2pdf import convert
import pythoncom
from flask import send_file, jsonify
import os
import tempfile
from docx import Document

import pypandoc
import platform

def send_docx():
    # The path to your Word document
    doc_path = 'worksheet_tmp/Rita Test document.docx'

    # Ensure the file exists
    if os.path.exists(doc_path):
        # Send the file to the client
        return send_file(doc_path, as_attachment=True, download_name='your_document.docx')
    else:
        raise Exception('File not found')


def convert_to_pdf(docxPath, pdfPath):
    if os.path.exists(docxPath):
        try:
            temp_dir = tempfile.mkdtemp()
            pdf_path = os.path.join(temp_dir, pdfPath)
            # NOTE Server needs to install latex engine for file conversion
            # basictex is a minimal tool for conversion
            # brew install --cask basictex
            # ^ works on mac, not sure about windows LOL
            pypandoc.convert_file(docxPath, 'pdf', outputfile=pdf_path)
            response = send_file(pdf_path, as_attachment=True)

            try:
                os.remove(pdf_path)
                os.rmdir(temp_dir)
            except Exception as cleanup_error:
                print(f"Error cleaning up temporary files: {cleanup_error}")

            return response
        except Exception as e:
            print(e)
            return str(e)
    else:
        return jsonify({"error": "File not found"}), 404

# fixme - OS dependent code
# This works for windows, not sure if it will branch to mac. Please test it. 
# If it works, then conver_to_pdf can be combined in here.
def docxToPdfFunction(docxPath, pdfPath):

    # mac
    if platform.system() == 'Darwin':
        convert_to_pdf('worksheet_tmp/Rita Test document.docx', 'worksheet_tmp/your_document.pdf')
    # windows
    else:
        try:
            # worksheet_tmp/Rita Test document.docx, worksheet_tmp/Rita Test document.pdf
            pythoncom.CoInitialize()
            convert(docxPath, pdfPath)
            response = {
                'status': 'success',
                'data': pdfPath
            }
            return response
        except Exception as e:
            response = {
                'status': 'error',
                'data': str(e)
            }
            return response


def createBlankDocx(widgetId):
    documentName = "worksheet_tmp/" + widgetId + ".docx"
    document = Document()
    document.save(documentName)
    return documentName


def sendDocument(documentPath):

    if documentPath[-5:] == ".docx":
        return send_file(documentPath, as_attachment=True, download_name='your_document.docx')
    elif documentPath[-4:] == ".pdf":
        return send_file(documentPath, as_attachment=True, download_name='your_document.pdf')
    else:
        return ""
