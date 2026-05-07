import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import FileList from './components/FileList';
import AIAssistant from './components/AIAssistant';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [files, setFiles] = useState([]);
  const [ws, setWs] = useState(null);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        const unread = data.notifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  // Fetch files from backend
  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/files');
      const data = await res.json();
      if (data.success) setFiles(data.files);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    }
  }, []);

  // WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'BULK_UPLOAD_COMPLETE') {
        fetchNotifications();
        fetchFiles();
        // Show toast
        const toast = document.getElementById('ws-toast');
        if (toast) {
          toast.textContent = `✅ ${data.message}`;
          toast.style.display = 'block';
          setTimeout(() => { toast.style.display = 'none'; }, 4000);
        }
      }
    };

    socket.onclose = () => console.log('WebSocket disconnected');
    setWs(socket);

    return () => socket.close();
  }, [fetchNotifications]);

  // Initial data fetch
  useEffect(() => {
    fetchNotifications();
    fetchFiles();
  }, [fetchNotifications, fetchFiles]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-100)' }}>
      {/* WebSocket Toast */}
      <div id="ws-toast" style={{
        display: 'none',
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#16a34a',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        fontFamily: 'Livvic',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
      </div>

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        unreadCount={unreadCount}
        fetchNotifications={fetchNotifications}
      />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
        {activeTab === 'upload' && (
          <>
            <UploadZone fetchFiles={fetchFiles} fetchNotifications={fetchNotifications} />
            <FileList files={files} fetchFiles={fetchFiles} />
          </>
        )}
        {activeTab === 'ai' && <AIAssistant />}
      </main>
    </div>
  );
}

export default App;