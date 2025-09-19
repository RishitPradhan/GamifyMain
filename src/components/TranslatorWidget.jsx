import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TranslatorWidget.css';

// No local list; we let Google render its default select (restricted via includedLanguages)

export default function TranslatorWidget() {
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Initialize the official Google Translate widget with default styles
  useEffect(() => {
    const containerId = 'google_translate_element';
    const ensureScript = () => new Promise((resolve) => {
      if (window.google && window.google.translate) return resolve(true);
      // Inject script if missing
      const existing = document.querySelector('script[data-gt-widget]');
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=__gtInit';
      s.async = true;
      s.defer = true;
      s.dataset.gtWidget = '1';
      window.__gtInit = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });

    const init = () => {
      try {
        if (!(window.google && window.google.translate)) return false;
        const container = document.getElementById(containerId);
        if (!container) return false;
        const already = container.querySelector('.goog-te-combo');
        if (already) return true;
        // eslint-disable-next-line no-new
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'as,bn,gu,hi,kn,ml,mr,ne,or,pa,ta,te,ur',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          containerId
        );
        return true;
      } catch (_) { return false; }
    };

    let mounted = true;
    (async () => {
      const ok = await ensureScript();
      if (!mounted) return;
      if (!ok) return; // silently fail if blocked
      // Attempt init repeatedly for a short window in case of slow mount
      let attempts = 0;
      const timer = setInterval(() => {
        attempts++;
        if (init() || attempts > 20) clearInterval(timer);
      }, 250);
    })();

    return () => { mounted = false; };
  }, [location.pathname]);

  return (
    <div ref={dropdownRef} className="translator-widget">
      <div className="translator-shell">
        <div id="google_translate_element" />
      </div>
    </div>
  );
}
