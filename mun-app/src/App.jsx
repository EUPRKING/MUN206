import React, { useState, useEffect, useRef } from 'react';
import './index.css';
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
  Wind
} from 'lucide-react';

// API Configuration
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
  
  // Form States
  const [formData, setFormData] = useState({ institution: '', email: '', message: '' });
  
  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiMode, setAiMode] = useState('text'); // 'text', 'image', 'strategy'
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = activeCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Form Handling - Enviar al correo real de DEST MX
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { institution, email, message } = formData;
    const mailtoUrl = `mailto:dest.gto.mx@gmail.com?subject=Solicitud Cotización MUN 2026 - ${institution}&body=Empresa: ${institution}%0DEmail de contacto: ${email}%0D%0DMensaje:%0D${message}`;
    window.location.href = mailtoUrl;
  };

  // Gemini API Helper
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

  // TTS Helper (Corrected WAV wrapping)
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
      const prompt = `Actúa como Director Creativo de DEST MX. El cliente describe su evento así: "${userInput}". Genera una "Estrategia de Monumentalidad Táctica" para el Mundial 2026. Responde profesionalmente.`;
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
      const prompt = `Luxury hospitality concept for Mexico 2026 activation. Description: ${userInput}. Photographic architectural render.`;
      const result = await callGemini(
        'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict',
        { instances: { prompt }, parameters: { sampleCount: 1 } }
      );
      setAiResult(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
    } catch (err) { setAiResult(null); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="w-full">
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
        <button 
          onClick={() => { setShowAiModal(true); setAiMode('strategy'); setAiResult(null); }}
          className="bg-gradient-to-tr from-[#00ff88] to-[#00f2ff] p-4 rounded-full shadow-[0_0_30px_rgba(0,255,136,0.5)] hover:scale-110 transition-transform flex items-center gap-2 group"
        >
          <Sparkles className="text-black" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-black font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">Consultoría Estratégica ✨</span>
        </button>
      </div>

      {/* Navbar con Identidad Actualizada */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
        <div className="container flex items-center justify-between px-6 mx-auto">
          <div className="flex items-center gap-4">
            <img src="https://i.postimg.cc/PJKgCGtz/logos-varios.png" alt="Logo" className="object-contain w-auto h-10 md:h-12" />
            <span className="text-lg font-bold leading-none tracking-tighter uppercase md:text-xl">
              KillFire by <span className="block md:inline">DEST MX <span className="text-[#00ff88]">2026</span></span>
            </span>
          </div>
          <div className="hidden lg:flex gap-8 text-[10px] font-bold tracking-widest uppercase">
            <a href="#productos" className="hover:text-[#00ff88] transition-colors">Colección</a>
            <a href="#anuncios" className="hover:text-[#00ff88] transition-colors">Empresas VAR</a>
            <a href="#tecnologia" className="hover:text-[#00ff88] transition-colors">Stat-Vision</a>
            <a href="#contacto" className="hover:text-[#00ff88] transition-colors">Contacto</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://i.postimg.cc/xC04rx2Z/unnamed-(14).jpg" className="w-full h-full object-cover brightness-[0.4] scale-105" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
        </div>
        <div className="container relative z-10 px-6 mx-auto text-center">
          <div className="inline-block border border-[#00ff88] px-4 py-1 rounded-full mb-6">
            <h2 className="text-[#00ff88] font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase">Monumentalidad Táctica</h2>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black mb-6 tracking-[0.3em] leading-[0.8] uppercase">M U N</h1>
          <p className="max-w-xl mx-auto mb-10 text-lg italic font-medium leading-tight text-gray-200 md:text-2xl drop-shadow-lg">La infraestructura de marca para el Mundial 2026.</p>
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <a href="#productos" className="bg-[#00ff88] text-black px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all">Ver Catálogo</a>
            <a href="#contacto" className="px-10 py-4 font-black tracking-widest uppercase transition-all border rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20">Cotizar B2B</a>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="productos" className="py-24 border-t border-white/5">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col items-end justify-between gap-6 mb-12 md:flex-row">
            <div className="w-full md:w-auto">
              <h2 className="mb-4 text-4xl font-black leading-none tracking-tight uppercase">Colección <span className="text-gray-500">2026</span></h2>
              <div className="flex flex-wrap gap-3">
                {['Todos', 'Hospitalidad', 'Lifestyle', 'Acceso', 'Accesorios'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]' : 'bg-[#1a1a1a] text-gray-400 border border-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col h-full bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#00ff88]/30 transition-all duration-500 group">
                <div className="w-full h-64 overflow-hidden">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                  />
                </div>
                <div className="flex flex-col flex-grow p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="flex-1 text-2xl font-bold tracking-tight">{product.name}</h3>
                    <p className="text-[#00f2ff] font-mono text-sm whitespace-nowrap ml-2">{product.price}</p>
                  </div>
                  <p className="flex-grow mb-6 text-sm leading-relaxed text-gray-400 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between pt-6 mt-auto border-t border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">MOQ: {product.moq}</span>
                    <button 
                      onClick={() => handleTTS(`${product.name}: ${product.description}`)}
                      className="text-xs font-bold uppercase tracking-widest hover:text-[#00ff88] transition-colors flex items-center gap-2"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nueva Sección: Anuncios Corporativos VAR */}
      <section id="anuncios" className="py-24 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
             <div className="flex-1 w-full lg:w-auto">
                <div className="inline-flex items-center gap-2 text-[#00f2ff] font-black text-xs uppercase tracking-[0.3em] mb-6">
                   <Zap size={18} /> Partner Solutions
                </div>
                <h2 className="mb-8 text-5xl font-black leading-none tracking-tighter uppercase md:text-7xl">Anuncios en <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00f2ff]">Empresas VAR</span></h2>
                <p className="mb-10 text-xl font-light leading-relaxed text-gray-400">Inserte su marca en la dimensión Stat-Vision. No es publicidad estática; es un portal interactivo dentro de hoteles, estadios y centros de consumo.</p>
                <div className="space-y-6">
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center text-[#00ff88] border border-white/10 group-hover:border-[#00ff88] transition-all"><Monitor size={24} /></div>
                    <div><h4 className="mb-1 text-sm font-bold tracking-widest uppercase">Display Inteligente</h4><p className="text-xs text-gray-500">Activación nativa sin descarga de apps.</p></div>
                  </div>
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center text-[#00f2ff] border border-white/10 group-hover:border-[#00f2ff] transition-all"><BarChart3 size={24} /></div>
                    <div><h4 className="mb-1 text-sm font-bold tracking-widest uppercase">Data-Leads</h4><p className="text-xs text-gray-500">Captura de métricas de engagement en tiempo real.</p></div>
                  </div>
                </div>
             </div>
             <div className="relative flex-1 w-full lg:w-auto group">
                <div className="absolute inset-0 bg-[#00ff88]/10 blur-[120px] rounded-full opacity-20" />
                <img 
                  src="https://i.postimg.cc/YSNsscJd/unnamed-(30).jpg" 
                  alt="Anuncios Inteligentes" 
                  className="rounded-[4rem] border border-white/10 shadow-2xl relative z-10 group-hover:scale-[1.02] transition-transform duration-700 w-full h-auto"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Stat-Vision Interactive Scan */}
      <section id="tecnologia" className="py-32 bg-gradient-to-b from-[#0a0a0a] to-[#001a1a] overflow-hidden border-y border-white/5">
        <div className="container grid items-center gap-20 px-6 mx-auto lg:grid-cols-2">
            <div className="relative flex justify-center items-center h-[600px] perspective-1000">
              <div className={`relative w-[280px] h-[580px] bg-black rounded-[3.5rem] border-[8px] border-[#1a1a1a] shadow-[0_0_60px_rgba(0,255,136,0.15)] transition-transform duration-1000 ${arActive ? 'rotate-x-20 rotate-y--10 translate-y-10 shadow-[0_0_100px_rgba(0,255,136,0.3)]' : ''}`}>
                <div className="absolute inset-2 bg-black rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                   <div className="text-[10px] font-mono text-gray-600 mb-4 uppercase tracking-[0.3em]">STAT-VISION 4.0</div>
                   <button onClick={() => setArActive(!arActive)} className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${arActive ? 'bg-[#00ff88] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                     {arActive ? 'VAR ACTIVO' : 'ACTIVAR VAR'}
                   </button>
                </div>
                <div className={`absolute left-[-60px] top-[-100px] w-[400px] h-[400px] transition-all duration-1000 pointer-events-none ${arActive ? 'opacity-100 translate-y-[-50px] scale-100 rotate-[10deg]' : 'opacity-0 translate-y-20 scale-50'}`}>
                   <img src="https://i.postimg.cc/wBHQG15p/logos-varios-(1).png" className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,255,136,0.4)]" alt="VAR" />
                </div>
              </div>
            </div>
            <div className="text-left">
              <div className="inline-flex items-center gap-2 text-[#00ff88] font-black text-xs uppercase tracking-widest mb-6">
                <Target size={18} /> Dimensión Stat-Vision
              </div>
              <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.85]">Escaneo <br />de Marca</h2>
              <p className="max-w-lg mb-10 text-xl leading-relaxed text-gray-400">Transforma objetos físicos en interfaces digitales. Nuestra IA analiza el engagement en tiempo real para optimizar la infraestructura de marca.</p>
            </div>
        </div>
      </section>

      {/* Contact Section - Mensajes funcionales */}
      <section id="contacto" className="py-24 bg-black border-t border-white/5">
        <div className="container grid items-center gap-20 px-6 mx-auto md:grid-cols-2">
            <div>
              <h2 className="mb-8 text-6xl font-black leading-none tracking-tighter uppercase">Infraestructura <br /><span className="text-gray-500">2026</span></h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6 cursor-pointer group" onClick={() => window.location.href="mailto:dest.gto.mx@gmail.com"}>
                   <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#00ff88] transition-colors group-hover:text-black"><Mail size={20} /></div>
                   <span className="text-sm font-bold tracking-widest uppercase">dest.gto.mx@gmail.com</span>
                </div>
                <div className="flex items-center gap-6 cursor-pointer group" onClick={() => window.open("https://wa.me/527298956476")}>
                   <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#00f2ff] transition-colors group-hover:text-black"><MessageSquare size={20} /></div>
                   <span className="text-sm font-bold tracking-widest uppercase">+52 729 895 6476</span>
                </div>
              </div>
            </div>
            <div className="bg-[#111] p-10 rounded-[4rem] border border-white/5">
              <h3 className="mb-8 text-xl font-bold tracking-widest uppercase">Solicitar Cotización B2B</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input 
                  type="text" required placeholder="Institución / Marca" 
                  value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-[#00ff88]" 
                />
                <input 
                  type="email" required placeholder="Email Corporativo" 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-[#00ff88]" 
                />
                <textarea 
                  required placeholder="Detalles del pedido (Productos y cantidades)" rows="4" 
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-[#00ff88]" 
                />
                <button type="submit" className="w-full bg-[#00ff88] text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-xl shadow-[#00ff88]/20 flex items-center justify-center gap-3">
                  Enviar Mensaje <Send size={16} />
                </button>
              </form>
            </div>
        </div>
      </section>

      {/* AI Modal ✨ */}
      {showAiModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-3xl rounded-[4rem] overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,1)]">
            <button onClick={() => setShowAiModal(false)} className="absolute z-20 text-gray-500 transition-colors top-10 right-10 hover:text-white"><X size={32} /></button>
            <div className="p-12 md:p-16">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-gradient-to-tr from-[#00ff88] to-[#00f2ff] rounded-[1.5rem] shadow-[0_0_30px_rgba(0,255,136,0.3)]"><Sparkles size={32} className="text-black" /></div>
                <h3 className="text-3xl font-black tracking-tighter uppercase">
                  {aiMode === 'strategy' ? 'Estrategia MUN 2026 ✨' : aiMode === 'image' ? 'Concepto Visual ✨' : 'Análisis Táctico ✨'}
                </h3>
              </div>
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center gap-6 py-24">
                  <Loader2 className="animate-spin text-[#00ff88]" size={64} />
                  <p className="text-xs font-mono text-gray-600 animate-pulse tracking-[0.4em] uppercase">Procesando Inteligencia...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/10 max-h-[450px] overflow-y-auto custom-scrollbar">
                    <div className="text-gray-300 leading-loose font-light whitespace-pre-line text-sm selection:bg-[#00ff88] selection:text-black">
                      {aiResult || "Esperando datos..."}
                    </div>
                  </div>
                  <div className="flex justify-end pt-8 border-t border-white/5">
                    <button onClick={() => setShowAiModal(false)} className="px-8 py-3 text-xs font-black tracking-widest uppercase transition-all border rounded-full bg-white/5 border-white/10 hover:bg-white hover:text-black">Cerrar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="container flex flex-col items-center justify-between gap-12 px-6 mx-auto md:flex-row">
          <div className="flex flex-col items-center gap-3 md:items-start">
             <img src="https://i.postimg.cc/PJKgCGtz/logos-varios.png" alt="Logo" className="w-auto h-12 mb-2" />
             <div className="text-xl font-black leading-none tracking-tighter uppercase">KILLFIRE <span className="text-[#00ff88]">COMPANY</span></div>
             <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] font-black">Plan MUN &copy; 2026</p>
          </div>
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#00ff88] transition-colors cursor-pointer text-gray-400 hover:text-white"><Globe size={20} /></div>
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#00f2ff] transition-colors cursor-pointer text-gray-400 hover:text-white"><ShoppingBag size={20} /></div>
          </div>
        </div>
      </footer>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-x-20 { transform: rotateX(20deg); }
        .rotate-y--10 { transform: rotateY(-10deg); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;