import { useEffect, useRef } from 'react';

export function useScrollReveal(selector = '.reveal', deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, ...deps]);

  return containerRef;
}
