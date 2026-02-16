# MUN206
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Zap, 
  ChevronRight, 
  ShoppingBag, 
  Activity, 
  Globe, 
  Mail, 
  MessageSquare,
  ArrowUpRight,
  Monitor,
  Target,
  Layers,
  BarChart3,
  Sparkles,
  Volume2,
  Image as ImageIcon,
  Loader2,
  X,
  Send,
  Lightbulb,
  FileText,
  Boxes,
  Menu
} from 'lucide-react';

// API Configuration
const apiKey = "";

const products = [
  {
    id: 1,
    name: "Fundas de Neopreno",
    price: "$75.00 - $110.00",
    description: "Protección térmica premium para botellas y latas con diseños geo-métricos inspirados en la cosmogonía prehispánica.",
    moq: "500 unidades",
    features: ["VAR", "Huichol Beaded Style"],
    category: "Hospitalidad",
    img: "https://i.postimg.cc/ZqPMMk11/unnamed_(20).jpg"
  },
  {
    id: 2,
    name: "Tote Bags rPET",
    price: "$175.00 - $240.00",
    description: "Bolsas de carga fabricadas en poliéster reciclado (rPET) de 250g. Diseño técnico de estadios con amplia superficie de impacto visual.",
    moq: "150 unidades",
    features: ["Sostenibilidad", "VAR Estadio"],
    category: "Lifestyle",
    img: "https://i.postimg.cc/FR9BtW42/unnamed-(11).jpg"
  },
  {
    id: 3,
    name: "Porta AirTags",
    price: "$90.00 - $175.00",
    description: "Recuerdo funcional fabricado en metal con grabado láser de alta precisión. Tecnología VAR para una experiencia de marca minimalista.",
    moq: "300 unidades",
    features: ["Grabado Láser", "VAR Tech"],
    category: "Accesorios",
    img: "https://i.postimg.cc/PqbRRGBW/unnamed-(36).jpg"
  },
  {
    id: 4,
    name: "Termos Elite",
    price: "$350.00 - $500.00",
    description: "Acero inoxidable de grado industrial con acabado negro mate y grabado técnico. Transforma la interacción mediante AR.",
    moq: "150 unidades",
    features: ["Aislamiento Pro", "AR Ready"],
    category: "Lifestyle",
    img: "https://i.postimg.cc/pdQ66NgJ/unnamed-(33).jpg"
  },
  {
    id: 5,
    name: "Manteles Inteligentes",
    price: "$15.00 - $50.00",
    description: "Convierta su mesa en una cancha de fútbol virtual. Menús dinámicos y juegos interactivos en AR sobre papel o PVC.",
    moq: "2000 unidades",
    features: ["Gaming AR", "Menu Digital"],
    category: "Hospitalidad",
    img: "https://i.postimg.cc/PqbRRGBD/unnamed-(40).jpg"
  },
  {
    id: 6,
    name: "Pulseras de Acceso",
    price: "$50.00 - $135.00",
    description: "Brazaletes de silicona de grado médico o telar rPET. Incorporan chips NFC de corto alcance para gestión de accesos y pagos.",
    moq: "300 unidades",
    features: ["NFC Integrado", "Talavera Edition"],
    category: "Acceso",
    img: "https://i.postimg.cc/QMgyyLR4/unnamed-(28).jpg"
  },
  {
    id: 7,
    name: "Bandanas de Artista",
    price: "$50.00 - $135.00",
    description: "Textiles de alta densidad. Parte integral del ecosistema visual MUN 2026. Diseños que cobran vida con filtros VAR exclusivos.",
    moq: "300 unidades",
    features: ["VAR Filters", "Full Collection Style"],
    category: "Accesorios",
    img: "https://i.postimg.cc/cJ7bbqVY/unnamed-(41).jpg"
  },
  {
    id: 8,
    name: "Pañuelos Geo-métricos",
    price: "$180.00 - $220.00",
    description: "Seda sintética rPET con acabados de lujo. El accesorio definitivo de la Monumentalidad Táctica para directivos y hospitality.",
    moq: "150 unidades",
    features: ["Premium Silk", "Geo-Métrica"],
    category: "Lifestyle",
    img: "https://i.postimg.cc/g0yTT9f5/unnamed-(24).jpg"
  }
];

const App = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isScrolled, setIsScrolled] = useState(false);
  const [arActive, setArActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({ institution: '', email: '', message: '' });
  
  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiMode, setAiMode] = useState('text'); 
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = activeCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { institution, email, message } = formData;
    const mailtoUrl = `mailto:dest.gto.mx@gmail.com?subject=Solicitud Cotización MUN 2026 - ${institution}&body=Empresa: ${institution}%0DEmail de contacto: ${email}%0D%0DMensaje:%0D${message}`;
    window.location.href = mailtoUrl;
  };

  const callGemini = async (endpoint, payload, retries = 5, delay = 1000) => {
    try {
      const response = await fetch(endpoint + `?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGemini(endpoint, payload, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  const pcmToWav = (pcmBase64, sampleRate = 24000) => {
    const binaryString = atob(pcmBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (v, o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    writeString(view, 0, 'RIFF'); view.setUint32(4, 36 + bytes.byteLength, true);
    writeString(view, 8, 'WAVE'); writeString(view, 12, 'fmt '); view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    writeString(view, 36, 'data'); view.setUint32(40, bytes.byteLength, true);
    return new Blob([wavHeader, bytes.buffer], { type: 'audio/wav' });
  };

  const handleTTS = async (text) => {
    setAiLoading(true);
    try {
      const result = await callGemini(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent',
        { 
          contents: [{ parts: [{ text: `Dilo con una voz elegante y tecnológica: ${text}` }] }],
          generationConfig: { 
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } } 
          }
        }
      );
      const audioPart = result.candidates[0].content.parts.find(p => p.inlineData);
      if (audioPart) {
        const sampleRate = audioPart.inlineData.mimeType.match(/rate=(\d+)/)?.[1] || 24000;
        const audio = new Audio(URL.createObjectURL(pcmToWav(audioPart.inlineData.data, parseInt(sampleRate))));
        await audio.play();
      }
    } catch (err) { console.error("TTS failed", err); }
    finally { setAiLoading(false); }
  };

  const handleGenerateStrategy = async () => {
    if (!userInput) return;
    setAiLoading(true);
    setAiMode('strategy');
    setShowAiModal(true);
    try {
      const prompt = `Actúa como Director Creativo de DEST MX. Genera una Estrategia de Monumentalidad Táctica para: "${userInput}".`;
      const result = await callGemini(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent',
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      setAiResult(result.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (err) { setAiResult("Error en la consultoría."); }
    finally { setAiLoading(false); }
  };

  const handleVisualizeIdea = async () => {
    if (!userInput) return;
    setAiLoading(true);
    setAiMode('image');
    setShowAiModal(true);
    try {
      const prompt = `Luxury hospitality concept for Mexico 2026 activation. Description: ${userInput}. Photographic render.`;
      const result = await callGemini(
        'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict',
        { instances: { prompt }, parameters: { sampleCount: 1 } }
      );
      setAiResult(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
    } catch (err) { setAiResult(null); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00f2ff] selection:text-black overflow-x-hidden">
      
      {/* AI Assistant FAB ✨ */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button 
          onClick={() => { setShowAiModal(true); setAiMode('strategy'); setAiResult(null); }}
          className="bg-gradient-to-tr from-[#00ff88] to-[#00f2ff] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
        >
          <Sparkles className="text-black" size={24} />
          <span className="hidden md:block text-black font-bold uppercase text-[10px] tracking-widest">Consultoría ✨</span>
        </button>
      </div>

      {/* Navbar Responsiva */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-3' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://i.postimg.cc/PJKgCGtz/logos-varios.png" alt="Logo" className="h-8 md:h-12 w-auto object-contain" />
            <span className="text-sm md:text-xl font-bold tracking-tighter uppercase leading-none">
              KillFire by <span className="text-[#00ff88]">DEST MX 2026</span>
            </span>
          </div>
          
          {/* Mobile Menu Trigger */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             <Menu size={24} />
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex gap-8 text-[10px] font-bold tracking-widest uppercase">
            <a href="#productos" className="hover:text-[#00ff88] transition-colors">Colección</a>
            <a href="#anuncios" className="hover:text-[#00ff88] transition-colors">Empresas VAR</a>
            <a href="#tecnologia" className="hover:text-[#00ff88] transition-colors">Stat-Vision</a>
            <a href="#contacto" className="hover:text-[#00ff88] transition-colors">Contacto</a>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 bg-black/95 z-[60] lg:hidden transition-transform duration-500 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex flex-col h-full p-8">
              <button className="self-end mb-12" onClick={() => setMobileMenuOpen(false)}><X size={32} /></button>
              <div className="flex flex-col gap-8 text-2xl font-black uppercase tracking-tighter">
                <a href="#productos" onClick={() => setMobileMenuOpen(false)}>Colección</a>
                <a href="#anuncios" onClick={() => setMobileMenuOpen(false)}>Empresas VAR</a>
                <a href="#tecnologia" onClick={() => setMobileMenuOpen(false)}>Stat-Vision</a>
                <a href="#contacto" onClick={() => setMobileMenuOpen(false)}>Contacto</a>
              </div>
           </div>
        </div>
      </nav>

      {/* Hero - Optimizado para Movil */}
      <section className="relative min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src="https://i.postimg.cc/xC04rx2Z/unnamed-(14).jpg" className="w-full h-full object-cover brightness-[0.4] scale-105" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block border border-[#00ff88] px-4 py-1 rounded-full mb-4 md:mb-6">
            <h2 className="text-[#00ff88] font-bold tracking-[0.4em] text-[8px] md:text-xs uppercase">Monumentalidad Táctica</h2>
          </div>
          <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black mb-4 md:mb-6 tracking-tighter leading-[0.8] uppercase">M U N</h1>
          <p className="max-w-xl mx-auto text-gray-200 text-base md:text-2xl mb-8 md:mb-10 leading-tight font-medium drop-shadow-lg italic">La infraestructura de marca para el Mundial 2026.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <a href="#productos" className="w-full sm:w-auto bg-[#00ff88] text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all text-center">Ver Catálogo</a>
            <a href="#contacto" className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all text-center">Cotizar B2B</a>
          </div>
        </div>
      </section>

      {/* Grid de Productos - Optimizado para Movil */}
      <section id="productos" className="py-16 md:py-24 container mx-auto px-4 md:px-6 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
          <div className="w-full md:w-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 uppercase leading-none">Colección <span className="text-gray-500">2026</span></h2>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {['Todos', 'Hospitalidad', 'Lifestyle', 'Acceso', 'Accesorios'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 md:px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#00ff88] text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-400 border border-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-[#111] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#00ff88]/30 transition-all duration-500">
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale sm:group-hover:grayscale-0" />
                <button 
                  onClick={() => handleTTS(`${product.name}: ${product.description}`)}
                  className="absolute bottom-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-full text-[#00ff88] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">{product.name}</h3>
                  <p className="text-[#00f2ff] font-mono text-sm">{product.price}</p>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed line-clamp-3">{product.description}</p>
                <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5">
                  <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold">MOQ: {product.moq}</span>
                  <a href="#contacto" className="text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-[#00ff88] transition-colors flex items-center gap-2">Detalles <ArrowUpRight size={14} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Empresas VAR - Adaptado Movil */}
      <section id="anuncios" className="py-16 md:py-24 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-20">
             <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 text-[#00f2ff] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 md:mb-6">
                   <Zap size={16} /> Partner Solutions
                </div>
                <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 uppercase tracking-tighter leading-[0.9]">Anuncios en <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00f2ff]">Empresas VAR</span></h2>
                <p className="text-gray-400 text-base md:text-xl mb-8 md:mb-10 leading-relaxed font-light">Inserte su marca en la dimensión Stat-Vision. No es publicidad estática; es un portal interactivo dentro de hoteles, estadios y centros de consumo exclusivos.</p>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex gap-4 md:gap-6 items-center">
                    <div className="min-w-[48px] h-[48px] md:min-w-[56px] md:h-[56px] bg-white/5 rounded-2xl flex items-center justify-center text-[#00ff88] border border-white/10"><Monitor size={20} /></div>
                    <div><h4 className="font-bold uppercase tracking-widest text-[10px] md:text-sm mb-1">Display Inteligente</h4><p className="text-[10px] md:text-xs text-gray-500">Activación nativa e instantánea.</p></div>
                  </div>
                  <div className="flex gap-4 md:gap-6 items-center">
                    <div className="min-w-[48px] h-[48px] md:min-w-[56px] md:h-[56px] bg-white/5 rounded-2xl flex items-center justify-center text-[#00f2ff] border border-white/10"><BarChart3 size={20} /></div>
                    <div><h4 className="font-bold uppercase tracking-widest text-[10px] md:text-sm mb-1">Métricas de Impacto</h4><p className="text-[10px] md:text-xs text-gray-500">Datos precisos de engagement.</p></div>
                  </div>
                </div>
             </div>
             <div className="lg:w-1/2 w-full">
                <img 
                  src="https://i.postimg.cc/YSNsscJd/unnamed-(30).jpg" 
                  alt="Anuncios" 
                  className="rounded-[2.5rem] md:rounded-[4rem] border border-white/10 shadow-2xl w-full h-auto"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Stat-Vision - Adaptado Movil */}
      <section id="tecnologia" className="py-20 md:py-32 bg-gradient-to-b from-[#0a0a0a] to-[#001a1a] overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative flex justify-center items-center h-[500px] md:h-[600px] perspective-1000 scale-[0.8] md:scale-100">
              <div className={`relative w-[260px] h-[540px] md:w-[280px] md:h-[580px] bg-black rounded-[3rem] border-[6px] md:border-[8px] border-[#1a1a1a] shadow-2xl transition-transform duration-1000 ${arActive ? 'rotate-x-20 rotate-y--10' : ''}`}>
                <div className="absolute inset-2 bg-black rounded-[2.2rem] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                   <div className="text-[8px] md:text-[10px] font-mono text-gray-600 mb-4 uppercase tracking-[0.3em]">STAT-VISION 4.0</div>
                   <button onClick={() => setArActive(!arActive)} className={`px-6 md:px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${arActive ? 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.5)]' : 'bg-white/10 text-white'}`}>
                     {arActive ? 'VAR ACTIVO' : 'ACTIVAR VAR'}
                   </button>
                </div>
                <div className={`absolute left-[-40px] md:left-[-60px] top-[-80px] md:top-[-100px] w-[340px] md:w-[400px] h-[340px] md:h-[400px] transition-all duration-1000 pointer-events-none ${arActive ? 'opacity-100 translate-y-[-50px] scale-100' : 'opacity-0 translate-y-20 scale-50'}`}>
                   <img src="https://i.postimg.cc/wBHQG15p/logos-varios-(1).png" className="w-full h-full object-contain filter drop-shadow-2xl" alt="VAR" />
                </div>
              </div>
            </div>
            <div className="text-left px-2">
              <div className="inline-flex items-center gap-2 text-[#00ff88] font-black text-[10px] md:text-xs uppercase tracking-widest mb-4 md:mb-6">
                <Target size={16} /> Dimensión Stat-Vision
              </div>
              <h2 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 uppercase tracking-tighter leading-[0.9]">Escaneo <br />de Marca</h2>
              <p className="text-gray-400 text-base md:text-xl leading-relaxed max-w-lg">Transforma objetos físicos en interfaces digitales. Optimizamos la infraestructura de marca mediante inteligencia de datos aplicada.</p>
            </div>
        </div>
      </section>

      {/* Contacto - Formulario Mejorado Movil */}
      <section id="contacto" className="py-16 md:py-24 bg-black border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 uppercase tracking-tighter leading-none">Infraestructura <br /><span className="text-gray-500">2026</span></h2>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 group cursor-pointer" onClick={() => window.location.href="mailto:dest.gto.mx@gmail.com"}>
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-[#111] border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#00ff88] group-hover:text-black transition-colors"><Mail size={18} /></div>
                   <span className="font-bold tracking-widest uppercase text-[10px] md:text-sm">dest.gto.mx@gmail.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 group cursor-pointer" onClick={() => window.open("https://wa.me/527298956476")}>
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-[#111] border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#00f2ff] group-hover:text-black transition-colors"><MessageSquare size={18} /></div>
                   <span className="font-bold tracking-widest uppercase text-[10px] md:text-sm">+52 729 895 6476</span>
                </div>
              </div>
            </div>
            <div className="bg-[#111] p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-white/5">
              <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 uppercase tracking-widest text-center md:text-left">Solicitar Cotización B2B</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input 
                  type="text" required placeholder="Institución / Marca" 
                  value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-4 md:p-5 rounded-2xl focus:outline-none focus:border-[#00ff88] text-sm" 
                />
                <input 
                  type="email" required placeholder="Email Corporativo" 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-4 md:p-5 rounded-2xl focus:outline-none focus:border-[#00ff88] text-sm" 
                />
                <textarea 
                  required placeholder="Detalles del pedido..." rows="4" 
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-4 md:p-5 rounded-2xl focus:outline-none focus:border-[#00ff88] text-sm resize-none" 
                />
                <button type="submit" className="w-full bg-[#00ff88] text-black font-black py-4 md:py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3">
                  Enviar Mensaje <Send size={14} />
                </button>
              </form>
            </div>
        </div>
      </section>

      {/* AI Modal ✨ - Scrollable en movil */}
      {showAiModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl overflow-y-auto">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-3xl rounded-[3rem] overflow-hidden relative shadow-2xl my-auto">
            <button onClick={() => setShowAiModal(false)} className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-500 hover:text-white transition-colors z-20"><X size={24} /></button>
            <div className="p-8 md:p-16">
              <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
                <div className="p-3 md:p-4 bg-gradient-to-tr from-[#00ff88] to-[#00f2ff] rounded-[1.2rem] shadow-lg"><Sparkles size={24} className="text-black" /></div>
                <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-tight">
                  {aiMode === 'strategy' ? 'Estrategia MUN ✨' : aiMode === 'image' ? 'Concepto Visual ✨' : 'Análisis ✨'}
                </h3>
              </div>
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-24 gap-6">
                  <Loader2 className="animate-spin text-[#00ff88]" size={48} md:size={64} />
                  <p className="text-[10px] font-mono text-gray-600 animate-pulse tracking-[0.4em] uppercase">Consultando Red Táctica...</p>
                </div>
              ) : (
                <div className="space-y-6 md:space-y-8">
                  {aiMode === 'image' ? (
                    <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-video bg-black/50 flex items-center justify-center">
                      {aiResult ? <img src={aiResult} alt="IA" className="w-full h-full object-cover" /> : <p className="text-gray-600 text-xs">Sin render disponible.</p>}
                    </div>
                  ) : (
                    <div className="bg-white/[0.03] p-6 md:p-10 rounded-[2rem] border border-white/10 max-h-[350px] md:max-h-[450px] overflow-y-auto custom-scrollbar">
                      <div className="text-gray-300 leading-relaxed font-light whitespace-pre-line text-xs md:text-sm">
                        {aiResult || "Procesando datos estratégicos..."}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button onClick={() => setShowAiModal(false)} className="bg-white/5 border border-white/10 px-6 py-2 md:px-8 md:py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Cerrar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer - Optimizado Movil */}
      <footer className="py-12 md:py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-3">
             <img src="https://i.postimg.cc/PJKgCGtz/logos-varios.png" alt="Logo" className="h-10 w-auto mb-2" />
             <div className="text-lg font-black tracking-tighter uppercase leading-none">KillFire by <span className="text-[#00ff88]">DEST MX 2026</span></div>
             <p className="text-[8px] md:text-[10px] text-gray-600 uppercase tracking-[0.4em] font-black">Plan MUN &copy; 2026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <a href="#" className="hover:text-[#00ff88] transition-colors">B2B</a>
            <a href="#" className="hover:text-[#00f2ff] transition-colors">Media</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#00ff88] text-gray-400 hover:text-white transition-all"><Globe size={18} /></div>
             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#00f2ff] text-gray-400 hover:text-white transition-all"><ShoppingBag size={18} /></div>
          </div>
        </div>
      </footer>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-x-20 { transform: rotateX(20deg); }
        .rotate-y--10 { transform: rotateY(-10deg); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;