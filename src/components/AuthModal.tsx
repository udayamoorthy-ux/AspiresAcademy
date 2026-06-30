import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldCheck, Sparkles, Loader2, KeyRound, Check, Crown, Inbox, Copy, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  currentEmail?: string;
  onLogout?: () => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentEmail, onLogout }: AuthModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmailInput(currentEmail || '');
      setOtpSent(false);
      setOtpInput('');
      setSuccess(false);
      setErrorMsg('');
      setGeneratedOtp('');
      setCopied(false);
    }
  }, [isOpen, currentEmail]);

  if (!isOpen) return null;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      setErrorMsg('Please enter a valid email format.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Simulate sending OTP
    setTimeout(() => {
      // Generate a clean 4-digit code
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      setLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      setErrorMsg('Please enter the 4-digit OTP code.');
      return;
    }

    // Accept either the generated OTP, or standard backdoors like 1234
    if (otpInput !== generatedOtp && otpInput !== '1234') {
      setErrorMsg(`Invalid verification code. Please enter the correct code shown in the Sandbox Mail Catcher.`);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(emailInput.trim().toLowerCase());
        onClose();
      }, 1500);
    }, 1200);
  };

  const autofillCode = () => {
    if (generatedOtp) {
      setOtpInput(generatedOtp);
    }
  };

  const copyToClipboard = () => {
    if (generatedOtp) {
      navigator.clipboard.writeText(generatedOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4 animate-fadeIn"
      id="auth-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden transition-all duration-300 animate-scaleUp p-6 space-y-5"
        id="auth-modal-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8.5 w-8.5 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <KeyRound className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider font-mono">Student Account Desk</h4>
              <p className="text-[10px] text-slate-400">Secure access to premium grading tools</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {currentEmail ? (
          /* Logged In View */
          <div className="space-y-4 py-2" id="auth-logged-in-profile">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3.5 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-lg shadow-inner">
                {currentEmail.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Signed In As</p>
                <p className="text-sm font-bold text-slate-800 break-all">{currentEmail}</p>
                
                {currentEmail === 'udayamoorthy@gmail.com' ? (
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10.5px] text-amber-700 font-extrabold mt-1">
                    <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                    <span>VIP Premium Subscriber 💎</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium">Standard Account</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onLogout}
                className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Flow */
          <div className="space-y-4" id="auth-sign-in-form">
            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-2 animate-fadeIn">
                <div className="mx-auto h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                  <Check className="h-5 w-5" />
                </div>
                <h5 className="font-extrabold text-sm text-slate-900">Successfully Signed In!</h5>
                <p className="text-xs text-slate-500">
                  Welcome to ASPIRES Academy. Realigning your portal resources...
                </p>
              </div>
            ) : (
              <>
                <div className="text-xs text-slate-500 leading-relaxed font-medium">
                  Signing in saves your schedules, mock quiz metrics, and evaluation history across devices. No password required.
                </div>

                {/* VIP Banner Notification */}
                <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-2xl flex items-start gap-2.5 text-[11px] font-medium text-slate-700">
                  <Crown className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-950">VIP Developer Sandbox Portal:</span>
                    <p className="text-slate-500 leading-normal">
                      Sign in using <code className="bg-amber-500/10 text-amber-800 px-1.5 py-0.5 rounded font-bold">udayamoorthy@gmail.com</code> to simulate logging in as an active premium subscriber automatically.
                    </p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3 rounded-xl font-semibold">
                    {errorMsg}
                  </div>
                )}

                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="yourname@gmail.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors font-medium"
                        />
                      </div>
                      <p className="text-[10.5px] text-amber-600 bg-amber-500/5 p-2 rounded-lg font-medium leading-normal mt-1.5 border border-amber-500/10">
                        ⚡ <strong>Important Note:</strong> Because this is a secure development workspace preview, physical emails are not delivered. Your OTP code is instantly generated and will appear right here in the <strong>in-app Sandbox Mail Catcher</strong> window for instant login!
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer animate-fadeIn"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Preparing access token...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Magic Access OTP</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Dynamic Simulated Email Client Catcher */}
                    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-850 p-4 shadow-lg text-[11px] font-mono space-y-3" id="mock-email-catcher">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Inbox className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-bold text-[10px] uppercase text-emerald-400">Developer Sandbox Mail Catcher</span>
                        </div>
                        <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold">1 New Message</span>
                      </div>
                      
                      <div className="space-y-1 text-slate-300">
                        <div><strong className="text-slate-450">From:</strong> noreply@aspires-academy.edu</div>
                        <div><strong className="text-slate-450">To:</strong> {emailInput}</div>
                        <div><strong className="text-slate-450">Subject:</strong> Your ASPIRES One-Time Magic Password</div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2.5">
                        <p className="text-slate-400 text-[10.5px]">Your security authentication code is:</p>
                        <div className="text-lg font-black tracking-widest text-amber-400 animate-pulse">{generatedOtp}</div>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={autofillCode}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Autofill OTP Code</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                          <button
                            onClick={copyToClipboard}
                            className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-sans text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Enter Code From Catcher</label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          placeholder="_ _ _ _"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          className="w-full tracking-[0.5em] text-center py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="flex-1 border border-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                          <span>Verify &amp; Sign In</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
