
## Publicação do importador no GitHub Pages

Este projeto pode ser publicado como um importador estático de planilhas. O processamento dos arquivos XLSX acontece no navegador; a publicação no GitHub Pages não utiliza banco de dados ou backend.

O workflow está em `.github/workflows/deploy-pages.yml`. Para ativá-lo no repositório `maxmobilecontato-hub/dashboard-financeiro-imperio`, abra **Settings > Pages** e selecione **GitHub Actions** em **Build and deployment > Source**. Depois, faça push na branch `main` ou abra a aba **Actions**, selecione **Build and deploy importer to GitHub Pages** e use **Run workflow**.

Após a conclusão do workflow, a URL esperada será:

`https://maxmobilecontato-hub.github.io/dashboard-financeiro-imperio/`

O workflow executa `npm ci`, `npm run check`, `npm test` e `npm run build` antes da publicação. O build utiliza automaticamente o subcaminho do repositório e inclui `.nojekyll` para compatibilidade com os arquivos estáticos do Vite.
