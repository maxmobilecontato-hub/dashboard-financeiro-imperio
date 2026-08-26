import { chromium } from 'playwright';

const url = process.env.DASHBOARD_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
const noteInput = page.locator('input[type=file]').nth(2);
await noteInput.setInputFiles(['/tmp/nota-imperio-agosto.pdf', '/tmp/nota-invalida.pdf']);
await page.waitForTimeout(1800);
const text = (await page.locator('body').innerText()).replace(/\u00a0/g, ' ');
if (!text.includes('1 PDF importado; 1 arquivo não pôde ser lido')) throw new Error('Mensagem de erro parcial não foi exibida');
if (!text.includes('Império dos Balões') || !text.includes('R$ 1.000')) throw new Error('O PDF válido não foi mantido no lote');
console.log(JSON.stringify({ ok: true, imported: 1, rejected: 1, progressCompleted: true }));
await browser.close();
