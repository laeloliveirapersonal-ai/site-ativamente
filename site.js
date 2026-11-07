/* Ativamente Games — pergunta de idade, partidas grátis por dia e "assista para jogar mais".
   Usado pela vitrine (index.html) e pelas páginas de cada jogo. */
(function () {
  'use strict';
  var Ads = window.AtivamenteAds || { partidasGratis: 3, iniciar: function () {}, recompensa: function (l, s) { s(l); } };
  var FREE = Ads.partidasGratis || 3;
  function g(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function s(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var TIPOS = { kid: 'Público infantil: anúncios infantis, não personalizados', teen: '13 a 17: anúncios não personalizados', adult: '18+: anúncios normais' };

  var css = '.sov{position:fixed;inset:0;background:#030b18e8;display:none;align-items:center;justify-content:center;padding:16px;z-index:50;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#fff}.sov.on{display:flex}' +
    '.spn{background:#13305a;border-radius:24px;padding:24px;width:min(460px,96vw);text-align:center}.spn h2{margin:0 0 6px}' +
    '.spn button{width:100%;margin-top:10px;border:0;border-radius:14px;padding:14px;font-weight:900;font-size:16px;cursor:pointer;font-family:inherit}' +
    '.sy{background:#ffd23f;color:#3a2600}.sn{background:#ffffff18;color:#fff}.sfake{background:#fff;color:#333;border-radius:14px;height:180px;display:flex;align-items:center;justify-content:center;font-weight:800;margin:12px 0}';
  var html = '<div class="sov" id="sAge"><div class="spn"><h2>Bem-vindo! 👋</h2><p>Quantos anos você tem?</p>' +
    '<button class="sy" data-a="kid">Menos de 13</button><button class="sy" data-a="teen">13 a 17</button><button class="sy" data-a="adult">18 ou mais</button></div></div>' +
    '<div class="sov" id="sLim"><div class="spn"><h2>Partidas grátis de hoje acabaram</h2><p>Assista a um anúncio curto para ganhar mais 1 partida, ou volte amanhã.</p>' +
    '<button class="sy" id="sWatch">🎬 Assistir anúncio</button><button class="sn" id="sNo">Agora não</button></div></div>' +
    '<div class="sov" id="sAdv"><div class="spn"><p>Anúncio simulado</p><div class="sfake" id="sAdvTxt">Seu anúncio aqui</div><p id="sCnt"></p></div></div>';

  var ouvintes = [];
  function $(i) { return document.getElementById(i); }
  function day() { return new Date().toISOString().slice(0, 10); }
  function lerDia() { var d = {}; try { d = JSON.parse(g('site_plays') || '{}'); } catch (e) {} return d.day === day() ? d : { day: day() }; }
  function usadas(id) { return lerDia()[id] || 0; }
  function somar(id) { var d = lerDia(); d[id] = (d[id] || 0) + 1; s('site_plays', JSON.stringify(d)); }
  function restantes(id) { return Math.max(0, FREE - usadas(id)); }
  function abrir(h) { location.href = h; }
  var pend = null;

  function jogar(id, href) {
    if (usadas(id) < FREE) { somar(id); abrir(href); return; }
    pend = href; $('sLim').classList.add('on');
  }

  function montar() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.innerHTML = html; while (d.firstChild) document.body.appendChild(d.firstChild);
    document.querySelectorAll('#sAge button').forEach(function (b) {
      b.onclick = function () { s('site_age', b.dataset.a); $('sAge').classList.remove('on'); Ads.iniciar(); avisar(); };
    });
    $('sNo').onclick = function () { $('sLim').classList.remove('on'); };
    $('sWatch').onclick = function () {
      $('sLim').classList.remove('on');
      Ads.recompensa(function () { abrir(pend); }, function (liberar) {
        $('sAdv').classList.add('on'); var t = 5;
        $('sAdvTxt').textContent = g('site_age') === 'kid' ? 'Anúncio infantil de exemplo' : 'Anúncio de exemplo';
        (function tick() { $('sCnt').textContent = 'Liberando em ' + t + 's…'; if (t-- <= 0) { $('sAdv').classList.remove('on'); liberar(); } else setTimeout(tick, 1000); })();
      });
    };
    if (!g('site_age')) $('sAge').classList.add('on'); else Ads.iniciar();
    avisar();
  }
  function avisar() { ouvintes.forEach(function (f) { try { f(); } catch (e) {} }); }
  function refazerIdade() { try { localStorage.removeItem('site_age'); } catch (e) {} $('sAge').classList.add('on'); }

  window.Site = {
    jogar: jogar, restantes: restantes, gratis: FREE, refazerIdade: refazerIdade,
    idade: function () { return g('site_age'); }, tipo: function () { return TIPOS[g('site_age')] || ''; },
    aoMudar: function (f) { ouvintes.push(f); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
  addEventListener('pageshow', avisar);
})();
