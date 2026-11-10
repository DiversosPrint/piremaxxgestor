const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || path.join(__dirname, 'planilhas');
const dbPath = path.join(__dirname, 'database.json');
const decoder = new TextDecoder('windows-1252');

function readTable(name) {
  const html = decoder.decode(fs.readFileSync(path.join(dir, name)));
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(match =>
    [...match[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(cell =>
      cell[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
    )
  );
  const headers = rows.shift() || [];
  return rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])));
}

function number(value) {
  const text = String(value ?? '').trim();
  if (!text) return 0;
  const parsed = Number(text.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function permissionsFor(user) {
  const full = String(user.PERMISSOES || '').toLowerCase() === 'acessocompleto';
  return {
    home: true,
    financeiro: full,
    vendas: full,
    compras: full,
    frota: full,
    clientes: full,
    produtos: full,
    relatorios: full,
    configuracoes: full,
    excluir: full,
    descontos: full,
    custos: full
  };
}

const contactsRaw = readTable('contatos.xls');
const financeRaw = readTable('financeiro.xls');
const usersRaw = readTable('usuarios.xls');
const oldDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const oldUsers = JSON.parse(oldDb.piremaxx_usuarios || '[]');
const oldPasswords = new Map(oldUsers.map(user => [String(user.login || '').toLowerCase(), user.senha || '123456']));
const contactNames = new Map(contactsRaw.map(contact => [String(contact.CODIGO), contact.NOME]));

const profileByLogin = {
  odiman: 'admin',
  diego: 'comercial',
  katiacastilho: 'financeiro',
  vivianemartins: 'admin',
  claudemirnogueira: 'comercial'
};

const users = usersRaw
  .filter(user => user.ATIVO === '1' && user.LOGAVEL === '1' && !user.DTDEL && user.LOGIN)
  .map(user => ({
    id: Number(user.CODIGO) || user.CODIGO,
    nome: user.NOME,
    email: user.EMAIL,
    login: user.LOGIN,
    senha: oldPasswords.get(String(user.LOGIN).toLowerCase()) || '123456',
    palavrasChave: user.TAGS || user.NOME,
    perfil: profileByLogin[String(user.LOGIN).toLowerCase()] || 'comercial',
    permissaoLabel: String(user.PERMISSOES || '').toLowerCase() === 'acessocompleto' ? 'Acesso completo' : 'Acesso limitado',
    ativo: true,
    permissoes: permissionsFor(user)
  }));

const receivables = financeRaw
  .filter(finance => finance.ATIVO === '1' && !finance.DTDEL)
  .map(finance => {
    const paid = finance.SITUACAO === '40';
    const value = paid && number(finance.VALORPAGO) > 0 ? number(finance.VALORPAGO) : number(finance.VALOR);
    return {
      id: String(finance.CODIGO),
      code: String(finance.CODIGO),
      saleCode: '',
      description: finance.DESCRICAO || 'Lançamento financeiro',
      contact: contactNames.get(String(finance.CODCONTATO)) || ('Contato #' + finance.CODCONTATO),
      account: 'Caixa interno',
      date: finance.DTVENC || finance.DTCOMP || '',
      dueDate: finance.DTVENC || '',
      status: paid ? 'Recebida' : 'A Receber',
      value,
      originalValue: number(finance.VALOR),
      paidValue: number(finance.VALORPAGO),
      categoryCode: finance.CODPLANOCONTAS || '',
      paymentMethodCode: finance.CODFORMAPGTO || '',
      source: 'financeiro.xls'
    };
  });

oldDb.piremaxx_contatos = '[]';
oldDb.localProducts = '[]';
oldDb.localSales = '[]';
oldDb.piremaxx_contas_receber = JSON.stringify(receivables);
oldDb.piremaxx_usuarios = JSON.stringify(users);
oldDb.piremaxx_data_epoch = 'planilhas-2026-11-09-v2';
fs.writeFileSync(dbPath, JSON.stringify(oldDb, null, 2), 'utf8');

console.log(JSON.stringify({ contacts: contactsRaw.length, finance: receivables.length, users: users.length }));
