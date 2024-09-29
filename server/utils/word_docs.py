from flask import send_file, jsonify
import os
import sys
import pypandoc
import platform
import tempfile
from datetime import datetime
from docx import Document
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from Worksheet import Worksheet

filePath = "worksheet_tmp/testDocument"
fileName = "testDocument"

def generateWorksheet(questions):
    worksheet = Worksheet(filePath, "Worksheet", "", datetime.today().strftime('%Y-%m-%d'))

    try:
        for i, q in enumerate(questions):
            print(q)
            if q['type'] == "Multiple Choices":
                worksheet.multipleChoice(q["question"], q["choices"])
                    
            elif q['type'] == "Fill in the Blanks":
                worksheet.fillInTheBlanks(q["question"])

            elif q['type'] == "Matching":
                worksheet.matching(q["question"], q["leftList"], q["rightList"])

        worksheet.generateDoc()

    except Exception as e:
        response = {
            'status': 'error',
            'data': str(e)
        }
        return response

def send_pdf(questions):
    try:
        generateWorksheet(questions)
        pdf_path = filePath + '.pdf'
        return send_file(pdf_path, as_attachment=True, download_name= fileName + ".pdf")
    except Exception as e:
        response = {
            'status': 'error',
            'data': str(e)
        }
        return response
    

def send_docx(questions):
    try:
        generateWorksheet(questions)
        doc_path = filePath + '.docx'
        return send_file(doc_path, as_attachment=True, download_name= fileName + ".docx")
    except Exception as e:
        response = {
            'status': 'error',
            'data': str(e)
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
