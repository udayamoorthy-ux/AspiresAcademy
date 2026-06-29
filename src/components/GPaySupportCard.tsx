import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle2, ShieldAlert, Sparkles, Loader2, X, Info, QrCode, ArrowRight, Check, Users, GraduationCap } from 'lucide-react';

interface GPaySupportCardProps {
  isOpen: boolean;
  onClose: () => void;
  onVoicePlay?: (text: string, title: string) => void;
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
    amount: 150,
    message: 'The Mains Essay Evaluator has been a lifesaver for my TNPSC Group 1 prep!',
    timestamp: '2 hours ago'
  },
  {
    id: 's2',
    name: 'Karthik Raja S',
    amount: 50,
    message: 'Excellent syllabus tracker. Ad-free clean study portal, supporting to keep it running.',
    timestamp: '5 hours ago'
  },
  {
    id: 's3',
    name: 'Amit Sharma (UPSC Aspirant)',
    amount: 250,
    message: 'The AI voice lecture summaries of policy briefs on CURRENT AFFAIRS are absolute gold.',
    timestamp: 'Yesterday'
  },
  {
    id: 's4',
    name: 'Nandhini Murugesan',
    amount: 100,
    message: 'Customizable planners combined with mock tests help me target weak topics. Thank you!',
    timestamp: '2 days ago'
  }
];

export default function GPaySupportCard({ isOpen, onClose, onVoicePlay }: GPaySupportCardProps) {
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
    return customAmount ? parseFloat(customAmount) : amount;
  };

  // Generate UPI link & QR Code URL in the background
  useEffect(() => {
    const finalAmt = getFinalAmount();
    if (finalAmt > 0) {
      const senderName = supporterName.trim() || 'Aspirant';
      const note = `Aspires Academy contribution`;
      
      // Standard UPI deep link
      const link = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Aspires Academy')}&am=${finalAmt}&cu=INR&tn=${encodeURIComponent(note)}`;
      setUpiLink(link);
      
      // Dynamic QR Code generation with api.qrserver.com
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}&margin=10`;
      setQrCodeUrl(qrUrl);
    } else {
      setUpiLink('');
      setQrCodeUrl('');
    }
  }, [amount, customAmount, supporterName]);

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
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">Aspires Academy Portal</h4>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Column 1: Header and Description & Amount select */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-slate-800">Support Our Server Infrastructure</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  We provide high-quality AI study planners, essay evaluations, and mock tests completely free and ad-free. Support our AI server costs to keep this portal accessible to everyone!
                </p>
              </div>

              {/* Success Notification */}
              {justAddedSelf && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] px-3 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Thank you! Your simulated contribution has been added to our board below.</span>
                </div>
              )}

              {/* Quick Preset Selector */}
              <div className="space-y-2">
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
                          ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm'
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
                    className="w-full pl-6 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Optional Supporter Details */}
            <div className="lg:col-span-4 space-y-4 self-center">
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">2. Supporter Info (Optional)</span>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Priya S.)"
                    value={supporterName}
                    onChange={(e) => setSupporterName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Short encouraging note..."
                    value={supporterMessage}
                    onChange={(e) => setSupporterMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Action Simulation Confirm */}
              <div className="pt-1">
                {!showConfirmation ? (
                  <button
                    onClick={() => {
                      setShowConfirmation(true);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10.5px] py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Confirm Scan Contribution</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl space-y-1.5 animate-fadeIn">
                    <p className="text-[9.5px] text-amber-800 font-bold leading-normal">
                      Confirm simulation of your scan?
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleConfirmPaid}
                        disabled={isProcessing}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[9px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-0.5"
                      >
                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        <span>Paid & Simulated</span>
                      </button>
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[9px] py-1.5 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: ONLY the Pristine QR Code Container (NO visible UPI ID text!) */}
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
            <span>Aspires Academy Notice & Board Policy</span>
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
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Aspires Academy Notice</p>
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
                Aspires Academy is an independent self-guided preparation and AI educational platform dedicated to assisting public service exam students.
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
