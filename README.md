# Piremaxx Gestor

MVP web local inspirado no painel autenticado do eGestor: dashboard, vendas/orçamentos, produtos/estoque, clientes, financeiro, relatórios e backup/restauração. O painel original também possui Compras, Boletos, Cobranças, Pix, NFe/Fiscal, Configurações e API; esses módulos entram na próxima etapa da implementação.

## Executar

Requer Node.js 18+. Rode `npm start` e abra http://localhost:3000.

Com `PORT=3001 npm start`, a API fica disponível em `http://localhost:3001`. Os endpoints principais são `/api/clients`, `/api/products`, `/api/sales`, `/api/finance`, `/api/backup`, `/api/restore` e as exportações CSV correspondentes (`/api/clients.csv`, por exemplo).

## Backup

O botão **Backup** baixa um JSON completo. A restauração aceita esse formato e faz validação antes de substituir os dados salvos no navegador. No eGestor, a opção **Configurações → Geral → Exportação de dados** solicita uma cópia dos dados para download, normalmente em formato legível por planilhas; o adaptador para esse arquivo pode ser finalizado assim que a cópia real for baixada.
