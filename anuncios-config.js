/* =========================================================
   ATIVAMENTE GAMES — CONFIGURAÇÃO DOS ANÚNCIOS
   Depois que o AdSense aprovar o site, preencha os campos abaixo.
   Enquanto "cliente" estiver vazio, o site mostra anúncios de MENTIRA (modo teste).
   ========================================================= */
window.ANUNCIOS = {
  cliente: 'ca-pub-7687262841277568', // ID do AdSense da Ativamente Games
  slotTopo: '',           // ID do bloco de anúncio do banner do topo (ex.: '1234567890')
  slotRodape: '',         // ID do bloco de anúncio do banner do rodapé
  modoTeste: true,        // true = anúncios de teste do Google (não gera dinheiro). Troque para false quando estiver tudo certo.
  tudoInfantil: false,    // true = trata TODOS os visitantes como crianças (mais seguro para site infantil)
  partidasGratis: 3,      // partidas grátis por dia em cada jogo
  intersticial: false,    // anúncio de tela cheia ao voltar de um jogo — desligado (decisão: só banners + anúncio depois das partidas grátis)
  frequencia: '120s'      // tempo mínimo médio entre anúncios de tela cheia
};
