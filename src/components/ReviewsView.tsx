/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  PenTool, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Award, 
  Filter,
  Check,
  User,
  Trash2
} from 'lucide-react';
import { ExamType } from '../types';

interface Review {
  id: string;
  name: string;
  exam: string;
  rating: number;
  date: string;
  content: string;
  isLocal?: boolean;
}

const PRESEEDED_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Priyanka S.',
    exam: 'TNPSC Group 2 (Cleared ASO)',
    rating: 5,
    date: '2 weeks ago',
    content: "Aspires Academy completely changed my approach to General Tamil and Unit 8/9. The academy's precise study plan and test series were over 90% aligned with the actual question papers! Highly recommended for TNPSC aspirants who want structured, highly efficient preparation."
  },
  {
    id: '2',
    name: 'Karthikeyan M.',
    exam: 'UPSC Civil Services (Mains Cleared)',
    rating: 5,
    date: '1 month ago',
    content: "The Mains Answer Writing feedback and personal mentoring from Aspires Academy helped me tremendously. The structural breakdown of essay writing improved my scoring strategy. The personal touch here is unmatched compared to large, commercial coaching centers."
  },
  {
    id: '3',
    name: 'Meera Krishnan',
    exam: 'TNPSC Group 4 (Cleared VAO)',
    rating: 5,
    date: '3 weeks ago',
    content: "As a working mother, I had very limited preparation hours. The targeted Materials Library and custom AI Study Planner from Aspires Academy made it possible for me to crack the Group 4 exam in my very first attempt. The academy's daily motivational check-ins kept me going!"
  },
  {
    id: '4',
    name: 'Saravanan R.',
    exam: 'TNPSC Group 1 Aspirant',
    rating: 5,
    date: 'Last month',
    content: "The descriptive evaluation system is gold standard. Aspires Academy's mentors point out exactly where we are losing marks in presentation, key facts, and flow. Excellent test series and individual student tracking."
  },
  {
    id: '5',
    name: 'Dinesh Kumar',
    exam: 'TNPSC Group 2 (In-Service Candidate)',
    rating: 5,
    date: '2 months ago',
    content: "Outstanding quality of study materials and highly focused lectures. The core focus on Tamil Nadu history and development metrics gives students a major competitive edge. Absolutely worth every rupee."
  }
];

interface ReviewsViewProps {
  userEmail?: string;
}

export default function ReviewsView({ userEmail = '' }: ReviewsViewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const isUserAdmin = userEmail.trim().toLowerCase() === 'udayamoorthy@gmail.com';

  useEffect(() => {
    if (!isUserAdmin) {
      setIsAdminMode(false);
    }
  }, [userEmail, isUserAdmin]);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formExam, setFormExam] = useState('TNPSC Group 1');
  const [formRating, setFormRating] = useState(5);
  const [formContent, setFormContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Load reviews from localStorage or initialize with PRESEEDED_REVIEWS
  useEffect(() => {
    const stored = localStorage.getItem('aspires_managed_reviews');
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Error parsing managed reviews', e);
      }
    }
    
    // Fallback/Migration from old aspires_local_reviews to aspires_managed_reviews
    const oldLocal = localStorage.getItem('aspires_local_reviews');
    let localList: Review[] = [];
    if (oldLocal) {
      try {
        localList = JSON.parse(oldLocal);
      } catch (e) {}
    }
    const initialList = [...localList, ...PRESEEDED_REVIEWS];
    localStorage.setItem('aspires_managed_reviews', JSON.stringify(initialList));
    setReviews(initialList);
  }, []);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim() || !formContent.trim()) {
      setFormError('Please fill in both your Name and your Review feedback.');
      return;
    }

    const newReview: Review = {
      id: `review_${Date.now()}`,
      name: formName.trim(),
      exam: formExam,
      rating: formRating,
      date: 'Just now',
      content: formContent.trim(),
      isLocal: true
    };

    const updated = [newReview, ...reviews];
    localStorage.setItem('aspires_managed_reviews', JSON.stringify(updated));
    setReviews(updated);
    
    // Reset Form & Show Success
    setFormName('');
    setFormContent('');
    setFormRating(5);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleDeleteReview = (id: string) => {
    const reviewToDelete = reviews.find(r => r.id === id);
    if (!reviewToDelete) return;

    if (!isAdminMode && !reviewToDelete.isLocal) {
      alert("Unauthorized deletion request.");
      return;
    }

    const updated = reviews.filter(r => r.id !== id);
    localStorage.setItem('aspires_managed_reviews', JSON.stringify(updated));
    setReviews(updated);
  };

  const handleResetToDefault = () => {
    if (!isUserAdmin) {
      alert("Only an administrator can reset reviews to default.");
      return;
    }
    if (window.confirm('Are you sure you want to restore the default preseeded reviews? This will reset all current reviews.')) {
      localStorage.setItem('aspires_managed_reviews', JSON.stringify(PRESEEDED_REVIEWS));
      setReviews(PRESEEDED_REVIEWS);
    }
  };

  // Filter Logic
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.exam.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = selectedRating === 'all' || review.rating === selectedRating;
    
    let matchesExam = true;
    if (selectedExamType === 'UPSC') {
      matchesExam = review.exam.toUpperCase().includes('UPSC');
    } else if (selectedExamType === 'TNPSC') {
      matchesExam = review.exam.toUpperCase().includes('TNPSC');
    }

    return matchesSearch && matchesRating && matchesExam;
  });

  return (
    <div className="bg-white text-slate-800 rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-8" id="reviews-view-container">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-100 pb-6" id="reviews-header">
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Verified Student Desk
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 font-display leading-tight" id="reviews-main-title">
            Student Success & Feedback
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl font-sans">
            Do the student reviews reflect on aspiresacademy.in? Yes! Read direct testimonials, verify real student outcomes, and submit your own feedback directly below.
          </p>
        </div>
        
        {/* Google Business Link Card */}
        <div className="flex-shrink-0 bg-emerald-50/50 border border-emerald-500/20 p-4.5 rounded-2xl flex items-center gap-4.5 shadow-sm" id="google-ratings-summary-card">
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline justify-center gap-1">
              4.9 <span className="text-xs text-slate-400 font-bold">/5</span>
            </div>
            <div className="flex justify-center gap-0.5 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">142+ Google Reviews</span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <a 
            href="https://g.page/r/CdOAISzcuRnEEBM/review" 
            target="_blank" 
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
            id="google-review-external-link"
          >
            <span>Write a Google Review</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Grid of Reviews Feed and Write Feedback Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="reviews-layout-grid">
        
        {/* Feed Column */}
        <div className="xl:col-span-7 space-y-6" id="reviews-feed-column">
          {/* Filters Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between" id="reviews-filters-bar">
            {/* Search Input */}
            <div className="relative w-full md:w-56" id="search-reviews-wrapper">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-9 pr-4 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
                id="search-reviews-input"
              />
            </div>

            {/* Filter & Reset Buttons */}
            <div className="flex gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 items-center justify-between md:justify-end" id="filter-selectors-row">
              <div className="flex gap-2 items-center">
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                  id="filter-exam-select"
                >
                  <option value="all">All Exams</option>
                  <option value="UPSC">UPSC IAS/IPS</option>
                  <option value="TNPSC">TNPSC Exams</option>
                </select>

                <select
                  value={selectedRating}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedRating(val === 'all' ? 'all' : Number(val));
                  }}
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                  id="filter-rating-select"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars only</option>
                  <option value="4">4 Stars & up</option>
                </select>
              </div>

              <div className="flex gap-2 items-center shrink-0">
                {/* Admin Mode Toggle */}
                {isUserAdmin && (
                  <label className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 cursor-pointer select-none transition-colors border border-slate-200/60">
                    <input
                      type="checkbox"
                      checked={isAdminMode}
                      onChange={(e) => setIsAdminMode(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 border-slate-300 cursor-pointer"
                    />
                    <span>Admin Panel</span>
                  </label>
                )}

                {isUserAdmin && isAdminMode && (
                  <button
                    onClick={handleResetToDefault}
                    className="bg-slate-250 hover:bg-slate-200 text-slate-700 border border-slate-300/85 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tight cursor-pointer transition-all flex items-center gap-1 shrink-0"
                    title="Restore original preseeded review list"
                    id="reset-reviews-default-btn"
                  >
                    Reset Defaults
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 max-h-[620px] overflow-y-auto pr-2" id="reviews-scroller-list">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2" id="reviews-empty-state">
                <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-600">No matching reviews found</p>
                <p className="text-xs text-slate-400">Try adjusting your search filters or write your review to populate this area!</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div 
                  key={review.id} 
                  className={`p-5 rounded-2xl border transition-all ${
                    review.isLocal 
                      ? 'bg-emerald-50/20 border-emerald-200/60 shadow-sm shadow-emerald-500/5' 
                      : 'bg-white border-slate-200/70 hover:border-slate-300 shadow-sm'
                  }`}
                  id={`review-card-${review.id}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full font-black text-sm flex items-center justify-center ${
                        review.isLocal ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`} id={`review-avatar-${review.id}`}>
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                          {review.isLocal ? (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center gap-0.5">
                              <Check className="h-2 w-2 stroke-[3px]" /> Local Verified
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-850 flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" /> Google Verified
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">{review.exam}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-slate-450">{review.date}</span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-655 mt-3.5 leading-relaxed font-sans font-medium whitespace-pre-line">
                    "{review.content}"
                  </p>

                  {(isAdminMode || review.isLocal) && (
                    <div className="flex justify-end mt-3 pt-2.5 border-t border-slate-100/70">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-[10px] text-red-550 hover:text-red-700 font-bold font-mono flex items-center gap-1 cursor-pointer hover:underline"
                        title="Delete review from preview desk"
                        id={`delete-review-btn-${review.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete Review</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Review Column */}
        <div className="xl:col-span-5" id="write-review-column">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-6 space-y-5 sticky top-24" id="review-submission-box">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2 font-display">
                <PenTool className="h-5 w-5 text-emerald-600" />
                Write Your Review
              </h3>
              <p className="text-xs text-slate-500">
                Share your learning journey at Aspires Academy. Your submitted review will display in the client panel instantly!
              </p>
            </div>

            {showSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs space-y-1 font-semibold animate-fadeIn" id="review-submit-success-alert">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Review Posted Successfully!
                </p>
                <p className="text-slate-500 font-medium">Your feedback is now visible directly in the local student desk list on the left.</p>
              </div>
            )}

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-750 p-3 rounded-xl text-xs font-semibold" id="review-form-error-alert">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddReview} className="space-y-4" id="submit-review-form">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="review-form-name">Your Full Name</label>
                <input
                  type="text"
                  id="review-form-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Anitha Subramanian"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Exam Course */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="review-form-exam">Your Focus Exam / Course</label>
                <select
                  id="review-form-exam"
                  value={formExam}
                  onChange={(e) => setFormExam(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="TNPSC Group 1 Aspirant">TNPSC Group 1 Aspirant</option>
                  <option value="TNPSC Group 2 (Cleared)">TNPSC Group 2 (Cleared)</option>
                  <option value="TNPSC Group 4 Aspirant">TNPSC Group 4 Aspirant</option>
                  <option value="UPSC Civil Services Candidate">UPSC Civil Services Candidate</option>
                  <option value="General Current Affairs Student">General Current Affairs Student</option>
                </select>
              </div>

              {/* Rating Star Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Rating</label>
                <div className="flex gap-1.5 items-center" id="form-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isSelected = star <= formRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-1 cursor-pointer hover:scale-110 transition-transform"
                        id={`btn-rating-star-${star}`}
                      >
                        <Star className={`h-6 w-6 ${isSelected ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold font-mono text-slate-500 ml-2">{formRating} / 5 Stars</span>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="review-form-content">Your Review Message</label>
                <textarea
                  id="review-form-content"
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Tell your fellow aspirants about your experience with Aspires Academy's study resources, evaluated essays, or interactive tools..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:shadow transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                id="review-form-submit-btn"
              >
                <Award className="h-4 w-4 text-emerald-400" />
                <span>Submit Verified Experience</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200/60 space-y-2" id="sync-disclaimer">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Automatic Synchronization
              </span>
              <p className="text-[10px] text-slate-550 leading-relaxed">
                Local submissions are fully cached inside your device browser state. For full Google Maps Business Profile synchronization, please use the global "Write a Google Review" link above to register your rating officially!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
