/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExamType, StudyPlan, PlannerTask } from '../types';
import { Calendar, Clock, Sparkles, CheckCircle2, ChevronRight, RefreshCw, Layers, PlusCircle, Trash2 } from 'lucide-react';

interface PlannerViewProps {
  selectedExam: ExamType;
}

export default function PlannerView({ selectedExam }: PlannerViewProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [totalDays, setTotalDays] = useState<number>(30);
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [targetDate, setTargetDate] = useState<string>(() => {
    const target = new Date();
    target.setDate(target.getDate() + 30);
    return target.toISOString().split('T')[0];
  });
  
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  
  // Custom added tasks
  const [customTopic, setCustomTopic] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>('General Studies');
  const [customDay, setCustomDay] = useState<number>(1);
  const [customHours, setCustomHours] = useState<number>(4);

  // Load from LocalStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem(`study_plan_${selectedExam}`);
    if (saved) {
      try {
        setStudyPlan(JSON.parse(saved));
      } catch (e) {
        console.warn("Issue loading saved schedule:", e);
      }
    } else {
      // Default initial generate suggestion without hitting API immediately
      setStudyPlan(null);
    }
  }, [selectedExam]);

  // Handle auto-updating target date when total days changes
  useEffect(() => {
    if (startDate) {
      const sDate = new Date(startDate);
      sDate.setDate(sDate.getDate() + Number(totalDays));
      setTargetDate(sDate.toISOString().split('T')[0]);
    }
  }, [totalDays, startDate]);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/study-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam: selectedExam,
          totalDays,
          dailyHours,
          startDate,
          targetDate
        }),
      });
      const data = await response.json();
      if (data && data.tasks) {
        // Add custom IDs and completion state
        const sanitizedTasks = data.tasks.map((t: any, idx: number) => ({
          id: t.id || `task-${selectedExam}-${idx}-${Date.now()}`,
          day: t.day || idx + 1,
          topic: t.topic || 'General Review',
          subject: t.subject || 'Syllabus',
          hours: t.hours || dailyHours,
          completed: false,
          subtasks: t.subtasks || []
        }));

        const newPlan: StudyPlan = {
          exam: selectedExam,
          totalDays,
          dailyHours,
          startDate,
          targetDate,
          tasks: sanitizedTasks
        };

        setStudyPlan(newPlan);
        localStorage.setItem(`study_plan_${selectedExam}`, JSON.stringify(newPlan));
      }
    } catch (error) {
      console.warn("Failed generating planner:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    if (!studyPlan) return;
    const updatedTasks = studyPlan.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedPlan = { ...studyPlan, tasks: updatedTasks };
    setStudyPlan(updatedPlan);
    localStorage.setItem(`study_plan_${selectedExam}`, JSON.stringify(updatedPlan));
  };

  const addCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyPlan || !customTopic.trim()) return;

    const newTask: PlannerTask = {
      id: `task-custom-${Date.now()}`,
      day: customDay,
      topic: customTopic,
      subject: customSubject,
      hours: customHours,
      completed: false,
      subtasks: ['Self study task', 'Review concepts']
    };

    // Sort tasks by day
    const updatedTasks = [...studyPlan.tasks, newTask].sort((a, b) => a.day - b.day);
    const updatedPlan = { ...studyPlan, tasks: updatedTasks };
    setStudyPlan(updatedPlan);
    localStorage.setItem(`study_plan_${selectedExam}`, JSON.stringify(updatedPlan));
    
    // Clear state
    setCustomTopic('');
  };

  const deleteCustomTask = (taskId: string) => {
    if (!studyPlan) return;
    const updatedTasks = studyPlan.tasks.filter(t => t.id !== taskId);
    const updatedPlan = { ...studyPlan, tasks: updatedTasks };
    setStudyPlan(updatedPlan);
    localStorage.setItem(`study_plan_${selectedExam}`, JSON.stringify(updatedPlan));
  };

  const clearCurrentPlan = () => {
    if (window.confirm("Are you sure you want to reset your study schedule? This will delete all checked off items.")) {
      setStudyPlan(null);
      localStorage.removeItem(`study_plan_${selectedExam}`);
    }
  };

  // Calculations
  const completedCount = studyPlan?.tasks.filter(t => t.completed).length || 0;
  const totalCount = studyPlan?.tasks.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalHoursLeft = studyPlan?.tasks.reduce((acc, curr) => acc + (curr.completed ? 0 : curr.hours), 0) || 0;

  return (
    <div className="space-y-6" id="planner-view-container">
      {/* Configuration Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-900">
              <Calendar className="h-5.5 w-5.5 text-amber-500" />
              Interactive Smart Study Planner
            </h2>
            <p className="text-xs text-slate-500">
              Calibrate your study limits. Our AI compiles a high-yield learning timeline mapping to specified dates.
            </p>
          </div>
          {studyPlan && (
            <button
              onClick={clearCurrentPlan}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Plan
            </button>
          )}
        </div>

        {!studyPlan ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="plan-generation-form">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Duration (Days)</label>
              <select
                id="select-duration-days"
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
              >
                <option value={15}>15 Days Intensive</option>
                <option value={30}>30 Days Blueprint</option>
                <option value={60}>60 Days Complete Course</option>
                <option value={90}>90 Days Mastery</option>
                <option value={180}>180 Days Extensive Path</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Study Hours Per Day</label>
              <select
                id="select-study-hours"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
              >
                <option value={2}>2 Hours (Part-time Working)</option>
                <option value={4}>4 Hours (Balanced Routine)</option>
                <option value={6}>6 Hours (Recommended Standard)</option>
                <option value={8}>8 Hours (Dedicated Aspirant)</option>
                <option value={10}>10 Hours (Rigorous Prep)</option>
                <option value={12}>12 Hours (Final Countdown)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Start Date</label>
              <input
                id="input-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex items-end">
              <button
                id="btn-generate-plan"
                disabled={loading}
                onClick={generatePlan}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Compiling Timeline...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Assemble AI Study Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Active Plan Overview Statistics */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="planner-stats-panel">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Duration</span>
                <p className="text-sm font-extrabold text-slate-800">{studyPlan.totalDays} Days Schedule</p>
                <p className="text-[10px] text-slate-400 font-mono">Ends: {studyPlan.targetDate}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Pending Load</span>
                <p className="text-sm font-extrabold text-slate-800">~{totalHoursLeft} Study Hours</p>
                <p className="text-[10px] text-slate-400 font-mono">At {studyPlan.dailyHours} hours/day</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Task Completion</span>
                <p className="text-sm font-extrabold text-slate-800">{completedCount} / {totalCount} Achieved</p>
                <p className="text-[10px] text-slate-400 font-mono">Keep writing summaries!</p>
              </div>
            </div>

            {/* Circular or Bar Progress */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Overall Progress</span>
                <span className="font-mono font-bold text-emerald-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {studyPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="planner-split-layout">
          {/* Main Tasks List */}
          <div className="lg:col-span-2 space-y-4" id="planner-tasks-column">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 mb-1">Study Plan Milestones</h3>
            
            <div className="space-y-3" id="milestones-scroll-list">
              {studyPlan.tasks.map((task) => (
                <div
                  key={task.id}
                  id={`milestone-card-${task.id}`}
                  className={`bg-white border rounded-xl p-5 transition-all duration-200 shadow-sm ${
                    task.completed 
                      ? 'border-emerald-200 bg-emerald-50/20 opacity-80' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center border transition-all duration-200 ${
                          task.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {task.completed && (
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold text-slate-600">
                            Day {task.day}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                            {task.subject}
                          </span>
                          <span className="text-[10px] text-slate-550 font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.hours} hrs recommended
                          </span>
                        </div>
                        <h4 className={`font-extrabold text-sm md:text-base text-slate-800 ${task.completed ? 'line-through text-slate-400 font-normal' : ''}`}>
                          {task.topic}
                        </h4>
                      </div>
                    </div>

                    {task.id.startsWith('task-custom-') && (
                      <button
                        onClick={() => deleteCustomTask(task.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Delete custom task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Subtasks or action checklists */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 pl-8 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recommended Actions:</p>
                      <ul className="space-y-1.5">
                        {task.subtasks.map((sub, sIdx) => (
                          <li key={sIdx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                            <ChevronRight className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span className={task.completed ? 'text-slate-400 line-through' : ''}>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area: Add Custom Tasks & Syllabus Mapping */}
          <div className="space-y-6" id="planner-sidebar-column">
            {/* Custom Task Addition Form */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 text-slate-850 space-y-4">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <PlusCircle className="h-4.5 w-4.5 text-amber-500" />
                  Append Custom Task
                </h4>
                <p className="text-xs text-slate-500">
                  Did you buy an extra textbook or attend an online lecture? Insert it into your schedule directly.
                </p>
              </div>

              <form onSubmit={addCustomTask} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Topic / Lecture Name</label>
                  <input
                    type="text"
                    required
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. Laxmikanth Chapter 15: Emergency Provisions"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Broad Category</label>
                    <select
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
                    >
                      <option value="Polity">Polity & Constitution</option>
                      <option value="History">History & Culture</option>
                      <option value="General Tamil">General Tamil</option>
                      <option value="Heritage">Tamil Heritage</option>
                      <option value="Aptitude">Aptitude</option>
                      <option value="Economy">Economy</option>
                      <option value="Science">General Science</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Target Day</label>
                    <input
                      type="number"
                      min={1}
                      max={studyPlan.totalDays}
                      value={customDay}
                      onChange={(e) => setCustomDay(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Allocated Study Hours ({customHours} hrs)</label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={customHours}
                    onChange={(e) => setCustomHours(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  Insert Into Milestone Calendar
                </button>
              </form>
            </div>

            {/* Helpful reference panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-850 space-y-3 shadow-sm">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-500" />
                Durable Local Preservation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your study timeline, progress state, and custom elements are automatically preserved directly within your browser cache (`localStorage`). This ensures your checked milestones remain persistent across page updates or offline reloads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
