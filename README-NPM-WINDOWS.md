# Instalação no Windows

Esta versão remove `@builder.io/vite-plugin-jsx-loc`, que declara compatibilidade apenas com Vite 4/5 e conflitava com o Vite 7. O código do dashboard não foi alterado por essa correção.

Na pasta do projeto, execute:

```powershell
npm install
npm run check
npm test
npm run dev
```

Os scripts `dev` e `start` usam `cross-env`, portanto funcionam no Prompt de Comando, PowerShell e Linux. Se o npm exibir uma lista de scripts do esbuild aguardando aprovação, use `npm install-scripts approve esbuild` e execute novamente `npm install`. Não é necessário usar `--force` nem `--legacy-peer-deps`.
