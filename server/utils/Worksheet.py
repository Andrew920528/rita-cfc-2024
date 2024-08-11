from pylatex import Document, Command, Package, LineBreak, Section, Subsection
from pylatex.base_classes import Environment, Arguments
from pylatex.utils import NoEscape
from pdf2docx import Converter
import os.path

class MatchTabularEnvironment(Environment):
    _latex_name = "matchtabular"

class Worksheet:
    def __init__(self, title, author, date):
        geometry_options = {"lmargin" : "1in", "rmargin" : "1in", "tmargin" : "1in", "bmargin" : "1in", "headheight" : "14pt"}
        self.doc = Document(documentclass='ctexart', geometry_options=geometry_options)
        self.title = title

        self.doc.preamble.append(Package('tabularx'))
        self.doc.preamble.append(Package('titling'))
        self.doc.preamble.append(NoEscape(r'\setlength{\droptitle}{-3cm}'))

        self.doc.preamble.append(Command('title', title))
        self.doc.preamble.append(Command('author', author))
        self.doc.preamble.append(Command('date', date))

        self.doc.append(NoEscape(r"\maketitle"))

    def addSection(self, title):
        self.doc.append(Section(title))

    def addSubsection(self, title):
        self.doc.append(Subsection(title))
    
    def addText(self, text):
        self.doc.append(text)
        self.doc.append(LineBreak())

    def addTextBox(self, text):
        self.doc.append(NoEscape(r"""\noindent\fbox{%
            \parbox{\textwidth}{%
                """ + text + """
            }%
        }"""))
        self.doc.append(LineBreak())

    def addMatching(self, pairs):
        self.doc.append(NoEscape(r'\newcounter{matchleft}'))
        self.doc.append(NoEscape(r'\newcounter{matchright}'))
        self.doc.append(NoEscape(
        r"""\newenvironment{matchtabular}{%
            \setcounter{matchleft}{0}%
            \setcounter{matchright}{0}%
            \tabularx{\textwidth}{%
                >{\leavevmode\hbox to 1.5em{\stepcounter{matchleft}\arabic{matchleft}.}}X%
                >{\leavevmode\hbox to 1.5em{\stepcounter{matchright}\alph{matchright})}}X%
            }%
        }{\endtabularx}"""))
                
        str = ""
        for left, right in pairs:
            str += left + " & " + right + r" \\"
        
        with self.doc.create(MatchTabularEnvironment()) as environment:
            environment.append(NoEscape(str))
        self.doc.append(LineBreak())
    
    def generatePDF(self):
        self.doc.generate_pdf(self.title, compiler='xelatex', clean=True, clean_tex=False)
    
    def generateDoc(self):
        pdfPath = "./" + self.title + ".pdf"
        docxPath = "./" + self.title + ".docx"
        
        self.generatePDF()
        cv = Converter(pdfPath)
        cv.convert(docxPath, start=0, end=None)
        cv.close()
