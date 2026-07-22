import React, { useState } from 'react';
import { LLMModel, FileItem } from '../types';

export interface UserProfile {
  email: string;
  name: string;
  initials: string;
}

interface HeaderProps {
  view: 'landing' | 'workspace';
  onSelectView: (view: 'landing' | 'workspace') => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  
  // Workspace controls (rendered in workspace view)
  models: LLMModel[];
  selectedModel: string;
  onSelectModel: (id: string) => void;
  files: FileItem[];
  selectedFile: FileItem | null;
  onSelectFile: (file: FileItem) => void;
  onOpenUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  view,
  onSelectView,
  currentUser,
  onOpenLogin,
  onLogout,
  models,
  selectedModel,
  onSelectModel,
  files,
  selectedFile,
  onSelectFile,
  onOpenUpload
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="headbar" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Brand Logo & Name */}
        <div className="brand" onClick={() => onSelectView('landing')} style={{ cursor: 'pointer' }}>
          <div className="brand-badge">SM</div>
          <div className="brand-text">
            <div className="name">The Reading Room</div>
            <div className="tagline">
              SummaMind Studio — Multimodal Document Intelligence
            </div>
          </div>
        </div>

        {/* Middle Navigation Links */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button 
            onClick={() => onSelectView('landing')}
            className={`nav-link-btn ${view === 'landing' ? 'active' : ''}`}
            style={{
              background: 'transparent',
              border: 'none',
              color: view === 'landing' ? 'var(--gold)' : '#A8C3B8',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: view === 'landing' ? 'underline' : 'none',
              transition: 'color 0.2s ease'
            }}
          >
            Home
          </button>
          <button 
            onClick={() => onSelectView('workspace')}
            className={`nav-link-btn ${view === 'workspace' ? 'active' : ''}`}
            style={{
              background: 'transparent',
              border: 'none',
              color: view === 'workspace' ? 'var(--gold)' : '#A8C3B8',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: view === 'workspace' ? 'underline' : 'none',
              transition: 'color 0.2s ease'
            }}
          >
            Workspace
          </button>
        </div>

        {/* Right Authentication Action */}
        <div>
          {currentUser ? (
            <div className="account-dropdown-container" style={{ position: 'relative' }}>
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="brand-badge" 
                style={{ 
                  cursor: 'pointer', 
                  background: 'var(--gold)', 
                  color: '#152622', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  outline: 'none'
                }}
              >
                {currentUser.initials}
              </button>
              
              {menuOpen && (
                <div 
                  className="account-dropdown-menu" 
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '125%',
                    background: '#1C2F2B',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '12px',
                    width: '180px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 100
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#EDE6D6', marginBottom: '2px' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#7A8E8A', marginBottom: '8px', wordBreak: 'break-all' }}>
                    {currentUser.email}
                  </div>
                  <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
                  <button 
                    onClick={() => { setMenuOpen(false); alert('Settings under archival preservation.'); }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#EDE6D6',
                      width: '100%',
                      textAlign: 'left',
                      padding: '6px 0',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ⚙️ Account Settings
                  </button>
                  <button 
                    onClick={() => { setMenuOpen(false); onLogout(); }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#CF8E82',
                      width: '100%',
                      textAlign: 'left',
                      padding: '6px 0',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onOpenLogin}
              className="btn-secondary"
              style={{
                background: 'transparent',
                border: '1px solid rgba(237, 230, 214, 0.3)',
                color: '#EDE6D6',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                padding: '6px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.color = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(237, 230, 214, 0.3)';
                e.currentTarget.style.color = '#EDE6D6';
              }}
            >
              Log In
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls Row (only rendered if in workspace view) */}
      {view === 'workspace' && (
        <div className="head-controls" style={{ display: 'flex', justifyContent: 'flex-start', gap: '16px', borderTop: '1px solid rgba(237, 230, 214, 0.05)', paddingTop: '10px', marginTop: '4px' }}>
          {/* Model Dropdown Dial */}
          <div className="dial">
            <span>Model —</span>
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Document Selector */}
          <div className="dial">
            <span>Existing Documents —</span>
            <select
              value={selectedFile ? selectedFile.id : ''}
              onChange={(e) => {
                const found = files.find((f) => f.id === e.target.value);
                if (found) onSelectFile(found);
              }}
            >
              {files.length === 0 ? (
                <option value="" disabled>No Documents Available</option>
              ) : (
                <>
                  {!selectedFile && <option value="" disabled>Select Document...</option>}
                  {files.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.filename}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Primary Ingestion Trigger Action */}
          <button onClick={onOpenUpload} className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
            + Upload Document
          </button>
        </div>
      )}
    </div>
  );
};
