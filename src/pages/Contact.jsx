import { useLanguage } from '../hooks/useLanguage';
import { useState } from 'preact/hooks';

export function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        {/* Contact Links */}
        <div class="grid grid-cols-1 gap-6">
          <a 
            href="mailto:info@nomus.film" 
            class="group flex items-center gap-8 p-8 bg-[var(--bg-primary)] border border-brown/10 rounded-[2rem] shadow-lg hover:shadow-xl hover:border-pastelGreen/50 transition-all duration-500"
          >
            <span class="text-3xl group-hover:scale-110 transition-transform">✉️</span>
            <div>
              <h3 class="text-lg font-serif font-bold text-[var(--text-primary)] group-hover:text-pastelGreen transition-colors">{t.emailLabel}</h3>
              <p class="text-sm text-[var(--text-secondary)] font-light">info@nomus.film</p>
            </div>
          </a>

          <a 
            href="https://www.instagram.com/nomusfilm/" 
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-8 p-8 bg-[var(--bg-primary)] border border-brown/10 rounded-[2rem] shadow-lg hover:shadow-xl hover:border-pastelGreen/50 transition-all duration-500"
          >
            <span class="text-3xl group-hover:scale-110 transition-transform">📸</span>
            <div>
              <h3 class="text-lg font-serif font-bold text-[var(--text-primary)] group-hover:text-pastelGreen transition-colors">{t.instagramLabel}</h3>
              <p class="text-sm text-[var(--text-secondary)] font-light">@nomusfilm</p>
            </div>
          </a>

          <a 
            href="tel:+390101234567" 
            class="group flex items-center gap-8 p-8 bg-[var(--bg-primary)] border border-brown/10 rounded-[2rem] shadow-lg hover:shadow-xl hover:border-pastelGreen/50 transition-all duration-500"
          >
            <span class="text-3xl group-hover:scale-110 transition-transform">📞</span>
            <div>
              <h3 class="text-lg font-serif font-bold text-[var(--text-primary)] group-hover:text-pastelGreen transition-colors">{t.phoneLabel}</h3>
              <p class="text-sm text-[var(--text-secondary)] font-light">+39 010 123 4567</p>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div class="bg-[var(--bg-primary)] border border-brown/10 rounded-[3rem] p-10 shadow-xl">
          <form onSubmit={handleSubmit} class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onInput={handleChange}
                required
                placeholder="Your name"
                class="w-full bg-brown/5 border border-brown/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-pastelGreen/50 transition-colors text-[var(--text-primary)]"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onInput={handleChange}
                required
                placeholder="your@email.com"
                class="w-full bg-brown/5 border border-brown/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-pastelGreen/50 transition-colors text-[var(--text-primary)]"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onInput={handleChange}
                required
                rows="4"
                placeholder="Tell us about your project..."
                class="w-full bg-brown/5 border border-brown/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-pastelGreen/50 transition-colors text-[var(--text-primary)] resize-none"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={status === 'sending'}
              class={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 ${
                status === 'success' 
                ? 'bg-pastelGreen text-white' 
                : 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-pastelGreen'
              }`}
            >
              {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
