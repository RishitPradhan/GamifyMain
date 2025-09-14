import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const GeminiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [winPos, setWinPos] = useState({ left: 0, top: 0 });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, offX: 0, offY: 0, moved: false, mode: 'icon', winOffX: 0, winOffY: 0 });
  const WIN_W = 320; // slightly wider for comfort
  const WIN_H = 540; // keep height tall for usability

  // Replace with your actual Gemini API key
  const GEMINI_API_KEY = 'AIzaSyCTgrClxS1vOPTi2QBEz0xk-TIgUf2E0BE';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Debug: confirm mounting and API key presence (masked)
    try {
      const masked = (typeof GEMINI_API_KEY === 'string' && GEMINI_API_KEY.length > 8)
        ? GEMINI_API_KEY.slice(0, 4) + '...' + GEMINI_API_KEY.slice(-3)
        : '(unset)';
      // eslint-disable-next-line no-console
      console.log('[GeminiChatbot] mounted, key:', masked);
    } catch (_) {}
  }, []);

  // Show help popup after 3 seconds, hide after 5 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (!isOpen) {
        setShowHelpPopup(true);
      }
    }, 3000);

    const hideTimer = setTimeout(() => {
      setShowHelpPopup(false);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // When opening, place window near icon and clamp to viewport
  useEffect(() => {
    if (!isOpen) return;
    const ww = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const wh = typeof window !== 'undefined' ? window.innerHeight : 800;
    // Place the window near the icon while clamping
    const left = Math.min(Math.max(16, pos.x - (WIN_W - 40)), ww - WIN_W - 16);
    const top = Math.min(Math.max(16, pos.y - (WIN_H - 80)), wh - WIN_H - 16);
    setWinPos({ left, top });
  }, [isOpen]);

  // Initialize position bottom-right and restore from localStorage
  useEffect(() => {
    const key = 'gemini_chat_pos_v1';
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      const ix = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const iy = typeof window !== 'undefined' ? window.innerHeight : 800;
      const def = { x: Math.max(16, ix - 80 - 16), y: Math.max(16, iy - 80 - 16) };
      setPos(saved && typeof saved.x === 'number' && typeof saved.y === 'number' ? saved : def);
    } catch {
      // default if parse fails
      const ix = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const iy = typeof window !== 'undefined' ? window.innerHeight : 800;
      setPos({ x: Math.max(16, ix - 80 - 16), y: Math.max(16, iy - 80 - 16) });
    }

    const onResize = () => {
      setPos(p => ({
        x: Math.min(Math.max(8, p.x), window.innerWidth - 80 - 8),
        y: Math.min(Math.max(8, p.y), window.innerHeight - 80 - 8),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Drag handlers for icon button
  const startDrag = (clientX, clientY) => {
    dragRef.current.dragging = true;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.offX = clientX - pos.x;
    dragRef.current.offY = clientY - pos.y;
    dragRef.current.moved = false;
    dragRef.current.mode = 'icon';
  };
  const moveDrag = (clientX, clientY) => {
    if (!dragRef.current.dragging) return;
    if (dragRef.current.mode === 'icon') {
      const nx = clientX - dragRef.current.offX;
      const ny = clientY - dragRef.current.offY;
      const clampedX = Math.min(Math.max(8, nx), window.innerWidth - 80 - 8);
      const clampedY = Math.min(Math.max(8, ny), window.innerHeight - 80 - 8);
      if (Math.abs(clientX - dragRef.current.startX) + Math.abs(clientY - dragRef.current.startY) > 3) {
        dragRef.current.moved = true;
      }
      setPos({ x: clampedX, y: clampedY });
      return;
    }
    // Window drag mode: directly update window position
    const winW = WIN_W, winH = WIN_H;
    const winLeft = Math.min(Math.max(16, clientX - dragRef.current.winOffX), window.innerWidth - winW - 16);
    const winTop = Math.min(Math.max(16, clientY - dragRef.current.winOffY), window.innerHeight - winH - 16);
    if (Math.abs(clientX - dragRef.current.startX) + Math.abs(clientY - dragRef.current.startY) > 3) {
      dragRef.current.moved = true;
    }
    setWinPos({ left: winLeft, top: winTop });
  };
  const endDrag = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    try { localStorage.setItem('gemini_chat_pos_v1', JSON.stringify(pos)); } catch {}
  };

  // Document-level handlers for drag
  const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    endDrag();
  };
  const onTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
    const t = e.touches && e.touches[0];
    if (t) moveDrag(t.clientX, t.clientY);
  };
  const onTouchEnd = () => {
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    endDrag();
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: inputValue
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process your request.';

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If DOM is not available, render nothing (SSR safeguard)
  if (typeof document === 'undefined') return null;

  const ui = (
    <>
      {/* Hard CSS constraints to beat page-level !important rules */}
      <style>{`
        .gcb-window { width: ${WIN_W}px !important; min-width: ${WIN_W}px !important; max-width: ${WIN_W}px !important; box-sizing: border-box !important; }
        .gcb-window, .gcb-window * { max-width: 100% !important; box-sizing: border-box !important; }
        .gcb-window textarea { width: 100% !important; }
        @keyframes helpPopupBounce {
          0% { transform: scale(0.8) translateY(10px); opacity: 0; }
          50% { transform: scale(1.05) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Help Popup */}
      {!isOpen && showHelpPopup && (
        <div
          style={{
            position: 'fixed',
            left: pos.x - 60,
            top: pos.y - 60,
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '2px solid #6366f1',
            borderRadius: '16px',
            padding: '12px 16px',
            color: '#00ff88',
            fontSize: '14px',
            fontFamily: 'VT323, monospace',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(0, 255, 136, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.3)',
            zIndex: 2147483646,
            animation: 'helpPopupBounce 0.5s ease-out',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🤖</span>
            <span>How can I help you?</span>
          </div>
          {/* Arrow pointing to chatbot */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #6366f1'
            }}
          />
        </div>
      )}

      {/* Floating Icon */}
      {!isOpen && (
        <button
          onClick={() => {
            if (!dragRef.current.moved) {
              setIsOpen(true);
              setShowHelpPopup(false); // Hide popup when opening chat
            }
          }}
          onMouseDown={(e) => { startDrag(e.clientX, e.clientY); document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); }}
          onTouchStart={(e) => { const t=e.touches[0]; startDrag(t.clientX, t.clientY); document.addEventListener('touchmove', onTouchMove, {passive:false}); document.addEventListener('touchend', onTouchEnd); }}
          onMouseEnter={() => setShowHelpPopup(false)} // Hide popup on hover
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'radial-gradient(80% 80% at 30% 30%, #a78bfa, #7c3aed)',
            boxShadow: '0 12px 34px rgba(124,58,237,0.55), 0 0 0 4px rgba(124,58,237,0.25), 0 0 0 6px rgba(34,211,238,0.12)',
            color: 'white',
            display: 'grid',
            placeItems: 'center',
            cursor: 'grab',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 2147483647,
          }}
        >
          {/* Assistant icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="3"/>
            <rect x="5" y="9" width="14" height="10" rx="5"/>
            <path d="M8 22h8"/>
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="gcb-window"
          onMouseDown={(e) => {
            // Begin drag if started on header area (we also set handler on header container)
            if (e.target && e.currentTarget.contains(e.target)) {
              // no-op: header handles precise start
            }
          }}
          style={{
          position: 'fixed',
          left: winPos.left,
          right: 'auto',
          top: winPos.top,
          width: WIN_W,
          minWidth: WIN_W,
          maxWidth: WIN_W,
          height: WIN_H,
          minHeight: WIN_H,
          maxHeight: WIN_H,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          flex: '0 0 auto',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.92), rgba(17,12,28,0.92))',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 18,
          boxShadow: '0 24px 58px rgba(17,12,28,0.55), 0 0 0 1px rgba(255,255,255,0.06) inset',
          backdropFilter: 'blur(14px)',
          zIndex: 2147483647
        }}>
          {/* Header */}
          <div
            onMouseDown={(e)=>{
              // start window drag from header
              dragRef.current.mode = 'win';
              dragRef.current.dragging = true;
              dragRef.current.startX = e.clientX;
              dragRef.current.startY = e.clientY;
              // current window top-left
              dragRef.current.winOffX = e.clientX - winPos.left;
              dragRef.current.winOffY = e.clientY - winPos.top;
              dragRef.current.moved = false;
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            onTouchStart={(e)=>{
              const t = e.touches && e.touches[0];
              if (!t) return;
              dragRef.current.mode = 'win';
              dragRef.current.dragging = true;
              dragRef.current.startX = t.clientX;
              dragRef.current.startY = t.clientY;
              dragRef.current.winOffX = t.clientX - winPos.left;
              dragRef.current.winOffY = t.clientY - winPos.top;
              dragRef.current.moved = false;
              document.addEventListener('touchmove', onTouchMove, {passive:false});
              document.addEventListener('touchend', onTouchEnd);
            }}
            style={{
            background: 'linear-gradient(90deg, rgba(124,58,237,0.28), rgba(236,72,153,0.22), rgba(34,211,238,0.18))',
            color: '#EDE9FE',
            padding: '10px 12px',
            borderRadius: '18px 18px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'inset 0 -1px 0 rgba(124,58,237,0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 26,
                height: 26,
                background: 'radial-gradient(80% 80% at 30% 30%, #a78bfa, #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="3"/>
                  <rect x="5" y="9" width="14" height="10" rx="5"/>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: 12, letterSpacing: 0.3 }}>AI Assistant</h3>
                <p style={{ margin: 0, color: '#c4b5fd', fontSize: 10 }}>Prompt me anything</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                color: '#e9d5ff',
                background: 'transparent',
                border: 'none',
                padding: 2,
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#fff';
                e.target.style.backgroundColor = 'rgba(124,58,237,0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#e9d5ff';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(17,12,28,0.35), rgba(2,6,23,0.3))'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  maxWidth: '100%',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                }}>
                  {/* Avatars removed in compact mode */}
                  <div style={{
                    padding: '8px 10px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    background: message.role === 'user'
                      ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                      : 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(236,72,153,0.14), rgba(34,211,238,0.12))',
                    color: message.role === 'user' ? '#0b0720' : '#EDE9FE',
                    border: message.role === 'user' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(124, 58, 237, 0.28)',
                    marginLeft: message.role === 'user' ? '8px' : '0',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere'
                  }}>
                    <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.5', whiteSpace: 'pre-wrap', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {message.content}
                    </p>
                    {/* Timestamp hidden in compact mode */}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(90deg, #60a5fa, #2563eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white' }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="5" r="2"/>
                      <path d="M12 7v4"/>
                      <line x1="8" y1="16" x2="8" y2="16"/>
                      <line x1="16" y1="16" x2="16" y2="16"/>
                    </svg>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.16), rgba(236,72,153,0.14))',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(124, 58, 237, 0.3)'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#a78bfa',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#60a5fa',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite 0.1s'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#60a5fa',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite 0.2s'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '8px',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.85), rgba(17,12,28,0.85))',
            borderRadius: '0 0 18px 18px',
            borderTop: '1px solid rgba(124, 58, 237, 0.28)',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  background: 'rgba(124, 58, 237, 0.10)',
                  color: '#EDE9FE',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '8px 10px',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere'
                }}
                rows="2"
                disabled={isLoading}
                wrap="soft"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                style={{
                  background: isLoading || !inputValue.trim() 
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.22))' 
                    : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  color: 'white',
                  padding: '8px 10px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  opacity: isLoading || !inputValue.trim() ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && inputValue.trim()) {
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                </svg>
              </button>
            </div>
            <p style={{ fontSize: 9, color: '#a78bfa', margin: '4px 0 0 0', textAlign: 'center' }}>Powered by Google Gemini AI</p>
          </div>
        </div>
      )}
    </>
  );

  // Use a portal so the widget is never clipped by parent containers
  return createPortal(ui, document.body);
};

export default GeminiChatbot;