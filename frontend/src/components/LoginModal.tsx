import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isRegister, setIsRegister] = useState(false);

  if (!isOpen) return null;

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
                card: {
                  background: '#152622',
                  border: 'none',
                  boxShadow: 'none'
                },
                headerTitle: {
                  fontFamily: "'Playfair Display', serif",
                  color: '#D4AF37'
                },
                socialButtonsBlockButton: {
                  background: '#1C2F2B',
                  border: '1px solid #2A4D44',
                  color: '#EDE6D6'
                },
                socialButtonsBlockButtonText: {
                  color: '#EDE6D6'
                },
                formButtonPrimary: {
                  background: '#D4AF37',
                  color: '#152622'
                },
                footerActionText: {
                  color: '#7A8E8A'
                },
                footerActionLink: {
                  color: '#D4AF37'
                }
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
                card: {
                  background: '#152622',
                  border: 'none',
                  boxShadow: 'none'
                },
                headerTitle: {
                  fontFamily: "'Playfair Display', serif",
                  color: '#D4AF37'
                },
                socialButtonsBlockButton: {
                  background: '#1C2F2B',
                  border: '1px solid #2A4D44',
                  color: '#EDE6D6'
                },
                socialButtonsBlockButtonText: {
                  color: '#EDE6D6'
                },
                formButtonPrimary: {
                  background: '#D4AF37',
                  color: '#152622'
                },
                footerActionText: {
                  color: '#7A8E8A'
                },
                footerActionLink: {
                  color: '#D4AF37'
                }
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
