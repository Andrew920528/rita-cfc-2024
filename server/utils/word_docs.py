# pip install docx2pdf
from docx2pdf import convert
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
        response = {
            'status': 'error',
            'data': 'File not found'
        }
        return response

def docxToPdfFunction(docxPath, pdfPath):

    docxPath = 'worksheet_tmp/Rita Test document.docx'
    pdfPath = 'worksheet_tmp/your_document.pdf'

    if os.path.exists(docxPath):
        try:
            pypandoc.convert_file(docxPath, 'pdf', outputfile=pdfPath)
            response = send_file(pdfPath, as_attachment=True)
            return response
        except Exception as e:
            response = {
                'status': 'error',
                'data': str(e)
            }
            return response
    else:
        response = {
            'status': 'error',
            'data': 'File not found'
        }
        return response

def createBlankDocx(widgetId):
    try:
        documentName = "worksheet_tmp/" + widgetId + ".docx"
        document = Document()
        document.save(documentName)
        return documentName
    except Exception as e:
        response = {
            'status': 'error',
            'data': str(e)
        }
        return response

def sendDocument(documentPath):
    if documentPath[-5:] == ".docx":
        return send_file(documentPath, as_attachment=True, download_name='your_document.docx')
    elif documentPath[-4:] == ".pdf":
        return send_file(documentPath, as_attachment=True, download_name='your_document.pdf')
    else:
        return ""
