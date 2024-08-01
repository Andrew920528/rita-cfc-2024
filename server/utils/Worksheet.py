from pylatex import Document, Command, Package
from pylatex.base_classes import Environment
from pylatex.utils import NoEscape

class MatchTabularEnvironment(Environment):
    _latex_name = "matchtabular"

class Worksheet:
    def __init__(self, title, author, date):
        self.doc = Document(documentclass='ctexart')
        self.title = title

        self.doc.preamble.append(Package('tabularx'))

        self.doc.preamble.append(Command('title', title))
        self.doc.preamble.append(Command('author', author))
        self.doc.preamble.append(Command('date', date))

        self.doc.append(NoEscape(r"\maketitle"))

    def addMatching(self, pairs):
        self.doc.append(NoEscape(r'\newcounter{matchleft}'))
        self.doc.append(NoEscape(r'\newcounter{matchright}'))
        self.doc.append(NoEscape(r'''\newenvironment{matchtabular}{%
            \setcounter{matchleft}{0}%
            \setcounter{matchright}{0}%
            \tabularx{\textwidth}{%
                >{\leavevmode\hbox to 1.5em{\stepcounter{matchleft}\arabic{matchleft}.}}X%
                >{\leavevmode\hbox to 1.5em{\stepcounter{matchright}\alph{matchright})}}X%
            }%
        }{\endtabularx}'''))
                
        str = ""
        for left, right in pairs:
            str += left + " & " + right + r" \\"
        
        with self.doc.create(MatchTabularEnvironment()) as environment:
            environment.append(NoEscape(str))

    def printDoc(self):
        self.doc.generate_pdf(self.title, compiler='xelatex', clean=True,  clean_tex=False)
