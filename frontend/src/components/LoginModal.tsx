import React, { useState } from 'react';
import { SignIn, SignUp, useClerk } from '@clerk/clerk-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
}

class ClerkErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("Clerk component failed to render, switching to fallback form:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  let clerkLoaded = false;
  try {
    const clerk = useClerk();
    clerkLoaded = !!(clerk && clerk.loaded);
  } catch {
    clerkLoaded = false;
  }

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const userName = name || email.split('@')[0];
    const userProfile = {
      email,
      name: userName,
      initials: userName.slice(0, 2).toUpperCase(),
    };
    if (onLoginSuccess) {
      onLoginSuccess(userProfile);
    }
    onClose();
  };

  const renderFallbackForm = () => (
    <div style={{ padding: '36px 32px', width: '360px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--gold)', marginBottom: '8px', fontWeight: 'normal' }}>
        {isRegister ? 'Create Account' : 'Welcome Back'}
      </h2>
      <p style={{ fontSize: '13px', color: '#7A8E8A', marginBottom: '24px' }}>
        {isRegister ? 'Register your archivist profile in SummaMind.' : 'Sign in to access your saved summaries & reading room.'}
      </p>

      <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              background: '#1C2F2B',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '12px',
              color: '#EDE6D6',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            background: '#1C2F2B',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '12px',
            color: '#EDE6D6',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            background: '#1C2F2B',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '12px',
            color: '#EDE6D6',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          required
        />

        <button
          type="submit"
          style={{
            background: 'var(--gold)',
            color: '#152622',
            border: 'none',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '8px',
            transition: 'opacity 0.2s ease'
          }}
        >
          {isRegister ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '13px', color: '#7A8E8A' }}>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          onClick={() => setIsRegister(!isRegister)}
          style={{ color: 'var(--gold)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isRegister ? 'Sign In' : 'Register'}
        </span>
      </div>
    </div>
  );

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#152622',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          color: '#EDE6D6',
          fontFamily: "'IBM Plex Sans', sans-serif",
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#7A8E8A',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ✕
        </button>

        {isCustomMode || !clerkLoaded ? (
          renderFallbackForm()
        ) : (
          <ClerkErrorBoundary fallback={renderFallbackForm()}>
            {isRegister ? (
              <SignUp 
                routing="virtual"
                signInUrl="/sign-in"
                appearance={{
                  variables: {
                    colorPrimary: '#D4AF37',
                    colorBackground: '#152622',
                    colorText: '#EDE6D6',
                    colorInputBackground: '#1C2F2B',
                    colorInputText: '#EDE6D6',
                    colorTextSecondary: '#7A8E8A',
                    colorBorder: '#2A4D44'
                  },
                  elements: {
                    card: { background: '#152622', border: 'none', boxShadow: 'none' },
                    headerTitle: { fontFamily: "'Playfair Display', serif", color: '#D4AF37' },
                    socialButtonsBlockButton: { background: '#1C2F2B', border: '1px solid #2A4D44', color: '#EDE6D6' },
                    socialButtonsBlockButtonText: { color: '#EDE6D6' },
                    formButtonPrimary: { background: '#D4AF37', color: '#152622' },
                    footerActionText: { color: '#7A8E8A' },
                    footerActionLink: { color: '#D4AF37' }
                  }
                }}
              />
            ) : (
              <SignIn 
                routing="virtual"
                signUpUrl="/sign-up"
                appearance={{
                  variables: {
                    colorPrimary: '#D4AF37',
                    colorBackground: '#152622',
                    colorText: '#EDE6D6',
                    colorInputBackground: '#1C2F2B',
                    colorInputText: '#EDE6D6',
                    colorTextSecondary: '#7A8E8A',
                    colorBorder: '#2A4D44'
                  },
                  elements: {
                    card: { background: '#152622', border: 'none', boxShadow: 'none' },
                    headerTitle: { fontFamily: "'Playfair Display', serif", color: '#D4AF37' },
                    socialButtonsBlockButton: { background: '#1C2F2B', border: '1px solid #2A4D44', color: '#EDE6D6' },
                    socialButtonsBlockButtonText: { color: '#EDE6D6' },
                    formButtonPrimary: { background: '#D4AF37', color: '#152622' },
                    footerActionText: { color: '#7A8E8A' },
                    footerActionLink: { color: '#D4AF37' }
                  }
                }}
              />
            )}
          </ClerkErrorBoundary>
        )}
      </div>
    </div>
  );
};
