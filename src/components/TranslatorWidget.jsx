import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TranslatorWidget.css';

// No local list; we let Google render its default select (restricted via includedLanguages)

export default function TranslatorWidget() {
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Initialize the official Google Translate widget with default styles
  useEffect(() => {
    const init = () => {
      try {
        if (window.google && window.google.translate) {
          const containerId = 'google_translate_element';
          const container = document.getElementById(containerId);
          if (container && !container.querySelector('.goog-te-combo')) {
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
          }
        }
      } catch (_) {}
    };
    init();
    // Retry briefly in case the script loads a bit later
    const interval = setInterval(init, 800);
    const timeout = setTimeout(() => clearInterval(interval), 6000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  return (
    <div ref={dropdownRef}>
      <div id="google_translate_element" />
    </div>
  );
}
