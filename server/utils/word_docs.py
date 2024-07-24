from flask import send_file, jsonify
import os
import tempfile
import pypandoc
from docx2pdf import convert
def send_docx():
    # The path to your Word document
    doc_path = 'worksheet_tmp/Rita Test document.docx'

    # Ensure the file exists
    if os.path.exists(doc_path):
        # Send the file to the client
        return send_file(doc_path, as_attachment=True, download_name='your_document.docx')
    else:
        raise Exception('File not found')


def convert_to_pdf():
    doc_path = 'worksheet_tmp/Rita Test document.docx'
    print(doc_path)
    if os.path.exists(doc_path):
        try:
            temp_dir = tempfile.mkdtemp()
            pdf_path = os.path.join(temp_dir, 'your_document.pdf')
            # pypandoc.convert_file(doc_path, 'pdf', outputfile=pdf_path)
            convert(doc_path, pdf_path)
            print(pdf_path)
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

