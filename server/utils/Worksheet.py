from pylatex import Document, Command, Package, LineBreak, Section, Subsection, Itemize, TextBlock, MiniPage, VerticalSpace
from pylatex.base_classes import Environment, Arguments
from pylatex.utils import NoEscape
from pdf2docx import Converter
import os.path
import random


class MatchTabularEnvironment(Environment):
    _latex_name = "matchtabular"


class Worksheet:
    def __init__(self, path, title, author, date):
        geometry_options = {"lmargin": "1in", "rmargin": "1in",
                            "tmargin": "1in", "bmargin": "1in", "headheight": "14pt"}
        self.doc = Document(documentclass='ctexart',
                            geometry_options=geometry_options)
        
        self.doc.change_length("\TPHorizModule", "1mm")
        self.doc.change_length("\TPVertModule", "1mm")

        self.title = title
        self.path = path

        self.doc.preamble.append(Package('tabularx'))
        self.doc.preamble.append(Package('titling'))
        self.doc.preamble.append(NoEscape(r'\setlength{\droptitle}{-3cm}'))

        self.doc.preamble.append(Command('title', title)) if title else ""
        self.doc.preamble.append(Command('author', author)) if author else ""
        self.doc.preamble.append(Command('date', date)) if date else ""

        self.doc.append(NoEscape(r"\maketitle"))

        

    def multipleChoice(self, title, options):
        with self.doc.create(Section(title)):
            with self.doc.create(Itemize()) as itemize:
                for option in options:
                    itemize.add_item(option)

    def fillInTheBlanks(self, title):
        with self.doc.create(Section(title)):
            with self.doc.create(MiniPage(width=r"\textwidth")) as page:
                with page.create(TextBlock(100, 0, 0)):
                    page.append("-")

    def matching(self, title, l1, l2):
        with self.doc.create(Section(title)):
            with self.doc.create(MiniPage(width=r"\textwidth")) as page:
                with page.create(TextBlock(100, 0, 0)):
                    for item in l1:
                        page.append("\n" + item)

                random.shuffle(l2)

                with page.create(TextBlock(80, 150, 0)):
                    for item in l2:
                        page.append("\n" + item)

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
        self.doc.generate_pdf(self.path, compiler='xelatex',
                              clean=True, clean_tex=False)

    def generateDoc(self):
        pdfPath = self.path + ".pdf"
        docxPath = self.path + ".docx"

        self.generatePDF()
        cv = Converter(pdfPath)
        cv.convert(docxPath, start=0, end=None)
        cv.close()
