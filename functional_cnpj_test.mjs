import { chromium } from 'playwright';

const url = process.env.DASHBOARD_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
page.on('console', (message) => { if (message.type() === 'error') console.log('[browser-error]', message.text()); });
page.on('pageerror', (error) => console.log('[page-error]', error.message));
await page.goto(url, { waitUntil: 'networkidle' });
const noteInput = page.locator('input[type=file]').nth(2);
if (await page.locator('input[type=file]').count() < 3) throw new Error('Input de nota fiscal não encontrado');
async function importNotes(paths) {
  await noteInput.setInputFiles(paths);
  await page.waitForTimeout(1600);
}
await importNotes(['/tmp/nota-imperio-agosto.pdf', '/tmp/nota-imperio-bh-setembro.pdf', '/tmp/nota-sem-empresa.pdf']);
const allText = (await page.locator('body').innerText()).replace(/\u00a0/g, ' ');
if (!allText.includes('Império dos Balões') || !allText.includes('Império dos Balões BH') || !allText.includes('Não identificado')) throw new Error('As três classificações não apareceram na interface');
if (!allText.includes('R$ 1.000') || !allText.includes('R$ 2.000') || !allText.includes('R$ 300')) { console.log(allText.slice(-2200)); throw new Error('Totais das notas não apareceram na interface'); }
const monthSelect = page.locator('select').nth(1);
const options = await monthSelect.locator('option').allTextContents();
const septemberIndex = options.findIndex((item) => item === 'Set');
if (septemberIndex < 0) throw new Error(`Opção Set não encontrada: ${options.join(' | ')}`);
await monthSelect.selectOption(String(septemberIndex - 1));
await page.waitForTimeout(250);
const septemberText = (await page.locator('body').innerText()).replace(/\u00a0/g, ' ');
if (!septemberText.includes('1 nota(s) no filtro') || !septemberText.includes('R$ 2.000')) throw new Error('Filtro de setembro não isolou a nota BH');
await monthSelect.selectOption('7');
await page.waitForTimeout(250);
const augustText = (await page.locator('body').innerText()).replace(/\u00a0/g, ' ');
if (!augustText.includes('2 nota(s) no filtro') || !augustText.includes('R$ 1.000')) throw new Error('Filtro de agosto não isolou as duas notas de agosto');
console.log(JSON.stringify({ ok: true, selectedInSingleAction: 3, classifications: ['imperio', 'imperio-bh', 'unknown'], september: 'R$ 2.000', august: 'R$ 1.000 + R$ 300' }));
await browser.close();
