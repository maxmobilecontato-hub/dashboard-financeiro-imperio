# Project TODO

- [x] Dashboard financeiro responsivo com layout refinado inspirado no painel de referência
- [x] Upload aceitar somente arquivos `.xlsx`
- [x] Nova importação substituir integralmente a base atual exibida
- [x] Ler a aba de fluxo de entrada
- [x] Ler a aba de fluxo de saída
- [x] Ler a aba de boletos a pagar
- [x] Ler a aba de pagamentos a receber
- [x] Calcular total de entradas, saídas, boletos, recebimentos e saldo
- [x] Calcular lucro líquido mensal como entradas menos saídas menos boletos a pagar
- [x] Exibir gráfico de lucro líquido mensal
- [x] Exibir indicadores e gráfico de boletos vencidos, em dia e pagos
- [x] Exibir despesas por forma de pagamento
- [x] Exibir comparação entre entradas e saídas
- [x] Aplicar regra de comprovante como pagamento
- [x] Exibir itens vencidos como pendência e itens em dia como acompanhamento
- [x] Exibir histórico da última importação com nome do arquivo e data
- [x] Criar estados de carregamento, vazio, erro e arquivo inválido
- [x] Validar o funcionamento com testes Vitest
- [x] Validar visualmente desktop e mobile

## Correções de validação

- [x] Corrigir o parser da aba de pagamentos a receber para localizar as colunas reais de valor e data mesmo com cabeçalho deslocado
- [x] Revalidar os totais de recebimentos e o saldo após corrigir o parser
- [x] Garantir que o Vitest inclua e execute os testes das regras do dashboard

## Validação com base real

- [x] Validar o parser de pagamentos a receber com a planilha enviada e confirmar a coluna de valor
- [x] Conferir explicitamente os totais de recebimentos e saldo calculados com os dados reais

## Prova do parser integrado

- [x] Executar o parser do app com as linhas reais de pagamentos a receber e registrar coluna, quantidade e valores
- [x] Corrigir o teste para usar cabeçalho sem `VALOR` e excluir código e datas
- [x] Comparar o total produzido pelo parser do app com o total da planilha real

## Ajuste final do parser real

- [x] Ignorar linhas-resumo ou fórmulas sem nome válido na aba de pagamentos a receber
- [x] Registrar explicitamente a coluna de valor e os registros válidos encontrados na planilha real
- [x] Recomparar o total após excluir registros espúrios

- [x] Comparar explicitamente o total do parser com o total revalidado da planilha real sem a linha-resumo

## Expansão do dashboard

- [x] Adicionar seleção de mês e ano para reutilizar o dashboard em diferentes períodos
- [x] Permitir upload de PDFs financeiros
- [x] Criar áreas específicas para entradas e saídas
- [x] Criar etapa de importação de notas fiscais de entrada
- [x] Extrair e somar automaticamente valores das notas fiscais compatíveis
- [x] Atualizar métricas e gráficos conforme mês/ano selecionados
- [x] Registrar histórico das importações XLSX e PDF
- [x] Testar PDF inválido, PDF sem texto e notas fiscais sem valor identificável

## Rankings comerciais

- [x] Exibir os 5 principais clientes por valor de compras realizadas
- [x] Exibir os 5 principais fornecedores por valor de compras feitas pela empresa
- [x] Fazer os rankings respeitarem mês e ano selecionados
- [x] Validar rankings com dados reais e sem registros vazios

## Bases mensais

- [x] Detectar automaticamente mês e ano da planilha importada
- [x] Armazenar várias bases mensais no navegador sem sobrescrever os meses anteriores
- [x] Selecionar um mês e exibir exclusivamente os dados daquela base
- [x] Comparar faturamento entre meses disponíveis
- [x] Exibir variação absoluta e percentual entre meses
- [x] Testar agosto e uma segunda base mensal com o mesmo dashboard

## Comparativo de lucro 2026

- [x] Criar gráfico separado de lucro mensal de agosto a dezembro de 2026
- [x] Manter o gráfico comparativo independente do filtro da visão principal
- [x] Atualizar o comparativo conforme novas bases mensais forem importadas

## Fechamento mensal dinâmico

- [x] Validar rankings com a planilha real e cobrir nomes vazios e ordenação dos cinco primeiros
- [x] Implementar comparação de faturamento baseada em todas as bases mensais disponíveis
- [x] Adicionar variação absoluta e percentual entre o mês selecionado e o mês anterior
- [x] Executar teste funcional automatizado de duas importações, histórico com múltiplas bases e alternância pelo seletor; setembro real depende do próximo upload
- [x] Tornar o comparativo de lucro dinâmico conforme novas bases forem importadas

## Separação por empresa/CNPJ

- [x] Identificar empresa e CNPJ nas notas fiscais importadas — teste UI com CNPJs 12.345.678/0001-90 e 98.765.432/0001-10
- [x] Separar totais recebidos entre Império dos Balões e Império dos Balões BH
- [x] Adicionar controle lateral com gráfico comparativo por empresa
- [x] Respeitar mês/ano selecionados e registrar estado sem CNPJ identificado
- [x] Testar classificação, cálculos, filtros e responsividade da nova seção — teste UI passou com agosto, setembro e documento sem empresa

## Upload múltiplo de notas fiscais

- [x] Permitir selecionar vários PDFs de notas fiscais em uma única ação
- [x] Processar todos os PDFs selecionados e atualizar totais, empresas e histórico
- [x] Exibir feedback de progresso e erros parciais sem interromper os demais arquivos
- [x] Testar upload múltiplo, classificação, soma automática e responsividade

## Correção do conflito npm após rollback

- [x] Remover novamente @builder.io/vite-plugin-jsx-loc da versão revertida
- [x] Remover sua configuração do vite.config.ts sem alterar o dashboard
- [x] Regenerar package-lock e validar npm install sem ERESOLVE
- [x] Validar TypeScript, testes e build
- [x] Entregar novo pacote ReactJS compatível com npm

## Pacote npm corrigido após rollback

- [x] Gerar ZIP com package.json, package-lock.json e configuração Vite sem jsx-loc
- [x] Enviar o pacote corrigido e confirmar instalação npm sem ERESOLVE

## Publicação do importador estático via GitHub Actions

- [x] Revisar build e configuração de base path para GitHub Pages
- [x] Preparar workflow de instalação, testes e build
- [x] Adicionar publicação automática do frontend estático no GitHub Pages
- [x] Validar build e documentar a ativação do Pages

## Documentação de ativação do GitHub Pages

- [x] Documentar Settings > Pages > Source = GitHub Actions
- [x] Documentar branch main, disparo manual e URL esperada
- [x] Confirmar no guia que o importador funciona no navegador sem backend

## Estrutura .github/workflows

- [x] Confirmar o arquivo de workflow dentro de `.github/workflows`
- [x] Validar o workflow de build e publicação do importador
- [x] Entregar a estrutura pronta para o GitHub Actions

## Correções do GitHub Pages — recursos e console

- [x] Identificar a requisição que retorna 400 no build estático
- [x] Evitar chamadas/recursos do Manus que não funcionam no GitHub Pages
- [x] Adicionar favicon disponível no subcaminho do GitHub Pages
- [x] Validar recursos, build e console após a correção

## Correção da rota inicial no GitHub Pages

- [x] Configurar o roteador para reconhecer o subcaminho do repositório
- [x] Validar a rota inicial e os assets no build estático
- [x] Confirmar a publicação sem 404 no GitHub Pages

## Validação runtime da rota no GitHub Pages

- [x] Publicar novamente a versão com WouterRouter usando o base path
- [x] Confirmar no navegador que a URL inicial não retorna 404
- [x] Confirmar em execução que favicon e assets carregam no subcaminho

## Remoção das faixas coloridas da planilha

- [x] Identificar os preenchimentos e regras que formam as faixas coloridas
- [x] Remover somente as faixas da área solicitada, preservando status e dados
- [x] Validar fórmulas, gráficos, layout e símbolos após a alteração
- [x] Entregar nova cópia do arquivo Excel

## Ajuste solicitado para status automático até a linha 150

- [x] Atualizar somente a aba BOLETOS A PAGAR- AGOSTO até a linha 150: comprovante preenchido deixa B:I verdes e A com ✅; boleto em dia mostra bolinha verde em A; boleto vencido mostra bolinha vermelha em A e B:H vermelhas; H calcula automaticamente os dias até o vencimento; preservar layout, estrutura, dados e gráficos.
- [x] Ajustar a automação da coluna A para usar o símbolo exato ✅ nos boletos pagos e revalidar o XML/resultado final.
- [x] Revalidar explicitamente que a automação até a linha 150 preserva as formatações e automações necessárias da área A:I.
