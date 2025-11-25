import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Phone, Mail, MapPin, ChevronDown, Menu, X, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MapView } from "@/components/Map";

// Função para rastrear eventos no Google Analytics
const trackEvent = (eventName: string, eventCategory: string, eventLabel: string) => {
  const gtagFunc = (window as any).gtag;
  if (typeof gtagFunc !== 'undefined') {
    gtagFunc('event', eventName, {
      'event_category': eventCategory,
      'event_label': eventLabel,
    });
  }
};

const useIntersectionObserver = (ref: React.RefObject<HTMLElement | null>, animationClass: string) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return isVisible ? animationClass : "opacity-0";
};

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWhatsAppClick = (buttonName: string = "WhatsApp") => {
    trackEvent('cta_click', 'engagement', buttonName);
    const phoneNumber = "5511934855187"; // Número corrigido: (11) 9 3485-5187
    const message = "Olá! Gostaria de saber mais sobre os serviços de atraso na entrega de imóvel.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const createWhatsAppHandler = (buttonName: string) => {
    return () => handleWhatsAppClick(buttonName);
  };

  const faqs = [
    {
      question: "Qual é o prazo máximo para a entrega do imóvel?",
      answer: "A construtora pode atrasar a entrega em até 180 dias (prazo de tolerância previsto na Lei nº 4.591/64). Se esse prazo adicional for ultrapassado, e você não tiver dado causa ao atraso, é possível exigir a resolução do contrato, com a devolução integral dos valores pagos; ou indenização pelos prejuízos sofridos, caso deseje manter o contrato."
    },
    {
      question: "Posso receber indenização mesmo que o imóvel já tenha sido entregue?",
      answer: "Sim. Mesmo com a entrega das chaves, se houve atraso superior ao prazo de tolerância, você pode solicitar indenização por lucros cessantes (valores que você deixou de usufruir, como aluguel) e, em alguns casos, danos morais. O atraso gera prejuízos que devem ser compensados, independentemente da entrega posterior do imóvel."
    },
    {
      question: "Como funciona o cálculo da indenização por lucros cessantes?",
      answer: "A indenização por lucros cessantes corresponde ao valor de aluguel que você deixou de usufruir enquanto aguardava a entrega do imóvel. Geralmente, esse valor é calculado entre 0,5% e 1% do valor do imóvel por mês de atraso."
    },
    {
      question: "Qual é o custo para contratar os serviços do Santana Advocacia?",
      answer: "Os honorários são definidos de forma personalizada, de acordo com a complexidade do caso, o tempo de dedicação necessário e o valor econômico envolvido. Podemos estruturar a contratação em honorários fixos, percentuais sobre o êxito ou modelos mistos, sempre alinhados à sua realidade e aos parâmetros da Tabela da OAB/SP. Antes de qualquer contratação, você recebe orientações detalhadas sobre o funcionamento do processo e sobre os valores envolvidos, com total transparência."
    },
    {
      question: "Quanto tempo leva para resolver um caso de atraso na entrega?",
      answer: "O tempo varia conforme o caso. Negociações diretas com a construtora podem ser resolvidas em semanas. Processos judiciais geralmente levam de 1 a 3 anos, dependendo da complexidade e do tribunal. Recomendamos consultar para uma estimativa específica do seu caso."
    },
    {
      question: "Preciso ter documentação específica para iniciar o processo?",
      answer: "Sim! É importante ter: contrato de compra e venda, comprovantes de pagamentos, correspondências com a construtora, e documentos que comprovem o atraso (como notificações, e-mails, etc.). Nós ajudamos a reunir toda a documentação necessária durante a consulta."
    },
    {
      question: "Como posso conhecer melhor o escritório Santana Advocacia?",
      answer: "Você pode acompanhar nosso trabalho pelo Instagram e acessar nosso site institucional www.santanalaw.com.br, onde publicamos informativos e artigos sobre Direito Imobiliário, além de apresentar em detalhes nossos serviços jurídicos.",
      hasLinks: true
    },
    {
      question: "Posso confiar no escritório Santana Advocacia?",
      answer: "Sim. O escritório é fundado e liderado pela Dra. Leidiane Santos de Santana (OAB/SP 502.416), regularmente inscrita na Ordem dos Advogados do Brasil. Para verificar a inscrição, clique aqui.",
      hasLinks: true
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const [mapReady, setMapReady] = useState(false);

  // Refs para animações
  const servicosRef = useRef<HTMLElement | null>(null);
  const problemaSolucaoRef = useRef<HTMLElement | null>(null);
  const porQueEscolherRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const advogadaRef = useRef<HTMLElement | null>(null);
  const mapaRef = useRef<HTMLElement | null>(null);
  const contatoRef = useRef<HTMLElement | null>(null);

  // Hooks de animação
  const servicosAnimation = useIntersectionObserver(servicosRef, "animate-slideInUp");
  const problemaSolucaoAnimation = useIntersectionObserver(problemaSolucaoRef, "animate-slideInUp");
  const porQueEscolherAnimation = useIntersectionObserver(porQueEscolherRef, "animate-slideInUp");
  const faqAnimation = useIntersectionObserver(faqRef, "animate-fadeIn");
  const advogadaAnimation = useIntersectionObserver(advogadaRef, "animate-slideInUp");
  const mapaAnimation = useIntersectionObserver(mapaRef, "animate-fadeIn");
  const contatoAnimation = useIntersectionObserver(contatoRef, "animate-slideInUp");

  const handleMapReady = (map: google.maps.Map) => {
    // Coordenadas do escritório: Avenida Paulista, 302, São Paulo
    const officeLocation = { lat: -23.5614, lng: -46.6560 };
    
    // Centralizar o mapa na localização do escritório
    map.setCenter(officeLocation);
    map.setZoom(15);
    
    // Adicionar marcador
    const marker = new google.maps.Marker({
      position: officeLocation,
      map: map,
      title: "Santana Advocacia - Avenida Paulista, 302",
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });
    
    // Adicionar infowindow ao marcador
    const infowindow = new google.maps.InfoWindow({
      content: `
        <div style="font-family: Arial, sans-serif; width: 250px;">
          <h3 style="color: #293d47; margin: 0 0 8px 0;">Santana Advocacia</h3>
          <p style="margin: 0 0 4px 0; color: #333;"><strong>Soluções Jurídicas</strong></p>
          <p style="margin: 0 0 4px 0; color: #666; font-size: 13px;">Avenida Paulista, 302, 1º andar</p>
          <p style="margin: 0 0 4px 0; color: #666; font-size: 13px;">Bela Vista, São Paulo - SP</p>
          <p style="margin: 0 0 4px 0; color: #666; font-size: 13px;">CEP: 01310-000</p>
          <p style="margin: 8px 0 0 0; color: #293d47; font-size: 13px;"><strong>(11) 9 3485-5187</strong></p>
        </div>
      `
    });
    
    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
    
    // Abrir infowindow por padrão
    infowindow.open(map, marker);
    
    setMapReady(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#9a9a9a]/95 border-b border-gray-200/30 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center h-24 md:h-24">
          {/* Logo and Branding */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <img src="/logo.png" alt="Santana Advocacia Logo" className="h-12 md:h-16 w-12 md:w-16 object-contain" />
            <div className="border-l-2 border-[#293d47]/20 pl-2 md:pl-4">
              <div className="font-bold text-[#293d47] text-xs md:text-lg tracking-wider uppercase">Santana Advocacia</div>
              <div className="text-[#7A5E47] text-[10px] md:text-xs tracking-widest uppercase font-semibold">Soluções Jurídicas</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center ml-auto">
            <a href="#servicos" className="text-[#293d47] hover:text-[#4a9b7f] transition font-medium tracking-wider uppercase text-sm duration-200">Serviços</a>
            <a href="#por-que" className="text-[#293d47] hover:text-[#4a9b7f] transition font-medium tracking-wider uppercase text-sm duration-200">Por que nós</a>
            <a href="#faq" className="text-[#293d47] hover:text-[#4a9b7f] transition font-medium tracking-wider uppercase text-sm duration-200">DÚVIDAS</a>
            <a href="#contato" className="text-[#293d47] hover:text-[#4a9b7f] transition font-medium tracking-wider uppercase text-sm duration-200">Contato</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-[#293d47] hover:text-[#4a9b7f] transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#e8e8e8] border-t border-gray-300/30 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="text-[#293d47] hover:text-[#4a9b7f] transition font-medium tracking-wider uppercase text-sm py-2 border-b border-gray-300/30">Serviços</a>
              <a href="#por-que" onClick={() => setMobileMenuOpen(false)} className="text-[#293d47] hover:text-[#4a9b7f] transition font-medium tracking-wider uppercase text-sm py-2 border-b border-gray-300/30">Por que nós</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-[#293d47] hover:text-[#4a9b7f] transition font-medium tracking-wider uppercase text-sm py-2 border-b border-gray-300/30">DÚVIDAS</a>
              <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="text-[#293d47] hover:text-[#4a9b7f] transition font-medium tracking-wider uppercase text-sm py-2">Contato</a>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="hidden md:block h-24"></div>

      {/* Problema e Solução */}
      <section className="mt-12 sm:mt-10 md:mt-0 py-8 md:py-32 px-4 relative overflow-hidden min-h-[500px] md:min-h-[600px] flex items-end md:items-center">
        {/* Vídeo de fundo com fallback para imagem */}
        <div className="absolute inset-0 pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/construction-user.mp4" type="video/mp4" />
            <img 
              src="/construction-cranes.jpg"
              alt="Construção com gruas"
              className="w-full h-full object-cover"
            />
          </video>
          {/* Overlay gradiente: mais escuro à esquerda, mais claro à direita */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3d2817]/85 via-[#5a3d2a]/75 to-[#7a5e47]/40"></div>
        </div>
        <div className="container mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:items-start">
            {/* Texto no lado esquerdo */}
            <div className="flex flex-col justify-center md:justify-start pt-0 md:pt-8 max-w-md pb-8 md:pb-0 text-center md:text-left mx-auto md:mx-0">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white leading-relaxed">Atrasos na entrega de imóveis comprados na planta são comuns. Mas você não precisa aceitar o prejuízo.</h2>
            </div>
            {/* Espaço vazio à direita (para a imagem aparecer) */}
            <div className="hidden md:block"></div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#293d47] to-[#3a5568] text-white py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-relaxed max-w-2xl mx-auto">Atraso na entrega do imóvel?<br />Conheça seus direitos.</h1>
          <p className="text-base sm:text-lg md:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">Nosso escritório é especializado em Direito Civil e Direito Imobiliário, oferecendo soluções jurídicas estratégicas para compradores de imóveis na planta.</p>
           <Button 
             size="lg" 
             className="bg-white text-[#293d47] hover:bg-gray-100 font-bold text-lg border-2 border-[#293d47] mt-6 md:mt-8"
             onClick={createWhatsAppHandler('Fale com especialista - Hero')}
           >
             Fale com especialista
           </Button>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" ref={servicosRef} className={`py-12 md:py-16 px-4 transition-all duration-700 ${servicosAnimation}`}>
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[#293d47]">Nossas soluções jurídicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Serviço 1: Resolução do Contrato */}
            <Card className="border-l-4 border-l-[#4a9b7f]">
              <CardHeader>
                <CardTitle className="text-[#293d47]">Resolução do contrato (distrato)</CardTitle>
                <CardDescription>Não quer mais esperar pela entrega da obra? Há possibilidade de devolução integral.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Se o atraso ultrapassou o prazo de tolerância (180 dias) e você perdeu a confiça na construtora, a lei permite, se houver culpa exclusiva da construtora, a <strong>resolução do contrato</strong>.
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-[#4a9b7f] flex-shrink-0" />
                    <span className="text-gray-700"><strong>100% dos valores pagos</strong> devolvidos (incluindo comissão de corretagem)</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-[#4a9b7f] flex-shrink-0" />
                    <span className="text-gray-700"><strong>Correção monetária</strong> sobre os valores a devolver</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-[#4a9b7f] flex-shrink-0" />
                    <span className="text-gray-700"><strong>Indenização por danos morais</strong> (a depender do caso)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Serviço 2: Indenização pelo Atraso */}
            <Card className="border-l-4 border-l-[#4a9b7f]">
              <CardHeader>
                <CardTitle className="text-[#293d47]">Indenização pelo atraso</CardTitle>
                <CardDescription>Quer o imóvel, mas quer ser indenizado pelo atraso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Se você ainda deseja esperar pela entrega do imóvel, mas foi prejudicado pelo atraso, você tem direito a ser indenizado.
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-[#4a9b7f] flex-shrink-0" />
                    <span className="text-gray-700"><strong>Lucros Cessantes (Aluguéis)</strong>: Indenização mensal (0,5% a 1% do valor do imóvel)</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-[#4a9b7f] flex-shrink-0" />
                    <span className="text-gray-700"><strong>Danos Morais</strong>: Indenização pelo transtorno causado</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-[#4a9b7f] flex-shrink-0" />
                    <span className="text-gray-700"><strong>Congelamento do Saldo Devedor</strong>: Suspensão da correção após prazo final</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section id="por-que" ref={porQueEscolherRef} className={`py-12 md:py-16 px-4 bg-gray-50 transition-all duration-700 ${porQueEscolherAnimation}`}>
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[#293d47]">Por que escolher a Santana Advocacia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="bg-[#4a9b7f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#293d47]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#293d47] mb-2">Especialistas em direito imobiliário</h3>
              <p className="text-gray-700">Conhecimento aprofundado nas leis e jurisprudência sobre atraso de obras.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#4a9b7f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#293d47]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#293d47] mb-2">Atendimento personalizado</h3>
              <p className="text-gray-700">Seu caso é único e será tratado com a atenção que merece.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#4a9b7f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#293d47]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#293d47] mb-2">Atendimento online e presencial</h3>
              <p className="text-gray-700">Consultas e acompanhamentos disponíveis tanto online quanto presencial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" ref={faqRef} className={`py-12 md:py-16 px-4 transition-all duration-700 ${faqAnimation}`}>
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4 text-[#293d47]">DÚVIDAS FREQUENTES</h2>
          <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">Esclareça suas dúvidas sobre os serviços de resolução de contrato e indenização por atraso na entrega de imóvel.</p>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition text-left"
                >
                  <span className="font-semibold text-[#293d47] pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`flex-shrink-0 w-5 h-5 text-[#4a9b7f] transition-transform ${
                      expandedFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    {faq.hasLinks ? (
                      <div className="text-gray-700 leading-relaxed">
                        {faq.question === "Como posso conhecer melhor o escritório Santana Advocacia?" ? (
                          <div>
                            <p>Você pode acompanhar nosso trabalho pelo <a href="https://www.instagram.com/santanna.advocacia_?igsh=MTkyYzV3Z2oxcXFybA==" target="_blank" rel="noopener noreferrer" className="text-[#4a9b7f] hover:underline font-semibold">Instagram</a> e acessar nosso <a href="https://www.santanalaw.com.br" target="_blank" rel="noopener noreferrer" className="text-[#4a9b7f] hover:underline font-semibold">site institucional</a>, onde publicamos informativos e artigos sobre Direito Imobiliário, além de apresentar em detalhes nossos serviços jurídicos.</p>
                          </div>
                        ) : faq.question === "Posso confiar no escritório Santana Advocacia?" ? (
                          <div>
                            <p>Sim. O escritório é fundado e liderado pela Dra. Leidiane Santos de Santana (OAB/SP 502.416), regularmente inscrita na Ordem dos Advogados do Brasil. Para verificar a inscrição, <a href="https://cna.oab.org.br/" target="_blank" rel="noopener noreferrer" className="text-[#4a9b7f] hover:underline font-semibold">clique aqui</a>.</p>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Ainda tem dúvidas? Entre em contato conosco!</p>
            <Button 
              size="lg" 
              className="bg-white text-[#293d47] hover:bg-gray-100 font-bold border-2 border-[#293d47]"
              onClick={createWhatsAppHandler('Fale com um Especialista - FAQ')}
            >
              Fale com um Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Conheça a advogada */}
      <section id="advogada" ref={advogadaRef} className={`py-12 md:py-16 px-4 bg-gray-50 transition-all duration-700 ${advogadaAnimation}`}>
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[#293d47]">Conheça a advogada que conduzirá seu caso</h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Foto */}
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="/dra-leidiane.png" 
                  alt="Dra. Leidiane" 
                  className="w-full md:w-96 h-auto md:h-[520px] object-cover rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-[#293d47]/20 to-transparent"></div>
              </div>
            </div>
            
            {/* Informações */}
            <div>
              <h3 className="text-3xl font-bold text-[#293d47] mb-2">Dra. Leidiane Santana</h3>
              <p className="text-[#4a9b7f] font-semibold text-lg mb-6">Advogada especialista em Direito civil e Direito imobiliário</p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Com uma década de experiência, conduz com estratégia e segurança a solução de conflitos envolvendo compra de imóveis na planta. Sua atuação é pautada em técnica, análise minuciosa de documentos e condução firme nas negociações, sempre com foco na proteção do patrimônio do cliente.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                É membro da Comissão de Direito Imobiliário da OAB/SP, associada ao Instituto Brasileiro de Direito Imobiliário (IBRADIM) e integrante do Instituto Mulheres do Imobiliário, mantém constante atualização e presença ativa no setor.
              </p>
              
              <div className="mb-8">
                <h4 className="font-bold text-[#293d47] mb-4">Especialidades:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4a9b7f] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Resolução de contratos de compra e venda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4a9b7f] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Indenização por atraso na entrega</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4a9b7f] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Rescisão direto com a construtora</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4a9b7f] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Direito imobiliário e cível</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4a9b7f] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Consultoria jurídica especializada</span>
                  </li>
                </ul>
              </div>
              
               <Button 
                 size="lg" 
                 className="bg-white text-[#293d47] hover:bg-gray-100 font-bold border-2 border-[#293d47]"
                 onClick={createWhatsAppHandler('Agende uma Consulta - Advogada')}
               >
                 Agende uma Consulta
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section ref={mapaRef} className={`w-full h-64 md:h-96 bg-gray-200 overflow-hidden transition-all duration-700 ${mapaAnimation}`}>
        <MapView onMapReady={handleMapReady} />
      </section>

      {/* Contato e Footer */}
      <footer id="contato" ref={contatoRef} className={`bg-[#293d47] text-white py-12 md:py-16 px-4 mt-0 relative z-10 transition-all duration-700 ${contatoAnimation}`}>
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">Entre em contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#4a9b7f]" />
              <h3 className="font-bold mb-2">WhatsApp</h3>
              <a href="https://wa.me/5511934855187" target="_blank" rel="noopener noreferrer" className="hover:text-[#4a9b7f] transition">(11) 9 3485-5187</a>
            </div>
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-[#4a9b7f]" />
              <h3 className="font-bold mb-2">E-mail</h3>
              <a href="mailto:juridico@santanasadvocacia.com.br" className="hover:text-[#4a9b7f] transition">juridico@santanasadvocacia.com.br</a>
            </div>
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-[#4a9b7f]" />
              <h3 className="font-bold mb-2">Endereço</h3>
              <p className="text-sm leading-relaxed">Avenida Paulista, 302, 1º andar<br/>Bela Vista, São Paulo - SP<br/>CEP: 01310-000</p>
            </div>
          </div>
          <div className="text-center border-t border-gray-600 pt-8">
            <p className="text-gray-300">© 2024 Santana Advocacia Soluções Jurídicas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] text-gray-100 py-6 px-4 shadow-lg z-40">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm md:text-base flex-1 leading-relaxed">
              Este site não se utiliza de "cookies" para coletar informações pessoais ou de navegação. Nossos provedores poderão, contudo, utilizar cookies para coletar dados genéricos e com finalidades estatísticas. Clicando em "Aceitar", você concorda com os termos.
            </p>
            <button
              onClick={() => setShowCookieBanner(false)}
              className="bg-[#4a9b7f] hover:bg-[#3d8b7f] text-white font-bold py-2 px-6 rounded transition whitespace-nowrap flex-shrink-0"
            >
              ACEITAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
