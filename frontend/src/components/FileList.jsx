import React from 'react';

function FileList({ files, fetchFiles }) {
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/files/download/${fileId}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  if (files.length === 0) return null;

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid var(--gray-200)',
      overflow: 'hidden',
      marginTop: '24px'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--gray-200)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontWeight: '700',
          fontSize: '15px',
          color: '#1a1a2e'
        }}>
          Uploaded Documents
        </span>
        <span style={{
          background: 'var(--blue-light)',
          color: 'var(--blue-primary)',
          fontSize: '12px',
          fontWeight: '600',
          padding: '2px 10px',
          borderRadius: '20px'
        }}>
          {files.length} files
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead>
            <tr style={{ background: 'var(--gray-100)' }}>
              {['File Name', 'Size', 'Type', 'Upload Date', 'Status', 'Action'].map(h => (
                <th key={h} style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: 'var(--gray-600)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.map((file, i) => (
              <tr key={file._id} style={{
                borderTop: '1px solid var(--gray-200)',
                background: i % 2 === 0 ? 'white' : 'var(--gray-100)'
              }}>
                <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1a1a2e' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📄</span>
                    <span style={{
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block'
                    }}>
                      {file.originalName}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>
                  {formatSize(file.fileSize)}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>
                  <span style={{
                    background: 'var(--blue-light)',
                    color: 'var(--blue-primary)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {file.mimeType.split('/')[1].toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>
                  {formatDate(file.uploadedAt)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: file.status === 'complete' ? '#dcfce7' : '#fee2e2',
                    color: file.status === 'complete' ? '#16a34a' : '#dc2626',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {file.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => handleDownload(file._id, file.originalName)}
                    style={{
                      background: 'var(--blue-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'Livvic'
                    }}
                  >
                    ⬇️ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileList;