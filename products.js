/* =====================================================
   LUZZ — CATÁLOGO DE PEÇAS
   -----------------------------------------------------
   Para colocar uma peça à venda, copie um bloco { ... }
   e altere os campos. Ou use a página admin.html, que
   gera este arquivo pronto para substituir.

   Campos:
     id          identificador único (sem espaços)
     nome        nome da peça
     categoria   brincos | colares | pingentes | pulseiras | aneis | masculino
     preco       número (ex: 189.9) ou null para "Sob consulta"
     precoAntigo número opcional, mostra o preço riscado (promoção)
     foto        caminho da imagem (coloque a foto na pasta images/)
     descricao   texto curto
     materiais   opções que o cliente escolhe (pode deixar só uma)
     selo        opcional: "Novo", "Mais vendido", "Últimas unidades"...
     esgotado    true para mostrar como esgotado
   ===================================================== */

window.LUZZ_CONFIG = {
  // Número do WhatsApp com DDI + DDD, só números. Ex: "5519999999999"
  // Se ficar vazio, o pedido é copiado e abre o link de mensagem da loja.
  whatsapp: "",
  whatsappLink: "https://wa.me/message/NUPQV2P2MQB6P1"
};

window.LUZZ_PRODUCTS = [
  {
    id: "brinco-ponto-de-luz",
    nome: "Brinco Ponto de Luz",
    categoria: "brincos",
    preco: null,
    foto: "images/brincos-mao.jpg",
    descricao: "Moissanite lapidação brilhante presa em seis garras. O clássico que vira assinatura.",
    materiais: ["Prata", "Banho ouro branco", "Banho ouro amarelo"],
    selo: "Mais vendido"
  },
  {
    id: "brinco-coroa",
    nome: "Brinco Coroa Cravejado",
    categoria: "brincos",
    preco: null,
    foto: "images/brincos-coroa.jpg",
    descricao: "Pedra central em moissanite com base em coroa cravejada. Brilho de todos os ângulos.",
    materiais: ["Prata", "Banho ouro branco"],
    selo: "Novo"
  },
  {
    id: "anel-solitario",
    nome: "Anel Solitário",
    categoria: "aneis",
    preco: null,
    foto: "images/anel-riviera.jpg",
    descricao: "Moissanite redonda em aro cravejado. Para marcar um “sim” — ou só porque você merece.",
    materiais: ["Prata", "Banho ouro branco", "Banho ouro amarelo"],
    selo: "Novo"
  },
  {
    id: "colar-riviera",
    nome: "Colar Riviera",
    categoria: "colares",
    preco: null,
    foto: "images/correntes.jpg",
    descricao: "Riviera de moissanites alinhadas, do fecho ao fecho. Sozinha ou em camadas.",
    materiais: ["Prata", "Banho ouro branco"]
  },
  {
    id: "colar-moissanite-negra",
    nome: "Colar Moissanite Negra",
    categoria: "colares",
    preco: null,
    foto: "images/colar-negro.jpg",
    descricao: "Riviera negra com ponto de luz pendente. Contraste elegante para o preto e o branco.",
    materiais: ["Prata"]
  },
  {
    id: "pingente-medalha",
    nome: "Pingente Medalha Cravejada",
    categoria: "pingentes",
    preco: null,
    foto: "images/medalha.jpg",
    descricao: "Medalha oval com moldura cravejada em corrente delicada.",
    materiais: ["Prata", "Banho ouro branco", "Banho ouro amarelo"]
  },
  {
    id: "pulseira-riviera",
    nome: "Pulseira Riviera",
    categoria: "pulseiras",
    preco: null,
    foto: "images/paris.jpg",
    descricao: "A riviera que acompanha o brinde. Fecho seguro e brilho contínuo.",
    materiais: ["Prata", "Banho ouro branco"]
  }
];
