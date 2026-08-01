import React, { useState, useEffect } from 'react';
import { SEO } from './SEO';

export const CookiePolicyPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true & locked
    analytics: true,
    functional: true
  });

  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookie_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        // Fallback defaults
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px', color: '#EDE6D6', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <SEO 
        title="Cookie Policy & Settings — SummaMind Studio"
        description="Learn how SummaMind Studio uses cookies and manage your interactive cookie preferences."
        canonicalUrl="https://summamind.shop/cookies"
      />

      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          PRIVACY CONTROL & PREFERENCES
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
          Cookie Policy & Preferences
        </h1>
        <p style={{ fontSize: '15px', color: '#A8C3B8', maxWidth: '640px', lineHeight: '1.6' }}>
          This page explains how SummaMind Studio utilizes cookies and local storage tokens to deliver a secure and smooth Reading Room workspace experience.
        </p>
      </div>

      {/* Interactive Cookie Preference Card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #1C2F2B 0%, #152622 100%)', 
          border: '1px solid var(--gold)', 
          borderRadius: '12px', 
          padding: '32px',
          marginBottom: '48px'
        }}
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--gold)', marginTop: 0, marginBottom: '16px', fontWeight: 'normal' }}>
          Manage Your Cookie Preferences
        </h2>

        {savedMessage && (
          <div style={{ background: '#1A3D32', border: '1px solid #4C8A6D', color: '#7FBE9E', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>
            ✓ Your cookie preferences have been updated and saved locally.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
          {/* Necessary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0D1614', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#EDE6D6' }}>Essential & Authentication Cookies</div>
              <div style={{ fontSize: '12px', color: '#A8C3B8', marginTop: '2px' }}>Required for user login sessions, workspace security tokens, and basic page navigation. Cannot be disabled.</div>
            </div>
            <span style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", background: 'var(--gold)', color: '#152622', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
              ALWAYS ACTIVE
            </span>
          </div>

          {/* Analytics */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0D1614', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#EDE6D6' }}>Performance & Analytics Cookies</div>
              <div style={{ fontSize: '12px', color: '#A8C3B8', marginTop: '2px' }}>Help us measure application load speeds, API latency, and document processing efficiency.</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
            </label>
          </div>

          {/* Functional */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0D1614', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#EDE6D6' }}>Functional & Workspace Preference Cookies</div>
              <div style={{ fontSize: '12px', color: '#A8C3B8', marginTop: '2px' }}>Remembers your chosen AI model router (e.g. GPT-4.1 vs Claude Sonnet 5) and custom user display options.</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={preferences.functional}
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{
            background: 'var(--gold)',
            color: '#152622',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 28px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Save Preferences
        </button>
      </div>

      {/* Breakdown Explanations */}
      <div style={{ background: '#152622', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', lineHeight: '1.7', fontSize: '14px', color: '#A8C3B8' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
          Understanding Cookies & Web Tokens
        </h2>
        <p>
          Cookies are small text files placed on your browser when visiting websites. Local storage objects function similarly to preserve user state locally on your device without transmitting data back and forth unnecessarily. SummaMind Studio uses these strictly to enhance UI performance and protect your active session.
        </p>
      </div>
    </div>
  );
};
