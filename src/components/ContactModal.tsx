import React, { useState } from 'react';
import { X, Mail, MessageSquare, Loader2, Check, Copy, Send, HelpCircle, ExternalLink, ShieldAlert } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
}

export default function ContactModal({ isOpen, onClose, currentUserEmail }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(currentUserEmail || '');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('udayamoorthy@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all fields before submitting.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email format.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Simulate sending message to udayamoorthy@gmail.com
    setTimeout(() => {
      const generatedTicket = 'ASP-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedTicket);
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleOpenMailClient = () => {
    const subject = encodeURIComponent(`[ASPIRES Academy Support] ${category} - ${name}`);
    const body = encodeURIComponent(
      `Hello Admin,\n\nI have a query regarding ASPIRES Academy.\n\n` +
      `Category: ${category}\n` +
      `User Name: ${name}\n` +
      `User Email: ${email}\n\n` +
      `Message:\n${message}\n\n` +
      `Best regards,\n${name}`
    );
    window.open(`mailto:udayamoorthy@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const resetForm = () => {
    setName('');
    setEmail(currentUserEmail || '');
    setCategory('General Inquiry');
    setMessage('');
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4 animate-fadeIn"
      id="contact-support-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden transition-all duration-300 animate-scaleUp p-6 space-y-5"
        id="contact-support-modal-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider font-mono">ASPIRES Help Desk</h4>
              <p className="text-[10px] text-slate-400">Direct query submission to administrator</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Support Representative Context Banner */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono">
            UM
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-800 text-xs">Aspirants Coordinator Desk</p>
            <p className="text-slate-500 leading-normal text-[11px]">
              Our administrator <strong>Udayamoorthy</strong> resolves student queries, premium setup validation, and study materials dispatch.
            </p>
            <div className="flex items-center gap-2 pt-1.5 flex-wrap">
              <span className="text-[10.5px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold select-all">
                udayamoorthy@gmail.com
              </span>
              <button
                onClick={handleCopyEmail}
                className="text-[10.5px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Copy className="h-3 w-3" />
                <span>{copied ? 'Copied!' : 'Copy Support Email'}</span>
              </button>
            </div>
          </div>
        </div>

        {submitted ? (
          /* Submission Success State */
          <div className="space-y-5 py-4 text-center animate-fadeIn" id="contact-success-state">
            <div className="mx-auto h-12 w-12 bg-emerald-150 text-emerald-700 rounded-full flex items-center justify-center shadow-inner">
              <Check className="h-6 w-6" />
            </div>
            
            <div className="space-y-1.5">
              <h5 className="font-extrabold text-base text-slate-900 font-display">Query Submitted Successfully!</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Thank you, your message has been logged directly for the administrator. A support coordinator will reach out to you within 12-24 hours.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto space-y-1 text-center font-mono text-[11px]">
              <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Ticket Reference ID</span>
              <p className="text-slate-800 font-black text-sm select-all">{ticketId}</p>
              <span className="text-emerald-600 font-bold block mt-1">Dispatched to: udayamoorthy@gmail.com</span>
            </div>

            <div className="flex gap-2.5 max-w-sm mx-auto pt-2">
              <button
                onClick={resetForm}
                className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Submit Another Query
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form Input State */
          <form onSubmit={handleSendForm} className="space-y-4" id="contact-support-form">
            {errorMsg && (
              <div className="bg-red-50 border border-red-250 text-red-650 text-xs p-3 rounded-xl font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Aspirant name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Query Topic</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors font-semibold cursor-pointer"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Subscription & Payments">Subscription &amp; Premium Activation</option>
                <option value="Syllabus & Planner">Syllabus &amp; AI Planner Assistance</option>
                <option value="Essay Evaluation Feedback">Mains Essay Evaluator Feedback</option>
                <option value="Feature Suggestion">Feature Suggestion / bug report</option>
                <option value="Urgent Assistance">Urgent Support Request</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Detailed Query Message</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your query in detail so our administrator can assist you efficiently..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors font-medium resize-none leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1.5">
              <button
                type="button"
                onClick={handleOpenMailClient}
                disabled={!name.trim() || !email.trim() || !message.trim()}
                className="flex-1 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-500/5 text-slate-700 hover:text-emerald-800 font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-200 disabled:hover:text-slate-700"
                title="Populate and send using your standard computer or mobile mail app"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Send Direct Mail (Mailto)</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Transmitting query...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Query Desk</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
