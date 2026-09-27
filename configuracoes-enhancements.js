(()=>{
  const style=document.createElement('style');style.textContent='.settings-toolbar{display:flex;gap:8px;align-items:center;margin:-6px 0 18px}.settings-toolbar input{margin-left:auto;width:280px;padding:10px;border:1px solid #c9d0d5;border-radius:3px}.settings-new{background:#f2ad00;color:#fff;border:0;border-radius:4px;padding:10px 18px;font-weight:bold}.settings-delete{background:#fff;border:1px solid #c9d0d5;border-radius:4px;padding:10px 14px;color:#71808a}.settings-list{width:100%;border-collapse:collapse;background:#fff}.settings-list th,.settings-list td{text-align:left;padding:13px 12px;border-bottom:1px solid #e0e0e0;color:#55728a}.settings-list th{font-weight:bold}.settings-list tr:nth-child(odd){background:#f0f0f0}.settings-list .yes{color:#18a768}.settings-form{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px}@media(max-width:800px){.settings-form{grid-template-columns:1fr}.settings-toolbar input{width:180px}}';document.head.appendChild(style);
  const panel=document.querySelector('#panel');
  if(!panel)return;
  const labels={
    contas:['Plano de contas','Cadastre e organize as contas usadas no financeiro.',['Código','Descrição','Tipo']],
    caixa:['Contas caixa','Configure as contas bancárias e caixas da empresa.',['Nome da conta','Banco','Agência / conta']],
    operacoes:['Operações','Defina as operações padrão para vendas e compras.',['Descrição','Tipo de operação','Conta padrão']],
    pagto:['Formas de pagamento','Configure as formas aceitas e seus prazos.',['Descrição','Tipo','Prazo padrão']],
    boletos:['Boletos','Configure os dados para emissão e registro de boletos.',['Banco','Carteira','Convênio']],
    fiscal:['Dados fiscais','Configure os parâmetros fiscais usados nos documentos.',['Regime tributário','Série padrão','Ambiente']],
    api:['API','Integrações locais e chaves de acesso do sistema.',['Integração','Status','Última sincronização']]
  };
  const users=[
    ['4','CLAUDEMIR NOGUEIRA','claudemir.nogueira@piremaxx.com.br','claudemirnogueira','claudemir nogueira'],
    ['1','Diego Miranda','diego.miranda@piremaxx.com.br','diego',''],
    ['2','Katia Maria','katia.castilho@piremaxx.com.br','katiacastilho','KATIA CASTILHO'],
    ['5','ODIMAN COSTA','adoarapro@gmail.com','odiman','ODIMAN COSTA'],
    ['3','Viviane Martins','administrativo@piremaxx.com.br','vivianemartins','viviane']
  ];
  function renderPanel(key){
    if(key==='usuarios'){
      panel.innerHTML='<h2>♟ Usuários</h2><div class="settings-toolbar"><button class="settings-new" type="button" onclick="alert(\'Cadastro de usuário local disponível.\')">⊞ Novo</button><button class="settings-delete" type="button">♜</button><input placeholder="Buscar usuários"></div><table class="settings-list"><thead><tr><th>□</th><th>Cód</th><th>Nome ↕</th><th>E-mail</th><th>Login</th><th>Palavras-chave</th><th>Permissão</th><th>Acesso?</th></tr></thead><tbody>'+users.map(user=>'<tr><td>□</td><td>'+user[0]+'</td><td>'+user[1]+'</td><td>'+user[2]+'</td><td>'+user[3]+'</td><td>'+user[4]+'</td><td>Acesso completo</td><td class="yes">Sim</td></tr>').join('')+'</tbody></table>';
      return;
    }
    const data=labels[key]||['Configuração','Configure esta seção do sistema.',['Descrição','Valor','Observações']];
    panel.innerHTML='<h2>'+data[0]+'</h2><div class="settings-form">'+data[2].map((field,index)=>'<label class="field">'+field+'<input placeholder="'+field+'" value="'+(index===0?'': '')+'"></label>').join('')+'</div><button class="save" type="button" onclick="alert(\'Configuração salva\')">Salvar</button><div class="clear"></div>';
  }
  const buttons=document.querySelectorAll('.tabs button[data-panel]');
  buttons.forEach(button=>button.addEventListener('click',()=>{if(button.dataset.panel!=='geral')renderPanel(button.dataset.panel)}));
})();
