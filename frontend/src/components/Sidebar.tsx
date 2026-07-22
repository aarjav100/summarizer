import React, { useState } from 'react';
import { Project, FileItem } from '../types';

interface SidebarProps {
  projects: Project[];
  selectedProject: string;
  onSelectProject: (id: string) => void;
  files: FileItem[];
  selectedFile: FileItem | null;
  onSelectFile: (file: FileItem) => void;
  onToggleFavorite: (fileId: string) => void;
  onOpenUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  files,
  selectedFile,
  onSelectFile,
  onToggleFavorite,
  onOpenUpload
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const activeProjectObj = projects.find((p) => p.id === selectedProject) || projects[0];

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.filename.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'favorites') return matchesSearch && f.is_favorite;
    return matchesSearch;
  });

  const getBadgeType = (type: FileItem['file_type']) => {
    return type.toUpperCase();
  };

  return (
    <div style={{ flex: 1 }} className="flex flex-col">
      {/* Catalog Title */}
      <span className="section-label">CARD CATALOG</span>
      <h2 className="section-title">Your Documents</h2>

      {/* Workspace Selector Row */}
      <div className="workspace-container">
        <div className="workspace-select-row flex items-center gap-2">
          <span>📁</span>
          <select
            value={selectedProject}
            onChange={(e) => onSelectProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="search-container">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search documents & URLs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Pill Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Files ({files.length})
        </button>
        <button
          className={activeTab === 'favorites' ? 'active' : ''}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
      </div>

      {/* Document Group Header */}
      <span className="section-label">
        DRAWER — {activeProjectObj ? activeProjectObj.name.toUpperCase() : 'VAULT'}
      </span>

      {/* Document Catalog Grid */}
      <div className="document-grid overflow-y-auto max-h-[340px] pr-1">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#556D69] mono">
            No items in drawer.
          </div>
        ) : (
          filteredFiles.map((file) => {
            const isSelected = selectedFile?.id === file.id;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file)}
                className="doc-card"
                style={
                  isSelected
                    ? { outline: '2px solid var(--gold)', transform: 'translateY(-1px)' }
                    : undefined
                }
              >
                <div className="doc-info">
                  <div className="title truncate max-w-[180px]">{file.filename}</div>
                  <div className="meta">
                    {getBadgeType(file.file_type)} · {(file.file_size_bytes / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Selected Tick Indicator */}
                  {isSelected && (
                    <span 
                      style={{ 
                        color: 'var(--rust)', 
                        fontWeight: 'bold', 
                        fontSize: '15px',
                        marginRight: '4px' 
                      }}
                      title="Selected Document Context"
                    >
                      ✔
                    </span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B9C2BE]"></span>
                  <button
                    className={`doc-star ${file.is_favorite ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(file.id);
                    }}
                  >
                    {file.is_favorite ? '★' : '☆'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ingestion Trigger Button */}
      <button className="add-doc-btn" onClick={onOpenUpload}>
        + ADD DOCUMENT TO DRAWER
      </button>
    </div>
  );
};
