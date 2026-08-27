import fs from 'node:fs';
const pdfjs = await import('pdfjs-dist');
try {
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync('/tmp/nota-imperio-agosto.pdf')), useWorkerFetch: false, disableWorker: true, isEvalSupported: false }).promise;
  const page = await pdf.getPage(1);
  const content = await page.getTextContent();
  console.log(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
} catch (error) {
  console.error(error?.stack || error);
}
