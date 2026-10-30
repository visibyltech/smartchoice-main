import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
  initialMode?: 'signin' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Sign In to Your Account',
  subtitle = 'Checkout requires an authenticated customer account to safeguard your order and Save to Buy plans.',
  initialMode = 'signin'
}) => {
  const { loginWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } = useStore();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(initialMode);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setSuccessNotice(null);
    }
  }, [isOpen, initialMode]);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Failed to sign in with Google');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await signInWithEmail(email.trim(), password);
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      let msg = err.message || 'Failed to sign in';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please verify and try again.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setErrorMessage(msg);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !phone) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await signUpWithEmail(email.trim(), password, fullName.trim(), phone.trim());
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      let msg = err.message || 'Failed to create account';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email address is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setErrorMessage(msg);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await sendPasswordReset(email.trim());
      setLoading(false);
      setSuccessNotice('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-xs">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-12 h-12 bg-red-50 text-[#D91E2A] rounded-2xl flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#0A1931]">
            {mode === 'signin'
              ? title
              : mode === 'register'
              ? 'Create Customer Account'
              : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            {mode === 'signin' || mode === 'register' ? subtitle : 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl font-bold text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition ${
                mode === 'signin'
                  ? 'bg-white text-[#0A1931] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition ${
                mode === 'register'
                  ? 'bg-white text-[#0A1931] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Register (New Customer)
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{successNotice}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        {mode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-bold flex items-center justify-center gap-2.5 transition shadow-2xs text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-gray-200" />
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Or use email</span>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-3.5">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:border-[#D91E2A] outline-none text-xs"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Password *</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMessage(null);
                  }}
                  className="text-[11px] text-[#D91E2A] hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:border-[#D91E2A] outline-none text-xs"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In and Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Chukwuma Okeke"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:border-[#D91E2A] outline-none text-xs"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Phone Number / WhatsApp *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0803 123 4567"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:border-[#D91E2A] outline-none text-xs"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:border-[#D91E2A] outline-none text-xs"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Create Password (min. 6 characters) *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:border-[#D91E2A] outline-none text-xs"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account and Proceed'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Your Registered Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:border-[#D91E2A] outline-none text-xs"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs"
            >
              <span>{loading ? 'Sending link...' : 'Send Password Reset Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-900 font-semibold"
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
