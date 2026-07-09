import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import logoImg from './assets/logo.webp';
import {
  Building2, ArrowRight, Calendar, Ruler, ChevronRight,
  MapPin, Phone, Mail, CheckCircle, Send, Settings, X, Wrench, Menu, Trash2, Image as ImageIcon,
  ShieldCheck, HardHat, Leaf, ChevronDown, Quote, Play, Loader2
} from 'lucide-react';

// --- TYPES & INTERFACES ---
type TabType = 'inicio' | 'nosotros' | 'proyectos' | 'activos' | 'contacto';

interface Project {
  id: number;
  name: string;
  category: 'residencial' | 'corporativo' | 'industriales';
  image: string;
  year: number;
  area: number;
  architect: string;
  location: string;
  description: string;
}

interface Lead {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  tipoProyecto: string;
  mensaje: string;
  timestamp: Date;
}

interface Machinery {
  id: number;
  name: string;
  quantity: number;
  capacity: string;
  status: 'activo' | 'mantenimiento' | 'operativo';
  image: string;
  specs: string[];
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Testimonial {
  id: number;
  author: string;
  role: string;
  text: string;
}

// --- LOCAL DATA ---
const heroImages = [
  'https://plus.unsplash.com/premium_photo-1682882580715-7c1c07fd934d?q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
];

const defaultProjects: Project[] = [
  {
    id: 1,
    name: 'Edificio VyV San Isidro',
    category: 'corporativo',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    year: 2023,
    area: 45000,
    architect: 'Arquitectos Asociados Lima',
    location: 'San Isidro, Lima',
    description: 'Torre corporativa de 25 pisos con certificación LEED Gold y sistema de eficiencia energética integrado.',
  },
  {
    id: 2,
    name: 'Residencial San Antonio',
    category: 'residencial',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    area: 160,
    architect: 'Ingeniería VyV',
    location: 'Carabayllo, Lima',
    description: 'Desarrollo residencial optimizado. Incluye rigurosos estudios de mecánica de suelos mediante calicatas para garantizar estabilidad estructural.',
  },
  {
    id: 3,
    name: 'Planta Industrial Callao',
    category: 'industriales',
    image: 'https://images.unsplash.com/photo-1665734996545-c7a70a54a5d5?q=80',
    year: 2021,
    area: 65000,
    architect: 'Ingeniería Estructural S.A.C.',
    location: 'Callao',
    description: 'Nave industrial con capacidad para procesos de manufactura pesada y logística multimodal.',
  },
];

const defaultMachinery: Machinery[] = [
  {
    id: 1,
    name: 'Grúas Torre',
    quantity: 8,
    capacity: '12-50 toneladas',
    status: 'operativo',
    image: 'https://plus.unsplash.com/premium_photo-1676299944682-929023fe3a3d?q=80',
    specs: ['Alcance: 40-70 metros', 'Capacidad máxima: 50 ton', 'Control remoto digital', 'Sistema anti-colisión'],
  },
  {
    id: 2,
    name: 'Equipos Topográficos y GPS',
    quantity: 15,
    capacity: 'Alta Precisión',
    status: 'activo',
    image: 'https://plus.unsplash.com/premium_photo-1681992175171-4e0541e9a4af?q=80',
    specs: ['Receptores GNSS doble banda (L1+L5)', 'Estaciones totales robóticas', 'Integración nativa con ArcGIS / QGIS', 'Lectura topográfica en tiempo real'],
  },
  {
    id: 3,
    name: 'Excavadoras Hidráulicas',
    quantity: 12,
    capacity: '20-45 toneladas',
    status: 'activo',
    image: 'https://plus.unsplash.com/premium_photo-1682142119293-ba4cb0877108?q=80',
    specs: ['Potencia: 150-350 HP', 'Cucharón: 1.2-2.5 m³', 'Cabina blindada ROPS/FOPS', 'Cámara perimetral 360°'],
  },
];

const faqs: FAQ[] = [
  { id: 1, question: '¿Qué certificaciones de calidad poseen sus proyectos?', answer: 'Todos nuestros proyectos corporativos aspiran a la certificación LEED. Además, contamos con ISO 9001 en gestión de calidad de obra y procesos constructivos.' },
  { id: 2, question: '¿Realizan proyectos bajo la modalidad "llave en mano"?', answer: 'Sí, ofrecemos soluciones integrales EPC (Engineering, Procurement, and Construction) garantizando el costo, tiempo y calidad desde la concepción hasta la entrega final.' },
  { id: 3, question: '¿Cuál es su capacidad de financiamiento para obras de gran envergadura?', answer: 'Operamos a través de fideicomisos respaldados por las principales entidades bancarias del país, lo que asegura un flujo de caja ininterrumpido y transparencia total para los inversionistas.' }
];

const testimonials: Testimonial[] = [
  { id: 1, author: 'Carlos Mendoza', role: 'Director de Inversiones, Grupo Capital', text: 'Constructora VYV no solo entregó nuestro edificio corporativo dos semanas antes del plazo, sino que la calidad de los acabados superó nuestras expectativas.' },
  { id: 2, author: 'Elena Salas', role: 'Gerente General, Logística Sur', text: 'La precisión en la ingeniería de nuestra nave industrial es destacable. El uso de su propia maquinaria aceleró los tiempos de movimiento de tierras drásticamente.' }
];

// --- UTILS ---
const tabVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, filter: 'blur(10px)', transition: { duration: 0.3, ease: 'easeIn' } }
};

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isVisible) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={ref} className="counter-value">{count.toLocaleString()}{suffix}</span>;
}

// --- CLAD SERVICES FLOATING CARD (Resized & Link Enabled) ---
function CladServicesCard() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6, type: "spring", bounce: 0.4 }}
      className="fixed bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-[60] bg-[#223a59] rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3 md:gap-4 w-[calc(100vw-2rem)] md:w-auto md:min-w-[380px] border border-white/5"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white ml-0.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-body font-bold text-xs md:text-[14px] leading-snug mb-0.5">
            Previsualización en Vivo<br />por CLAD Services
          </span>
          <span className="text-[#9ab1d1] text-[9px] md:text-[10px] uppercase font-bold leading-tight tracking-[0.05em]">
            SOLUCIONES DIGITALES WEB<br />COORPORATIVA
          </span>
        </div>
      </div>
      <a 
        href="https://wa.me/51925928592?text=Hola%20quiero%20cotizar%20la%20pagina%20Constructora%20VyV" 
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white text-[#223a59] px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-[13px] font-bold hover:bg-gray-100 transition-all shrink-0 font-body shadow-sm hover:scale-105 active:scale-95 text-center inline-block"
      >
        Contratar
      </a>
    </motion.div>
  );
}

// --- SECTIONS ---
function HeroSection({ setTab }: { setTab: (tab: TabType) => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="relative min-h-[calc(100vh-80px)] mt-[80px] flex flex-col md:flex-row bg-obsidian">
      <div className="w-full md:w-[45%] bg-obsidian relative z-10 flex flex-col justify-center px-6 md:px-16 py-20 md:py-0 border-r-2 border-white/10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-6">
          <div className="w-12 h-[2px] bg-terracotta" />
          <span className="text-white/60 font-body text-sm tracking-wider uppercase">Desde 1999 en Lima</span>
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Sólidos<br />Fundamentos.<br /><span className="text-terracotta">Futuro</span><br />Sostenible.
        </motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/70 font-body text-lg max-w-md mb-10">
          Más de 25 años transformando el perfil urbano del Perú con ingeniería de precisión e innovación estructural.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
          <button onClick={() => setTab('proyectos')} className="inline-flex items-center gap-3 btn-primary group w-max">
            <span>Ver Proyectos Actuales</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      <div className="w-full md:w-[55%] relative h-[50vh] md:h-auto overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            alt={`VyV Obra ${currentSlide + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-transparent opacity-80" />
      </div>
    </motion.section>
  );
}

function NosotrosSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <motion.section variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="py-24 bg-concrete relative mt-[80px] min-h-[calc(100vh-80px)]">
      <div className="absolute inset-0 bg-grid-blueprint opacity-50 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 space-y-32">
        
        {/* Core Info */}
        <div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-5xl font-bold text-obsidian mb-12">
            Fideicomiso Jurídico con <span className="text-terracotta">Solidez Probada</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="bg-obsidian p-8 structural-shadow text-white">
              <div className="text-terracotta text-sm font-body tracking-wider uppercase mb-6">TRAYECTORIA</div>
              <div className="text-6xl font-display font-bold mb-4">
                <AnimatedCounter end={25} suffix=" Años" />
              </div>
              <p className="text-white/70 font-body">Transformando el perfil urbano del Perú con proyectos que definen el desarrollo sostenible y la viabilidad económica a largo plazo.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 border-2 border-obsidian/20 hover:border-terracotta transition-colors group">
              <div className="border-l-4 border-terracotta pl-4 mb-6">
                <span className="text-terracotta text-sm font-body uppercase tracking-wider font-bold">MISIÓN</span>
              </div>
              <p className="text-obsidian/80 font-body">Ejecutar proyectos de construcción con los más altos estándares de <strong>seguridad</strong>, <strong>ingeniería de precisión</strong> y entregas puntuales, garantizando el retorno de inversión.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 border-2 border-obsidian/20 hover:border-terracotta transition-colors group">
              <div className="border-l-4 border-terracotta pl-4 mb-6">
                <span className="text-terracotta text-sm font-body uppercase tracking-wider font-bold">VISIÓN</span>
              </div>
              <p className="text-obsidian/80 font-body">Ser la constructora y desarrolladora inmobiliaria líder a nivel nacional, impulsando la adopción de tecnologías de edificación verde y maximizando el valor urbano.</p>
            </motion.div>
          </div>
        </div>

        {/* Benefits Expansion */}
        <div>
          <h3 className="font-display text-3xl font-bold text-obsidian mb-10 text-center">Nuestros Pilares Constructivos</h3>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: ShieldCheck, title: 'Mitigación de Riesgos', desc: 'Cumplimiento estricto de normativas sísmicas y auditorías de seguridad HSE.' },
              { icon: HardHat, title: 'Fuerza Laboral Propia', desc: 'Evitamos subcontrataciones masivas para asegurar control de calidad en cada fase.' },
              { icon: Leaf, title: 'Eficiencia Energética', desc: 'Diseños que optimizan recursos hídricos y eléctricos, buscando certificaciones verdes.' }
            ].map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-terracotta/10 text-terracotta flex items-center justify-center rounded-full mb-6">
                  <b.icon className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-xl mb-3 text-obsidian">{b.title}</h4>
                <p className="font-body text-obsidian/70">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials & FAQs Expansion */}
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h3 className="font-display text-3xl font-bold text-obsidian mb-8">Respaldo Institucional</h3>
            <div className="space-y-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-6 border-l-4 border-obsidian shadow-sm">
                  <Quote className="w-8 h-8 text-terracotta/40 mb-4" />
                  <p className="font-body text-obsidian/80 italic mb-4">"{t.text}"</p>
                  <div className="font-display font-bold text-obsidian">{t.author}</div>
                  <div className="font-body text-sm text-terracotta">{t.role}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-3xl font-bold text-obsidian mb-8">Consultas Frecuentes</h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div key={faq.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border-2 border-obsidian/10 bg-white">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center p-5 text-left focus:outline-none">
                    <span className="font-display font-bold text-obsidian">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-terracotta transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5 pt-0 text-obsidian/70 font-body border-t border-obsidian/10 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ProyectosSection({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>('todos');
  const filteredProjects = filter === 'todos' ? projects : projects.filter((p) => p.category === filter);

  return (
    <motion.section variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="py-24 bg-obsidian relative mt-[80px] min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-display text-5xl font-bold text-white">
            Proyectos <span className="text-terracotta">Destacados</span>
          </motion.h2>
          <div className="flex gap-3 flex-wrap">
            {['todos', 'residencial', 'corporativo', 'industriales'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 font-body font-medium uppercase text-xs tracking-wider border-2 transition-all ${
                  filter === f ? 'bg-terracotta border-terracotta text-white' : 'border-white/20 text-white/70 hover:border-terracotta'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="group relative overflow-hidden border-2 border-white/10 hover:border-terracotta cursor-pointer transition-colors bg-white/5 project-card"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={project.image} alt={project.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="project-card-overlay flex flex-col justify-end p-6">
                    <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="transform transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <div className="text-terracotta text-xs font-body tracking-wider uppercase mb-2 font-bold">{project.category}</div>
                      <h3 className="font-display text-2xl font-bold text-white mb-2">{project.name}</h3>
                      <p className="text-white/80 font-body text-sm line-clamp-2 mb-4">{project.description}</p>
                      <div className="flex gap-4 text-xs font-body text-white/60">
                        <span className="flex items-center bg-white/10 px-2 py-1 rounded"><Calendar className="w-3 h-3 mr-1.5" />{project.year}</span>
                        <span className="flex items-center bg-white/10 px-2 py-1 rounded"><Ruler className="w-3 h-3 mr-1.5" />{project.area} m²</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}

function MaquinariaSection() {
  const [activeMachine, setActiveMachine] = useState(0);

  return (
    <motion.section variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="py-24 bg-concrete mt-[80px] min-h-[calc(100vh-80px)] flex flex-col justify-center pb-32">
      <div className="container mx-auto px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-5xl font-bold text-obsidian mb-16">
          Activos y <span className="text-terracotta">Logística Propia</span>
        </motion.h2>
        <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
          <div className="flex flex-col gap-4">
            {defaultMachinery.map((machine, idx) => (
              <button
                key={machine.id}
                onClick={() => setActiveMachine(idx)}
                className={`p-6 text-left border-2 font-display font-bold text-xl transition-all flex justify-between items-center ${
                  activeMachine === idx ? 'bg-obsidian border-obsidian text-white structural-shadow' : 'bg-white border-obsidian/20 text-obsidian hover:border-terracotta'
                }`}
              >
                {machine.name}
                <motion.div animate={{ x: activeMachine === idx ? 5 : 0 }}>
                  <ChevronRight className={`w-6 h-6 ${activeMachine === idx ? 'text-terracotta' : 'text-obsidian/30'}`} />
                </motion.div>
              </button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMachine}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-obsidian border-2 border-obsidian relative overflow-hidden flex flex-col structural-shadow"
            >
              <div className="absolute inset-0 bg-grid-blueprint opacity-20 pointer-events-none" />
              <div className="relative h-72 md:h-96 overflow-hidden bg-obsidian">
                <motion.img 
                  initial={{ scale: 1.1 }} 
                  animate={{ scale: 1 }} 
                  transition={{ duration: 0.5 }}
                  src={defaultMachinery[activeMachine].image} 
                  loading="lazy" 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" 
                  alt="Máquina" 
                />
                <div className="absolute top-6 right-6 bg-terracotta text-white font-body text-xs uppercase tracking-wider px-4 py-2 font-bold">
                  Estado: {defaultMachinery[activeMachine].status}
                </div>
              </div>
              
              <div className="p-8 md:p-12 relative z-10 grid md:grid-cols-2 gap-8 bg-obsidian border-t-2 border-white/10">
                <div>
                  <div className="text-terracotta text-sm font-body uppercase tracking-wider mb-6 font-bold flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> Especificaciones Técnicas
                  </div>
                  <ul className="space-y-4">
                    {defaultMachinery[activeMachine].specs.map((spec, i) => (
                      <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="text-white/80 font-body text-sm flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-terracotta rounded-full shrink-0 mt-1.5" />{spec}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="md:border-l-2 md:border-white/10 md:pl-8">
                  <div className="text-terracotta text-sm font-body uppercase tracking-wider mb-4 font-bold">Flota Activa</div>
                  <div className="text-7xl font-display font-bold text-white flex items-baseline gap-2">
                    {defaultMachinery[activeMachine].quantity}
                    <span className="text-xl text-white/30 font-body font-normal">unidades</span>
                  </div>
                  <div className="text-white/50 text-sm mt-4 font-body leading-relaxed">Equipos calibrados y operativos con mantenimientos preventivos al día, listos para despliegue en campo.</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function ContactoSection({ onSubmitLead }: { onSubmitLead: (lead: Omit<Lead, 'id' | 'timestamp'>) => void }) {
  const [formState, setFormState] = useState({ nombre: '', empresa: '', email: '', telefono: '', tipoProyecto: '', mensaje: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitLead(formState);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormState({ nombre: '', empresa: '', email: '', telefono: '', tipoProyecto: '', mensaje: '' });
    }, 5000);
  };

  return (
    <motion.section variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="py-24 bg-obsidian border-t-2 border-white/10 mt-[80px] min-h-[calc(100vh-80px)] flex items-center pb-32">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
            Inicie su <span className="text-terracotta">Licitación</span>
          </h2>
          <p className="text-white/60 font-body mb-12 text-lg">Capturamos oportunidades de inversión. Contacte directamente con nuestra gerencia de proyectos para cotizaciones formales y bases técnicas.</p>
          
          <div className="space-y-10">
            <div className="flex gap-6 items-start group">
              <div className="bg-white/5 p-4 rounded-lg group-hover:bg-terracotta/20 transition-colors">
                <MapPin className="w-8 h-8 text-terracotta shrink-0" />
              </div>
              <div>
                <div className="text-white font-display font-bold text-xl mb-1">Centro de Operaciones VyV</div>
                <div className="text-white/60 font-body">Av. Javier Prado Este 4200, Piso 12<br/>San Isidro, Lima, Perú</div>
              </div>
            </div>
            <div className="flex gap-6 items-start group">
              <div className="bg-white/5 p-4 rounded-lg group-hover:bg-terracotta/20 transition-colors">
                <Phone className="w-8 h-8 text-terracotta shrink-0" />
              </div>
              <div>
                <div className="text-white font-display font-bold text-xl mb-1">Líneas Directas (Central)</div>
                <div className="text-white/60 font-body">+51 1 421-8900 <span className="mx-2 text-white/20">|</span> +51 987 654 321</div>
              </div>
            </div>
            <div className="flex gap-6 items-start group">
              <div className="bg-white/5 p-4 rounded-lg group-hover:bg-terracotta/20 transition-colors">
                <Mail className="w-8 h-8 text-terracotta shrink-0" />
              </div>
              <div>
                <div className="text-white font-display font-bold text-xl mb-1">Canales Corporativos</div>
                <a href="mailto:ventas@vyv.pe" className="block text-terracotta hover:text-white transition-colors font-body">ventas@vyv.pe</a>
                <a href="mailto:proyectos@vyv.pe" className="block text-terracotta hover:text-white transition-colors font-body mt-1">proyectos@vyv.pe</a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-concrete p-10 md:p-12 border-2 border-obsidian relative structural-shadow">
          <AnimatePresence>
            {showSuccess && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-concrete/98 z-20 flex flex-col items-center justify-center p-8 text-center border-4 border-green-500">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="bg-green-100 p-4 rounded-full mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </motion.div>
                <h3 className="font-display text-3xl font-bold text-obsidian mb-4">¡Cotización Recibida!</h3>
                <p className="font-body text-obsidian/70 text-lg">Nuestro equipo comercial y de ingeniería evaluará los requerimientos y se contactará a la brevedad.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold font-body uppercase tracking-wider text-obsidian/70">Nombre del Contacto</label>
                <input required type="text" className="w-full p-4 border-2 border-obsidian/20 bg-white font-body focus:border-terracotta outline-none transition-colors" value={formState.nombre} onChange={(e) => setFormState({...formState, nombre: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold font-body uppercase tracking-wider text-obsidian/70">Empresa (Opcional)</label>
                <input type="text" className="w-full p-4 border-2 border-obsidian/20 bg-white font-body focus:border-terracotta outline-none transition-colors" value={formState.empresa} onChange={(e) => setFormState({...formState, empresa: e.target.value})} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold font-body uppercase tracking-wider text-obsidian/70">Correo Corporativo</label>
                <input required type="email" className="w-full p-4 border-2 border-obsidian/20 bg-white font-body focus:border-terracotta outline-none transition-colors" value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold font-body uppercase tracking-wider text-obsidian/70">Teléfono Directo</label>
                <input required type="tel" className="w-full p-4 border-2 border-obsidian/20 bg-white font-body focus:border-terracotta outline-none transition-colors" value={formState.telefono} onChange={(e) => setFormState({...formState, telefono: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold font-body uppercase tracking-wider text-obsidian/70">Naturaleza del Requerimiento</label>
              <select required className="w-full p-4 border-2 border-obsidian/20 bg-white font-body focus:border-terracotta outline-none transition-colors appearance-none cursor-pointer" value={formState.tipoProyecto} onChange={(e) => setFormState({...formState, tipoProyecto: e.target.value})}>
                <option value="" disabled>Seleccione una opción...</option>
                <option value="licitacion_privada">Licitación de Obra Privada</option>
                <option value="desarrollo_inmobiliario">Desarrollo Inmobiliario / Inversión</option>
                <option value="compra_corporativa">Compra de Lotes Corporativos</option>
                <option value="registro_proveedores">Homologación de Proveedores</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold font-body uppercase tracking-wider text-obsidian/70">Alcance Técnico / Comentarios</label>
              <textarea required rows={4} className="w-full p-4 border-2 border-obsidian/20 bg-white font-body focus:border-terracotta outline-none resize-none transition-colors" value={formState.mensaje} onChange={(e) => setFormState({...formState, mensaje: e.target.value})} />
            </div>

            <button type="submit" className="w-full btn-primary flex justify-center items-center gap-3 text-lg py-4">
              Emitir Solicitud Comercial <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
}

// --- CMS PANEL ---
interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (p: Omit<Project, 'id'>) => void;
  projects: Project[];
  onDeleteProject: (id: number) => void;
}

function AdminPanel({ isOpen, onClose, onAddProject, projects, onDeleteProject }: AdminPanelProps) {
  const [tab, setTab] = useState<'add' | 'manage'>('add');
  const [newProject, setNewProject] = useState<{name: string, category: 'residencial' | 'corporativo' | 'industriales', area: string}>({
    name: '', category: 'residencial', area: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setImagePreview(tempUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.area) return;
    
    onAddProject({
      name: newProject.name,
      category: newProject.category,
      area: parseInt(newProject.area, 10),
      image: imagePreview || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      year: new Date().getFullYear(),
      architect: 'Ingeniería VyV (Demo)',
      location: 'Lima, Perú',
      description: 'Proyecto inyectado dinámicamente desde el CMS Local Volátil en modo demostración.',
    });
    
    setNewProject({ name: '', category: 'residencial', area: '' });
    setImagePreview(null);
    setTab('manage');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-[80]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full md:w-96 bg-steel z-[90] border-l-4 border-terracotta shadow-2xl p-6 flex flex-col text-white">
            <div className="flex justify-between items-center mb-6 border-b-2 border-white/10 pb-4 shrink-0">
              <h3 className="font-display font-bold flex items-center gap-2 text-xl"><Settings className="w-5 h-5 text-terracotta"/> Panel CMS Volátil</h3>
              <button onClick={onClose} className="hover:text-terracotta transition-colors bg-white/5 p-2 rounded-full"><X className="w-5 h-5"/></button>
            </div>

            <div className="flex gap-2 mb-6 shrink-0 bg-obsidian p-1 rounded-lg">
              <button onClick={() => setTab('add')} className={`flex-1 py-2 font-body text-sm font-bold rounded transition-colors ${tab === 'add' ? 'bg-terracotta text-white' : 'bg-transparent text-white/50 hover:text-white'}`}>Crear Entidad</button>
              <button onClick={() => setTab('manage')} className={`flex-1 py-2 font-body text-sm font-bold rounded transition-colors ${tab === 'manage' ? 'bg-terracotta text-white' : 'bg-transparent text-white/50 hover:text-white'}`}>Gestión Data</button>
            </div>

            {tab === 'add' ? (
              <form onSubmit={handleSubmit} className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="text-xs font-body text-white/70 uppercase tracking-wider block mb-2">Fotografía Estructural (Local)</label>
                  <div className="w-full h-40 bg-obsidian/50 border-2 border-dashed border-white/20 hover:border-terracotta transition-colors relative flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-lg">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-white/30 mx-auto mb-2" />
                        <span className="text-xs font-body text-white/50">Arrastrar o clic para subir</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-body text-white/70 uppercase tracking-wider block mb-2">Denominación del Proyecto</label>
                  <input required type="text" className="w-full bg-obsidian p-4 outline-none border-2 border-transparent focus:border-terracotta font-body text-sm rounded transition-colors" placeholder="Ej: Torre Empresarial XYZ" value={newProject.name} onChange={(e)=>setNewProject({...newProject, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-body text-white/70 uppercase tracking-wider block mb-2">Superficie Total (m²)</label>
                  <input required type="number" className="w-full bg-obsidian p-4 outline-none border-2 border-transparent focus:border-terracotta font-body text-sm rounded transition-colors" placeholder="Ej: 15000" value={newProject.area} onChange={(e)=>setNewProject({...newProject, area: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-body text-white/70 uppercase tracking-wider block mb-2">Clasificación</label>
                  <select className="w-full bg-obsidian p-4 outline-none border-2 border-transparent focus:border-terracotta font-body text-sm rounded transition-colors appearance-none" value={newProject.category} onChange={(e)=>setNewProject({...newProject, category: e.target.value as 'residencial' | 'corporativo' | 'industriales'})}>
                    <option value="residencial">Sector Residencial</option>
                    <option value="corporativo">Sector Corporativo</option>
                    <option value="industriales">Naves Industriales</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-terracotta text-white font-display font-bold p-4 hover:bg-white hover:text-obsidian transition-colors mt-6 rounded shadow-lg shadow-terracotta/20">
                  Desplegar en Portafolio
                </button>
              </form>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                <AnimatePresence>
                  {projects.map(project => (
                    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={project.id} className="bg-obsidian p-4 border-l-4 border-transparent hover:border-terracotta transition-colors flex justify-between items-center group rounded bg-opacity-80">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <img src={project.image} alt={project.name} className="w-12 h-12 object-cover shrink-0 rounded" />
                        <div className="truncate">
                          <div className="text-sm font-display font-bold text-white truncate">{project.name}</div>
                          <div className="text-xs font-body text-terracotta uppercase font-bold tracking-wider">{project.category}</div>
                        </div>
                      </div>
                      <button onClick={() => onDeleteProject(project.id)} className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded transition-all shrink-0" title="Eliminar del catálogo">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {projects.length === 0 && (
                  <div className="text-center text-white/30 text-sm py-12 font-body flex flex-col items-center">
                    <Building2 className="w-12 h-12 mb-4 opacity-20" />
                    Base de datos vacía.<br/>Ingrese proyectos desde la pestaña 'Crear Entidad'.
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 text-xs font-body text-white/40 pt-4 border-t-2 border-white/10 shrink-0 leading-relaxed bg-obsidian/30 p-4 rounded">
              <strong className="text-terracotta block mb-1">Entorno Sandbox:</strong> 
              
            Toda la manipulación de datos del protafolio es temporal. Refrescar la pagina (F5) restaurará la base de datos a sus valores iniciales debido a que la pagina es una demostracion.En la pagina de produccion el CMS sera mas extendido pudiendo modificar mas secciones.Ojo:Este panel sera solo visible para el dueño de la pagina.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Advanced Image Preloading Strategy
  useEffect(() => {
    const allImagesToPreload = [
      ...heroImages,
      ...defaultProjects.map(p => p.image),
      ...defaultMachinery.map(m => m.image)
    ];

    let loadedImages = 0;
    const totalImages = allImagesToPreload.length;

    allImagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === totalImages) setIsAppLoading(false);
      };
      img.onerror = () => {
        loadedImages++;
        if (loadedImages === totalImages) setIsAppLoading(false);
      };
    });
  }, []);

  const handleAddProject = useCallback((p: Omit<Project, 'id'>) => setProjects(prev => [{ ...p, id: Date.now() }, ...prev]), []);
  const handleDeleteProject = useCallback((id: number) => setProjects(prev => prev.filter(p => p.id !== id)), []);
  const handleSubmitLead = useCallback((lead: Omit<Lead, 'id' | 'timestamp'>) => console.log("Nuevo Lead Capturado Localmente:", lead), []);

  const navItems: { id: TabType; label: string }[] = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'proyectos', label: 'Portafolio' },
    { id: 'activos', label: 'Activos' },
  ];

  const renderActiveSection = () => {
    switch(activeTab) {
      case 'inicio': return <HeroSection key="inicio" setTab={setActiveTab} />;
      case 'nosotros': return <NosotrosSection key="nosotros" />;
      case 'proyectos': return <ProyectosSection key="proyectos" projects={projects} />;
      case 'activos': return <MaquinariaSection key="activos" />;
      case 'contacto': return <ContactoSection key="contacto" onSubmitLead={handleSubmitLead} />;
      default: return <HeroSection key="inicio" setTab={setActiveTab} />;
    }
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-terracotta mb-6" />
        <div className="font-display font-bold text-2xl tracking-widest uppercase mb-2">Precargando Activos</div>
        <div className="font-body text-white/50 text-sm">Garantizando la mejor experiencia visual...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-concrete overflow-x-hidden relative">
      <header className="fixed top-0 w-full z-40 bg-obsidian/95 backdrop-blur-md border-b-2 border-white/10 h-[80px] flex items-center shadow-xl">
        <div className="container mx-auto px-6 flex justify-between items-center w-full">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('inicio')}>
            <div >
              <img src={logoImg} alt="Logo" className="w-20 h-auto" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-white tracking-widest text-xl leading-none">VYV</span>
              <span className="text-terracotta text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Constructora</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-8 relative">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`font-body text-sm font-bold uppercase tracking-wider transition-colors relative py-2 ${activeTab === item.id ? 'text-white' : 'text-white/50 hover:text-terracotta'}`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta" />
                )}
              </button>
            ))}
          </nav>
          
          <button onClick={() => setActiveTab('contacto')} className="hidden md:inline-flex btn-primary py-2.5 px-8 text-sm">
            Licitaciones
          </button>

          <button className="md:hidden text-white hover:text-terracotta transition-colors p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden absolute top-full left-0 w-full bg-obsidian border-b-2 border-white/10 shadow-2xl flex flex-col p-6 gap-2">
              {[...navItems, { id: 'contacto', label: 'Licitaciones' } as const].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id as TabType); setIsMobileMenuOpen(false); }} 
                  className={`p-4 text-left font-body uppercase tracking-wider text-sm font-bold rounded ${activeTab === item.id ? 'bg-terracotta text-white' : 'text-white/70 hover:bg-white/5'}`}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderActiveSection()}
        </AnimatePresence>
      </main>

      <footer className="bg-obsidian py-8 border-t-2 border-white/10 text-center relative z-20 pb-36 md:pb-8">
        <p className="text-white/30 font-body text-sm px-6">© {new Date().getFullYear()} Constructora VYV. Todos los datos son volátiles.Todos los derechos reservados.</p>
      </footer>

      {/* CLAD Services Targeta Flotante */}
      <CladServicesCard />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPanelOpen(true)}
        className="fixed z-[70] flex items-center gap-2 bg-obsidian/90 backdrop-blur-md text-white/80 px-4 py-3 font-body text-xs font-bold rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:bg-terracotta hover:text-white transition-colors border border-white/10"
        style={{ top: '100px', right: '24px' }} /* Repositioned to top-right to avoid clashing with floating card */
      >
        <Wrench className="w-4 h-4" /> Configuración CMS
      </motion.button>

      <AdminPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        onAddProject={handleAddProject}
        projects={projects}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
}

