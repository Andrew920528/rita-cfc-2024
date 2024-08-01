from pylatex import Document, Command, Package
from pylatex.base_classes import Environment
from pylatex.utils import NoEscape

class Worksheet:
    def __init__(self, title, author, date):
        self.doc = Document(documentclass='ctexart')
        self.title = title

        self.doc.preamble.append(Package('tabularx'))

        self.doc.preamble.append(Command('title', title))
        self.doc.preamble.append(Command('author', author))
        self.doc.preamble.append(Command('date', date))

        self.doc.append(NoEscape(r"\maketitle"))

    def print_doc(self):
        self.doc.generate_pdf(self.title, compiler='xelatex', clean=True,  clean_tex=False)
        