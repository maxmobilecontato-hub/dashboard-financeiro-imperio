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
