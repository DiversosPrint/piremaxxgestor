const titles = {
  overview: 'Visão Geral',
  finance: 'Financeiro',
  stock: 'Estoque',
  production: 'Produção',
  sales: 'Vendas',
  customers: 'Clientes'
};

const sideLinks = document.querySelectorAll('.side-link');
const panels = document.querySelectorAll('.window-card');
const pageTitle = document.getElementById('pageTitle');

sideLinks.forEach((link) => {
  link.addEventListener('click', () => {
    sideLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    const target = link.dataset.window;
    pageTitle.textContent = titles[target] || 'Visão Geral';

    // Mantém a visão geral como dashboard principal e destaca a janela escolhida.
    panels.forEach((panel) => panel.classList.remove('focus-panel'));
    if (target !== 'overview') {
      const selected = document.querySelector(`[data-panel="${target}"]`);
      selected?.classList.add('focus-panel');
      selected?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

document.querySelectorAll('.view-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.view-tab').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
  });
});

document.querySelectorAll('.dots').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.glass-card');
    card?.classList.toggle('expanded');
  });
});
