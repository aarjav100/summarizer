import React, { useState, useRef } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newFile: any) => void;
  projectId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'https://summamind-backend.onrender.com');

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  projectId
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'text'>('file');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let type: 'pdf' | 'image' | 'video' | 'audio' | 'url' | 'text' = 'pdf';
    let name = 'Document';
    let size = 1200;

    if (activeTab === 'file' && selectedFile) {
      name = selectedFile.name;
      size = selectedFile.size;
      const fileType = selectedFile.type.toLowerCase();
      if (fileType.includes('image')) type = 'image';
      else if (fileType.includes('video')) type = 'video';
      else if (fileType.includes('audio') || fileType.includes('mp3') || fileType.includes('wav')) type = 'audio';
      else if (fileType.includes('pdf')) type = 'pdf';
    } else if (activeTab === 'url') {
      type = 'url';
      name = urlInput || 'https://arxiv.org/abs/paper';
    } else if (activeTab === 'text') {
      type = 'text';
      name = 'Pasted_Manuscript.txt';
      size = textInput.length;
    }

    // Call simulated API upload
    const formData = new FormData();
    if (activeTab === 'file' && selectedFile) {
      formData.append('file', selectedFile);
    }
    formData.append('project_id', projectId);
    formData.append('file_type', type);
    if (urlInput) formData.append('source_url', urlInput);
    if (textInput) formData.append('text_content', textInput);

    fetch(`${API_BASE_URL}/api/v1/files/upload`, {
      method: 'POST',
      body: formData
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.detail || `Upload failed with status ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsUploading(false);
        onUploadSuccess(data);
        onClose();
      })
      .catch((err) => {
        setIsUploading(false);
        // Show error to the user so they know the upload didn't persist
        alert(`Upload error: ${err.message || 'Could not save file. Please check the backend connection.'}`);
        console.error('Upload failed:', err);
      });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(9, 14, 13, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--panel)',
          border: '2px solid var(--border)',
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Head */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between'
          }}
          className="flex justify-between"
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '20px' }}>📥</span>
            <span
              className="serif"
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#EDE6D6' }}
            >
              Add New Document Source
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#7A8E8A',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'flex',
            background: '#0C1513',
            borderBottom: '1px solid var(--border)',
            padding: '4px'
          }}
        >
          <button
            onClick={() => setActiveTab('file')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: activeTab === 'file' ? 'var(--panel)' : 'transparent',
              color: activeTab === 'file' ? 'var(--gold)' : '#7A8E8A',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            📁 UPLOAD FILE / IMAGE
          </button>
          <button
            onClick={() => {
              setActiveTab('url');
              setSelectedFile(null);
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: activeTab === 'url' ? 'var(--panel)' : 'transparent',
              color: activeTab === 'url' ? 'var(--gold)' : '#7A8E8A',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🔗 WEB LINK / URL
          </button>
          <button
            onClick={() => {
              setActiveTab('text');
              setSelectedFile(null);
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: activeTab === 'text' ? 'var(--panel)' : 'transparent',
              color: activeTab === 'text' ? 'var(--gold)' : '#7A8E8A',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ✍️ PLAIN TEXT
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {activeTab === 'file' && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: dragActive ? '2px dashed var(--gold)' : '2px dashed var(--border)',
                background: dragActive ? 'rgba(184, 150, 110, 0.05)' : '#0C1513',
                borderRadius: '6px',
                padding: '36px 20px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="application/pdf,image/*,audio/*,video/*,text/plain"
              />

              {selectedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '32px' }}>✅</span>
                  <span className="mono" style={{ fontSize: '13.5px', color: '#EDE6D6', fontWeight: 'bold' }}>
                    {selectedFile.name}
                  </span>
                  <span className="mono" style={{ fontSize: '11px', color: '#7A8E8A' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '32px' }}>📂</span>
                  <div>
                    <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#EDE6D6', display: 'block' }}>
                      Drag and drop your file here
                    </span>
                    <span style={{ fontSize: '11px', color: '#7A8E8A', display: 'block', marginTop: '4px' }}>
                      Supports PDFs, PNG, JPG, MP3, WAV, MP4 (Up to 50MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    style={{
                      background: 'var(--panel)',
                      border: '1px solid var(--border)',
                      padding: '6px 16px',
                      color: 'var(--gold)',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      marginTop: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Browse Local Storage
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="mono" style={{ fontSize: '11px', color: '#7A8E8A', fontWeight: 'bold' }}>
                WEB ADDRESS / URL SOURCE
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/article or https://youtube.com/watch?v=..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{
                  background: '#0C1513',
                  border: '1px solid var(--border)',
                  color: '#EDE6D6',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  fontSize: '13.5px',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '11px', color: '#7A8E8A', lineHeight: '1.4' }}>
                The archivist will crawl the address, extract semantic text, and generate vector embeddings.
              </span>
            </div>
          )}

          {activeTab === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="mono" style={{ fontSize: '11px', color: '#7A8E8A', fontWeight: 'bold' }}>
                RAW NOTE MANUSCRIPT
              </label>
              <textarea
                rows={6}
                required
                placeholder="Paste raw notes, document body text, or script transcripts here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                style={{
                  background: '#0C1513',
                  border: '1px solid var(--border)',
                  color: '#EDE6D6',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  fontSize: '13.5px',
                  outline: 'none',
                  fontFamily: 'monospace',
                  resize: 'none'
                }}
              />
            </div>
          )}

          {/* Action Row */}
          <div
            style={{
              marginTop: '24px',
              borderTop: '1px solid var(--border)',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#7A8E8A',
                fontSize: '12.5px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || (activeTab === 'file' && !selectedFile)}
              className="btn-primary"
              style={{
                opacity: isUploading || (activeTab === 'file' && !selectedFile) ? 0.5 : 1
              }}
            >
              {isUploading ? 'INDEXING SOURCE...' : 'ADD TO DRAWER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
