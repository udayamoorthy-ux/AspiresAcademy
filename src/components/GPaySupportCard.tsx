import React, { useState, useEffect, useId } from 'react';
import { Heart, CheckCircle2, ShieldAlert, Sparkles, Loader2, X, Info, QrCode, ArrowRight, Check, Users, GraduationCap, Award, Crown } from 'lucide-react';

interface GPaySupportCardProps {
  isOpen: boolean;
  onClose: () => void;
  onVoicePlay?: (text: string, title: string) => void;
  isPremium?: boolean;
  onSubscriptionSuccess?: (plan: 'monthly' | 'annual') => void;
  onCancelSubscription?: () => void;
}

interface Supporter {
  id: string;
  name: string;
  amount: number;
  message: string;
  timestamp: string;
}

const PRE_SEEDED_SUPPORTERS: Supporter[] = [
  {
    id: 's1',
    name: 'Priya Dharshini',
    amount: 199,
    message: 'The Mains Essay Evaluator has been a lifesaver for my TNPSC Group 1 prep!',
    timestamp: '2 hours ago'
  },
  {
    id: 's2',
    name: 'Karthik Raja S',
    amount: 299,
    message: 'Excellent syllabus tracker and AI coach. Subscribed to Annual Pass to keep it going.',
    timestamp: '5 hours ago'
  },
  {
    id: 's3',
    name: 'Amit Sharma (UPSC Aspirant)',
    amount: 199,
    message: 'The AI voice lecture summaries of policy briefs on CURRENT AFFAIRS are absolute gold.',
    timestamp: 'Yesterday'
  },
  {
    id: 's4',
    name: 'Nandhini Murugesan',
    amount: 199,
    message: 'Customizable planners combined with mock tests help me target weak topics. Thank you!',
    timestamp: '2 days ago'
  }
];

export default function GPaySupportCard({ 
  isOpen, 
  onClose, 
  onVoicePlay, 
  isPremium = false, 
  onSubscriptionSuccess, 
  onCancelSubscription 
}: GPaySupportCardProps) {
  const [paymentMode, setPaymentMode] = useState<'subscription' | 'donation'>('subscription');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Hardcoded internally for encoding the QR code only - removed from all text rendering!
  const upiId = 'udayamoorthy@okaxis';
  
  // Supporter custom info
  const [supporterName, setSupporterName] = useState<string>('');
  const [supporterMessage, setSupporterMessage] = useState<string>('');
  
  const [supportersList, setSupportersList] = useState<Supporter[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [justAddedSelf, setJustAddedSelf] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  
  const [upiLink, setUpiLink] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const quickAmounts = [20, 50, 100, 200];

  // Generate unique IDs for SVG definitions to prevent conflicts when multiple logos exist on the page
  const uniqueId = useId();
  const safeId = uniqueId.replace(/:/g, '-');
  const flameGradId = `flame-grad-${safeId}`;
  const goldGradId = `gold-grad-${safeId}`;

  // Load saved supporters on mount
  useEffect(() => {
    const savedSupporters = localStorage.getItem('gpay_supporters_list');
    if (savedSupporters) {
      try {
        setSupportersList(JSON.parse(savedSupporters));
      } catch (e) {
        setSupportersList(PRE_SEEDED_SUPPORTERS);
      }
    } else {
      setSupportersList(PRE_SEEDED_SUPPORTERS);
    }
  }, []);

  const getFinalAmount = () => {
    if (paymentMode === 'subscription') {
      return selectedPlan === 'monthly' ? 199 : 299;
    }
    return customAmount ? parseFloat(customAmount) : amount;
  };

  // Generate UPI link & QR Code URL in the background
  useEffect(() => {
    const finalAmt = getFinalAmount();
    if (finalAmt > 0) {
      const senderName = supporterName.trim() || 'Aspirant';
      const note = paymentMode === 'subscription' 
        ? `ASPIRES PREMIUM ${selectedPlan.toUpperCase()} subscription`
        : `ASPIRES ACADEMY contribution`;
      
      // Standard UPI deep link
      const link = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('ASPIRES ACADEMY')}&am=${finalAmt}&cu=INR&tn=${encodeURIComponent(note)}`;
      setUpiLink(link);
      
      // Dynamic QR Code generation with api.qrserver.com
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}&margin=10`;
      setQrCodeUrl(qrUrl);
    } else {
      setUpiLink('');
      setQrCodeUrl('');
    }
  }, [amount, customAmount, supporterName, paymentMode, selectedPlan]);

  const handleConfirmPaid = () => {
    const finalAmount = getFinalAmount();
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert("Please choose or enter a valid amount.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);
      setJustAddedSelf(true);

      if (paymentMode === 'subscription') {
        // Trigger subscription success
        onSubscriptionSuccess?.(selectedPlan);
      } else {
        const newSupporter: Supporter = {
          id: 'user_' + Date.now(),
          name: supporterName.trim() || 'Anonymous Aspirant',
          amount: finalAmount,
          message: supporterMessage.trim() || 'Supported free server infrastructure!',
          timestamp: 'Just now'
        };

        const updated = [newSupporter, ...supportersList];
        setSupportersList(updated);
        localStorage.setItem('gpay_supporters_list', JSON.stringify(updated));
      }

      // Reset
      setCustomAmount('');
      setAmount(100);
      setSupporterName('');
      setSupporterMessage('');

      setTimeout(() => {
        setJustAddedSelf(false);
      }, 5000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn"
      id="gpay-support-modal-overlay"
      onClick={onClose}
    >
      {/* Modern Dialog Modal Body */}
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl relative overflow-hidden transition-all duration-300 max-h-[90vh] overflow-y-auto flex flex-col"
        id="gpay-support-modal-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colorful visual accent top line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500" />
        
        {/* Close Button Header */}
        <div className="px-5 pt-4 flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-amber-500/20">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">ASPIRES ACADEMY Portal</h4>
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-600 animate-pulse font-mono uppercase">SUPPORT WINDOW</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-slate-400">Scan &amp; Contribute with</span>
                <span className="text-[10px] font-extrabold tracking-tight flex items-center">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">P</span>
                  <span className="text-[#FBBC05]">a</span>
                  <span className="text-[#34A853]">y</span>
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
            title="Close support window"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* If already Premium, show a glorious membership banner */}
          {isPremium && (
            <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-emerald-500/10 border border-amber-300/60 p-4.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
                  <Crown className="h-5.5 w-5.5 animate-bounce" />
                </div>
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="text-sm font-black text-slate-900 flex items-center justify-center sm:justify-start gap-1.5 font-display">
                    ASPIRES Premium Plan is Active
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono">LIVE</span>
                  </h4>
                  <p className="text-xs text-slate-500">Unlimited Essay Evaluations, AI Notes, and Mentor Chat fully unlocked!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel your ASPIRES ACADEMY Premium subscription? Daily limits will be restored.")) {
                      onCancelSubscription?.();
                    }
                  }}
                  className="px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-[10.5px] font-bold rounded-xl transition-all"
                  id="btn-cancel-subscription"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          )}

          {/* Core Action Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Column 1: Mode Selection & Tier Configurations */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Selector segmented button */}
              <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl" id="payment-mode-tabs">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMode('subscription');
                    setShowConfirmation(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMode === 'subscription'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  id="tab-payment-subscription"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Premium Plans</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMode('donation');
                    setShowConfirmation(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMode === 'donation'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  id="tab-payment-donation"
                >
                  <Heart className="h-3.5 w-3.5" />
                  <span>One-time Support</span>
                </button>
              </div>

              {/* Mode 1: Subscription Options */}
              {paymentMode === 'subscription' ? (
                <div className="space-y-3.5" id="subscription-plans-area">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <Crown className="h-4 w-4 text-amber-500" />
                      Select Your Subscription Term
                    </h3>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed">
                      Upgrade to unlock permanent access to state-of-the-art civil service guidance pipelines. Scan with Google Pay to simulate immediate enrollment.
                    </p>
                    <div className="mt-1.5 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-500/15 flex items-center gap-1.5 text-[10px] w-full animate-fadeIn shadow-xs">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>🎁 Early Bird Special: ₹299/yr for the first 100 aspirants only!</span>
                    </div>
                  </div>

                  {/* Plan Cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Plan A: Monthly */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan('monthly');
                        setShowConfirmation(false);
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all relative ${
                        selectedPlan === 'monthly'
                          ? 'bg-emerald-50/40 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                      id="plan-monthly"
                    >
                      <div>
                        <span className="text-[8px] uppercase tracking-wider font-mono font-black text-slate-400">Monthly Pass</span>
                        <h4 className="font-extrabold text-slate-900 text-xs mt-0.5">Standard Premium</h4>
                      </div>
                      <div>
                        <span className="text-base font-black text-slate-900">₹199</span>
                        <span className="text-[10px] text-slate-500 font-medium"> / mo</span>
                      </div>
                    </button>

                    {/* Plan B: Annual */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan('annual');
                        setShowConfirmation(false);
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all relative ${
                        selectedPlan === 'annual'
                          ? 'bg-emerald-50/40 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                      id="plan-annual"
                    >
                      <span className="absolute -top-2 right-2 bg-amber-500 text-slate-950 font-black text-[7.5px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-amber-600/20 shadow-sm animate-pulse">
                        First 100 Aspirants (Save 87%)
                      </span>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider font-mono font-black text-slate-400">Annual Pass</span>
                        <h4 className="font-extrabold text-slate-900 text-xs mt-0.5">Elite Preparatory</h4>
                      </div>
                      <div>
                        <span className="text-base font-black text-slate-900">₹299</span>
                        <span className="text-[10px] text-slate-500 font-medium"> / yr</span>
                      </div>
                    </button>
                  </div>

                  {/* Bullet points of Premium features */}
                  {selectedPlan === 'annual' ? (
                    <div className="bg-amber-500/10 border border-amber-500/35 rounded-2xl p-3.5 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-mono font-black tracking-wider text-amber-700 flex items-center gap-1">
                          <Crown className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
                          Exclusive Annual-Only VIP Benefits
                        </span>
                        <span className="text-[8px] px-1.5 py-0.5 font-bold rounded bg-amber-500 text-slate-950 uppercase font-mono tracking-tight shrink-0">Best Seller</span>
                      </div>
                      <ul className="space-y-1.5 text-[10.5px] text-slate-700 font-semibold">
                        <li className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Unlimited AI Essay Evaluations</strong> with granular rubrics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Unlimited Notes &amp; Flashcards</strong> generations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>VIP Priority Line</strong>: 2x faster Gemini responses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="text-emerald-700 font-bold">⭐ BONUS: Free 1-Click PDF Notes Exporter</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="text-emerald-700 font-bold">⭐ BONUS: WhatsApp Notification Alerts (Worth ₹499/yr)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="text-emerald-700 font-bold">⭐ BONUS: 10% Off Physical Study Materials</span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3.5 space-y-2">
                      <span className="text-[8.5px] uppercase font-mono font-black tracking-wider text-slate-400 block">Premium Feature Highlights</span>
                      <ul className="space-y-1.5 text-[10.5px] text-slate-600 font-semibold">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Unlimited AI Essay Evaluations with rubrics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Unlimited Notes and recall deck generations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Unlimited 24/7 Coaching chats with study targets</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Unlimited diagnostic tests mapped directly to exams</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                // Mode 2: One-Time Donation Options
                <div className="space-y-4" id="one-time-donation-area">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                      One-time Support Contribution
                    </h3>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed">
                      Love our dynamic free trackers? Support our API and cloud database operations directly by contributing any voluntary amount with Google Pay.
                    </p>
                  </div>

                  {/* Quick Preset Selector */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">1. Choose Support Amount</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {quickAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`py-2 rounded-lg text-[10.5px] font-extrabold font-mono transition-all border ${
                            amount === amt && !customAmount
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        placeholder="Or enter custom amount..."
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount(0);
                        }}
                        className="w-full pl-6 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Optional Info and Action Triggers */}
            <div className="lg:col-span-4 space-y-4 self-center">
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">Supporter Registration</span>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Priya S.)"
                    value={supporterName}
                    onChange={(e) => setSupporterName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                  <input
                    type="text"
                    placeholder={paymentMode === 'subscription' ? 'Optional subscriber notes...' : 'Short encouraging note...'}
                    value={supporterMessage}
                    onChange={(e) => setSupporterMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Action Simulation Confirm */}
              <div className="pt-1">
                {justAddedSelf && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] p-2.5 rounded-xl flex items-center gap-1.5 animate-fadeIn mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      {paymentMode === 'subscription' 
                        ? 'Successfully Subscribed! Welcome to ASPIRES Premium. 👑' 
                        : 'Simulated contribution recorded on the community board! Thank you!'}
                    </span>
                  </div>
                )}

                {!showConfirmation ? (
                  <button
                    onClick={() => {
                      setShowConfirmation(true);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10.5px] py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    id="btn-confirm-gpay-intent"
                  >
                    <span>{paymentMode === 'subscription' ? 'Activate Premium via GPay' : 'Confirm Scan Contribution'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl space-y-1.5 animate-fadeIn">
                    <p className="text-[9.5px] text-amber-800 font-bold leading-normal">
                      Confirm simulated Google Pay payment for ₹{getFinalAmount()}?
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleConfirmPaid}
                        disabled={isProcessing}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[9px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                        id="btn-simulated-paid-success"
                      >
                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        <span>Simulate GPay Success</span>
                      </button>
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-2 bg-slate-150 hover:bg-slate-200 text-slate-600 font-bold text-[9px] py-1.5 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Dynamic GPay Scanner QR Code */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center text-center p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative min-h-[200px]">
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest absolute top-2.5 left-2.5">GPay Scanner</span>

              
              {qrCodeUrl ? (
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-1 mt-1 transition-transform duration-300 hover:scale-105">
                  <img 
                    src={qrCodeUrl} 
                    alt="Scan GPay QR Code" 
                    className="w-32 h-32 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-[8px] font-mono font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-0.5">
                    <QrCode className="h-2.5 w-2.5" />
                    <span>Scan Amount: ₹{getFinalAmount()}</span>
                  </div>
                </div>
              ) : (
                <div className="h-32 w-32 flex items-center justify-center border border-dashed border-slate-300 rounded-xl bg-slate-100">
                  <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
                </div>
              )}

              <p className="text-[9.5px] font-semibold text-slate-500 leading-snug">
                Scan with Google Pay, PhonePe or standard UPI app
              </p>

              {/* Direct Deeplink Button */}
              <a 
                href={upiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[9.5px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Launch Google Pay client"
              >
                <span>Launch GPay</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </a>
            </div>

          </div>

          {/* Wall of Fame Supporters Ticker */}
          <div className="border-t border-slate-100 pt-3 space-y-2" id="supporters-wall-of-fame">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="h-3 w-3 text-amber-500" />
                Recent Contributors Wall
              </span>
              <span className="text-[8.5px] font-mono font-bold text-slate-400 uppercase">
                {supportersList.length} total supporters
              </span>
            </div>

            {/* Scrolling Feed layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 max-h-[90px] overflow-y-auto pr-1">
              {supportersList.map((sup) => (
                <div 
                  key={sup.id} 
                  className="bg-slate-50 border border-slate-200/50 p-2 rounded-lg space-y-1 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold text-slate-700 truncate">{sup.name}</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 font-black px-1 rounded border border-emerald-100 shrink-0 font-mono">
                      ₹{sup.amount}
                    </span>
                  </div>
                  {sup.message && (
                    <p className="text-[9.5px] text-slate-500 leading-normal italic font-sans truncate">
                      "{sup.message}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info & Disclaimer link */}
        <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => setShowDisclaimer(true)}
            className="text-[9px] font-mono text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
            id="modal-btn-trigger-disclaimer"
          >
            <Info className="h-3 w-3 text-slate-400" />
            <span>ASPIRES ACADEMY Notice & Board Policy</span>
          </button>
          
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>

      {/* Disclaimer Overlay Modal */}
      {showDisclaimer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn"
          id="modal-disclaimer-overlay"
          onClick={() => setShowDisclaimer(false)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative space-y-3 animate-scaleUp"
            id="modal-disclaimer-body"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <ShieldAlert className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Official Disclaimer</h4>
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">ASPIRES ACADEMY Notice</p>
                </div>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                title="Close disclaimer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content body */}
            <div className="space-y-2.5 text-[11px] text-slate-600 leading-relaxed max-h-[250px] overflow-y-auto pr-1 font-sans">
              <p className="font-bold text-slate-800">
                ASPIRES ACADEMY is an independent self-guided preparation and AI educational platform dedicated to assisting public service exam students.
              </p>
              
              <p>
                <strong>No Affiliation:</strong> We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with the <strong>Union Public Service Commission (UPSC)</strong>, the <strong>Tamil Nadu Public Service Commission (TNPSC)</strong>, or any central or state government body, department, or agency.
              </p>

              <p>
                <strong>Educational Materials:</strong> All study plans, materials, dynamic mock testing databases, and evaluated essays are provided solely for personal diagnostic, study assistance, and educational support.
              </p>

              <p>
                <strong>Not Official Counsel:</strong> The AI scores, evaluations, and voice briefings provided by the system are generated algorithmically to target diagnostic gaps, and do not represent actual evaluation methodologies of civil service boards. Aspirants are strongly encouraged to always consult the official portals (<strong>upsc.gov.in</strong> and <strong>tnpsc.gov.in</strong>) for official instructions, updates, schedules, and gazettes.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-2.5 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
