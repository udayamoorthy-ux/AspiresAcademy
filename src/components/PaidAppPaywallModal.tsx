/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  X, 
  Smartphone, 
  CreditCard, 
  KeyRound, 
  Loader2, 
  Copy, 
  ExternalLink, 
  AlertCircle, 
  GraduationCap, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Zap, 
  Users, 
  Lock,
  Flame,
  Award
} from 'lucide-react';
import { PaidPlanType, PaymentMethodType, PaidSubscriptionRecord, PaywallSettings } from '../types';

interface PaidAppPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
  premiumPlan?: string;
  userEmail?: string;
  selectedExam?: string;
  onSubscriptionSuccess?: (plan: string) => void;
  onCancelSubscription?: () => void;
  initialSelectedPlan?: PaidPlanType;
  featureTriggerName?: string; // e.g. "AI Mains Essay Evaluator"
}

export const PaidAppPaywallModal: React.FC<PaidAppPaywallModalProps> = ({
  isOpen,
  onClose,
  isPremium = false,
  premiumPlan = 'annual',
  userEmail = '',
  selectedExam = 'UPSC',
  onSubscriptionSuccess,
  onCancelSubscription,
  initialSelectedPlan = 'annual',
  featureTriggerName
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PaidPlanType>(initialSelectedPlan);
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'key'>('upi');
  
  // Student Details
  const [studentEmail, setStudentEmail] = useState(userEmail || '');
  const [studentName, setStudentName] = useState(userEmail ? userEmail.split('@')[0] : '');
  const [studentPhone, setStudentPhone] = useState('');
  
  // UPI State
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  
  // License Key State
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  
  // Card/Netbanking state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Processing & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [successRecord, setSuccessRecord] = useState<PaidSubscriptionRecord | null>(null);
  
  // Paywall Settings from server
  const [settings, setSettings] = useState<PaywallSettings>({
    mode: 'free_trial',
    trialLimits: { evaluations: 1, quizzes: 5, notes: 2, chats: 3 },
    prices: { monthly: 199, annual: 999, lifetime: 1999 },
    upiId: 'udayamoorthy@okaxis',
    upiName: 'ASPIRES ACADEMY'
  });

  useEffect(() => {
    if (userEmail) {
      setStudentEmail(userEmail);
      if (!studentName) setStudentName(userEmail.split('@')[0]);
    }
  }, [userEmail]);

  useEffect(() => {
    // Fetch latest paywall config from server
    fetch('/api/paywall/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const prices = settings.prices;
  const currentPrice = prices[selectedPlan] || (selectedPlan === 'monthly' ? 199 : selectedPlan === 'lifetime' ? 1999 : 999);

  // Dynamic UPI Link & QR Code
  const upiNote = `ASPIRES ${selectedPlan.toUpperCase()} Pass for ${studentEmail.trim() || 'Student'}`;
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.upiName)}&am=${currentPrice}&cu=INR&tn=${encodeURIComponent(upiNote)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}&margin=10`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleVerifyUpiPayment = async () => {
    setFeedbackError('');
    if (!studentEmail || !studentEmail.includes('@')) {
      setFeedbackError('Please enter your valid student email to register your Pro license.');
      return;
    }
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setFeedbackError('Please enter the 12-digit UPI Reference / UTR Number found in your payment receipt.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: studentEmail.trim().toLowerCase(),
          userName: studentName.trim() || studentEmail.split('@')[0],
          phone: studentPhone.trim() || undefined,
          plan: selectedPlan,
          amount: currentPrice,
          paymentMethod: 'upi_gpay',
          utrRef: utrNumber.trim(),
          exam: selectedExam
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      setSuccessRecord(data.subscription);
      onSubscriptionSuccess?.(selectedPlan);
    } catch (err: any) {
      setFeedbackError(err.message || 'Could not verify payment. Please retry or contact helpdesk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardCheckout = async () => {
    setFeedbackError('');
    if (!studentEmail || !studentEmail.includes('@')) {
      setFeedbackError('Please enter your valid student email.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Process instant gateway transaction
      const res = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: studentEmail.trim().toLowerCase(),
          userName: studentName.trim() || studentEmail.split('@')[0],
          phone: studentPhone.trim() || undefined,
          plan: selectedPlan,
          amount: currentPrice,
          paymentMethod: 'card_netbanking',
          utrRef: `CARD-${Date.now().toString().slice(-8)}`,
          exam: selectedExam
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Checkout failed');
      }

      setSuccessRecord(data.subscription);
      onSubscriptionSuccess?.(selectedPlan);
    } catch (err: any) {
      setFeedbackError(err.message || 'Payment processing failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedeemLicenseKey = async () => {
    setFeedbackError('');
    if (!licenseKeyInput.trim()) {
      setFeedbackError('Please enter your activation code or license key.');
      return;
    }
    if (!studentEmail || !studentEmail.includes('@')) {
      setFeedbackError('Please enter your student email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscriptions/redeem-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: licenseKeyInput.trim().toUpperCase(),
          email: studentEmail.trim().toLowerCase(),
          userName: studentName.trim() || studentEmail.split('@')[0],
          phone: studentPhone.trim() || undefined,
          exam: selectedExam
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to redeem license key');
      }

      setSuccessRecord(data.subscription);
      onSubscriptionSuccess?.(data.subscription.plan);
    } catch (err: any) {
      setFeedbackError(err.message || 'Invalid or expired license key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full shadow-2xl relative overflow-hidden transition-all duration-300 max-h-[92vh] overflow-y-auto flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colorful visual accent top stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 via-orange-500 to-amber-600 shrink-0" />

        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-black">
              <Crown className="h-5.5 w-5.5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  ASPIRES Pro Membership
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wider font-mono">
                  PAID ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                All-India Competitive Examination Preparation Suite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Feature Trigger Banner if opened via a locked tool */}
          {featureTriggerName && !isPremium && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300">
                  {featureTriggerName} is a Pro Feature
                </h4>
                <p className="text-[11px] text-slate-300">
                  Activate an ASPIRES Pro Pass to unlock unlimited evaluations, full PYQ solution banks, and expert AI feedback.
                </p>
              </div>
            </div>
          )}

          {/* If already Premium: Official Digital Membership Card */}
          {isPremium && !successRecord && (
            <div className="bg-gradient-to-br from-slate-850 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
                    <Award className="h-7 w-7 text-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base">Verified Pro Scholar</span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Member ID: <strong className="text-amber-400 font-mono">ASP-2026-{Math.floor(1000 + Math.random() * 9000)}</strong> • Plan: <strong className="text-white capitalize">{premiumPlan} Pass</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Slip</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to cancel your active Pro membership?")) {
                        onCancelSubscription?.();
                      }
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 transition-all"
                  >
                    Cancel Pass
                  </button>
                </div>
              </div>

              {/* Pro Perks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 text-center">
                <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Mains Evaluation</span>
                  <div className="text-sm font-black text-emerald-400 mt-1">Unlimited</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Question Bank</span>
                  <div className="text-sm font-black text-amber-400 mt-1">10,000+ MCQs</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Voice Lessons</span>
                  <div className="text-sm font-black text-sky-400 mt-1">AI Teacher</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Live Speed Arena</span>
                  <div className="text-sm font-black text-purple-400 mt-1">VIP Priority</div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Zap className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">
                    Need support or study materials? Join the verified Pro Aspirants WhatsApp Lounge.
                  </span>
                </div>
                <a
                  href="https://chat.whatsapp.com/KNkh3LnmULH7PHI1KfetnT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <Users className="h-4 w-4" />
                  <span>Join VIP Lounge</span>
                </a>
              </div>
            </div>
          )}

          {/* Success Screen after instant activation */}
          {successRecord && (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-3xl p-6 text-center space-y-4 animate-scaleUp">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Payment Successful! You are now Pro</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Invoice <strong className="text-amber-400 font-mono">{successRecord.invoiceNumber}</strong> generated for {successRecord.email}.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan:</span>
                  <span className="text-white font-bold uppercase">{successRecord.plan} Pass</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-emerald-400 font-bold">₹{successRecord.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valid Until:</span>
                  <span className="text-white">{successRecord.expiresAt.substring(0, 10)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer text-xs"
              >
                Start Studying with Pro
              </button>
            </div>
          )}

          {/* Plan Selection Cards */}
          {(!isPremium || successRecord === null) && (
            <>
              <div>
                <div className="text-center max-w-lg mx-auto mb-5 space-y-1">
                  <h4 className="text-lg font-black text-white font-sans">
                    Choose Your Preparation Pass
                  </h4>
                  <p className="text-xs text-slate-400">
                    Transparent pricing. Zero hidden charges. Cancel anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Monthly Pass */}
                  <div
                    onClick={() => setSelectedPlan('monthly')}
                    className={`rounded-2xl p-5 border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === 'monthly'
                        ? 'bg-slate-850 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Sprint Pass</span>
                      </div>
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-black text-white">₹{prices.monthly}</span>
                        <span className="text-xs text-slate-400">/ 30 days</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-4">
                        Ideal for last-minute revision before Prelims or Tier 1 exams.
                      </p>
                      <ul className="text-xs space-y-2 text-slate-300">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>All 8 Exams Unlocked</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>AI Essay Evaluator</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Topic-wise Mock Tests</span>
                        </li>
                      </ul>
                    </div>

                    <button className={`w-full mt-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedPlan === 'monthly'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {selectedPlan === 'monthly' ? 'Selected' : 'Select'}
                    </button>
                  </div>

                  {/* Annual Pro Pass (Highlighted Best Value) */}
                  <div
                    onClick={() => setSelectedPlan('annual')}
                    className={`rounded-2xl p-5 border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === 'annual'
                        ? 'bg-gradient-to-b from-slate-850 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/40'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                      MOST POPULAR • 60% SAVINGS
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2 mt-1">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Annual Pro Pass</span>
                      </div>
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-3xl font-black text-white">₹{prices.annual}</span>
                        <span className="text-xs text-slate-400">/ 365 days</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-4">
                        Just ₹83/month. Complete comprehensive preparation for the full academic cycle.
                      </p>
                      <ul className="text-xs space-y-2 text-slate-200">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="font-bold text-white">Unlimited Mains Essay Evaluations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Voice AI Teacher & Audio Briefs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Live Speed Battle & Study Lounge</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Adaptive Study Planner</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Offline PWA App Access</span>
                        </li>
                      </ul>
                    </div>

                    <button className={`w-full mt-5 py-2.5 rounded-xl text-xs transition-all shadow-md ${
                      selectedPlan === 'annual'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 font-bold'
                    }`}>
                      {selectedPlan === 'annual' ? 'Selected • Best Value' : 'Select'}
                    </button>
                  </div>

                  {/* Lifetime Pass */}
                  <div
                    onClick={() => setSelectedPlan('lifetime')}
                    className={`rounded-2xl p-5 border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === 'lifetime'
                        ? 'bg-slate-850 border-purple-500 shadow-lg shadow-purple-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">Lifetime Ranker</span>
                      </div>
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-black text-white">₹{prices.lifetime}</span>
                        <span className="text-xs text-slate-400">one-time</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-4">
                        Pay once, learn forever. Covers UPSC, TNPSC, SSC, RRB, JEE, NEET & IELTS.
                      </p>
                      <ul className="text-xs space-y-2 text-slate-300">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="font-bold text-white">Lifetime Unlimited Access</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>All Future Exam Modules Free</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Direct Mentor Priority Support</span>
                        </li>
                      </ul>
                    </div>

                    <button className={`w-full mt-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedPlan === 'lifetime'
                        ? 'bg-purple-600 text-white font-black'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {selectedPlan === 'lifetime' ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Student Details Form */}
              <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  1. Aspirant License Registration
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    2. Select Payment Method
                  </span>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setPaymentTab('upi')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        paymentTab === 'upi'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Instant UPI (GPay/PhonePe)
                    </button>
                    <button
                      onClick={() => setPaymentTab('card')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        paymentTab === 'card'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Cards / NetBanking
                    </button>
                    <button
                      onClick={() => setPaymentTab('key')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        paymentTab === 'key'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Enter License Key
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {feedbackError && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{feedbackError}</span>
                  </div>
                )}

                {/* TAB 1: UPI Instant Payment */}
                {paymentTab === 'upi' && (
                  <div className="bg-slate-850 p-5 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* QR Code Column */}
                    <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <img 
                          src={qrCodeUrl} 
                          alt="ASPIRES Pro UPI QR Code" 
                          className="w-40 h-40 object-contain rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-300">
                          Scan with Google Pay, PhonePe, Paytm or BHIM
                        </span>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-mono">
                          <span>Amount: <strong>₹{currentPrice}</strong></span>
                        </div>
                      </div>

                      {/* Mobile Deep Link Button */}
                      <a
                        href={upiDeepLink}
                        className="sm:hidden w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>Tap to Pay on Mobile UPI App</span>
                      </a>
                    </div>

                    {/* Step-by-Step UPI Verification */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Official Merchant UPI ID:</span>
                          <button
                            onClick={handleCopyUpiId}
                            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-mono font-bold cursor-pointer"
                          >
                            <span>{settings.upiId}</span>
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {copiedUpi && (
                          <p className="text-[10px] text-emerald-400 text-right font-medium">
                            ✓ Copied to clipboard! Open GPay/PhonePe to pay.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200 block">
                          Step 2: Enter 12-Digit UPI Ref / UTR Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={16}
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="e.g. 429184029182"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono uppercase tracking-wider"
                          />
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          After making the transfer of <strong>₹{currentPrice}</strong> in your UPI app, enter the transaction Reference / UTR number from your payment confirmation screen for instant verification.
                        </p>
                      </div>

                      <button
                        onClick={handleVerifyUpiPayment}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-3 px-5 rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                            <span>Verifying Transaction...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 text-slate-950" />
                            <span>Verify &amp; Activate {selectedPlan.toUpperCase()} Pass (₹{currentPrice})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: Card & NetBanking Checkout */}
                {paymentTab === 'card' && (
                  <div className="bg-slate-850 p-5 rounded-3xl border border-slate-800 space-y-4 max-w-lg mx-auto">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4532 •••• •••• 8921"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                          <CreditCard className="h-4 w-4 text-slate-500 absolute right-3 top-2.5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCardCheckout}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-3 px-5 rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                          <span>Processing Gateway Payment...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 text-slate-950" />
                          <span>Pay ₹{currentPrice} &amp; Unlock Instant Access</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10.5px] text-slate-400 text-center">
                      🔒 256-bit Encrypted SSL Gateway. Immediate receipt and roll number issue.
                    </p>
                  </div>
                )}

                {/* TAB 3: License Key Redemption */}
                {paymentTab === 'key' && (
                  <div className="bg-slate-850 p-5 rounded-3xl border border-slate-800 space-y-4 max-w-lg mx-auto">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block">
                        Enter Student License Key or Institutional Voucher
                      </label>
                      <input
                        type="text"
                        value={licenseKeyInput}
                        onChange={(e) => setLicenseKeyInput(e.target.value)}
                        placeholder="e.g. ASPIRES-PRO-2026 or TOPPER2026"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono uppercase tracking-wider"
                      />
                      <p className="text-[11px] text-slate-400">
                        Have a coupon or institution code from your academy or sponsor? Enter it here for instant 100% scholarship activation.
                      </p>
                    </div>

                    <button
                      onClick={handleRedeemLicenseKey}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black py-3 px-5 rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Validating License Key...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4" />
                          <span>Redeem License Key &amp; Unlock Pro</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Guarantee Footer */}
          <div className="border-t border-slate-800/80 pt-4 text-center space-y-1 text-slate-400 text-[11px]">
            <p>
              🛡️ <strong>ASPIRES ACADEMY Satisfaction Promise</strong>: 100% secure direct-to-educator transaction.
            </p>
            <p className="text-slate-500 text-[10px]">
              For queries or bulk institutional licenses, reach out directly to <strong>udayamoorthy@gmail.com</strong>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
