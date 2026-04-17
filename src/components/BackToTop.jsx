import { useState, useEffect } from 'preact/hooks';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      class={`fixed bottom-8 right-8 p-4 bg-pastelGreen text-gray-900 rounded-full shadow-2xl transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      } hover:scale-110 active:scale-95 z-40`}
      aria-label="Back to top"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
