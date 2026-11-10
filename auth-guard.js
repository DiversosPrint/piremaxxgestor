/*
 * Piremaxx Gestor - controle de acesso da sessão.
 *  - Sempre exige login ao abrir o sistema (a sessão vale apenas para a aba/janela aberta).
 *  - Após 5 minutos sem atividade, volta para a tela de login.
 *  - Ao sair da conta ou fechar o sistema, lembra o usuário de fazer o backup.
 * Carregado no <head> de todas as páginas, exceto login.html, venda-pdf.html (link público) e offline.html.
 */
(function () {
  'use strict';

  var IDLE_LIMIT_MS = 5 * 60 * 1000;
  var CHECK_EVERY_MS = 15 * 1000;
  var SESSION_KEY = 'piremaxx_sessao';
  var TAB_KEY = 'piremaxx_tab_auth';
  var ACTIVITY_KEY = 'piremaxx_last_activity';
  var CLOSED_KEY = 'piremaxx_closed_notice';
  var BACKUP_KEY = 'piremaxx_last_backup';

  var page = (location.pathname.split('/').pop() || '').toLowerCase();
  if (['login.html', 'venda-pdf.html', 'offline.html'].indexOf(page) !== -1) return;

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  }
  function tabAuthenticated() {
    try { return sessionStorage.getItem(TAB_KEY) === '1'; } catch (e) { return false; }
  }
  function lastActivity() {
    var n = Number(localStorage.getItem(ACTIVITY_KEY));
    return n > 0 ? n : 0;
  }

  var leaving = false;
  function goToLogin(reason) {
    leaving = true;
    try { sessionStorage.removeItem(TAB_KEY); } catch (e) {}
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    location.replace('login.html' + (reason ? '?motivo=' + reason : ''));
  }

  // 1) Sem sessão válida nesta aba -> tela de login
  if (!tabAuthenticated() || !readSession()) {
    goToLogin();
    return;
  }
  // 2) Inatividade acumulada enquanto a aba estava fechada/suspensa
  if (lastActivity() && Date.now() - lastActivity() >= IDLE_LIMIT_MS) {
    goToLogin('inatividade');
    return;
  }
  try { localStorage.setItem(ACTIVITY_KEY, String(Date.now())); } catch (e) {}

  // ---- Controle de inatividade (5 min) ----
  var lastWrite = 0;
  function markActivity() {
    var now = Date.now();
    if (now - lastWrite < 1000) return;
    lastWrite = now;
    try { localStorage.setItem(ACTIVITY_KEY, String(now)); } catch (e) {}
  }
  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, markActivity, { passive: true, capture: true });
  });
  function checkIdle() {
    if (leaving) return;
    if (Date.now() - lastActivity() >= IDLE_LIMIT_MS) goToLogin('inatividade');
  }
  setInterval(checkIdle, CHECK_EVERY_MS);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) checkIdle(); });
  window.addEventListener('pageshow', checkIdle);
  window.addEventListener('storage', function (e) {
    // Saiu da conta em outra aba/janela
    if (e.key === SESSION_KEY && !e.newValue && !leaving) goToLogin();
  });

  // ---- Aviso de backup ao sair da conta ----
  function isAdmin() {
    var s = readSession();
    return !s || s.perfil === 'admin' || (s.permissaoLabel && String(s.permissaoLabel).toLowerCase().indexOf('completo') !== -1);
  }
  function lastBackupText() {
    var n = Number(localStorage.getItem(BACKUP_KEY));
    if (!n) return 'Nenhum backup foi feito neste navegador ainda.';
    var d = new Date(n), p = function (x) { return String(x).padStart(2, '0'); };
    return 'Último backup: ' + p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' às ' + p(d.getHours()) + ':' + p(d.getMinutes()) + '.';
  }
  function performLogout() {
    leaving = true;
    try { sessionStorage.removeItem(TAB_KEY); } catch (e) {}
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    location.href = 'login.html';
  }

  window.piremaxxRequestLogout = function () {
    if (document.getElementById('pmxLogoutBackupModal')) return;
    var admin = isAdmin();
    var overlay = document.createElement('div');
    overlay.id = 'pmxLogoutBackupModal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(15,29,58,.62);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Arial,Helvetica,sans-serif';
    overlay.innerHTML =
      '<div style="width:min(460px,95vw);background:#fff;border-radius:12px;box-shadow:0 16px 40px rgba(0,0,0,.35);overflow:hidden">' +
        '<div style="background:#1e3a47;color:#fff;padding:15px 20px;font-size:16px;font-weight:bold">💾 Faça o backup antes de sair</div>' +
        '<div style="padding:20px;color:#334e5b;font-size:14px;line-height:1.5">' +
          '<p style="margin:0 0 10px">Recomendamos fazer o <b>backup dos dados</b> antes de sair da conta, para evitar a perda de informações.</p>' +
          '<p style="margin:0 0 4px;font-size:12px;color:#6a828e" id="pmxLastBackup">' + lastBackupText() + '</p>' +
          (admin ? '' : '<p style="margin:8px 0 0;font-size:12px;color:#b45309">O backup completo é feito por um administrador.</p>') +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;padding:0 20px 20px">' +
          '<button type="button" data-act="cancel" style="padding:9px 14px;border:1px solid #cbd5dc;background:#fff;border-radius:6px;cursor:pointer;color:#334e5b">Cancelar</button>' +
          '<button type="button" data-act="leave" style="padding:9px 14px;border:0;background:#dc2626;color:#fff;border-radius:6px;cursor:pointer;font-weight:bold">Sair sem backup</button>' +
          (admin ? '<button type="button" data-act="backup" style="padding:9px 14px;border:0;background:#0b7285;color:#fff;border-radius:6px;cursor:pointer;font-weight:bold">Fazer backup e sair</button>' : '') +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (e.target === overlay || act === 'cancel') { overlay.remove(); return; }
      if (act === 'leave') { performLogout(); return; }
      if (act === 'backup') {
        try {
          if (typeof window.piremaxxDownloadBackup === 'function') window.piremaxxDownloadBackup();
        } catch (err) {}
        // aguarda o download iniciar antes de encerrar a sessão
        setTimeout(performLogout, 900);
      }
    });
  };

  // Intercepta qualquer link "Sair" que aponte para o login
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-logout-link], a[href$="login.html"]');
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    window.piremaxxRequestLogout();
  }, true);

  // ---- Aviso ao fechar o sistema ----
  // O navegador não permite texto personalizado no aviso nativo; por isso, além dele,
  // a mensagem de lembrete de backup também aparece na tela de login seguinte.
  var internalNav = false;
  var hasNavigationApi = !!(window.navigation && window.navigation.addEventListener);
  if (hasNavigationApi) {
    window.navigation.addEventListener('navigate', function (e) {
      try {
        if (e.destination && String(e.destination.url).indexOf(location.origin) === 0) {
          internalNav = true;
          setTimeout(function () { internalNav = false; }, 4000);
        }
      } catch (err) {}
    });
  }
  window.addEventListener('beforeunload', function (e) {
    if (internalNav || leaving) return;
    var msg = 'Lembre-se de fazer o backup dos dados antes de fechar o sistema.';
    e.preventDefault();
    e.returnValue = msg;
    return msg;
  });
  window.addEventListener('pagehide', function (e) {
    if (e.persisted || internalNav || leaving) return;
    try { localStorage.setItem(CLOSED_KEY, '1'); } catch (err) {}
  });
})();
