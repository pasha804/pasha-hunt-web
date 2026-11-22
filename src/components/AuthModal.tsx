'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, isNewUser: boolean) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSuccessMsg('Password reset link sent to your email! Please check your inbox.');
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        if (data.user) {
          onAuthSuccess(data.user, true);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onAuthSuccess(data.user, false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#17212A] border border-[#27343D] p-6 shadow-2xl text-[#F7F3EA]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#858B8D] hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2AA4C]/10 border border-[#F2AA4C]/30 text-[#F2AA4C] text-xs font-semibold mb-3">
            <span>⚡ PASHA HUNT 2.0</span>
            <span>•</span>
            <span>Cloud SaaS</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Candidate Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#858B8D] mt-1">
            {isForgotPassword
              ? 'Enter your email to receive a password reset link'
              : isSignUp
              ? 'Join 5,460+ verified opportunities with elite ATS tailoring'
              : 'Access your AI career copilot & active job tracker'}
          </p>
        </div>

        {/* Tab Toggle */}
        {!isForgotPassword && (
          <div className="flex rounded-lg bg-[#101820] p-1 mb-5 border border-[#27343D]">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                !isSignUp ? 'bg-[#F2AA4C] text-black shadow-md' : 'text-[#858B8D] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                isSignUp ? 'bg-[#F2AA4C] text-black shadow-md' : 'text-[#858B8D] hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && !isForgotPassword && (
            <div>
              <label className="block text-xs font-medium text-[#B7B7AE] mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-[#858B8D]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Muhammad Mubashar"
                  className="w-full pl-9 pr-3 py-2 bg-[#101820] border border-[#27343D] rounded-lg text-sm text-white placeholder-[#858B8D] focus:outline-none focus:border-[#F2AA4C] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#B7B7AE] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#858B8D]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-9 pr-3 py-2 bg-[#101820] border border-[#27343D] rounded-lg text-sm text-white placeholder-[#858B8D] focus:outline-none focus:border-[#F2AA4C] transition-colors"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-[#B7B7AE]">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[11px] text-[#F2AA4C] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#858B8D]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-[#101820] border border-[#27343D] rounded-lg text-sm text-white placeholder-[#858B8D] focus:outline-none focus:border-[#F2AA4C] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#858B8D] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-lg bg-[#F2AA4C] text-black font-bold text-sm hover:bg-[#FFC16F] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#F2AA4C]/20"
          >
            {loading ? (
              <span>Processing...</span>
            ) : isForgotPassword ? (
              <span>Send Reset Link</span>
            ) : isSignUp ? (
              <>
                <span>Continue Setup</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <span>Sign In to Workstation</span>
            )}
          </button>
        </form>

        {isForgotPassword && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setErrorMsg(''); setSuccessMsg(''); }}
              className="text-xs text-[#858B8D] hover:text-[#F2AA4C] transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
