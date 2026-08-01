import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer 
      style={{ 
        background: '#090F0D', 
        borderTop: '1px solid var(--border)', 
        padding: '48px 24px 36px 24px', 
        marginTop: '80px',
        color: '#EDE6D6',
        fontFamily: "'IBM Plex Sans', sans-serif"
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '36px',
            marginBottom: '40px'
          }}
        >
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img 
                src="/logo.png" 
                alt="SummaMind Studio Logo" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--gold)'
                }} 
              />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', fontWeight: 'bold' }}>
                SummaMind
              </span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#A8C3B8', margin: 0 }}>
              Multimodal document intelligence sanctuary. Synthesize reports, dense PDFs, images, and audio into grounded knowledge with citation transparency.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: 'var(--gold)', marginTop: 0, marginBottom: '16px', fontWeight: 'normal' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <Link to="/" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/workspace" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  Reading Room Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Help */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: 'var(--gold)', marginTop: 0, marginBottom: '16px', fontWeight: 'normal' }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <Link to="/help" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@summamind.shop" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  support@summamind.shop
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Privacy */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: 'var(--gold)', marginTop: 0, marginBottom: '16px', fontWeight: 'normal' }}>
              Legal & Policy
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <Link to="/privacy-policy" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/cookies" style={{ color: '#A8C3B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#A8C3B8'}>
                  Cookie Policy & Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright banner */}
        <div 
          style={{ 
            borderTop: '1px solid rgba(237, 230, 214, 0.08)', 
            paddingTop: '24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: '#7A8E8A',
            fontFamily: "'IBM Plex Mono', monospace"
          }}
        >
          <div>
            SUMMAMIND STUDIO © {new Date().getFullYear()} · ALL RIGHTS RESERVED
          </div>
          <div>
            SECURED WITH TLS 1.3 · POWERED BY PGVECTOR & MULTIMODAL LLMS
          </div>
        </div>
      </div>
    </footer>
  );
};
