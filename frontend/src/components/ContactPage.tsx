import React, { useState } from 'react';
import { SEO } from './SEO';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatus('error');
      setErrorMessage('Please provide your full name.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!formData.subject.trim()) {
      setStatus('error');
      setErrorMessage('Please provide a subject line.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setStatus('error');
      setErrorMessage('Please write a message of at least 10 characters.');
      return;
    }

    // Simulate successful submission
    setStatus('success');
    setErrorMessage('');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px', color: '#EDE6D6', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <SEO 
        title="Contact Us — SummaMind Studio"
        description="Get in touch with SummaMind Studio. Contact our support and technical engineering team for inquiries, enterprise integrations, or feedback."
        canonicalUrl="https://summamind.shop/contact"
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
          REACH OUR TEAM
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', color: 'var(--gold)', margin: '0 0 16px 0', fontWeight: 'normal' }}>
          Contact SummaMind Studio
        </h1>
        <p style={{ fontSize: '16px', color: '#A8C3B8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Have questions about our AI summarizer, custom Enterprise API deployment, or feedback? Send us a message below.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', marginBottom: '64px' }}>
        {/* Left Column: Contact Form */}
        <div 
          style={{ 
            background: '#152622', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--gold)', marginTop: 0, marginBottom: '20px', fontWeight: 'normal' }}>
            Send Us a Message
          </h2>

          {status === 'success' && (
            <div style={{ background: '#1A3D32', border: '1px solid #4C8A6D', borderRadius: '6px', padding: '16px', marginBottom: '20px', color: '#7FBE9E', fontSize: '14px' }}>
              ✓ <strong>Thank you!</strong> Your message has been dispatched to our engineering desk. We will respond within 24 business hours.
            </div>
          )}

          {status === 'error' && (
            <div style={{ background: '#3B1D1A', border: '1px solid var(--rust)', borderRadius: '6px', padding: '16px', marginBottom: '20px', color: '#E8988D', fontSize: '14px' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: '#A8C3B8', marginBottom: '6px' }}>
                YOUR FULL NAME *
              </label>
              <input 
                type="text" 
                placeholder="Dr. Eleanor Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0D1614',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#EDE6D6',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: '#A8C3B8', marginBottom: '6px' }}>
                EMAIL ADDRESS *
              </label>
              <input 
                type="email" 
                placeholder="eleanor@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0D1614',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#EDE6D6',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: '#A8C3B8', marginBottom: '6px' }}>
                SUBJECT *
              </label>
              <input 
                type="text" 
                placeholder="API Integration / Support Query..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0D1614',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#EDE6D6',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: '#A8C3B8', marginBottom: '6px' }}>
                YOUR MESSAGE *
              </label>
              <textarea 
                rows={5}
                placeholder="Details about your document intelligence request..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0D1614',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#EDE6D6',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button 
              type="submit"
              style={{
                background: 'var(--gold)',
                color: '#152622',
                border: 'none',
                borderRadius: '6px',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                marginTop: '6px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Send Message →
            </button>
          </form>
        </div>

        {/* Right Column: Corporate Info & Map Placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Info Card */}
          <div 
            style={{ 
              background: '#152622', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              padding: '32px' 
            }}
          >
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--gold)', marginTop: 0, marginBottom: '20px', fontWeight: 'normal' }}>
              Direct Contact Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div>
                <div style={{ color: '#7A8E8A', fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace" }}>OFFICIAL EMAIL</div>
                <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 'bold' }}>
                  support@summamind.shop
                </a>
              </div>

              <div>
                <div style={{ color: '#7A8E8A', fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace" }}>HEADQUARTERS LOCATION</div>
                <div style={{ color: '#EDE6D6', marginTop: '2px' }}>
                  SummaMind Studio Labs<br />
                  100 Tech Plaza, Suite 400<br />
                  San Francisco, CA 94107
                </div>
              </div>

              <div>
                <div style={{ color: '#7A8E8A', fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace", marginBottom: '6px' }}>SOCIAL NETWORK CHANNELS</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ background: '#0D1614', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '4px', color: '#A8C3B8', textDecoration: 'none', fontSize: '12px' }}>
                    𝕏 Twitter / X
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ background: '#0D1614', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '4px', color: '#A8C3B8', textDecoration: 'none', fontSize: '12px' }}>
                    in LinkedIn
                  </a>
                  <a href="https://github.com" target="_blank" rel="noreferrer" style={{ background: '#0D1614', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '4px', color: '#A8C3B8', textDecoration: 'none', fontSize: '12px' }}>
                    💻 GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Placeholder */}
          <div 
            style={{ 
              background: '#152622', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              overflow: 'hidden',
              height: '240px',
              position: 'relative'
            }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'radial-gradient(circle at center, #1C2F2B 0%, #0D1614 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--gold)', marginBottom: '4px' }}>
                San Francisco Research Facility
              </div>
              <div style={{ fontSize: '12px', color: '#7A8E8A', fontFamily: "'IBM Plex Mono', monospace" }}>
                37.7749° N, 122.4194° W · GOOGLE MAPS INTERACTIVE NODE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
