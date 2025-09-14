import React from 'react';

export default function NetworkStatusIndicator() {
  const [online, setOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (online) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 12, right: 12, zIndex: 1000,
      background: 'rgba(27,18,51,0.9)', color: '#fff', padding: '8px 12px',
      borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
      border: '1px solid #3b1747'
    }}>
      🔌 You are offline. Changes will sync when back online.
    </div>
  );
}
