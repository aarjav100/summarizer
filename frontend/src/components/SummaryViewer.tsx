import React, { useState, useEffect } from 'react';
import { SummaryItem } from '../types';
import ReactMarkdown from 'react-markdown';

interface SummaryViewerProps {
  summaries: SummaryItem[];
  selectedModel: string;
  isLoading: boolean;
  onGenerateNewTypes: (types: string[]) => void;
  activeFileName?: string;
}

export const SummaryViewer: React.FC<SummaryViewerProps> = ({
  summaries,
  selectedModel,
  isLoading,
  onGenerateNewTypes,
  activeFileName
}) => {
  const [selectedLabel, setSelectedLabel] = useState<string>("Short (2–3 lines)");
  const [isScanning, setIsScanning] = useState(false);
  const [generatedFormats, setGeneratedFormats] = useState<string[]>([]);
  const [downloadFormat, setDownloadFormat] = useState<string>("txt");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [quizState, setQuizState] = useState<Record<number, { selectedOption: string | null, revealed: boolean }>>({});

  const primaryFormats = [
    { label: "Short (2–3 lines)", id: "short", icon: "💥" },
    { label: "Medium Summary", id: "medium", icon: "📄" },
    { label: "Detailed Summary", id: "detailed", icon: "📘" },
    { label: "Bullet Points", id: "bullet", icon: "📋" },
    { label: "Key Takeaways", id: "takeaways", icon: "✔️" },
    { label: "MCQs & Quiz", id: "mcq", icon: "🎓" }
  ];

  const overflowFormats = [
    { label: "Extracted Details", id: "extracted_details", icon: "🔎" },
    { label: "Action Items", id: "action_items", icon: "☑️" },
    { label: "Generated FAQ", id: "faq", icon: "❓" },
    { label: "Timeline & Chapters", id: "timeline", icon: "🕒" },
    { label: "Structured JSON", id: "structured_json", icon: "✨" }
  ];

  const formatControls = [...primaryFormats, ...overflowFormats];

  const handleSelectFormat = (label: string) => {
    setSelectedLabel(label);
  };

  const handleGenerate = () => {
    const activeControl = formatControls.find((f) => f.label === selectedLabel);
    if (!activeControl) return;

    setIsScanning(true);
    onGenerateNewTypes([activeControl.id]);

    if (!generatedFormats.includes(activeControl.id)) {
      setGeneratedFormats((prev) => [...prev, activeControl.id]);
    }

    setTimeout(() => {
      setIsScanning(false);
    }, 750);
  };

  const activeControl = formatControls.find((f) => f.label === selectedLabel);
  const isGenerated = activeControl ? summaries.some((s) => s.summary_type === activeControl.id) : false;
  const activeSummary = activeControl ? summaries.find((s) => s.summary_type === activeControl.id) : null;

  useEffect(() => {
    setQuizState({});
  }, [activeSummary]);

  interface MCQQuestion {
    questionNumber: string;
    questionText: string;
    options: { key: string; text: string }[];
    correctAnswer: string;
    explanation: string;
  }

  const parseMCQ = (content: string): MCQQuestion[] => {
    const questions: MCQQuestion[] = [];
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let currentQuestion: MCQQuestion | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      const qMatch = line.match(/^\*\*Q(\d+)\.\s*(.*)\*\*/i) || line.match(/^Q(\d+)\.\s*(.*)/i) || line.match(/^\*\*Q(\d+):\s*(.*)\*\*/i);
      if (qMatch) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          questionNumber: qMatch[1],
          questionText: qMatch[2],
          options: [],
          correctAnswer: "",
          explanation: ""
        };
        continue;
      }
      
      const optMatch = line.match(/^([A-D])\)\s*(.*)/i) || line.match(/^([A-D])\.\s*(.*)/i);
      if (optMatch && currentQuestion) {
        currentQuestion.options.push({
          key: optMatch[1].toUpperCase(),
          text: optMatch[2]
        });
        continue;
      }
      
      const ansMatch = line.match(/^(?:\*\*Answer:\*\*|Answer:)\s*([A-D])(?:\s*[-—:\)]\s*(.*))?/i);
      if (ansMatch && currentQuestion) {
        currentQuestion.correctAnswer = ansMatch[1].toUpperCase();
        currentQuestion.explanation = ansMatch[2] ? ansMatch[2].trim() : "";
        continue;
      }
    }
    
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    return questions;
  };

  const renderMCQ = (content: string) => {
    const questions = parseMCQ(content);
    if (questions.length === 0) {
      return (
        <div style={{ fontSize: '15.5px', lineHeight: '1.8', color: 'var(--ink)' }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '22px', 
          color: 'var(--rust)', 
          marginBottom: '8px',
          fontStyle: 'italic'
        }}>
          Knowledge Check Quiz
        </h3>
        
        {questions.map((q, qIdx) => {
          const state = quizState[qIdx] || { selectedOption: null, revealed: false };
          const isCorrect = state.selectedOption === q.correctAnswer;
          
          return (
            <div 
              key={qIdx}
              style={{
                background: 'rgba(28, 38, 35, 0.03)',
                border: '1px solid rgba(28, 38, 35, 0.1)',
                borderRadius: '8px',
                padding: '20px',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)' }}>
                Q{q.questionNumber || (qIdx + 1)}. {q.questionText}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt) => {
                  const isOptSelected = state.selectedOption === opt.key;
                  let optStyle: React.CSSProperties = {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid rgba(28, 38, 35, 0.1)',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  };
                  
                  if (isOptSelected) {
                    if (state.revealed) {
                      optStyle.borderColor = opt.key === q.correctAnswer ? '#2E7D32' : '#C62828';
                      optStyle.background = opt.key === q.correctAnswer ? '#E8F5E9' : '#FFEBEE';
                      optStyle.color = opt.key === q.correctAnswer ? '#2E7D32' : '#C62828';
                      optStyle.fontWeight = 600;
                    } else {
                      optStyle.borderColor = 'var(--rust)';
                      optStyle.background = 'rgba(167, 62, 47, 0.05)';
                      optStyle.color = 'var(--rust)';
                      optStyle.fontWeight = 600;
                    }
                  } else if (state.revealed && opt.key === q.correctAnswer) {
                    optStyle.borderColor = '#2E7D32';
                    optStyle.background = '#E8F5E9';
                    optStyle.color = '#2E7D32';
                    optStyle.fontWeight = 600;
                  }
                  
                  return (
                    <button
                      key={opt.key}
                      onClick={() => {
                        if (state.revealed) return;
                        setQuizState(prev => ({
                          ...prev,
                          [qIdx]: { ...state, selectedOption: opt.key }
                        }));
                      }}
                      style={optStyle}
                      disabled={state.revealed}
                    >
                      <span style={{
                        display: 'inline-flex',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '1px solid currentColor',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                {!state.revealed ? (
                  <button
                    onClick={() => {
                      setQuizState(prev => ({
                        ...prev,
                        [qIdx]: { ...state, revealed: true }
                      }));
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--rust)',
                      color: 'var(--rust)',
                      fontSize: '11.5px',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontFamily: 'IBM Plex Mono, monospace',
                      cursor: state.selectedOption ? 'pointer' : 'not-allowed',
                      opacity: state.selectedOption ? 1 : 0.5
                    }}
                    disabled={!state.selectedOption}
                  >
                    CHECK ANSWER
                  </button>
                ) : (
                  <span style={{ 
                    fontFamily: 'IBM Plex Mono, monospace', 
                    fontSize: '11.5px', 
                    fontWeight: 'bold',
                    color: isCorrect ? '#2E7D32' : '#C62828'
                  }}>
                    {isCorrect ? '✅ CORRECT' : `❌ INCORRECT (Correct: ${q.correctAnswer})`}
                  </span>
                )}
                
                {state.revealed && (
                  <button
                    onClick={() => {
                      setQuizState(prev => ({
                        ...prev,
                        [qIdx]: { selectedOption: null, revealed: false }
                      }));
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#7A8E8A',
                      fontSize: '11px',
                      fontFamily: 'IBM Plex Mono, monospace',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    RESET
                  </button>
                )}
              </div>
              
              {state.revealed && q.explanation && (
                <div style={{ 
                  marginTop: '6px', 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  background: 'rgba(28, 38, 35, 0.05)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: 'var(--ink)',
                  borderLeft: '3px solid var(--gold)'
                }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stripMarkdown = (md: string) => {
    return md
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^#+\s/gm, "")
      .replace(/^- \[ \]/gm, "☐")
      .replace(/^- /gm, "• ");
  };

  const generatePDF = (content: string, fileName: string) => {
    const opt = {
      margin: 0.5,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    const container = document.createElement('div');
    container.style.padding = '40px';
    container.style.fontFamily = 'Georgia, serif';
    container.style.color = '#1C2623';
    container.style.backgroundColor = '#EDE6D6';
    container.style.lineHeight = '1.6';
    
    let htmlContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '<p></p>')
      .replace(/\n/g, '<br/>');
    
    container.innerHTML = `
      <h2 style="color: #A73E2F; border-bottom: 2px solid #A73E2F; padding-bottom: 10px; font-family: Georgia, serif;">${fileName}</h2>
      <div style="font-size: 14px;">${htmlContent}</div>
    `;

    if ((window as any).html2pdf) {
      (window as any).html2pdf().from(container).set(opt).save();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      document.head.appendChild(script);
      script.onload = () => {
        (window as any).html2pdf().from(container).set(opt).save();
      };
    }
  };

  const generateDocx = (content: string, fileName: string) => {
    let htmlContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '<p></p>')
      .replace(/\n/g, '<br/>');

    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>${fileName}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            strong { color: #A73E2F; }
          </style>
        </head>
        <body>
          <h2>${fileName}</h2>
          <div>${htmlContent}</div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlString], { type: 'application/msword' });
    triggerDownload(blob, `${fileName}.doc`);
  };

  const handleDownload = () => {
    if (!activeSummary) return;
    const rawFileName = activeFileName || "synthesis_output";
    const cleanFileName = rawFileName.replace(/\.[^/.]+$/, "");
    const formattedName = `${cleanFileName}_${activeControl?.id || "summary"}`;

    switch (downloadFormat) {
      case "txt": {
        const blob = new Blob([stripMarkdown(activeSummary.content)], { type: "text/plain" });
        triggerDownload(blob, `${formattedName}.txt`);
        break;
      }
      case "md": {
        const blob = new Blob([activeSummary.content], { type: "text/markdown" });
        triggerDownload(blob, `${formattedName}.md`);
        break;
      }
      case "json": {
        const blob = new Blob([activeSummary.content], { type: "application/json" });
        triggerDownload(blob, `${formattedName}.json`);
        break;
      }
      case "pdf":
        generatePDF(activeSummary.content, formattedName);
        break;
      case "docx":
        generateDocx(activeSummary.content, formattedName);
        break;
    }
  };

  const cleanText = (text: string) => {
    let temp = text;
    // Clean OCR ligatures and glyph artifacts
    temp = temp.replace(/envel-alt|envel-|laptop-code|phone-alt|linkedinlinkedin/gi, '');
    temp = temp.replace(/[♂♀■🔹]/g, '');
    temp = temp.replace(/github\s*/gi, 'github.com/');
    temp = temp.replace(/linkedin\s*/gi, 'linkedin.com/');
    return temp.trim();
  };

  const renderContent = (content: string) => {
    const cleaned = cleanText(content);
    
    // 1. Dynamic Contact Extraction from raw text content
    const emailMatch = cleaned.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const email = emailMatch ? emailMatch[1] : null;

    const phoneMatch = cleaned.match(/(?:phone|tel|mob|contact)?[:\s]?((\+?\d[\d\s-]{9,14}\d))/i);
    const phone = phoneMatch ? phoneMatch[1].trim() : null;

    const linkedinMatch = cleaned.match(/(linkedin\.com\/in\/[a-zA-Z0-9-_\/]+)/i);
    const linkedin = linkedinMatch ? linkedinMatch[0] : null;

    const githubMatch = cleaned.match(/(github\.com\/[a-zA-Z0-9-_\/]+)/i);
    const github = githubMatch ? githubMatch[0] : null;

    const contactChips: { label: string; icon: string; url: string }[] = [];
    if (email) contactChips.push({ label: email, icon: "✉️", url: `mailto:${email}` });
    if (phone) contactChips.push({ label: phone, icon: "📞", url: `tel:${phone}` });
    if (linkedin) contactChips.push({ label: linkedin, icon: "🔗", url: `https://${linkedin}` });
    if (github) contactChips.push({ label: github, icon: "💻", url: `https://${github}` });

    // 2. Remove contact strings from body to prevent duplicate rendering
    let displayBody = cleaned;
    if (email) displayBody = displayBody.replace(email, '');
    if (phone) displayBody = displayBody.replace(phone, '');
    if (linkedin) displayBody = displayBody.replace(linkedin, '');
    if (github) displayBody = displayBody.replace(github, '');
    
    // Clean up empty lines or double separators left after removal
    displayBody = displayBody.replace(/\/\s*\//g, '/').replace(/^\s*[\/-]\s*$/gm, '');

    // 3. Extract Name if it is at the beginning of the text
    const lines = displayBody.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let detectedName = "";
    
    if (lines.length > 0) {
      const firstLine = lines[0].replace(/^[#\s\-\*]+/, '').trim();
      if (firstLine.length < 30 && !firstLine.toLowerCase().includes('page') && !firstLine.toLowerCase().includes('extracted')) {
        detectedName = firstLine;
        displayBody = displayBody.replace(lines[0], '');
      }
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {(detectedName || contactChips.length > 0) && (
          <div style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(28, 38, 35, 0.08)', marginBottom: '10px' }}>
            {detectedName && (
              <h1 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: '30px', 
                color: 'var(--gold)', 
                margin: '0 0 12px 0',
                fontWeight: 'normal',
                letterSpacing: '-0.02em'
              }}>
                {detectedName}
              </h1>
            )}
            
            {contactChips.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {contactChips.map((chip, idx) => (
                  <a 
                    key={idx}
                    href={chip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(237, 230, 214, 0.05)',
                      border: '1px solid rgba(237, 230, 214, 0.15)',
                      borderRadius: '16px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      color: '#EDE6D6',
                      textDecoration: 'none',
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--rust)';
                      e.currentTarget.style.background = 'rgba(237, 230, 214, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(237, 230, 214, 0.15)';
                      e.currentTarget.style.background = 'rgba(237, 230, 214, 0.05)';
                    }}
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ fontSize: '15.5px', lineHeight: '1.8', color: '#EDE6D6' }} className="parsed-summary-content">
          <ReactMarkdown>{displayBody}</ReactMarkdown>
        </div>
      </div>
    );
  };

  const isMoreActive = overflowFormats.some(f => f.label === selectedLabel);

  return (
    <div style={{ flex: 1, position: 'relative' }} className="flex flex-col">
      {/* Desk Headers */}
      <span className="section-label">THE DESK</span>
      <h2 className="section-title text-2xl font-bold font-serif mb-4">Press a Format to Begin Synthesis</h2>

      {/* Main content split: sidebar (left) and canvas (right) */}
      <div style={{ display: 'flex', gap: '24px', width: '100%', alignItems: 'flex-start' }}>
        
        {/* Sidebar: Primary formats + More Formats Dropdown */}
        <div style={{ width: '170px', minWidth: '170px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {primaryFormats.map((ctrl) => {
            const isSelected = selectedLabel === ctrl.label;
            return (
              <button
                key={ctrl.id}
                onClick={() => handleSelectFormat(ctrl.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isSelected ? 'var(--rust)' : 'transparent',
                  border: 'none',
                  color: isSelected ? '#EDE6D6' : '#7A8E8A',
                  padding: '10px 14px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  fontWeight: isSelected ? 600 : 500
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(28, 38, 35, 0.05)';
                    e.currentTarget.style.color = '#EDE6D6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#7A8E8A';
                  }
                }}
              >
                <span>{ctrl.icon}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ctrl.label}</span>
              </button>
            );
          })}

          {/* More Formats Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: '8px',
                background: isMoreActive ? 'var(--rust)' : 'transparent',
                border: 'none',
                color: isMoreActive ? '#EDE6D6' : '#7A8E8A',
                padding: '10px 14px',
                fontSize: '13px',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                fontWeight: isMoreActive ? 600 : 500
              }}
              onMouseEnter={(e) => {
                if (!isMoreActive) {
                  e.currentTarget.style.background = 'rgba(28, 38, 35, 0.05)';
                  e.currentTarget.style.color = '#EDE6D6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMoreActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#7A8E8A';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <span>{isMoreActive ? activeControl?.icon : "📁"}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isMoreActive ? activeControl?.label : "More Formats"}
                </span>
              </div>
              <span>{isMoreOpen ? "▴" : "▾"}</span>
            </button>

            {isMoreOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '105%',
                  left: 0,
                  right: 0,
                  background: 'var(--panel)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 10,
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                {overflowFormats.map((ctrl) => {
                  const isSelected = selectedLabel === ctrl.label;
                  return (
                    <button
                      key={ctrl.id}
                      onClick={() => {
                        handleSelectFormat(ctrl.label);
                        setIsMoreOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: isSelected ? 'var(--rust)' : 'transparent',
                        border: 'none',
                        color: isSelected ? '#EDE6D6' : '#7A8E8A',
                        padding: '8px 12px',
                        fontSize: '12.5px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        width: '100%',
                        fontWeight: isSelected ? 600 : 500
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(28, 38, 35, 0.08)';
                          e.currentTarget.style.color = '#EDE6D6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#7A8E8A';
                        }
                      }}
                    >
                      <span>{ctrl.icon}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ctrl.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Content Canvas Area (Right) */}
        <div style={{ flex: 1 }}>
          <div 
            className="reading-canvas"
            style={{
              position: 'relative',
              padding: '48px 56px',
              width: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden',
              minHeight: '480px'
            }}
          >
            {/* Dynamic Top Accent Bar matching format status */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--rust)' }} />

            {isLoading || isScanning ? (
              <div className="blank-state">
                <span className="icon text-2xl">⏳</span>
                <div className="headline">Scanning RAG ledger...</div>
                <div className="sub text-sm">
                  Drawing relevant vector context from checked document library index chunks.
                </div>
              </div>
            ) : !isGenerated || !activeSummary ? (
              /* Blank Page Empty State with explicit GENERATE OUTPUT Option */
              <div className="blank-state space-y-4">
                <span className="icon text-3xl font-mono text-[#A73E2F]">🗎✃</span>
                <div className="headline text-2xl font-serif font-bold italic">The page is still blank.</div>
                <p className="text-sm font-sans leading-relaxed text-[#5C6773] font-medium max-w-lg">
                  You've stamped <span className="text-[#A73E2F] font-bold">{selectedLabel}</span> as the format. Synthesis will begin once a document is opened from the catalog on the left — the summary will be set here, on the desk, exactly as it will read in your notes.
                </p>

                {/* Explicit Generate Output button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="btn-primary"
                  style={{
                    marginTop: '12px',
                    background: 'var(--rust)',
                    color: '#EDE6D6',
                    border: '1px solid var(--gold)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '12.5px',
                    letterSpacing: '0.04em'
                  }}
                >
                  RUN SYNTHESIS CORE
                </button>
              </div>
            ) : (
              /* Rendered Result Page */
              <div className="reading-result">
                {/* Header row with File Info and Download Toolbar */}
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingBottom: '12px', 
                    borderBottom: '1px solid rgba(28, 38, 35, 0.1)',
                    marginBottom: '24px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EDE6D6' }}>
                    <span style={{ fontSize: '16px' }}>📄</span>
                    <span 
                      style={{ 
                        fontFamily: 'IBM Plex Mono, monospace', 
                        fontSize: '12.5px', 
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        maxWidth: '240px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={activeFileName || "Unnamed Document"}
                    >
                      {activeFileName || "Unnamed Document"}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value)}
                      style={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        color: '#EDE6D6',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '11.5px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="txt">TXT</option>
                      <option value="md">MD</option>
                      <option value="json">JSON</option>
                      <option value="pdf">PDF</option>
                      <option value="docx">DOCX</option>
                    </select>

                    <button
                      onClick={handleDownload}
                      style={{
                        background: 'var(--rust)',
                        border: '1px solid var(--rust)',
                        color: '#EDE6D6',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '11px',
                        padding: '5px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        letterSpacing: '0.02em'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--ink)';
                        e.currentTarget.style.borderColor = 'var(--ink)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--rust)';
                        e.currentTarget.style.borderColor = 'var(--rust)';
                      }}
                    >
                      📥 DOWNLOAD
                    </button>

                    <button
                      onClick={handleGenerate}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(28, 38, 35, 0.2)',
                        color: 'var(--rust)',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '11px',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--rust)';
                        e.currentTarget.style.background = 'rgba(167, 62, 47, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(28, 38, 35, 0.2)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      ↻ RE-RUN
                    </button>
                  </div>
                </div>
                
                <div className="text-content">
                  {activeControl?.id === 'mcq'
                    ? renderMCQ(activeSummary.content)
                    : renderContent(activeSummary.content)}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
