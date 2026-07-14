import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Volume2, Download, Trash2, HelpCircle, CheckCircle, BrainCircuit, RefreshCw, Layers, Crown } from 'lucide-react';
import { ExamType } from '../types';

interface NoteData {
  title: string;
  syllabusSubject: string;
  coreSummary: string;
  citations: string[];
  activeRecallQuestions: { question: string; answer: string }[];
  isOffline?: boolean;
  timestamp?: string;
}

interface NotesGeneratorViewProps {
  selectedExam: ExamType;
  onVoicePlay?: (text: string, title: string) => void;
  isPremium?: boolean;
  onPremiumClick?: () => void;
}

const PRESET_TOPICS: Record<ExamType, { topic: string; keywords: string }[]> = {
  UPSC: [
    { topic: 'Fundamental Rights', keywords: 'Part III, Articles 12-35, Magna Carta, Writ remedies Article 32' },
    { topic: 'Panchayati Raj Institutions', keywords: '73rd Amendment, Article 243, Balwant Rai Mehta, Local Self Government' },
    { topic: 'Revolt of 1857', keywords: 'Mangal Pandey, Bahadur Shah II, Doctrine of Lapse, Economic drain theory' },
    { topic: 'Elections and Representation', keywords: 'Article 324, Model Code of Conduct, Delimitation, RP Act 1951' }
  ],
  TNPSC_G1: [
    { topic: 'Sangam Era', keywords: 'Tolkappiyam, Five Thinais, Chera Chola Pandya, Maduraikanchi' },
    { topic: 'Self Respect Movement', keywords: 'Periyar E.V.R, Justice Party, Kudi Arasu, Anti-Hindi Agitations 1937' },
    { topic: 'Archaeological Sites in Tamil Nadu', keywords: 'Keezhadi carbon date, Adichanallur urn burials, Kodumanal trade' },
    { topic: 'Development Administration', keywords: 'Socio-economic growth Tamil Nadu, Dravidian Model, Human Development Index' }
  ],
  TNPSC_G2: [
    { topic: 'Sangam Era', keywords: 'Ettutogai, Pathupattu, Thinai classification' },
    { topic: 'Role of Tamil Nadu in Freedom Struggle', keywords: 'Veerapandiya Kattabomman, V.O. Chidambaranar Swadeshi Steam, Subramania Bharati' },
    { topic: 'Industrial Map of Tamil Nadu', keywords: 'Detroit of Asia, Leather clusters Ambur, Textile valley Karur' },
    { topic: 'Reservation Policy in TN', keywords: '69% reservation, Ambasankar Commission, Article 15(4) and 16(4)' }
  ],
  TNPSC_G4: [
    { topic: 'Thirukkural Ethics', keywords: 'Thiruvalluvar, Aram, Porul, Inbam, Administrative values' },
    { topic: 'Tamil Literature Chronology', keywords: 'Silappatikaram, Manimekalai, Nayanmar and Alwar saints' },
    { topic: 'Important Schemes of TN Govt', keywords: 'Pudhumai Penn, Illam Thedi Kalvi, Makkalai Thedi Maruthuvam' },
    { topic: 'Aptitude Simple Interest', keywords: 'Formulas, Compound comparison, Rate of interest derivations' }
  ],
  SSC_CGL: [
    { topic: 'Quantitative Aptitude Geometry', keywords: 'Centroid, Incenter, Orthocenter, Congruency & Similarity of Triangles, Cyclic Quadrilaterals' },
    { topic: 'Active to Passive Voice Rules', keywords: 'Tense transitions, Imperative sentences, Interrogative transformations, Prepositional changes' },
    { topic: 'Syllogism & Venn Diagrams', keywords: 'All A are B, Some B are C, No A is C, At least some, Possibility cases' },
    { topic: 'Constitutional Bodies', keywords: 'Election Commission Art 324, UPSC Art 315, CAG Art 148, Finance Commission Art 280' }
  ]
};

// Simple Markdown-like formatter for a clean, secure view without external library failure risk
function FormattedContent({ text }: { text: string }) {
  if (!text) return null;
  
  const lines = text.split('\n');
  return (
    <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers ###
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="text-base font-extrabold text-slate-950 mt-5 pt-2 border-b border-slate-200 pb-1.5 uppercase tracking-wider font-mono">
              {trimmed.replace(/^###\s*/, '')}
            </h4>
          );
        }
        
        // Headers ##
        if (trimmed.startsWith('##')) {
          return (
            <h3 key={idx} className="text-lg font-extrabold text-slate-950 mt-6 pt-4 flex items-center gap-2 font-display">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              {trimmed.replace(/^##\s*/, '')}
            </h3>
          );
        }
        
        // List items *
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const content = trimmed.replace(/^[\*\-]\s*/, '');
          return (
            <li key={idx} className="ml-4 list-disc pl-1.5 text-slate-800 text-sm md:text-base leading-relaxed">
              {renderBoldText(content)}
            </li>
          );
        }
        
        // Numbered list
        if (/^\d+\.\s*/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s*/, '');
          const num = trimmed.match(/^\d+/)?.[0] || '1';
          return (
            <div key={idx} className="flex gap-2.5 pl-2 text-sm md:text-base leading-relaxed">
              <span className="font-mono font-bold text-emerald-600">{num}.</span>
              <p className="text-slate-800 flex-1">{renderBoldText(content)}</p>
            </div>
          );
        }
        
        if (trimmed === '') {
          return <div key={idx} className="h-3" />;
        }
        
        return <p key={idx} className="text-slate-800 text-sm md:text-base leading-relaxed">{renderBoldText(trimmed)}</p>;
      })}
    </div>
  );
}

function renderBoldText(rawText: string) {
  const parts = rawText.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    // Odd indexes represent the captured text inside **
    if (index % 2 === 1) {
      return <strong key={index} className="font-bold text-slate-950 bg-emerald-500/10 px-1 rounded">{part}</strong>;
    }
    return part;
  });
}

export default function NotesGeneratorView({ 
  selectedExam, 
  onVoicePlay, 
  isPremium = false, 
  onPremiumClick 
}: NotesGeneratorViewProps) {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeNote, setActiveNote] = useState<NoteData | null>(null);
  const [savedNotes, setSavedNotes] = useState<NoteData[]>([]);
  const [revealedCardIndex, setRevealedCardIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Free Tier Usage Counting state
  const [notesCount, setNotesCount] = useState<number>(() => {
    const val = localStorage.getItem('aspires_notes_gen_count');
    return val ? parseInt(val, 10) : 0;
  });

  useEffect(() => {
    // Load saved notes from localStorage
    const saved = localStorage.getItem('ai_study_notes');
    if (saved) {
      try {
        setSavedNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved notes:', e);
      }
    }
  }, []);

  // Handle prefilled topics from Study Planner
  useEffect(() => {
    const prefill = localStorage.getItem('notes_topic_prefill');
    if (prefill) {
      setTopic(prefill);
      setKeywords('Syllabus deep dive, key pointers, standard references');
      localStorage.removeItem('notes_topic_prefill');
      setTimeout(() => {
        handleGenerateNotes(prefill, 'Syllabus deep dive, key pointers, standard references');
      }, 300);
    }
  }, [selectedExam]);

  const handleGenerateNotes = async (customTopic?: string, customKeywords?: string) => {
    const targetTopic = customTopic || topic;
    const targetKeywords = customKeywords !== undefined ? customKeywords : keywords;

    if (!targetTopic.trim()) {
      alert('Please provide a study topic name.');
      return;
    }

    if (!isPremium && notesCount >= 2) {
      alert("Free Tier Limit Reached: You have reached your daily limit of 2 AI Notes generations. Upgrade to ASPIRES Premium via Google Pay to unlock unlimited custom notes & recall cards!");
      onPremiumClick?.();
      return;
    }

    setLoading(true);
    setRevealedCardIndex(null);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          keywords: targetKeywords,
          exam: selectedExam
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from notes engine');
      }

      const data: NoteData = await response.json();
      const updatedNote: NoteData = {
        ...data,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      setActiveNote(updatedNote);
      
      // Auto-save to list
      saveNoteToList(updatedNote);

      if (!isPremium) {
        const newCount = notesCount + 1;
        setNotesCount(newCount);
        localStorage.setItem('aspires_notes_gen_count', String(newCount));
      }

    } catch (err) {
      console.error(err);
      alert('Error generating study notes. Operating in smart offline fallback mode.');
    } finally {
      setLoading(false);
    }
  };

  const saveNoteToList = (note: NoteData) => {
    const existing = localStorage.getItem('ai_study_notes');
    let list: NoteData[] = [];
    if (existing) {
      try {
        list = JSON.parse(existing);
      } catch (e) {}
    }

    // Filter duplicates
    list = list.filter(item => item.title.toLowerCase() !== note.title.toLowerCase());
    list.unshift(note); // Add to top
    
    localStorage.setItem('ai_study_notes', JSON.stringify(list));
    setSavedNotes(list);
  };

  const handleDeleteNote = (titleToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedNotes.filter(n => n.title !== titleToDelete);
    localStorage.setItem('ai_study_notes', JSON.stringify(updated));
    setSavedNotes(updated);
    
    if (activeNote && activeNote.title === titleToDelete) {
      setActiveNote(null);
    }
    showToast('Revision card deleted successfully');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadMarkdown = (note: NoteData) => {
    const markdownContent = `# ${note.title}
**Syllabus Focus:** ${note.syllabusSubject}
**Textbook & Board Citations:** ${note.citations.join(', ')}

---

${note.coreSummary}

---
## Active Recall Self-Assessment Cards
${note.activeRecallQuestions.map((q, idx) => `### Q${idx + 1}: ${q.question}\n**A:** ${q.answer}\n`).join('\n')}
`;
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_revision_notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Markdown notes exported to downloads');
  };

  const handleListenNote = () => {
    if (!activeNote || !onVoicePlay) return;
    
    // Create an elegant lecture script
    const spokenText = `Lecture outline for ${activeNote.title}. Mapped to ${activeNote.syllabusSubject}. 
    Official References include ${activeNote.citations.join(' and ')}.
    
    Let us review the core revision material:
    ${activeNote.coreSummary.replace(/###/g, '').replace(/##/g, '').replace(/\*\*/g, '')}
    
    Now, let us test your comprehension with some active recall revision cards:
    ${activeNote.activeRecallQuestions.map((q, idx) => `Card ${idx + 1}: ${q.question}`).join(' ')}
    
    This concludes the overview lecture. Re-read the notes to solidify your understanding.`;
    
    onVoicePlay(spokenText, activeNote.title);
  };

  const loadPreset = (preset: { topic: string; keywords: string }) => {
    setTopic(preset.topic);
    setKeywords(preset.keywords);
    handleGenerateNotes(preset.topic, preset.keywords);
  };

  const activePresets = PRESET_TOPICS[selectedExam] || [];

  return (
    <div className="space-y-6" id="notes-generator-viewport">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-950 flex items-center gap-2.5 font-display">
            <BrainCircuit className="h-6.5 w-6.5 text-emerald-600" />
            AI High-Yield Notes & Recall Cards
          </h3>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed">
            Convert any syllabus topic or specialized keywords into formatted micro-notes, active recall testing cards, and speech lectures.
          </p>
        </div>
        <span className="text-xs uppercase font-mono font-bold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 self-start sm:self-auto">
          Active: {selectedExam} Syllabus Mapping
        </span>
      </div>

      {/* Grid of presets and inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Custom Notes Form */}
          <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm space-y-4.5">
            <h4 className="text-sm font-extrabold text-slate-950 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-600" />
              Compile Study Notes
            </h4>

            {!isPremium && (
              <div className="bg-amber-500/10 border border-amber-500/35 p-3 rounded-xl flex items-center justify-between gap-2.5 text-xs font-semibold text-slate-800 animate-fadeIn mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-amber-500 animate-bounce shrink-0" />
                  <span>Free Notes: <strong className="text-amber-700">{notesCount} / 2</strong> generated.</span>
                </div>
                <button
                  onClick={onPremiumClick}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded-lg text-[9.5px] font-black shadow-sm transition-all cursor-pointer shrink-0"
                >
                  Go Unlimited 💎
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Topic Focus</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Fundamental Rights, Sangam Social Structure, simple interest"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Specific Sub-Keywords (Optional)</label>
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. Writ jurisdiction Article 32, Habeas Corpus, reasonable restrictions (comma separated)"
                  rows={2.5}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={() => handleGenerateNotes()}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Assembling Lecture Note...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4" />
                    Generate Interactive Revision Deck
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Topics */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3.5">
            <h4 className="text-sm font-extrabold text-slate-950 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-emerald-600" />
              Syllabus Presets
            </h4>
            <p className="text-xs text-slate-500">Click a recommended topic from the official {selectedExam} syllabus to generate instant summaries:</p>
            
            <div className="flex flex-wrap gap-2">
              {activePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPreset(preset)}
                  className="bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {preset.topic}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Deck Registry */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-600" />
                Your Saved Notebooks
              </h4>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {savedNotes.length} Saved
              </span>
            </div>

            {savedNotes.length === 0 ? (
              <p className="text-[11px] text-slate-400 py-4 text-center italic">No saved notebooks. Generate a topic above to begin caching revision cards.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {savedNotes.map((note) => {
                  const isActive = activeNote && activeNote.title === note.title;
                  return (
                    <div
                      key={note.title}
                      onClick={() => {
                        setActiveNote(note);
                        setRevealedCardIndex(null);
                      }}
                      className={`group p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-150 text-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <h5 className="font-bold text-sm truncate group-hover:text-emerald-800">{note.title}</h5>
                        <p className="text-xs text-slate-500 truncate">{note.syllabusSubject}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadMarkdown(note);
                          }}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                          title="Export Markdown"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteNote(note.title, e)}
                          className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Notebook"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Details/Active Note Area */}
        <div className="lg:col-span-7 space-y-6">
          {activeNote ? (
            <div className="space-y-6">
              
              {/* Revision Desk Header */}
              <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {activeNote.syllabusSubject}
                    </span>
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-950 pt-1 font-display">
                      {activeNote.title}
                    </h3>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    {onVoicePlay && (
                      <button
                        onClick={handleListenNote}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm px-4.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/10"
                        title="Read this note using AI Voice Teacher"
                      >
                        <Volume2 className="h-4 w-4" />
                        Listen Lecture
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadMarkdown(activeNote)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Download className="h-4 w-4" />
                      Markdown
                    </button>
                  </div>
                </div>

                {/* Citations block */}
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-400">BOARD CITATIONS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNote.citations.map((c, i) => (
                      <span key={i} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-150 text-slate-600 font-mono text-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Main Revision Notes Body */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/60 max-h-[420px] overflow-y-auto pr-2">
                  <FormattedContent text={activeNote.coreSummary} />
                </div>
              </div>

              {/* Active Recall Flashcard Testing */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-emerald-600" />
                    Active Recall Flashcards
                  </h4>
                  <p className="text-[11px] text-slate-500">Click any card to reveal the correct high-precision answer key to self-evaluate your recall.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeNote.activeRecallQuestions.map((q, idx) => {
                    const isRevealed = revealedCardIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setRevealedCardIndex(isRevealed ? null : idx)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isRevealed 
                            ? 'bg-slate-900 border-slate-800 text-white' 
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-150 text-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-2 flex-1">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${isRevealed ? 'text-amber-400' : 'text-slate-400'}`}>
                              RECALL CARD {idx + 1}
                            </span>
                            <p className={`text-xs font-bold leading-relaxed ${isRevealed ? 'text-slate-100' : 'text-slate-850'}`}>
                              {q.question}
                            </p>
                            
                            {isRevealed && (
                              <div className="pt-3 border-t border-slate-800 space-y-1.5 animate-fadeIn">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-extrabold block">ANSWER KEY:</span>
                                <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                                  {q.answer}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <span className={`text-[10px] font-mono uppercase font-bold py-1 px-2 rounded ${
                            isRevealed ? 'bg-amber-450 text-slate-950' : 'bg-slate-150 text-slate-600 border border-slate-250'
                          }`}>
                            {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-5 shadow-sm h-full min-h-[380px]">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-extrabold text-base text-slate-900 font-display">Awaiting Study Selection</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                  Generate a custom study note or select one from your saved list on the left to activate the interactive recall desk and audio teacher reader.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadPreset(activePresets[0])}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-500/10"
                >
                  Load {activePresets[0]?.topic || 'Preset'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
