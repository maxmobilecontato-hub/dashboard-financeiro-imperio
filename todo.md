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
