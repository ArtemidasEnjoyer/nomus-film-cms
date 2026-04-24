import { useLanguage } from '../hooks/useLanguage';
import { useArticles } from '../hooks/useArticles';

export function About() {
  const { t } = useLanguage();
  const { articles } = useArticles();
  
  const partners = articles.value.filter(a => a.type === 'partner');

  const creators = [
    { 
      name: 'Nicolò Sanfilippo', 
      role: 'Director & Founder', 
      img: '/assets/nicolo_sanfilippo.png',
      handle: '@sanfilipponicolo',
      link: 'https://www.instagram.com/sanfilipponicolo/',
      bio: t.bioNicolo
    },
    { 
      name: 'Vinci Cardona', 
      role: 'Screenwriter & Comic Artist', 
      img: '/assets/vinci_cardona.png',
      handle: '@vincicardona',
      link: 'https://www.instagram.com/vincicardona/',
      bio: t.bioVinci
    },
  ];

  const services = [t.service1, t.service2, t.service3, t.service4];

  return (
    <div class="max-w-7xl mx-auto px-4 py-32 space-y-48">
      {/* Studio Section */}
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div class="space-y-10 opacity-0 animate-fade-in-up">
          <div class="space-y-2">
            <p class="font-calligraphy text-4xl text-pastelGreen">{t.storySubtitle}</p>
            <h1 class="text-6xl md:text-8xl font-black font-serif text-[var(--text-primary)] leading-none tracking-tighter">{t.storyTitle}</h1>
          </div>
          <div class="space-y-8 text-xl text-[var(--text-secondary)] font-light leading-relaxed">
            <p>{t.storyDesc1}</p>
            <p>{t.storyDesc2}</p>
            
            <div class="pt-8 space-y-6">
               <h3 class="text-2xl font-serif font-bold text-[var(--text-primary)]">{t.servicesTitle}</h3>
               <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {services.map((s, idx) => (
                   <li key={idx} class="flex items-center gap-3 text-sm font-bold uppercase tracking-widest bg-brown/5 p-4 rounded-2xl border border-brown/5 opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                     <span class="text-pastelGreen text-xl">✦</span> {s}
                   </li>
                 ))}
               </ul>
            </div>

            <p class="italic border-l-4 border-pastelGreen pl-8 py-6 bg-brown/5 rounded-r-3xl font-serif text-2xl text-[var(--text-primary)] shadow-sm opacity-0 animate-fade-in-up-delay-2">
              {t.storyQuote}
            </p>
          </div>
        </div>
        <div class="relative group opacity-0 animate-slide-in-right">
          <div class="absolute inset-0 border-2 border-pastelGreen rounded-[3rem] translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
          <img 
            src="/assets/portfolio/NomusPortfolio-001.jpg" 
            alt="NomusFilm Cinematic Shot" 
            class="rounded-[3rem] shadow-2xl object-cover w-full h-[800px] border border-brown/10"
          />
        </div>
      </section>

      {/* Creators Section */}
      <section class="space-y-32">
        <h2 class="text-5xl md:text-7xl font-black font-serif text-center tracking-tighter opacity-0 animate-fade-in-up">{t.visionaries}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-24">
          {creators.map((c, idx) => (
            <div key={idx} class="flex flex-col items-center group space-y-8 opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.2 + idx * 0.2}s` }}>
              <a href={c.link} target="_blank" class="relative w-80 h-80 block transition-all duration-700 hover:scale-105">
                <div class="absolute inset-0 bg-pastelGreen/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-1000"></div>
                <img src={c.img} alt={c.name} class="relative z-10 w-full h-full rounded-full object-cover shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 border-4 border-white dark:border-gray-900" />
              </a>
              <div class="text-center space-y-4 max-w-sm">
                <div>
                  <h3 class="text-4xl font-serif font-bold tracking-tight">{c.name}</h3>
                  <p class="text-pastelGreen font-black uppercase tracking-[0.4em] text-[10px] mt-2">{c.role}</p>
                </div>
                <p class="text-sm text-[var(--text-secondary)] font-light leading-relaxed italic">
                  {c.bio}
                </p>
                <a href={c.link} target="_blank" class="block pt-4 text-xs font-black uppercase tracking-widest text-[var(--text-primary)] hover:text-pastelGreen transition-colors underline underline-offset-8 decoration-pastelGreen/30">
                  {c.handle}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
