from reportlab.pdfgen import canvas

fixtures = {
    '/tmp/nota-imperio-agosto.pdf': ['DESTINATARIO: IMPERIO DOS BALOES', 'CNPJ: 12.345.678/0001-90', 'DATA DE EMISSAO: 08/08/2026', 'VALOR TOTAL DA NOTA R$ 1.000,00'],
    '/tmp/nota-imperio-bh-setembro.pdf': ['DESTINATARIO: IMPERIO DOS BALOES BH', 'CNPJ: 98.765.432/0001-10', 'DATA DE EMISSAO: 08/09/2026', 'VALOR TOTAL DA NOTA R$ 2.000,00'],
    '/tmp/nota-sem-empresa.pdf': ['CNPJ: 11.222.333/0001-44', 'DATA DE EMISSAO: 08/08/2026', 'VALOR TOTAL DA NOTA R$ 300,00'],
}
for path, lines in fixtures.items():
    c = canvas.Canvas(path)
    for index, line in enumerate(lines):
        c.drawString(48, 760 - index * 24, line)
    c.save()
print('\n'.join(fixtures))
