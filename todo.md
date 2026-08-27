
## Restauração dos gráficos do dashboard

- [x] Validar a planilha enviada e a leitura das abas usadas pelos gráficos
- [x] Restaurar a renderização dos gráficos com dados importados
- [x] Garantir que nova gravação da planilha não remova os gráficos
- [x] Testar gráficos com base real, estado sem dados e layout da aba DASHBOARD

## Gráficos restaurados na planilha Excel

- [x] Inspecionar abas e dados do arquivo Excel enviado
- [x] Recriar os gráficos diretamente na planilha sem alterar a estrutura principal
- [x] Validar gráficos, fórmulas, formatação de status e abas existentes
- [x] Entregar uma nova cópia Excel com os gráficos restaurados

## Aprimoramento visual dos gráficos da planilha

- [x] Escolher gráficos mais úteis para entradas, despesas e composição
- [x] Aplicar títulos, cores, rótulos e posicionamento aprimorados
- [x] Validar a leitura visual e a integridade das fórmulas e abas
- [x] Entregar a nova cópia Excel com os gráficos aprimorados

- [x] Posicionar cada gráfico no seu espaço correto, sem sobrepor tabelas ou informações existentes

## Conexão dos gráficos do arquivo recebido

- [x] Mapear as fontes atuais dos gráficos e fórmulas da aba DASHBOARD
- [x] Conectar os resumos aos intervalos das abas operacionais
- [x] Validar atualização automática após alimentar entradas, saídas e boletos — teste temporário confirmou que as fórmulas permanecem vinculadas após novos valores nas abas
- [x] Entregar a nova cópia Excel conectada

## Conexão seletiva dos gráficos existentes

- [x] Identificar os gráficos existentes de boletos pagos e total de entradas no arquivo recebido
- [x] Conectar somente suas fontes às abas operacionais, sem remover ou recriar gráficos
- [x] Validar preservação de posições, títulos, cores e quantidade de gráficos
- [x] Entregar a cópia Excel com os gráficos originais conectados

## Gráfico Boletos Pagos

- [x] Inspecionar a aba Boletos a Pagar, o gráfico existente e as colunas de status/valor
- [x] Conectar o gráfico existente a uma fonte dinâmica de boletos pagos
- [x] Preservar gráfico, posição, título, cores e formatação
- [x] Validar atualização automática após novos pagamentos
- [x] Entregar a cópia Excel conectada

## Alteração mínima — Boletos Pagos

- [x] Alterar somente a fonte do gráfico Boletos Pagos
- [x] Não modificar estrutura, dados, estilos, posições ou outros gráficos
- [x] Validar que a única diferença é a conexão solicitada
- [x] Entregar a cópia Excel resultante

## Correção do gráfico BOLETOS PAGOS / PRINCIPAIS LANÇAMENTOS

- [x] Identificar o objeto do gráfico mostrado no print e suas séries atuais
- [x] Ligar somente as séries de nomes e valores aos boletos com status PAGO
- [x] Preservar título, cores, dimensões, posição, abas e demais informações
- [x] Validar atualização automática ao marcar novos boletos como PAGO — teste simulado com novo comprovante passou após salvar e reabrir
- [x] Entregar a cópia Excel corrigida

## Correção de instalação do pacote ReactJS no Windows

- [x] Remover ou substituir o plugin incompatível com Vite 7
- [x] Atualizar package.json e lockfile de forma compatível com npm install
- [x] Validar TypeScript, testes e build após a correção
- [x] Entregar novo pacote ReactJS corrigido

## Compatibilidade Windows — scripts npm e esbuild

- [x] Corrigir o script `dev` para definir NODE_ENV de forma multiplataforma
- [x] Atualizar o guia de instalação sobre autorização dos scripts do esbuild
- [x] Validar os scripts npm, testes e build após a mudança
- [x] Gerar e entregar novo ZIP compatível com Windows
