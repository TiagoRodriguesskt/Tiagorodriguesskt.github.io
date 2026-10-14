/* =========================================================
   Portfólio do Tiago — comportamento
   1) utilidades
   2) fundo que reage ao mouse
   3) abertura: terminal digitando + nome em superposição
   4) esfera de Bloch interativa
   5) circuito de Bell que roda de verdade
   6) terminal (easter egg)
   7) menu ativo e seções aparecendo ao rolar
   8) artigos (lista em artigos.js)
   ========================================================= */

/* ---------- 1) UTILIDADES ---------- */

// Avisa ao CSS que o JavaScript está ativo (usado nas animações de entrada).
document.documentElement.classList.add('js');

// Se a pessoa pediu ao sistema para reduzir animações, respeitamos.
const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lê uma cor definida no :root do CSS, para os canvas usarem as mesmas cores.
function corCSS(nome) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

// Converte "#7CF5C2" em "rgba(124, 245, 194, a)".
function rgba(hex, a) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

const espera = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
const limitar = (x, min, max) => Math.min(max, Math.max(min, x));

const CORES = {
  a1: corCSS('--a1'),
  a2: corCSS('--a2'),
  fio: corCSS('--fio-claro'),
  forte: corCSS('--forte'),
  suave: corCSS('--suave'),
  apagado: corCSS('--apagado'),
};

document.getElementById('ano').textContent = new Date().getFullYear();

// Calcula o tempo de casa a partir de data-desde="AAAA-MM" (ex.: "2020-08")
document.querySelectorAll('[data-desde]').forEach((el) => {
  const [ano, mes] = el.dataset.desde.split('-').map(Number);
  const hoje = new Date();
  const meses = (hoje.getFullYear() - ano) * 12 + (hoje.getMonth() + 1 - mes);
  const anos = Math.floor(meses / 12);
  if (anos >= 1) el.textContent = ` · ${anos} ${anos === 1 ? 'ano' : 'anos'}`;
});


/* ---------- 2) FUNDO QUE REAGE AO MOUSE ----------
   Uma grade de pontos. Perto do mouse, os pontos são empurrados por
   um "pacote de onda": uma oscilação sin(k·r − ω·t) dentro de um
   envelope gaussiano. Cada clique solta uma onda circular que se espalha. */
(function fundo() {
  const canvas = document.getElementById('fundo');
  const ctx = canvas.getContext('2d');
  const ESPACO = 30;          // distância entre os pontos (px)
  const RAIO_MOUSE = 150;     // tamanho da região afetada pelo mouse
  const mouse = { x: -9999, y: -9999 };
  const ondas = [];           // ondas criadas pelos cliques
  let largura = 0, altura = 0;
  const excitados = [];       // pontos que vão ganhar brilho colorido

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = window.innerWidth;
    altura = window.innerHeight;
    canvas.width = largura * dpr;
    canvas.height = altura * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function desenhar(t) {
    ctx.clearRect(0, 0, largura, altura);
    ctx.fillStyle = CORES.fio;
    excitados.length = 0;

    // Remove ondas que já perderam a força
    for (let i = ondas.length - 1; i >= 0; i--) {
      ondas[i].forca = 1 - (t - ondas[i].inicio) / 2600;
      if (ondas[i].forca <= 0) ondas.splice(i, 1);
    }

    for (let gx = ESPACO / 2; gx < largura; gx += ESPACO) {
      for (let gy = ESPACO / 2; gy < altura; gy += ESPACO) {
        let px = gx, py = gy, energia = 0;

        // Pacote de onda em volta do mouse
        const dx = gx - mouse.x, dy = gy - mouse.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < RAIO_MOUSE * 3) {
          const envelope = Math.exp(-(d * d) / (2 * RAIO_MOUSE * RAIO_MOUSE));
          const desloc = envelope * 8 * Math.sin(d * 0.06 - t * 0.005);
          px += (dx / d) * desloc;
          py += (dy / d) * desloc;
          energia += envelope;
        }

        // Ondas circulares dos cliques
        for (const o of ondas) {
          const ox = gx - o.x, oy = gy - o.y;
          const od = Math.hypot(ox, oy) || 1;
          const raio = (t - o.inicio) * 0.45;
          const frente = Math.exp(-((od - raio) ** 2) / (2 * 22 * 22)) * o.forca;
          px += (ox / od) * frente * 10;
          py += (oy / od) * frente * 10;
          energia += frente;
        }

        energia = Math.min(1, energia);
        ctx.globalAlpha = 0.35 + energia * 0.3;
        ctx.fillRect(px - 0.75, py - 0.75, 1.5, 1.5);
        if (energia > 0.08) excitados.push(px, py, energia);
      }
    }

    // Segunda passada: pontos "excitados" ganham a cor de destaque
    ctx.fillStyle = CORES.a1;
    for (let i = 0; i < excitados.length; i += 3) {
      const e = excitados[i + 2];
      const tam = 1.5 + e * 1.6;
      ctx.globalAlpha = e * 0.85;
      ctx.fillRect(excitados[i] - tam / 2, excitados[i + 1] - tam / 2, tam, tam);
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    desenhar(t);
    requestAnimationFrame(loop);
  }

  redimensionar();
  window.addEventListener('resize', () => {
    redimensionar();
    if (reduzMovimento) desenhar(0);
  });

  if (reduzMovimento) {
    desenhar(0); // só a grade parada
    return;
  }

  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('pointerdown', (e) => {
    ondas.push({ x: e.clientX, y: e.clientY, inicio: performance.now(), forca: 1 });
    if (ondas.length > 6) ondas.shift();
  });

  requestAnimationFrame(loop);
})();


/* ---------- 3) ABERTURA ----------
   O comando é digitado letra por letra enquanto o nome fica
   "em superposição", trocando entre símbolos. Quando o comando
   termina, cada letra colapsa no seu valor real. */
const nomeEl = document.getElementById('nome');
const NOME = [...nomeEl.textContent.trim()];
const SIMBOLOS = 'ψφθαβℏ∂∑∫01⟩⟨√πΔΩλ';
let letras = [];
let emSuperposicao = false;

function montarNome() {
  nomeEl.textContent = '';
  letras = NOME.map((ch) => {
    const s = document.createElement('span');
    s.textContent = ch;
    s.setAttribute('aria-hidden', 'true');
    nomeEl.appendChild(s);
    return s;
  });
}

// Fixa a largura de cada letra para o nome não "tremer" durante o efeito.
function fixarLarguras() {
  letras.forEach((s, i) => {
    s.style.width = '';
    s.textContent = NOME[i];
    s.style.width = s.getBoundingClientRect().width + 'px';
  });
}

function superposicao(atrasoInicial) {
  if (emSuperposicao || reduzMovimento) return Promise.resolve();
  emSuperposicao = true;
  return new Promise((resolver) => {
    const inicio = performance.now();
    const colapsaEm = letras.map((_, i) => atrasoInicial + i * 140);

    function passo() {
      const dt = performance.now() - inicio;
      let todasColapsaram = true;
      letras.forEach((s, i) => {
        if (dt < colapsaEm[i]) {
          todasColapsaram = false;
          s.textContent = SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)];
          s.classList.add('instavel');
        } else {
          s.textContent = NOME[i];
          s.classList.remove('instavel');
        }
      });
      if (todasColapsaram) {
        emSuperposicao = false;
        resolver();
      } else {
        setTimeout(passo, 55);
      }
    }
    passo();
  });
}

(async function abertura() {
  const alvo = document.getElementById('digitando');
  const texto = alvo.dataset.texto;
  montarNome();
  await document.fonts.ready;
  fixarLarguras();

  if (reduzMovimento) {
    alvo.textContent = texto;
    return;
  }

  // O nome fica em superposição durante toda a digitação
  superposicao(texto.length * 70 + 250);
  for (const ch of texto) {
    alvo.textContent += ch;
    await espera(45 + Math.random() * 50);
  }

  // Passar o mouse no nome "prepara" a superposição de novo
  nomeEl.addEventListener('mouseenter', () => superposicao(300));
  window.addEventListener('resize', () => { if (!emSuperposicao) fixarLarguras(); });
})();


/* ---------- 4) ESFERA DE BLOCH INTERATIVA ----------
   Todo estado de um qubit, |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)·sen(θ/2)|1⟩,
   é um ponto na superfície de uma esfera de raio 1:
       x = sen θ · cos φ,   y = sen θ · sen φ,   z = cos θ
   Cada porta quântica de 1 qubit é uma ROTAÇÃO dessa esfera. */
(function bloch() {
  const canvas = document.getElementById('bloch');
  const ctx = canvas.getContext('2d');
  const saida = document.getElementById('bloch-saida');
  const p0Barra = document.getElementById('p0-barra');
  const p1Barra = document.getElementById('p1-barra');
  const p0Txt = document.getElementById('p0-txt');
  const p1Txt = document.getElementById('p1-txt');
  const avisoColapso = document.getElementById('bloch-colapso');

  // --- matemática de vetores 3D ---
  const ponto = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const vetorial = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
  const norma = (a) => Math.hypot(a.x, a.y, a.z);
  const deAngulos = (theta, phi) => ({
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  });

  // Fórmula de Rodrigues: gira o vetor p em torno do eixo n (unitário) por um ângulo a.
  function girar(p, n, a) {
    const c = Math.cos(a), s = Math.sin(a), k = ponto(n, p) * (1 - c);
    const nxp = vetorial(n, p);
    return {
      x: p.x * c + nxp.x * s + n.x * k,
      y: p.y * c + nxp.y * s + n.y * k,
      z: p.z * c + nxp.z * s + n.z * k,
    };
  }

  // Cada porta = (eixo de rotação, ângulo)
  const R = Math.SQRT1_2;
  const PORTAS = {
    H: { eixo: { x: R, y: 0, z: R }, angulo: Math.PI },
    X: { eixo: { x: 1, y: 0, z: 0 }, angulo: Math.PI },
    Y: { eixo: { x: 0, y: 1, z: 0 }, angulo: Math.PI },
    Z: { eixo: { x: 0, y: 0, z: 1 }, angulo: Math.PI },
    S: { eixo: { x: 0, y: 0, z: 1 }, angulo: Math.PI / 2 },
    T: { eixo: { x: 0, y: 0, z: 1 }, angulo: Math.PI / 4 },
  };

  // --- estado ---
  let v = deAngulos(Math.PI / 4, Math.PI / 4);  // estado inicial
  let animacao = null;                           // rotação em andamento
  let rastro = [];                               // caminho deixado pela ponta do vetor
  const historico = [];                          // últimas portas aplicadas
  const vista = { giro: -0.6, inclinacao: 0.38 };
  let arrastando = false, ultimo = null, visivel = true;
  let tamanho = 290, centro = 145, raio = 104;

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    tamanho = canvas.clientWidth || 290;
    canvas.width = tamanho * dpr;
    canvas.height = tamanho * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    centro = tamanho / 2;
    raio = tamanho * 0.36;
  }

  // Projeta um ponto 3D na tela, levando em conta como a esfera está girada.
  function projetar(p) {
    const cg = Math.cos(vista.giro), sg = Math.sin(vista.giro);
    const ci = Math.cos(vista.inclinacao), si = Math.sin(vista.inclinacao);
    const x1 = p.x * cg - p.y * sg;
    const y1 = p.x * sg + p.y * cg;
    const cima = p.z * ci - x1 * si;
    return {
      x: centro + raio * y1,
      y: centro - raio * cima,
      prof: x1 * ci + p.z * si,   // > 0: na frente; < 0: atrás
    };
  }

  // Desenha uma curva fechada; a parte de trás fica mais apagada.
  function curva(f, cor) {
    ctx.strokeStyle = cor;
    ctx.lineWidth = 1;
    let ant = projetar(f(0));
    for (let i = 1; i <= 96; i++) {
      const atual = projetar(f((i / 96) * 2 * Math.PI));
      ctx.globalAlpha = (ant.prof + atual.prof) / 2 >= 0 ? 0.85 : 0.25;
      ctx.beginPath();
      ctx.moveTo(ant.x, ant.y);
      ctx.lineTo(atual.x, atual.y);
      ctx.stroke();
      ant = atual;
    }
    ctx.globalAlpha = 1;
  }

  function rotulo(p, texto, cor) {
    const q = projetar({ x: p.x * 1.22, y: p.y * 1.22, z: p.z * 1.22 });
    ctx.globalAlpha = q.prof >= -0.2 ? 1 : 0.45;
    ctx.fillStyle = cor;
    ctx.fillText(texto, q.x, q.y);
    ctx.globalAlpha = 1;
  }

  function desenhar() {
    ctx.clearRect(0, 0, tamanho, tamanho);

    // Corpo da esfera, com um brilho suave
    const brilho = ctx.createRadialGradient(centro - raio * 0.4, centro - raio * 0.5, raio * 0.1, centro, centro, raio);
    brilho.addColorStop(0, rgba(CORES.a1, 0.10));
    brilho.addColorStop(1, rgba(CORES.a1, 0.0));
    ctx.fillStyle = brilho;
    ctx.beginPath();
    ctx.arc(centro, centro, raio, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = CORES.fio;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Equador e dois meridianos
    curva((t) => ({ x: Math.cos(t), y: Math.sin(t), z: 0 }), CORES.fio);
    curva((t) => ({ x: Math.cos(t), y: 0, z: Math.sin(t) }), CORES.fio);
    curva((t) => ({ x: 0, y: Math.cos(t), z: Math.sin(t) }), CORES.fio);

    // Eixos x, y, z
    ctx.setLineDash([3, 4]);
    for (const e of [{ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }]) {
      const a = projetar({ x: -e.x, y: -e.y, z: -e.z }), b = projetar(e);
      ctx.strokeStyle = CORES.apagado;
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Nomes dos estados nos polos e no equador
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    rotulo({ x: 0, y: 0, z: 1 }, '|0⟩', CORES.suave);
    rotulo({ x: 0, y: 0, z: -1 }, '|1⟩', CORES.suave);
    rotulo({ x: 1, y: 0, z: 0 }, '|+⟩', CORES.apagado);
    rotulo({ x: -1, y: 0, z: 0 }, '|−⟩', CORES.apagado);
    rotulo({ x: 0, y: 1, z: 0 }, '|+i⟩', CORES.apagado);
    rotulo({ x: 0, y: -1, z: 0 }, '|−i⟩', CORES.apagado);

    // Rastro da ponta do vetor durante as rotações
    for (let i = 1; i < rastro.length; i++) {
      const a = projetar(rastro[i - 1]), b = projetar(rastro[i]);
      ctx.strokeStyle = CORES.a2;
      ctx.globalAlpha = (i / rastro.length) * 0.8;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Projeção do vetor no plano do equador (linhas tracejadas)
    const c = projetar({ x: 0, y: 0, z: 0 });
    const ponta = projetar(v);
    const sombra = projetar({ x: v.x, y: v.y, z: 0 });
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = CORES.suave;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y); ctx.lineTo(sombra.x, sombra.y); ctx.lineTo(ponta.x, ponta.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // O vetor de estado |ψ⟩
    ctx.globalAlpha = ponta.prof >= 0 ? 1 : 0.65;
    ctx.strokeStyle = CORES.a1;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.shadowColor = CORES.a1;
    ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(ponta.x, ponta.y); ctx.stroke();
    ctx.fillStyle = CORES.a1;
    ctx.beginPath(); ctx.arc(ponta.x, ponta.y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = CORES.forte;
    ctx.beginPath(); ctx.arc(c.x, c.y, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = CORES.a1;
    ctx.fillText('|ψ⟩', ponta.x + 18, ponta.y - 12);
    ctx.globalAlpha = 1;
  }

  // Mostra θ, φ, as amplitudes e as probabilidades
  function atualizarTexto() {
    const fmt = (n, casas = 3) => (Math.abs(n) < 5e-4 ? 0 : n).toFixed(casas);
    const graus = (r) => (r * 180 / Math.PI).toFixed(1) + '°';
    const theta = Math.acos(limitar(v.z, -1, 1));
    let phi = Math.atan2(v.y, v.x);
    if (phi < 0) phi += 2 * Math.PI;
    if (Math.sin(theta) < 1e-3) phi = 0;   // nos polos a fase não importa
    const alfa = Math.cos(theta / 2);
    const beta = Math.sin(theta / 2);
    const p0 = alfa * alfa, p1 = 1 - p0;

    saida.innerHTML =
`<span class="p">&gt;&gt;&gt;</span> θ = <span class="v">${fmt(theta)}</span> <span class="p"># ${graus(theta)}</span>
<span class="p">&gt;&gt;&gt;</span> φ = <span class="v">${fmt(phi)}</span> <span class="p"># ${graus(phi)}</span>
<span class="p">&gt;&gt;&gt;</span> α = <span class="v">${fmt(alfa)}</span>
<span class="p">&gt;&gt;&gt;</span> β = <span class="v">${fmt(beta)}</span>·e<sup>i·${fmt(phi, 2)}</sup>
<span class="p"># portas: ${historico.length ? historico.join(' → ') : '—'}</span>`;

    p0Barra.style.width = (p0 * 100) + '%';
    p1Barra.style.width = (p1 * 100) + '%';
    p0Txt.textContent = fmt(p0);
    p1Txt.textContent = fmt(p1);
  }

  function terminarAnimacao() {
    if (animacao) { v = animacao.fim; animacao = null; }
  }

  function rotacionar(eixo, angulo, nomePorta) {
    terminarAnimacao();
    historico.push(nomePorta);
    if (historico.length > 7) historico.shift();
    const fim = girar(v, eixo, angulo);
    if (reduzMovimento || angulo < 1e-6) {
      v = fim;
      atualizarTexto();
      return;
    }
    rastro = [];
    animacao = { de: v, eixo, angulo, fim, inicio: performance.now(), duracao: 750 };
  }

  // Gira o vetor pelo menor caminho até um ponto alvo (usado em medir e reset)
  function irPara(alvo, nomePorta) {
    terminarAnimacao();
    const eixo = vetorial(v, alvo);
    const n = norma(eixo);
    const angulo = Math.acos(limitar(ponto(v, alvo), -1, 1));
    const eixoUnit = n < 1e-6 ? { x: 1, y: 0, z: 0 } : { x: eixo.x / n, y: eixo.y / n, z: eixo.z / n };
    rotacionar(eixoUnit, angulo, nomePorta);
  }

  // Medir: com probabilidade P(0) = cos²(θ/2) o estado colapsa em |0⟩; senão em |1⟩.
  function medir() {
    terminarAnimacao();
    const p0 = (1 + v.z) / 2;
    const resultado = Math.random() < p0 ? 0 : 1;
    irPara({ x: 0, y: 0, z: resultado === 0 ? 1 : -1 }, `M=${resultado}`);
    avisoColapso.textContent = `medição: colapsou em |${resultado}⟩  (a chance era ${(resultado === 0 ? p0 : 1 - p0).toFixed(3)})`;
    avisoColapso.classList.add('mostrar');
    clearTimeout(medir.timer);
    medir.timer = setTimeout(() => avisoColapso.classList.remove('mostrar'), 3200);
  }

  function quadro(agora) {
    if (animacao) {
      const k = Math.min(1, (agora - animacao.inicio) / animacao.duracao);
      const suave = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // ease-in-out
      v = girar(animacao.de, animacao.eixo, animacao.angulo * suave);
      rastro.push({ ...v });
      if (k >= 1) { v = animacao.fim; animacao = null; }
      atualizarTexto();
    } else if (rastro.length) {
      rastro.shift();   // o rastro some aos poucos
    }
    if (rastro.length > 90) rastro.shift();
    if (!arrastando && !reduzMovimento) vista.giro += 0.0025;
    if (visivel) desenhar();
    requestAnimationFrame(quadro);
  }

  // --- controles ---
  document.querySelectorAll('[data-porta]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const p = PORTAS[botao.dataset.porta];
      rotacionar(p.eixo, p.angulo, botao.dataset.porta);
    });
  });
  document.getElementById('btn-medir').addEventListener('click', medir);
  document.getElementById('btn-reset').addEventListener('click', () => {
    historico.length = 0;
    irPara({ x: 0, y: 0, z: 1 }, 'reset');
    historico.length = 0;
  });

  // Arrastar para girar a esfera
  canvas.addEventListener('pointerdown', (e) => {
    arrastando = true;
    ultimo = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!arrastando) return;
    vista.giro -= (e.clientX - ultimo.x) * 0.01;
    vista.inclinacao = limitar(vista.inclinacao + (e.clientY - ultimo.y) * 0.01, -1.3, 1.3);
    ultimo = { x: e.clientX, y: e.clientY };
  });
  const soltar = () => { arrastando = false; };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);

  // Setas do teclado também giram (acessibilidade)
  canvas.addEventListener('keydown', (e) => {
    const passos = { ArrowLeft: [0.15, 0], ArrowRight: [-0.15, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] };
    if (!passos[e.key]) return;
    e.preventDefault();
    vista.giro += passos[e.key][0];
    vista.inclinacao = limitar(vista.inclinacao + passos[e.key][1], -1.3, 1.3);
  });

  // Só desenha quando a esfera está na tela (economiza bateria)
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(canvas);

  redimensionar();
  window.addEventListener('resize', redimensionar);
  document.fonts.ready.then(desenhar);
  atualizarTexto();
  requestAnimationFrame(quadro);
})();


/* ---------- 5) CIRCUITO DE BELL ----------
   Depois de H e CNOT, o estado é (|00⟩ + |11⟩)/√2.
   Cada "shot" mede os dois qubits: sai 00 ou 11, com 50% de chance cada.
   O ruído opcional inverte cada bit medido com 2% de chance,
   imitando os erros de leitura de um computador quântico real. */
let rodarBell = () => {};

(function bell() {
  const circuito = document.getElementById('circuito');
  const botao = document.getElementById('rodar');
  const seletor = document.getElementById('shots');
  const ruido = document.getElementById('ruido');
  const saida = document.getElementById('bell-saida');
  const barras = {};
  document.querySelectorAll('.barra').forEach((b) => {
    barras[b.dataset.k] = { coluna: b.querySelector('.coluna'), valor: b.querySelector('.valor') };
  });
  let rodando = false;

  async function rodar() {
    if (rodando) return;
    rodando = true;
    botao.disabled = true;
    botao.textContent = '$ rodando…';

    // Reinicia a animação do pulso percorrendo o circuito
    circuito.classList.remove('rodando');
    void circuito.offsetWidth;   // força o navegador a "perceber" a remoção
    circuito.classList.add('rodando');
    await espera(reduzMovimento ? 0 : 1300);

    const shots = Number(seletor.value);
    const p = ruido.checked ? 0.02 : 0;
    const contagem = { '00': 0, '01': 0, '10': 0, '11': 0 };
    const amostras = [];

    for (let i = 0; i < shots; i++) {
      const bit = Math.random() < 0.5 ? 0 : 1;   // o resultado "compartilhado" do par emaranhado
      let q0 = bit, q1 = bit;
      if (p) {
        if (Math.random() < p) q0 ^= 1;
        if (Math.random() < p) q1 ^= 1;
      }
      const chave = `${q0}${q1}`;
      contagem[chave]++;
      if (amostras.length < 30) amostras.push(chave);
    }

    const maior = Math.max(...Object.values(contagem));
    for (const k in contagem) {
      barras[k].coluna.style.height = (contagem[k] / maior) * 82 + '%';
      barras[k].valor.textContent = contagem[k];
    }

    const concordancia = ((contagem['00'] + contagem['11']) / shots * 100).toFixed(1);
    // Ordem fixa: o JavaScript poria '10' e '11' antes de '00' (chaves que parecem números vêm primeiro)
    const dicionario = ['00', '01', '10', '11']
      .filter((k) => contagem[k] > 0)
      .map((k) => `'${k}': ${contagem[k]}`)
      .join(', ');

    saida.innerHTML =
`<span class="m">→ {${dicionario}}</span>
<span class="p"># q₀ e q₁ concordaram em ${concordancia}% das medições</span>
<span class="p"># primeiros shots: ${amostras.join(' ')} …</span>`;

    botao.disabled = false;
    botao.textContent = '$ rodar de novo';
    rodando = false;
  }

  botao.addEventListener('click', rodar);
  rodarBell = rodar;
})();


/* ---------- 6) TERMINAL (easter egg) ---------- */
(function terminal() {
  const saida = document.getElementById('term-saida');
  const form = document.getElementById('term-form');
  const entrada = document.getElementById('term-entrada');
  const historico = [];
  let posicao = 0;

  function escrever(texto, classe) {
    const linha = document.createElement('div');
    if (classe) linha.className = classe;
    linha.textContent = texto;   // textContent: nunca interpreta HTML digitado
    saida.appendChild(linha);
    saida.scrollTop = saida.scrollHeight;
  }

  const SECOES = { inicio: 'inicio', sobre: 'inicio', bell: 'bell', projetos: 'projetos', certificacoes: 'certificacoes', certificados: 'certificacoes', mainframe: 'certificacoes', estudos: 'estudos', formacao: 'estudos', artigos: 'artigos', terminal: 'terminal', contato: 'contato' };

  const ARQUIVOS = {
    'bloch.py':
`import numpy as np

def vetor_de_bloch(psi):
    a, b = psi
    x = 2 * np.real(np.conj(a) * b)
    y = 2 * np.imag(np.conj(a) * b)
    z = abs(a)**2 - abs(b)**2
    return x, y, z`,
    'bell.qasm':
`OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0], q[1];
measure q -> c;`,
  };

  const COMANDOS = {
    help() {
      escrever(
`comandos disponíveis:
  whoami          quem sou eu
  ls              lista as seções e arquivos
  cd <seção>      vai até uma seção (ex.: cd projetos)
  cat <arquivo>   mostra um arquivo (bloch.py, bell.qasm)
  projetos        lista os projetos em destaque
  certificados    lista as certificações
  formacao        mostra a formação acadêmica
  artigos         lista os artigos publicados
  contato         e-mail e links
  github          abre o GitHub do Tiago
  linkedin        abre o LinkedIn do Tiago
  qubit           prepara |+⟩ e mede
  bell            roda o circuito de Bell
  gato            o experimento mental mais famoso
  date            data e hora
  echo <texto>    repete o texto
  clear           limpa a tela`);
    },
    whoami() {
      escrever('Tiago: Junior Support Operator em mainframe na CSU Digital desde 2020, desenvolvedor de sistemas por formação e futuro físico (graduação em Física a partir de 2027).', 'ok');
    },
    ls() {
      escrever('inicio/  bell/  projetos/  mainframe/  estudos/  artigos/  contato/  bloch.py  bell.qasm');
    },
    cd(args) {
      const destino = SECOES[(args[0] || '').replace(/[./]/g, '')];
      if (!destino) return escrever(`cd: seção não encontrada: ${args[0] || ''}`, 'erro');
      escrever(`→ /${destino}`, 'ok');
      document.getElementById(destino).scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth' });
    },
    cat(args) {
      const arquivo = ARQUIVOS[args[0]];
      if (!arquivo) return escrever(`cat: ${args[0] || '?'}: arquivo não encontrado`, 'erro');
      escrever(arquivo);
    },
    projetos() {
      escrever(
`meu_universo_cientifico/   emaranhamento, decoerência, três corpos, Manim…
criptografia_de_cesar/     cifra clássica em Python
Python_Cheat_Sheet/        referência de Python para ciência computacional`);
      escrever('digite github para ver todos os repositórios', 'ok');
    },
    certificados() {
      escrever(
`IBM z/OS Mainframe Practitioner                IBM
IBM Z Xplore – Advanced / Concepts             IBM
IBM Z 101 Certificate                          IBM
Introduction to IBM z/OS                       IBM
Introduction to System Programming on IBM Z    IBM
Introducing z/OS UNIX System Services          IBM
Introduction to z/OS Commands and Panels       IBM
Explore Emerging Tech                          IBM SkillsBuild
Lifelong Learning 2026                         Certiprof (em andamento)`);
      escrever('badges do curso IBM Z (1 ano, em andamento) · digite cd mainframe', 'ok');
    },
    github() {
      escrever('abrindo github.com/TiagoRodriguesskt …', 'ok');
      window.open('https://github.com/TiagoRodriguesskt', '_blank', 'noopener');
    },
    formacao() {
      escrever(
`[✓] Técnico em Desenvolvimento de Sistemas
[✓] Tecnólogo em Análise e Desenvolvimento de Sistemas
[✓] Pós-graduação em Engenharia de Software`);
      escrever('[ψ] Graduação em Física: início em 2027', 'med');
    },
    artigos() {
      if (listaArtigos.length === 0) {
        escrever('total 0 · nenhum artigo publicado ainda. O primeiro sai em breve!', 'med');
        return;
      }
      listaArtigos.forEach((a) => escrever(`${formatarData(a.data).padEnd(9)} ${a.titulo}  (${a.onde || 'link'})`));
      escrever('digite cd artigos para ver os cartões', 'ok');
    },
    contato() {
      escrever(
`e-mail    tiagorodriguesskt@gmail.com
github    github.com/TiagoRodriguesskt
linkedin  linkedin.com/in/tiago-rodrigues-0b5417124`);
    },
    linkedin() {
      escrever('abrindo o LinkedIn do Tiago …', 'ok');
      window.open('https://www.linkedin.com/in/tiago-rodrigues-0b5417124/', '_blank', 'noopener');
    },
    async qubit() {
      escrever('preparando |+⟩ = (|0⟩ + |1⟩)/√2 …');
      await espera(600);
      escrever(`medição: |${Math.random() < 0.5 ? 0 : 1}⟩`, 'med');
    },
    bell() {
      escrever('rodando o circuito de Bell…', 'ok');
      document.getElementById('bell').scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth' });
      setTimeout(rodarBell, reduzMovimento ? 0 : 600);
    },
    gato() {
      const vivo = Math.random() < 0.5;
      escrever('abrindo a caixa…');
      setTimeout(() => escrever(vivo ? 'o gato está vivo. ufa.' : 'o gato… estava só dormindo. ufa.', 'med'), 700);
    },
    date() {
      escrever(new Date().toLocaleString('pt-BR'));
    },
    echo(args) {
      escrever(args.join(' '));
    },
    sudo() {
      escrever('permissão negada: nem o observador tem esse poder.', 'erro');
    },
    clear() {
      saida.textContent = '';
    },
  };

  escrever('Bem-vindo ao terminal do Tiago. Digite help para ver os comandos.', 'ok');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bruto = entrada.value.trim();
    entrada.value = '';
    if (!bruto) return;
    historico.push(bruto);
    posicao = historico.length;
    escrever(`tiago@qubit:~$ ${bruto}`, 'cmd');
    const [nome, ...args] = bruto.split(/\s+/);
    const comando = COMANDOS[nome.toLowerCase()];
    if (comando) comando(args);
    else escrever(`comando não encontrado: ${nome}. Digite help.`, 'erro');
  });

  // Setas ↑ e ↓ navegam pelos comandos anteriores, como num terminal de verdade
  entrada.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && posicao > 0) {
      posicao--;
      entrada.value = historico[posicao];
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      posicao = Math.min(historico.length, posicao + 1);
      entrada.value = historico[posicao] || '';
      e.preventDefault();
    }
  });
})();


/* ---------- 8) ARTIGOS ----------
   Lê a lista ARTIGOS (do arquivo artigos.js) e monta um cartão para cada
   artigo, do mais novo para o mais antigo. Com a lista vazia, mostra um
   aviso de "em breve". Fica antes do bloco 7 para os cartões já existirem
   quando a navegação começar a observar a página. */
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Lista de artigos válidos, já ordenada. Usada pela seção e pelo terminal.
const listaArtigos = (typeof ARTIGOS !== 'undefined' && Array.isArray(ARTIGOS) ? ARTIGOS : [])
  .filter((a) => a && a.titulo && /^https:\/\//.test(a.link || ''))   // só links https
  .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')));

// "2027-03" vira "mar 2027"
function formatarData(data) {
  const [ano, mes] = String(data || '').split('-');
  return MESES[Number(mes) - 1] ? `${MESES[Number(mes) - 1]} ${ano}` : (ano || '');
}

(function artigos() {
  const lista = document.getElementById('lista-artigos');

  // Link do perfil acadêmico no fim da seção (só se estiver preenchido e for https)
  const perfil = typeof PERFIL_ACADEMICO !== 'undefined' ? PERFIL_ACADEMICO : null;
  if (perfil && /^https:\/\//.test(perfil.link || '')) {
    const caixa = document.getElementById('perfil-academico');
    const link = document.createElement('a');
    link.href = perfil.link;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = `$ open perfil  →  todos os artigos no ${perfil.nome || 'perfil acadêmico'} ↗`;
    caixa.appendChild(link);
    caixa.hidden = false;
  }

  // Atalho para criar um elemento com classe e texto
  // (textContent: o conteúdo nunca é interpretado como HTML)
  function criar(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  }

  if (listaArtigos.length === 0) {
    const vazio = criar('div', 'janela artigos-vazio');
    const barra = criar('div', 'janela-barra');
    const bolinhas = criar('div', 'bolinhas');
    bolinhas.setAttribute('aria-hidden', 'true');
    bolinhas.append(criar('span'), criar('span'), criar('span'));
    barra.append(bolinhas, criar('span', '', 'artigos/ — vazio'));

    const corpo = criar('pre', 'artigos-vazio-corpo');
    corpo.append(
      criar('span', 'p', '$ '), 'ls -la artigos/\n',
      'total 0\n\n',
      criar('span', 'm', '# primeiro artigo em breve'), '\n',
      criar('span', 'p', '# temas: computação quântica · física computacional · simulação em Python'),
      criar('span', 'cursor-bloco')
    );
    vazio.append(barra, corpo);
    lista.appendChild(vazio);
    return;
  }

  listaArtigos.forEach((a, i) => {
    const onde = a.onde || 'link externo';
    const cartao = criar('a', 'artigo');
    cartao.href = a.link;
    cartao.target = '_blank';
    cartao.rel = 'noopener';

    const numero = criar('span', 'artigo-num', String(listaArtigos.length - i).padStart(2, '0'));
    numero.setAttribute('aria-hidden', 'true');

    // Se o link for um DOI (doi.org/...), mostra o identificador no cartão
    const doi = (a.link.match(/doi\.org\/(.+)$/) || [])[1];
    const meta = [formatarData(a.data), onde, doi ? `DOI ${decodeURIComponent(doi)}` : '']
      .filter(Boolean).join(' · ');

    const corpo = criar('div', 'artigo-corpo');
    corpo.append(
      criar('span', 'artigo-meta', meta),
      criar('h3', '', a.titulo)
    );
    if (a.resumo) corpo.append(criar('p', '', a.resumo));
    if (Array.isArray(a.tags) && a.tags.length) corpo.append(criar('div', 'tags', a.tags.join(' · ')));
    corpo.append(criar('span', 'artigo-link', `ler no ${onde} ↗`));

    cartao.append(numero, corpo);
    lista.appendChild(cartao);
  });
})();


/* ---------- 7) MENU ATIVO E SEÇÕES APARECENDO ---------- */
(function navegacao() {
  const links = [...document.querySelectorAll('.circuito-nav a')];

  // Acende a "porta" do menu correspondente à seção que está no meio da tela
  const observarSecao = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('ativa', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  links
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean)
    .forEach((s) => observarSecao.observe(s));

  // Cada seção aparece suavemente na primeira vez que entra na tela
  const revelar = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.revelar').forEach((el) => revelar.observe(el));
})();
