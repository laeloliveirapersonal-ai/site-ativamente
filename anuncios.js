/* =========================================================
   ATIVAMENTE GAMES — ANÚNCIOS (AdSense + H5 Games Ads)
   • Banners no topo e no rodapé da vitrine
   • "Assista um anúncio para jogar mais" (anúncio com recompensa)
   • Anúncio de tela cheia ao voltar de um jogo
   • Idade do visitante define o tipo de anúncio:
       menos de 13 → infantil (child-directed) e não personalizado
       13 a 17     → não personalizado
       18 ou mais  → normal
   Sem "cliente" configurado, tudo funciona em modo simulado para testes.
   ========================================================= */
(function () {
  'use strict';
  var C = window.ANUNCIOS || {};
  var real = !!C.cliente;
  var iniciado = false;

  function idade() { try { return localStorage.getItem('site_age'); } catch (e) { return null; } }
  function infantil() { return C.tudoInfantil || idade() === 'kid'; }
  function naoPersonalizado() { return infantil() || idade() === 'teen'; }

  // Carrega o código do AdSense só depois da pergunta de idade
  function iniciar() {
    if (iniciado || !real) return;
    iniciado = true;
    window.adsbygoogle = window.adsbygoogle || [];
    if (naoPersonalizado()) window.adsbygoogle.requestNonPersonalizedAds = 1;
    window.adBreak = window.adConfig = function (o) { window.adsbygoogle.push(o); };
    var s = document.createElement('script');
    s.async = true; s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(C.cliente);
    s.setAttribute('data-ad-client', C.cliente);
    if (C.modoTeste) s.setAttribute('data-adbreak-test', 'on');
    if (infantil()) s.setAttribute('data-tag-for-child-directed-treatment', '1');
    if (C.frequencia) s.setAttribute('data-ad-frequency-hint', C.frequencia);
    document.head.appendChild(s);
    window.adConfig({ preloadAdBreaks: 'on', sound: 'on' });
    banner('adTop', C.slotTopo);
    banner('adBottom', C.slotRodape);
  }

  // Banner responsivo dentro de um espaço da página
  function banner(id, slot) {
    var el = document.getElementById(id);
    if (!el || !slot) return;
    el.className = 'ad-real';
    el.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="' + C.cliente +
      '" data-ad-slot="' + slot + '" data-ad-format="auto" data-full-width-responsive="true"' +
      (C.modoTeste ? ' data-adtest="on"' : '') + '></ins>';
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  // Anúncio com recompensa: chama "liberar" se a pessoa assistiu (ou se não houver anúncio disponível)
  function recompensa(liberar, simular) {
    if (!real || !window.adBreak) { simular(liberar); return; }
    var ganhou = false, mostrou = false;
    window.adBreak({
      type: 'reward', name: 'mais-uma-partida',
      beforeReward: function (mostrar) { mostrou = true; mostrar(); },
      adViewed: function () { ganhou = true; },
      adDismissed: function () {},
      adBreakDone: function () {
        if (ganhou) liberar();
        else if (!mostrou) liberar(); // sem anúncio disponível agora: não deixa a criança travada
      }
    });
  }

  // Tela cheia entre jogos (o Google decide se mostra e com que frequência)
  function intersticial(depois) {
    if (!real || !window.adBreak || !C.intersticial) { if (depois) depois(); return; }
    window.adBreak({ type: 'next', name: 'volta-do-jogo', adBreakDone: function () { if (depois) depois(); } });
  }

  window.AtivamenteAds = { real: real, iniciar: iniciar, recompensa: recompensa, intersticial: intersticial,
    partidasGratis: C.partidasGratis || 3, infantil: infantil };
})();
