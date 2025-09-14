import React, { useState, useEffect, useRef } from 'react';
import './TranslatorWidget.css';

const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' }
];

// Demo translations for key UI elements
const DEMO_TRANSLATIONS = {
  'Gamify Learning': {
    hi: 'गेमिफाई लर्निंग',
    bn: 'গেমিফাই লার্নিং',
    te: 'గేమిఫై లెర్నింగ్',
    mr: 'गेमिफाई लर्निंग',
    ta: 'கேமிஃபை லர்னிங்',
    ur: 'گیمیفائی لرننگ',
    gu: 'ગેમિફાઈ લર્નિંગ',
    kn: 'ಗೇಮಿಫೈ ಲರ್ನಿಂಗ್',
    ml: 'ഗെയിമിഫൈ ലേണിംഗ്',
    or: 'ଗେମିଫାଇ ଲର୍ନିଂ',
    pa: 'ਗੇਮਿਫਾਈ ਲਰਨਿੰਗ',
    ne: 'गेमिफाई लर्निङ',
    as: 'গেমিফাই লাৰ্নিং'
  },
  'Home': {
    hi: 'होम',
    bn: 'হোম',
    te: 'హోమ్',
    mr: 'होम',
    ta: 'முகப்பு',
    ur: 'ہوم',
    gu: 'હોમ',
    kn: 'ಹೋಮ್',
    ml: 'ഹോം',
    or: 'ହୋମ',
    pa: 'ਹੋਮ',
    ne: 'होम',
    as: 'হোম'
  },
  'Teacher': {
    hi: 'शिक्षक',
    bn: 'শিক্ষক',
    te: 'ఉపాధ్యాయుడు',
    mr: 'शिक्षक',
    ta: 'ஆசிரியர்',
    ur: 'استاد',
    gu: 'શિક્ષક',
    kn: 'ಶಿಕ್ಷಕ',
    ml: 'അധ്യാപകൻ',
    or: 'ଶିକ୍ଷକ',
    pa: 'ਅਧਿਆਪਕ',
    ne: 'शिक्षक',
    as: 'শিক্ষক'
  },
  'Profile': {
    hi: 'प्रोफाइल',
    bn: 'প্রোফাইল',
    te: 'ప్రొఫైల్',
    mr: 'प्रोफाइल',
    ta: 'சுயவிவரம்',
    ur: 'پروفائل',
    gu: 'પ્રોફાઇલ',
    kn: 'ಪ್ರೊಫೈಲ್',
    ml: 'പ്രൊഫൈൽ',
    or: 'ପ୍ରୋଫାଇଲ',
    pa: 'ਪ੍ਰੋਫਾਈਲ',
    ne: 'प्रोफाइल',
    as: 'প্ৰফাইল'
  },
  'Logout': {
    hi: 'लॉगआउट',
    bn: 'লগআউট',
    te: 'లాగ్అవుట్',
    mr: 'लॉगआउट',
    ta: 'வெளியேறு',
    ur: 'لاگ آؤٹ',
    gu: 'લૉગઆઉટ',
    kn: 'ಲಾಗ್ಔಟ್',
    ml: 'ലോഗൗട്ട്',
    or: 'ଲଗଆଉଟ',
    pa: 'ਲਾਗਆਉਟ',
    ne: 'लगआउट',
    as: 'লগআউট'
  }
};

export default function TranslatorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if Google Translate is available
  useEffect(() => {
    const checkGoogleTranslate = () => {
      const googleCombo = document.querySelector('.goog-te-combo');
      if (googleCombo) {
        setDemoMode(false);
        return true;
      }
      return false;
    };

    // Check periodically for Google Translate
    const interval = setInterval(() => {
      if (checkGoogleTranslate()) {
        clearInterval(interval);
      }
    }, 1000);

    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(interval), 10000);

    return () => clearInterval(interval);
  }, []);

  // Apply demo translations to page elements
  const applyDemoTranslations = (langCode) => {
    if (langCode === 'en') {
      // Reset to English
      const brandText = document.querySelector('.brand-text');
      if (brandText) brandText.textContent = 'Gamify Learning';
      
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach((link, index) => {
        if (index === 0) link.textContent = 'Home';
        if (index === 1) link.textContent = 'Teacher';
      });
      
      const profileText = document.querySelector('.profile-text');
      if (profileText) profileText.textContent = 'Profile';
      
      const logoutBtn = document.querySelector('.logout-btn');
      if (logoutBtn) logoutBtn.textContent = 'Logout';
    } else {
      // Apply translations
      const brandText = document.querySelector('.brand-text');
      if (brandText && DEMO_TRANSLATIONS['Gamify Learning'][langCode]) {
        brandText.textContent = DEMO_TRANSLATIONS['Gamify Learning'][langCode];
      }
      
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach((link, index) => {
        if (index === 0 && DEMO_TRANSLATIONS['Home'][langCode]) {
          link.textContent = DEMO_TRANSLATIONS['Home'][langCode];
        }
        if (index === 1 && DEMO_TRANSLATIONS['Teacher'][langCode]) {
          link.textContent = DEMO_TRANSLATIONS['Teacher'][langCode];
        }
      });
      
      const profileText = document.querySelector('.profile-text');
      if (profileText && DEMO_TRANSLATIONS['Profile'][langCode]) {
        profileText.textContent = DEMO_TRANSLATIONS['Profile'][langCode];
      }
      
      const logoutBtn = document.querySelector('.logout-btn');
      if (logoutBtn && DEMO_TRANSLATIONS['Logout'][langCode]) {
        logoutBtn.textContent = DEMO_TRANSLATIONS['Logout'][langCode];
      }
    }
  };

  const handleLanguageSelect = (langCode) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    setIsTranslating(true);
    setIsOpen(false);

    if (demoMode) {
      // Demo mode - apply sample translations
      setTimeout(() => {
        applyDemoTranslations(langCode);
        setCurrentLang(langCode);
        setIsTranslating(false);
      }, 800);
    } else {
      // Real Google Translate mode
      const googleCombo = document.querySelector('.goog-te-combo');
      if (googleCombo) {
        googleCombo.value = langCode;
        googleCombo.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
          setCurrentLang(langCode);
          setIsTranslating(false);
        }, 1000);
      } else {
        setIsTranslating(false);
      }
    }
  };

  const getCurrentLanguage = () => {
    return INDIAN_LANGUAGES.find(lang => lang.code === currentLang) || INDIAN_LANGUAGES[0];
  };

  return (
    <div className="translator-widget" ref={dropdownRef}>
      {/* Google Translate element - hidden but functional */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <button
        className={`translator-trigger ${isOpen ? 'active' : ''} ${isTranslating ? 'translating' : ''} ${demoMode ? 'demo' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        disabled={isTranslating}
        title={demoMode ? 'Demo Mode - Click to translate navbar elements' : 'Select language'}
      >
        <span className="translator-icon">🌐</span>
        <span className="translator-text">
          {isTranslating ? 'Translating...' : getCurrentLanguage().native}
        </span>
        <span className={`translator-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="translator-dropdown">
          <div className="translator-header">
            <span className="translator-title">Select Language</span>
            {demoMode && (
              <button 
                className="info-btn"
                onClick={() => setShowInfo(!showInfo)}
                title="About Demo Mode"
              >
                ℹ️
              </button>
            )}
          </div>
          
          {demoMode && showInfo && (
            <div className="demo-info">
              <p><strong>🎮 Demo Mode Active</strong></p>
              <p>This translates navbar elements to show the UI in action.</p>
              <p><strong>For full page translation:</strong></p>
              <ul>
                <li>Disable ad blocker for this site</li>
                <li>Refresh the page</li>
                <li>Google Translate will load automatically</li>
              </ul>
            </div>
          )}
          
          <div className="translator-options">
            {INDIAN_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`translator-option ${currentLang === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <span className="lang-native">{lang.native}</span>
                <span className="lang-english">{lang.name}</span>
                {demoMode && lang.code !== 'en' && (
                  <span className="demo-badge">Demo</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
