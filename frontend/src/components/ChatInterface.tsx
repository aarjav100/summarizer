import React, { useState } from 'react';
import { ChatMessage, FileItem } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, useFullContext: boolean, useFileContext: boolean) => void;
  selectedModel: string;
  selectedFile: FileItem | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  selectedModel,
  selectedFile
}) => {
  const [inputText, setInputText] = useState('');
  const [useAttachedFile, setUseAttachedFile] = useState(true);
  const [isFullContext, setIsFullContext] = useState(false);
  const [shuffledIndex, setShuffledIndex] = useState(0);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim(), isFullContext, useAttachedFile);
      setInputText('');
    }
  };

  const handleSendMessageDirect = (text: string) => {
    onSendMessage(text, isFullContext, useAttachedFile);
  };

  const getQuestionsForFile = (filename?: string) => {
    const fn = filename?.toLowerCase() || '';
    if (fn.includes('resume') || fn.includes('aarjav') || fn.includes('jain')) {
      return [
        "What is the candidate's educational background?",
        "What professional experience is listed in the resume?",
        "What technical skills and tools does the candidate master?",
        "Does the candidate have experience with databases?",
        "What projects has this candidate built?",
        "What is the candidate's name and contact information?",
        "Summarize Aarjav's internship at CodeAlpha."
      ];
    } else if (fn.includes('architecture') || fn.includes('diagram') || fn.includes('rag')) {
      return [
        "What are the core ingestion layers in this system?",
        "What database engine is used for vector indexing?",
        "How is security hardened in this architecture?",
        "What is the pipeline for audio and video files?",
        "Can you explain the pgvector retrieval setup?",
        "Describe the multi-LLM router integration."
      ];
    } else {
      return [
        "What is the overall main subject of this document?",
        "Can you provide a summary of the key takeaways?",
        "What are the primary recommendations or action items?",
        "Are there any specific dates or timelines mentioned?",
        "Who is the main contact person or author?",
        "What core conclusions are presented in this text?"
      ];
    }
  };

  const allQuestions = getQuestionsForFile(selectedFile?.filename);
  const startIndex = (shuffledIndex * 3) % Math.max(1, allQuestions.length);
  const suggestedQuestions = allQuestions.slice(startIndex, startIndex + 3);
  if (suggestedQuestions.length < 3 && allQuestions.length >= 3) {
    suggestedQuestions.push(...allQuestions.slice(0, 3 - suggestedQuestions.length));
  }

  const handleAskRandomQuestion = () => {
    if (allQuestions.length > 0) {
      const randomQ = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      handleSendMessageDirect(randomQ);
    }
  };

  return (
    <div className="ask-drawer">
      {/* Title Header */}
      <div className="ask-drawer-title-group">
        <span className="section-label">
          MARGINALIA
        </span>
        <h2 className="section-title" style={{ marginBottom: '6px' }}>
          Ask the Archivist
        </h2>
        <p className="mono text-[11px] text-[#7A8E8A] tracking-wide" style={{ margin: '0 0 10px 0' }}>
          {selectedModel} · {!useAttachedFile ? 'General Knowledge Mode' : isFullContext ? 'grounded in Full Document Context' : 'grounded in Supabase pgvector'}
        </p>
        <p className="ask-drawer-note">
          Every answer is annotated with the exact page and passage it came from — like a librarian citing the shelf, not just the book.
        </p>
      </div>

      {/* Options Bar, File Status, and Grounding Selector */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(237, 230, 214, 0.05)' }}>
        {selectedFile ? (
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer', 
            fontSize: '11px', 
            color: 'var(--gold)', 
            fontFamily: "'Courier New', Courier, monospace", 
            background: 'rgba(212, 175, 55, 0.06)', 
            padding: '4px 10px', 
            borderRadius: '4px', 
            border: '1px solid rgba(212, 175, 55, 0.2)',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={useAttachedFile}
              onChange={(e) => setUseAttachedFile(e.target.checked)}
              style={{ accentColor: 'var(--gold)', cursor: 'pointer' }}
            />
            <span>📎 Attached: {selectedFile.filename}</span>
          </label>
        ) : (
          <span style={{ fontSize: '11px', color: '#7A8E8A', fontStyle: 'italic' }}>
            No file selected. Chat operates in General Assistant mode.
          </span>
        )}

        {/* Cut or Not: Chunking settings (only shown if Use Attached File is active) */}
        {selectedFile && useAttachedFile && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: '#EDE6D6' }}>
            <input
              type="checkbox"
              checked={isFullContext}
              onChange={(e) => setIsFullContext(e.target.checked)}
              style={{ accentColor: 'var(--gold)', cursor: 'pointer' }}
            />
            <span>⚡ Feed Entire Document (Bypass pgvector RAG)</span>
          </label>
        )}
      </div>

      {/* Suggested Questions */}
      {selectedFile && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {suggestedQuestions.map((q, qIdx) => (
            <button
              key={qIdx}
              type="button"
              onClick={() => handleSendMessageDirect(q)}
              className="suggested-q-pill"
              style={{
                background: 'rgba(237, 230, 214, 0.04)',
                color: '#CFD9D6',
                border: '1px solid rgba(237, 230, 214, 0.08)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'IBM Plex Sans', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                e.currentTarget.style.borderColor = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(237, 230, 214, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(237, 230, 214, 0.08)';
              }}
            >
              💡 {q}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShuffledIndex((prev) => prev + 1)}
            className="suggested-q-pill"
            style={{
              background: 'rgba(237, 230, 214, 0.08)',
              color: 'var(--gold)',
              border: '1px solid var(--gold)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              fontFamily: "'IBM Plex Sans', sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.color = '#152622';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(237, 230, 214, 0.08)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
          >
            🎲 Suggest Another
          </button>
          <button
            type="button"
            onClick={handleAskRandomQuestion}
            className="suggested-q-pill"
            style={{
              background: 'rgba(212, 175, 55, 0.12)',
              color: 'var(--gold)',
              border: '1px solid var(--gold)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              fontFamily: "'IBM Plex Sans', sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.color = '#152622';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
          >
            🎲 Ask Random Question
          </button>
        </div>
      )}

      {/* Messages / Archivist Log Box */}
      <div style={{ marginBottom: '24px' }}>
        {messages.length === 0 ? (
          /* Default Archivist Box */
          <div className="archivist-box">
            <span className="archivist-box-label">
              ARCHIVIST
            </span>
            <p className="archivist-box-text">
              Ask anything about your document — I'll answer with the page and line it came from.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {messages.map((msg) => {
              const isAssistant = msg.sender !== 'user';
              let directAnswer = msg.content;
              let extractedDetail = '';

              if (isAssistant && msg.content.includes('EXTRACTED_DETAIL:')) {
                const parts = msg.content.split('EXTRACTED_DETAIL:');
                directAnswer = parts[0].replace('DIRECT_ANSWER:', '').trim();
                extractedDetail = parts[1].trim();
              } else if (isAssistant && msg.content.includes('DIRECT_ANSWER:')) {
                directAnswer = msg.content.replace('DIRECT_ANSWER:', '').trim();
              }

              return (
                <div
                  key={msg.id}
                  className="archivist-box"
                  style={{
                    borderLeft: msg.sender === 'user' ? '4px solid var(--border)' : '4px solid var(--gold)',
                    marginBottom: '16px'
                  }}
                >
                  <span className="archivist-box-label" style={{ color: msg.sender === 'user' ? '#7A8E8A' : 'var(--gold)' }}>
                    {msg.sender === 'user' ? 'USER QUERY' : 'ARCHIVIST'}
                  </span>
                  
                  {msg.sender === 'user' ? (
                    <div className="archivist-box-text">
                      <p style={{ margin: 0 }}>{msg.content}</p>
                    </div>
                  ) : (
                    <div>
                      {/* Direct Answer Zone */}
                      <div className="direct-answer-zone">
                        <ReactMarkdown>{directAnswer}</ReactMarkdown>
                      </div>

                      {/* Extracted Detail Panel */}
                      {extractedDetail && (
                        <div className="extracted-detail-zone">
                          <div className="extracted-detail-header">GROUNDED ARCHIVAL FINDINGS</div>
                          <div className="extracted-detail-content">
                            <ReactMarkdown>{extractedDetail}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* Citation Footer */}
                      {msg.citations && msg.citations.length > 0 && msg.citations[0].chunk_id !== 'general' && (
                        <div className="citation-footer-zone">
                          {msg.citations.map((cit, cIdx) => (
                            <div key={cIdx} className="citation-pill-container">
                              <span className="citation-pill">
                                📄 Page {cit.page_number}
                              </span>
                              <div className="citation-tooltip">
                                <span className="mono text-[10px] text-[#A8C3B8] block mb-1">
                                  SOURCE EXTRACT (PAGE {cit.page_number})
                                </span>
                                <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.5' }}>
                                  {cit.source_text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input Capsule Bar */}
      <form onSubmit={handleSend} className="ask-input-form">
        <input
          type="text"
          placeholder="Ask a question about this document..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="ask-input"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="ask-button"
        >
          <span>➤</span>
        </button>
      </form>
    </div>
  );
};
