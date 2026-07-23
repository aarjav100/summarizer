import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { UserProfile } from './Header';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const [isRegister, setIsRegister] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (isRegister) {
        if (!signUp) {
          setError('Clerk registration is not loaded yet.');
          return;
        }
        // Real Clerk Registration flow
        const signUpAttempt = await signUp.create({
          emailAddress: email,
          password: password,
          firstName: name
        });
        
        if (signUpAttempt.status === 'missing_requirements') {
          // Send verification email
          await signUpAttempt.prepareEmailAddressVerification({ strategy: 'email_code' });
          setVerifying(true);
        } else if (signUpAttempt.status === 'complete') {
          if (setSignUpActive) {
            await setSignUpActive({ session: signUpAttempt.createdSessionId });
          }
          const initials = name.slice(0, 2).toUpperCase();
          onLoginSuccess({ email, name, initials });
          onClose();
        }
      } else {
        if (!signIn) {
          setError('Clerk sign-in is not loaded yet.');
          return;
        }
        // Real Clerk Credentials login
        const signInAttempt = await signIn.create({
          identifier: email,
          password: password,
          strategy: 'password'
        });

        if (signInAttempt.status === 'complete') {
          if (setSignInActive) {
            await setSignInActive({ session: signInAttempt.createdSessionId });
          }
          const namePart = email.split('@')[0];
          onLoginSuccess({
            email,
            name: namePart,
            initials: namePart.slice(0, 2).toUpperCase()
          });
          onClose();
        } else if (signInAttempt.status === 'needs_first_factor') {
          setError('Email verification required. Please verify your email first.');
        } else {
          setError(`Sign-in status incomplete: ${signInAttempt.status}. Please check your account settings.`);
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || 'Credentials authentication failed.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signUp || !verificationCode) {
      setError('Please enter your verification code.');
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode
      });

      if (completeSignUp.status === 'complete') {
        if (setSignUpActive) {
          await setSignUpActive({ session: completeSignUp.createdSessionId });
        }
        const initials = name.slice(0, 2).toUpperCase();
        onLoginSuccess({ email, name, initials });
        onClose();
      } else {
        setError('Verification status incomplete. Please check the code.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || 'Verification failed.');
    }
  };

  const handleOAuth = async (strategy: 'oauth_google' | 'oauth_github') => {
    try {
      setError('');
      
      // Execute proper Google/GitHub Account login redirects via Clerk SDK
      if (isRegister) {
        if (!signUp) {
          setError('Clerk sign-up helper is not initialized.');
          return;
        }
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: window.location.origin + '/?workspace=true',
          redirectUrlComplete: window.location.origin + '/?workspace=true'
        });
      } else {
        if (!signIn) {
          setError('Clerk sign-in helper is not initialized.');
          return;
        }
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: window.location.origin + '/?workspace=true',
          redirectUrlComplete: window.location.origin + '/?workspace=true'
        });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || `${strategy} redirect failed.`);
    }
  };


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
        className="modal-content"
        style={{
          background: '#152622',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '32px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          color: '#EDE6D6',
          fontFamily: "'IBM Plex Sans', sans-serif"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Serif Heading */}
        <h2 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '26px', 
            fontWeight: 'normal',
            color: 'var(--gold)', 
            marginBottom: '8px',
            textAlign: 'center'
          }}
        >
          {verifying ? 'Verify Your Email' : (isRegister ? 'Create Account' : 'Enter the Archives')}
        </h2>
        <p style={{ fontSize: '12px', color: '#7A8E8A', textAlign: 'center', marginBottom: '24px' }}>
          {verifying ? 'Enter the verification code sent to your email.' : "Access SummaMind Studio's Multimodal Document Sanctuary"}
        </p>

        {error && (
          <div style={{ color: '#CF8E82', fontSize: '12px', marginBottom: '16px', background: 'rgba(207, 142, 130, 0.08)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(207, 142, 130, 0.2)' }}>
            ⚠️ {error}
          </div>
        )}

        {verifying ? (
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#7A8E8A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Verification Code</label>
              <input 
                type="text" 
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1C2F2B',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  color: '#EDE6D6',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button 
              type="submit"
              className="btn-primary"
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
              Verify Code
            </button>

            <button 
              type="button"
              onClick={() => setVerifying(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#7A8E8A',
                fontSize: '12.5px',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '4px'
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegister && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#7A8E8A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Arthur Pendelton"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1C2F2B',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      padding: '10px 12px',
                      color: '#EDE6D6',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#7A8E8A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="reader@archives.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1C2F2B',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    color: '#EDE6D6',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#7A8E8A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1C2F2B',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    color: '#EDE6D6',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* CAPTCHA Widget for Clerk Bot Protection */}
              {isRegister && <div id="clerk-captcha" style={{ marginTop: '4px' }}></div>}

              {/* Primary Action Button (Rust/Amber Gold) */}
              <button 
                type="submit"
                className="btn-primary"
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
                {isRegister ? 'Register & Begin' : 'Unlock Access'}
              </button>
            </form>

            <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0', position: 'relative', textAlign: 'center' }}>
              <span style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', background: '#152622', padding: '0 10px', fontSize: '11px', color: '#7A8E8A' }}>OR</span>
            </div>

            {/* Real SSO Accounts trigger */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button 
                onClick={() => handleOAuth('oauth_google')}
                style={{
                  flex: 1,
                  background: '#1C2F2B',
                  border: '1px solid var(--border)',
                  color: '#EDE6D6',
                  borderRadius: '4px',
                  padding: '8px',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🌐 Google
              </button>
              <button 
                onClick={() => handleOAuth('oauth_github')}
                style={{
                  flex: 1,
                  background: '#1C2F2B',
                  border: '1px solid var(--border)',
                  color: '#EDE6D6',
                  borderRadius: '4px',
                  padding: '8px',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                💻 GitHub
              </button>
            </div>

            {/* Toggle Form type */}
            <div style={{ textAlign: 'center', fontSize: '12.5px', color: '#7A8E8A' }}>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsRegister(!isRegister)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gold)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: 0
                }}
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
