/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  Users, 
  Apple, 
  Laptop, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Calendar,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { isOwnerEmail } from '../utils/authUtils';

interface AppInstallationRecord {
  id: string;
  deviceId: string;
  email?: string;
  userName?: string;
  exam: string;
  platform: 'Android' | 'iOS' | 'Windows' | 'Mac' | 'Linux' | 'Other';
  browser?: string;
  screen?: string;
  installedAt: string;
  lastOpenedAt: string;
  launchCount: number;
  isStandalone: boolean;
}

interface AppInstallationsAdminViewProps {
  userEmail: string;
  onClose?: () => void;
}

export const AppInstallationsAdminView: React.FC<AppInstallationsAdminViewProps> = ({
  userEmail,
  onClose
}) => {
  const [installations, setInstallations] = useState<AppInstallationRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [examFilter, setExamFilter] = useState<string>('ALL');

  const isAuthorized = isOwnerEmail(userEmail);

  const fetchInstallations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/installations`, {
        headers: {
          'x-admin-email': userEmail || 'udayamoorthy@gmail.com'
        }
      });
      if (!res.ok) {
        throw new Error('Access denied or failed to retrieve installation logs.');
      }
      const data = await res.json();
      setInstallations(data.installations || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load app installations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, [userEmail]);

  // Metrics summary
  const totalCount = installations.length;
  const androidCount = installations.filter((i) => i.platform === 'Android').length;
  const iosCount = installations.filter((i) => i.platform === 'iOS').length;
  const desktopCount = installations.filter((i) => i.platform === 'Windows' || i.platform === 'Mac' || i.platform === 'Linux').length;
  const standaloneActiveCount = installations.filter((i) => i.isStandalone).length;

  // Filtered list
  const filteredList = installations.filter((item) => {
    if (platformFilter !== 'ALL' && item.platform !== platformFilter) return false;
    if (examFilter !== 'ALL' && !item.exam.toLowerCase().includes(examFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEmail = item.email ? item.email.toLowerCase().includes(q) : false;
      const matchDevice = item.deviceId.toLowerCase().includes(q);
      const matchExam = item.exam.toLowerCase().includes(q);
      const matchName = item.userName ? item.userName.toLowerCase().includes(q) : false;
      if (!matchEmail && !matchDevice && !matchExam && !matchName) return false;
    }
    return true;
  });

  // Export to CSV
  const handleDownloadCSV = () => {
    const headers = [
      'Record ID',
      'Device ID',
      'User Email',
      'Student Name',
      'Target Exam',
      'Operating System',
      'Browser',
      'Screen Resolution',
      'Installed At (Date Time)',
      'Last Active At',
      'Launch Count',
      'Standalone Mode'
    ];

    const rows = filteredList.map((item) => [
      item.id,
      item.deviceId,
      item.email || 'Anonymous Aspirant',
      item.userName || 'Unregistered',
      item.exam,
      item.platform,
      item.browser || 'Unknown',
      item.screen || 'N/A',
      item.installedAt,
      item.lastOpenedAt,
      item.launchCount || 1,
      item.isStandalone ? 'YES' : 'NO'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aspires-app-installed-users-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-display">
                Installed Mobile App Users &amp; Devices
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Owner Access
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live telemetry of students who added ASPIRES to their Android, iOS, or Desktop Home Screens
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchInstallations}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Download CSV ({filteredList.length})</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Installed</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalCount}</div>
          <div className="text-[10px] text-slate-400">PWA installations logged</div>
        </div>

        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Android Devices</span>
            <Smartphone className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{androidCount}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">
            {totalCount ? Math.round((androidCount / totalCount) * 100) : 0}% of installs
          </div>
        </div>

        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>iOS / iPhone</span>
            <Apple className="h-4 w-4 text-slate-300" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{iosCount}</div>
          <div className="text-[10px] text-slate-400">Safari Home Screen</div>
        </div>

        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Standalone</span>
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{standaloneActiveCount}</div>
          <div className="text-[10px] text-amber-400 font-semibold">Running full-screen</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search installed users by email, device ID, or exam..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-850 border border-slate-750 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Platforms</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS (iPhone/iPad)</option>
            <option value="Windows">Windows Desktop</option>
            <option value="Mac">Mac</option>
          </select>

          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="bg-slate-850 border border-slate-750 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Exams</option>
            <option value="TNPSC">TNPSC</option>
            <option value="UPSC">UPSC</option>
            <option value="NEET">NEET</option>
            <option value="IIT_JEE">IIT JEE</option>
            <option value="SSC">SSC</option>
            <option value="RRB">RRB</option>
            <option value="IELTS">IELTS</option>
          </select>
        </div>
      </div>

      {/* Installations Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-850/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User / Device</th>
                <th className="py-3 px-4">Target Exam</th>
                <th className="py-3 px-4">Platform &amp; Browser</th>
                <th className="py-3 px-4">Installed Date</th>
                <th className="py-3 px-4">Last Opened</th>
                <th className="py-3 px-4">Launches</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {item.email || (
                          <span className="text-slate-300 font-mono text-[11px]">
                            {item.deviceId}
                          </span>
                        )}
                      </div>
                      {item.userName && (
                        <div className="text-[11px] text-slate-400">{item.userName}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {item.exam}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        {item.platform === 'Android' && <Smartphone className="h-3.5 w-3.5 text-emerald-400" />}
                        {item.platform === 'iOS' && <Apple className="h-3.5 w-3.5 text-slate-300" />}
                        {(item.platform === 'Windows' || item.platform === 'Mac') && (
                          <Laptop className="h-3.5 w-3.5 text-blue-400" />
                        )}
                        <span>{item.platform}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{item.browser}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {item.installedAt}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {item.lastOpenedAt}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {item.launchCount || 1}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.isStandalone ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="h-3 w-3" /> Standalone App
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                          Browser Tab
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                    {isLoading ? 'Loading installation records...' : 'No installed app records match the selected filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
