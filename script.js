'use strict';

// Adicione somente o número de WhatsApp confirmado pela empresa, com país e DDD.
const CONFIG = {
  whatsapp: '',
};

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const calculator = document.querySelector('#calculator');
const quoteDialog = document.querySelector('#quote-dialog');
const quoteMessage = document.querySelector('#quote-message');
const quoteStatus = document.querySelector('#quote-status');

function closeMenu() {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menu');
}

menu.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') !== 'true';

  menu.setAttribute('aria-expanded', String(isOpen));
  menu.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.querySelector('#year').textContent = new Date().getFullYear();

let estimate = '';

calculator.addEventListener('submit', (event) => {
  event.preventDefault();

  const area = Number(document.querySelector('#area').value);
  const rate = Number(document.querySelector('#orientation').value);

  if (!Number.isFinite(area) || area <= 0 || area > 100000) {
    return;
  }

  const total = Math.ceil(area * rate);
  estimate = `${total.toLocaleString('pt-BR')} peças para ${area.toLocaleString('pt-BR')} m², sem perdas`;
  document.querySelector('#result').textContent = estimate;
});

function openQuote(product) {
  document.querySelector('#quote-product').textContent = product;
  quoteMessage.value = `Olá! Gostaria de solicitar um orçamento para ${product.toLowerCase()}.${estimate ? ` Estimativa: ${estimate}.` : ''}
Cidade de entrega: 
Quantidade desejada: `;

  quoteStatus.textContent = CONFIG.whatsapp
    ? 'Envie seu pedido diretamente para nossa equipe.'
    : 'Solicite seu orçamento por telefone ou copie a mensagem e envie pelo Instagram.';

  document.querySelector('#send-quote').textContent = CONFIG.whatsapp
    ? 'Enviar pelo WhatsApp ↗'
    : 'Copiar pedido';

  quoteDialog.showModal();
  document.body.classList.add('modal-open');
}

document.querySelectorAll('[data-quote]').forEach((button) => {
  button.addEventListener('click', () => openQuote(button.dataset.quote));
});

document.querySelector('.close').addEventListener('click', () => {
  quoteDialog.close();
});

quoteDialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
});

quoteDialog.addEventListener('click', (event) => {
  if (event.target !== quoteDialog) {
    return;
  }

  const bounds = quoteDialog.getBoundingClientRect();
  const clickedOutsideDialog =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutsideDialog) {
    quoteDialog.close();
  }
});

document.querySelector('#send-quote').addEventListener('click', async () => {
  if (CONFIG.whatsapp && /^\d{10,15}$/.test(CONFIG.whatsapp)) {
    window.open(
      `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(quoteMessage.value)}`,
      '_blank',
      'noopener,noreferrer',
    );
    return;
  }

  try {
    await navigator.clipboard.writeText(quoteMessage.value);
    quoteStatus.textContent = 'Pedido copiado! Envie a mensagem pelo Instagram da Cerâmica Lara.';
  } catch {
    quoteMessage.focus();
    quoteMessage.select();
    quoteStatus.textContent = 'Selecione e copie a mensagem para enviar à equipe.';
  }
});
