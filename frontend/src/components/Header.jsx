import React, { useState } from 'react';

function Header({ activeTab, setActiveTab, notifications, unreadCount, fetchNotifications }) {
  const [showPanel, setShowPanel] = useState(false);

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/mark-all-read', {
        method: 'PATCH'
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH'
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-200)', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top bar */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        
        {/* Left - Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--blue-primary)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '16px' }}>📄</span>
          </div>
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>SWS AI Document Hub</span>
          <span style={{ background: 'var(--blue-light)', color: 'var(--blue-primary)', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', border: '1px solid var(--blue-border)' }}>LIVE DEMO</span>
        </div>

        {/* Right - Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPanel(!showPanel)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', position: 'relative', padding: '4px' }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '0', right: '0', background: 'var(--error)', color: 'white', fontSize: '10px', fontWeight: '700', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showPanel && (
            <div style={{ position: 'absolute', right: 0, top: '40px', width: '340px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid var(--gray-200)', zIndex: 999 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>Notifications</span>
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--blue-primary)', fontSize: '12px', cursor: 'pointer', fontFamily: 'Livvic', fontWeight: '600' }}>
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '13px' }}>No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} onClick={() => markOneRead(n._id)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-200)', cursor: 'pointer', background: n.isRead ? 'white' : 'var(--blue-light)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '16px' }}>{n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : 'ℹ️'}</span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a2e' }}>{n.message}</p>
                        <p style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '2px' }}>{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      {!n.isRead && <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--blue-primary)', flexShrink: 0, marginTop: '4px' }}></span>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px', display: 'flex', gap: '0' }}>
        {['upload', 'ai'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', fontSize: '14px', fontWeight: '600', fontFamily: 'Livvic', color: activeTab === tab ? 'var(--blue-primary)' : 'var(--gray-600)', borderBottom: activeTab === tab ? '2px solid var(--blue-primary)' : '2px solid transparent' }}
          >
            {tab === 'upload' ? '⬆️ Document Upload' : '🤖 AI Assistant'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Header;