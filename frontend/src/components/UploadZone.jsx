import React, { useState, useRef } from 'react';
import axios from 'axios';

function UploadZone({ fetchFiles, fetchNotifications }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileProgresses, setFileProgresses] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const [bulkToast, setBulkToast] = useState('');
  const fileInputRef = useRef();

  const handleFiles = async (selectedFiles) => {
    const filesArray = Array.from(selectedFiles);
    if (filesArray.length === 0) return;

    // Initialize progress for each file
    const initialProgresses = filesArray.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      progress: 0,
      status: 'uploading'
    }));
    setFileProgresses(initialProgresses);

    // Bulk upload logic
    if (filesArray.length > 3) {
      setIsBulk(true);
      setBulkToast(`Upload in progress — processing ${filesArray.length} files in background.`);
    } else {
      setIsBulk(false);
      setBulkToast('');
    }

    // Upload files
    const formData = new FormData();
    filesArray.forEach(file => formData.append('files', file));

    try {
      await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFileProgresses(prev =>
            prev.map(f => ({ ...f, progress: percent, status: percent === 100 ? 'complete' : 'uploading' }))
          );
        }
      });

      setFileProgresses(prev => prev.map(f => ({ ...f, progress: 100, status: 'complete' })));
      fetchFiles();
      fetchNotifications();

      if (filesArray.length <= 3) {
        setTimeout(() => setFileProgresses([]), 3000);
      }

    } catch (err) {
      setFileProgresses(prev => prev.map(f => ({ ...f, status: 'failed' })));
      console.error(err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const getStatusColor = (status) => {
    if (status === 'complete') return '#16a34a';
    if (status === 'failed') return '#dc2626';
    return 'var(--blue-primary)';
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Info Banner */}
      <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '16px' }}>ℹ️</span>
        <p style={{ fontSize: '13px', color: 'var(--blue-primary)', lineHeight: '1.5' }}>
          <strong>Upload 1–3 files</strong> to see individual per-file progress bars. Upload <strong>4 or more files</strong> to trigger the bulk notification flow.
        </p>
      </div>

      {/* Bulk Toast Banner */}
      {bulkToast && (
        <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', fontWeight: '600', color: '#854d0e' }}>
          ⏳ {bulkToast}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--blue-primary)' : 'var(--gray-200)'}`,
          borderRadius: '12px',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'var(--blue-light)' : 'white',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ width: '56px', height: '56px', background: 'var(--gray-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
          📄
        </div>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '6px' }}>
          Drop files here or click to browse
        </p>
        <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '16px' }}>
          Any file type · Up to 20 MB per file
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Single file', 'Bulk upload', 'Try 4+ files to trigger notifications'].map((label, i) => (
            <span key={i} style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--gray-200)', fontSize: '12px', fontWeight: '500', background: i === 2 ? 'var(--blue-light)' : 'white', color: i === 2 ? 'var(--blue-primary)' : 'var(--gray-600)' }}>
              {label}
            </span>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* Per File Progress Bars */}
      {fileProgresses.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {fileProgresses.map((file, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>📄 {file.name}</span>
                <span style={{ fontSize: '12px', color: getStatusColor(file.status), fontWeight: '600' }}>
                  {file.status === 'complete' ? '✅ Complete' : file.status === 'failed' ? '❌ Failed' : `${file.progress}%`}
                </span>
              </div>
              <div style={{ background: 'var(--gray-200)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${file.progress}%`, background: getStatusColor(file.status), borderRadius: '4px', transition: 'width 0.3s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{file.size}</span>
                <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{file.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadZone;