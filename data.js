(function () {
  const key = "charme-beleza-data-v1";

  const images = {
    hero: "img/salao.png",
    interior: "img/espaco.jfif",
    dona: "img/virlene.jpg",
    cabelos: "img/corte-cabelo.jpg",
    coloracao: "img/coloracao.jpg",
    unhas: "img/unhas-produtos.jpg",
    maquiagem: "img/maquiagem-producao.jpg",
    resultadoLiso: "img/resultado-liso.jpg",
    resultadoOndulado: "img/resultado-ondulado.jpg",
    tratamento: "img/cabelo 6.jfif",
  };

  const defaults = {
    version: 6,
    salon: {
      name: "Charme & Beleza",
      slogan: "Cuidado, autoestima e beleza em cada detalhe.",
      city: "Concórdia / SC",
      neighborhood: "Bairro Industriários",
      address: "Bairro Industriários",
      latitude: -27.232576292519717,
      longitude: -52.041101680701495,
      whatsapp: "5549988157650",
      whatsappDisplay: "(49) 98815-7650",
      email: "contato@charmeebeleza.com.br",
      instagram: "charmeebeleza",
      hours: "Segunda a sábado · 09h às 19h",
      clientsCount: "2.000",
    },
    services: [
      {
        id: "srv-pintura-unha",
        name: "Pintura de unha",
        category: "Unhas",
        description: "Esmaltação cuidadosa com variedade de cores, acabamento limpo e atenção aos detalhes.",
        duration: 45,
        price: 45,
        priceLabel: "Valor fixo",
        image: images.unhas,
      },
      {
        id: "srv-coloracao",
        name: "Coloração",
        category: "Cabelos",
        description: "Coloração com diagnóstico dos fios e escolha de tom pensada para valorizar o brilho e o movimento.",
        duration: 120,
        price: 260,
        priceLabel: "A partir de",
        image: images.coloracao,
      },
      {
        id: "srv-maquiagem",
        name: "Maquiagem",
        category: "Maquiagem",
        description: "Produção para eventos, fotos ou ocasiões especiais, com acabamento elegante para valorizar sua beleza.",
        duration: 90,
        price: 190,
        priceLabel: "A partir de",
        image: images.maquiagem,
      },
      {
        id: "srv-corte-cabelo",
        name: "Corte de cabelo",
        category: "Cabelos",
        description: "Corte personalizado com escuta, orientação e finalização para realçar o caimento dos fios.",
        duration: 60,
        price: 120,
        priceLabel: "A partir de",
        image: images.cabelos,
      },
      {
        id: "srv-tratamento",
        name: "Tratamento capilar",
        category: "Cabelos",
        description: "Hidratação, nutrição ou reconstrução escolhidas após avaliação dos fios, para devolver maciez, força e brilho.",
        duration: 60,
        price: 110,
        priceLabel: "A partir de",
        image: images.tratamento,
      },
    ],
    professionals: [
      {
        id: "pro-dona",
        name: "Virlene",
        specialty: "Proprietária, cabeleireira, manicure e maquiadora",
        description: "Dona e única profissional do Charme & Beleza, Virlene realiza cada atendimento com escuta individual, técnica e cuidado em cabelo, unhas, sobrancelhas e maquiagem.",
        image: images.dona,
        instagram: "charmeebeleza",
        certifications: [
          "Cortes femininos e visagismo",
          "Coloração e mechas",
          "Tratamentos capilares",
          "Manicure e pedicure",
          "Design de sobrancelhas",
          "Maquiagem social",
          "Atendimento personalizado",
        ],
      },
    ],
    faq: [
      {
        q: "Preciso agendar antes?",
        a: "Sim. Todos os atendimentos são feitos com horário marcado pelo WhatsApp, para garantir atenção, pontualidade e conforto.",
      },
      {
        q: "Quais formas de pagamento vocês aceitam?",
        a: "Aceitamos dinheiro, cartões de débito e crédito, Pix e transferência.",
      },
      {
        q: "Posso cancelar ou remarcar meu horário?",
        a: "Pode sim. Pedimos aviso com pelo menos 24 horas de antecedência pelo WhatsApp.",
      },
      {
        q: "Quanto tempo dura cada procedimento?",
        a: "Varia conforme o serviço. A duração estimada aparece em cada serviço aqui no site.",
      },
      {
        q: "Vocês atendem aos sábados?",
        a: "Sim. Atendemos de segunda a sábado, das 9h às 19h.",
      },
    ],
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function read() {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return clone(defaults);
      const stored = JSON.parse(raw);
      if (stored.version !== defaults.version) return write(clone(defaults));
      return { ...clone(defaults), ...stored };
    } catch (error) {
      return clone(defaults);
    }
  }

  function write(data) {
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  function money(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  }

  function minutes(value) {
    const hours = Math.floor(value / 60);
    const mins = value % 60;
    if (!hours) return `${mins}min`;
    return mins ? `${hours}h ${mins}min` : `${hours}h`;
  }

  function waLink(message) {
    const phone = read().salon.whatsapp || defaults.salon.whatsapp;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  window.SalonStore = {
    key,
    images,
    defaults,
    read,
    write,
    money,
    minutes,
    waLink,
    reset: () => write(clone(defaults)),
  };
})();
