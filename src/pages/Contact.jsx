import { useLanguage } from '../hooks/useLanguage';

export function Contact() {
  const { t } = useLanguage();

  return (
    <div class="max-w-4xl mx-auto px-4 py-32 space-y-24">
      <div class="text-center space-y-6 opacity-0 animate-fade-in-up">
        <p class="font-calligraphy text-4xl text-pastelGreen">{t.contact}</p>
        <h1 class="text-6xl md:text-8xl font-black font-serif text-[var(--text-primary)] leading-none tracking-tighter">
          {t.contactTitle}
        </h1>
        <p class="text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl mx-auto opacity-0 animate-fade-in-up-delay-1">
          {t.contactDesc}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 opacity-0 animate-fade-in-up-delay-2">
        {/* Email Link */}
        <a 
          href="mailto:info@nomus.film" 
          class="group flex flex-col items-center justify-center p-16 bg-[var(--bg-primary)] border border-brown/10 rounded-[3rem] shadow-xl hover:shadow-[0_0_30px_rgba(181,224,167,0.2)] hover:border-pastelGreen/50 transition-all duration-500 hover:-translate-y-2"
        >
          <span class="text-5xl mb-6 group-hover:scale-125 transition-transform duration-500">✉️</span>
          <h3 class="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2 group-hover:text-pastelGreen transition-colors duration-500">
            {t.emailLabel}
          </h3>
          <p class="text-[var(--text-secondary)] font-light">info@nomus.film</p>
        </a>

        {/* Instagram Link */}
        <a 
          href="https://www.instagram.com/nomusfilm/" 
          target="_blank"
          rel="noopener noreferrer"
          class="group flex flex-col items-center justify-center p-16 bg-[var(--bg-primary)] border border-brown/10 rounded-[3rem] shadow-xl hover:shadow-[0_0_30px_rgba(181,224,167,0.2)] hover:border-pastelGreen/50 transition-all duration-500 hover:-translate-y-2"
        >
          <span class="text-5xl mb-6 group-hover:scale-125 transition-transform duration-500">📸</span>
          <h3 class="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2 group-hover:text-pastelGreen transition-colors duration-500">
            {t.instagramLabel}
          </h3>
          <p class="text-[var(--text-secondary)] font-light">@nomusfilm</p>
        </a>

        {/* Phone Link */}
        <a 
          href="tel:+390101234567" 
          class="group flex flex-col items-center justify-center p-16 bg-[var(--bg-primary)] border border-brown/10 rounded-[3rem] shadow-xl hover:shadow-[0_0_30px_rgba(181,224,167,0.2)] hover:border-pastelGreen/50 transition-all duration-500 hover:-translate-y-2"
        >
          <span class="text-5xl mb-6 group-hover:scale-125 transition-transform duration-500">📞</span>
          <h3 class="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2 group-hover:text-pastelGreen transition-colors duration-500">
            {t.phoneLabel}
          </h3>
          <p class="text-[var(--text-secondary)] font-light">+39 010 123 4567</p>
        </a>

        {/* WhatsApp Link */}
        <a 
          href="https://wa.me/393471234567" 
          target="_blank"
          rel="noopener noreferrer"
          class="group flex flex-col items-center justify-center p-16 bg-[var(--bg-primary)] border border-brown/10 rounded-[3rem] shadow-xl hover:shadow-[0_0_30px_rgba(181,224,167,0.2)] hover:border-pastelGreen/50 transition-all duration-500 hover:-translate-y-2"
        >
          <span class="text-5xl mb-6 group-hover:scale-125 transition-transform duration-500">💬</span>
          <h3 class="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2 group-hover:text-pastelGreen transition-colors duration-500">
            {t.whatsappLabel}
          </h3>
          <p class="text-[var(--text-secondary)] font-light">Send a message</p>
        </a>
      </div>
    </div>
  );
}
