/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Crown, 
  KeyRound, 
  Plus, 
  Copy, 
  Check, 
  Search, 
  Download, 
  X, 
  RefreshCw, 
  Sliders, 
  ShieldAlert, 
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Settings,
  Sparkles,
  Award
} from 'lucide-react';
import { PaidPlanType, PaidSubscriptionRecord, LicenseKeyRecord, PaywallSettings } from '../types';

interface PaidAppAdminViewProps {
  userEmail: string;
  onClose: () => void;
}

export const PaidAppAdminView: React.FC<PaidAppAdminViewProps> = ({ userEmail, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Data
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [activeSubscribers, setActiveSubscribers] = useState(0);
  const [planStats, setPlanStats] = useState<Record<string, number>>({});
  const [subscriptions, setSubscriptions] = useState<PaidSubscriptionRecord[]>([]);
  const [licenseKeys, setLicenseKeys] = useState<LicenseKeyRecord[]>([]);
  const [settings, setSettings] = useState<PaywallSettings>({
    mode: 'free_trial',
    trialLimits: { evaluations: 1, quizzes: 5, notes: 2, chats: 3 },
    prices: { monthly: 199, annual: 999, lifetime: 1999 },
    upiId: 'udayamoorthy@okaxis',
    upiName: 'ASPIRES ACADEMY'
  });

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'licenses' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Grant Pro Form State
  const [grantEmail, setGrantEmail] = useState('');
  const [grantName, setGrantName] = useState('');
  const [grantPlan, setGrantPlan] = useState<PaidPlanType>('annual');
  const [grantDays, setGrantDays] = useState(365);
  const [isGranting, setIsGranting] = useState(false);

  // Generate License Form State
  const [licensePrefix, setLicensePrefix] = useState('ASPIRES-PRO');
  const [licensePlan, setLicensePlan] = useState<PaidPlanType>('annual');
  const [licenseCount, setLicenseCount] = useState(5);
  const [licenseMaxUses, setLicenseMaxUses] = useState(1);
  const [licenseExpiresDays, setLicenseExpiresDays] = useState(365);
  const [isGeneratingLicenses, setIsGeneratingLicenses] = useState(false);

  // Settings Form State
  const [tempMode, setTempMode] = useState<'free_trial' | 'strict_paid'>('free_trial');
  const [tempMonthlyPrice, setTempMonthlyPrice] = useState(199);
  const [tempAnnualPrice, setTempAnnualPrice] = useState(999);
  const [tempLifetimePrice, setTempLifetimePrice] = useState(1999);
  const [tempUpiId, setTempUpiId] = useState('udayamoorthy@okaxis');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/paid-app-stats?adminEmail=${encodeURIComponent(userEmail)}`, {
        headers: {
          'x-admin-email': userEmail
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch admin stats');
      }

      setTotalRevenue(data.totalRevenue || 0);
      setTotalSubscribers(data.totalSubscribers || 0);
      setActiveSubscribers(data.activeSubscribers || 0);
      setPlanStats(data.planStats || {});
      setSubscriptions(data.subscriptions || []);
      setLicenseKeys(data.licenseKeys || []);
      if (data.settings) {
        setSettings(data.settings);
        setTempMode(data.settings.mode);
        setTempMonthlyPrice(data.settings.prices.monthly);
        setTempAnnualPrice(data.settings.prices.annual);
        setTempLifetimePrice(data.settings.prices.lifetime);
        setTempUpiId(data.settings.upiId);
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to admin subscriptions service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userEmail]);

  const handleGrantPro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail || !grantEmail.includes('@')) {
      alert('Please enter a valid student email.');
      return;
    }

    setIsGranting(true);
    try {
      const res = await fetch('/api/admin/grant-pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': userEmail
        },
        body: JSON.stringify({
          adminEmail: userEmail,
          email: grantEmail.trim().toLowerCase(),
          userName: grantName.trim() || undefined,
          plan: grantPlan,
          days: Number(grantDays) || 365
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to grant Pro access');
      }

      setSuccessMsg(`Successfully granted ${grantPlan.toUpperCase()} Pro to ${grantEmail}`);
      setGrantEmail('');
      setGrantName('');
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Error granting Pro access');
    } finally {
      setIsGranting(false);
    }
  };

  const handleGenerateLicenses = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingLicenses(true);
    try {
      const res = await fetch('/api/admin/generate-license', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': userEmail
        },
        body: JSON.stringify({
          adminEmail: userEmail,
          prefix: licensePrefix.trim().toUpperCase(),
          plan: licensePlan,
          count: Number(licenseCount),
          maxUses: Number(licenseMaxUses),
          expiresDays: Number(licenseExpiresDays)
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate licenses');
      }

      setSuccessMsg(`Generated ${licenseCount} new license keys!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Error generating keys');
    } finally {
      setIsGeneratingLicenses(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/paywall-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': userEmail
        },
        body: JSON.stringify({
          adminEmail: userEmail,
          mode: tempMode,
          prices: {
            monthly: tempMonthlyPrice,
            annual: tempAnnualPrice,
            lifetime: tempLifetimePrice
          },
          upiId: tempUpiId
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update paywall settings');
      }

      setSuccessMsg('Paywall settings successfully updated.');
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const exportSubscribersCSV = () => {
    if (subscriptions.length === 0) {
      alert('No subscribers to export.');
      return;
    }
    const headers = ['Order ID', 'Email', 'Name', 'Phone', 'Plan', 'Amount (INR)', 'Payment Method', 'UTR Ref', 'Status', 'Activated At', 'Expires At', 'Invoice Number'];
    const rows = subscriptions.map(s => [
      s.id,
      s.email,
      `"${s.userName || ''}"`,
      s.phone || '',
      s.plan,
      s.amount,
      s.paymentMethod,
      s.utrRef || '',
      s.status,
      s.activatedAt,
      s.expiresAt,
      s.invoiceNumber
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aspires_paid_subscribers_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscriptions = subscriptions.filter(s => {
    if (planFilter !== 'ALL' && s.plan !== planFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.email.toLowerCase().includes(q) ||
      (s.userName && s.userName.toLowerCase().includes(q)) ||
      (s.utrRef && s.utrRef.toLowerCase().includes(q)) ||
      (s.invoiceNumber && s.invoiceNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-slate-900 border border-slate-750 text-slate-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <DollarSign className="h-6 w-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Paid App &amp; Revenue Hub</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                OWNER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage paid memberships, license keys, prices, and revenue analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="px-6 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-amber-500 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview &amp; KPIs
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'subscribers'
              ? 'border-amber-500 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Paid Subscribers ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('licenses')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'licenses'
              ? 'border-amber-500 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          License Keys ({licenseKeys.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-amber-500 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Paywall Mode &amp; Prices
        </button>
      </div>

      {/* Main Body */}
      <div className="p-6 overflow-y-auto space-y-6">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-1">
                <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider font-bold">Total Gross Revenue</span>
                <div className="text-2xl font-black text-amber-400 font-sans">
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Direct via UPI &amp; Cards</span>
                </div>
              </div>

              <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-1">
                <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider font-bold">Active Pro Members</span>
                <div className="text-2xl font-black text-white font-sans">
                  {activeSubscribers}
                </div>
                <div className="text-[11px] text-slate-400">
                  Total registered: <strong className="text-slate-200">{totalSubscribers}</strong>
                </div>
              </div>

              <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-1">
                <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider font-bold">App Access Mode</span>
                <div className="text-lg font-black text-white font-sans capitalize flex items-center gap-1.5 mt-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${settings.mode === 'strict_paid' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span>{settings.mode === 'strict_paid' ? 'Strict Paid App' : 'Free Trial + Paywall'}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {settings.mode === 'strict_paid' ? 'Paywall triggers on entry' : '1 Free trial evaluation'}
                </div>
              </div>

              <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-1">
                <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider font-bold">Annual Pass Price</span>
                <div className="text-2xl font-black text-emerald-400 font-sans">
                  ₹{settings.prices.annual}
                </div>
                <div className="text-[11px] text-slate-400">
                  Monthly: ₹{settings.prices.monthly} • Lifetime: ₹{settings.prices.lifetime}
                </div>
              </div>
            </div>

            {/* Plan Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Subscription Tier Distribution
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-400 font-bold">Annual Pro Pass (₹{settings.prices.annual})</span>
                      <span className="text-slate-300 font-mono">{planStats.annual || 0} students</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${totalSubscribers ? ((planStats.annual || 0) / totalSubscribers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-purple-400 font-bold">Lifetime Ranker (₹{settings.prices.lifetime})</span>
                      <span className="text-slate-300 font-mono">{planStats.lifetime || 0} students</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${totalSubscribers ? ((planStats.lifetime || 0) / totalSubscribers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-sky-400 font-bold">Monthly Sprint (₹{settings.prices.monthly})</span>
                      <span className="text-slate-300 font-mono">{planStats.monthly || 0} students</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 rounded-full" 
                        style={{ width: `${totalSubscribers ? ((planStats.monthly || 0) / totalSubscribers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Grant Access Widget */}
              <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Quick Grant Pro Access</span>
                  </h4>
                </div>
                <form onSubmit={handleGrantPro} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      required
                      value={grantEmail}
                      onChange={(e) => setGrantEmail(e.target.value)}
                      placeholder="Student email (e.g. karthik@gmail.com)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={grantPlan}
                      onChange={(e) => setGrantPlan(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="monthly">Monthly Pass</option>
                      <option value="annual">Annual Pass</option>
                      <option value="lifetime">Lifetime Pass</option>
                    </select>
                    <button
                      type="submit"
                      disabled={isGranting}
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isGranting ? 'Granting...' : 'Grant Pro Access'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Manually activate Pro for scholarship recipients, offline academy students, or top performers.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBSCRIBERS LIST */}
        {activeTab === 'subscribers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search email, name, UTR..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Plans</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>

              <button
                onClick={exportSubscribersCSV}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer w-full sm:w-auto justify-center"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Student &amp; Email</th>
                      <th className="py-3 px-4">Plan &amp; Amount</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">UTR / Invoice</th>
                      <th className="py-3 px-4">Expires</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{sub.userName || 'Student'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{sub.email}</div>
                          {sub.phone && <div className="text-[10px] text-slate-500">{sub.phone}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono ${
                            sub.plan === 'lifetime'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : sub.plan === 'annual'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}>
                            {sub.plan}
                          </span>
                          <div className="font-mono text-emerald-400 font-bold mt-1">₹{sub.amount}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-slate-300 font-mono text-[11px]">
                            {sub.paymentMethod.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div className="text-white">{sub.invoiceNumber}</div>
                          {sub.utrRef && <div className="text-slate-400 text-[10px]">Ref: {sub.utrRef}</div>}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                          {sub.expiresAt ? sub.expiresAt.substring(0, 10) : 'Permanent'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredSubscriptions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                          No subscribers matched your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LICENSE KEYS */}
        {activeTab === 'licenses' && (
          <div className="space-y-6">
            {/* Generate Key Form */}
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-400" />
                <span>Generate New License Codes / Vouchers</span>
              </h4>

              <form onSubmit={handleGenerateLicenses} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">Prefix</label>
                  <input
                    type="text"
                    value={licensePrefix}
                    onChange={(e) => setLicensePrefix(e.target.value)}
                    placeholder="e.g. BATCH-2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">Plan</label>
                  <select
                    value={licensePlan}
                    onChange={(e) => setLicensePlan(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="annual">Annual Pass</option>
                    <option value="lifetime">Lifetime Pass</option>
                    <option value="monthly">Monthly Pass</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={licenseCount}
                    onChange={(e) => setLicenseCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">Max Uses / Key</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={licenseMaxUses}
                    onChange={(e) => setLicenseMaxUses(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isGeneratingLicenses}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingLicenses ? 'Generating...' : 'Generate Keys'}
                  </button>
                </div>
              </form>
            </div>

            {/* License Keys Table */}
            <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">License Key Code</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Usage Count</th>
                      <th className="py-3 px-4">Expires</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {licenseKeys.map((k) => (
                      <tr key={k.key} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-amber-400 text-xs">
                          {k.key}
                        </td>
                        <td className="py-3 px-4 capitalize font-mono text-slate-300">
                          {k.plan}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className={k.usedCount >= k.maxUses ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {k.usedCount}
                          </span> / {k.maxUses}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {k.expiresAt ? k.expiresAt.substring(0, 10) : 'Never'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleCopyKey(k.key)}
                            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer"
                          >
                            {copiedKey === k.key ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYWALL SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-slate-850 p-6 rounded-3xl border border-slate-800 space-y-5">
              <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" />
                <span>App Access Mode &amp; Pricing Configuration</span>
              </h4>

              {/* Mode Selection */}
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <label className="text-xs font-bold text-slate-300 block">App Access Mode</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setTempMode('free_trial')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      tempMode === 'free_trial'
                        ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Free Trial Mode</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Students get 1 free essay evaluation and 5 free MCQs to sample the app, then the Pro Paywall appears.
                    </p>
                  </div>

                  <div
                    onClick={() => setTempMode('strict_paid')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      tempMode === 'strict_paid'
                        ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Strict Paid App Mode</span>
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Zero free trial. All practice modules, mock tests, and evaluators require an active paid subscription or license key.
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Editors */}
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <label className="text-xs font-bold text-slate-300 block">Plan Pricing (₹ INR)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-400 block mb-1">Monthly Pass (₹)</label>
                    <input
                      type="number"
                      value={tempMonthlyPrice}
                      onChange={(e) => setTempMonthlyPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-400 block mb-1">Annual Pass (₹)</label>
                    <input
                      type="number"
                      value={tempAnnualPrice}
                      onChange={(e) => setTempAnnualPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-400 block mb-1">Lifetime Pass (₹)</label>
                    <input
                      type="number"
                      value={tempLifetimePrice}
                      onChange={(e) => setTempLifetimePrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Merchant UPI ID */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Merchant UPI ID (GPay / PhonePe / Paytm)</label>
                <input
                  type="text"
                  value={tempUpiId}
                  onChange={(e) => setTempUpiId(e.target.value)}
                  placeholder="udayamoorthy@okaxis"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <p className="text-[10.5px] text-slate-400">
                  Payments from students scanning the dynamic QR code will be routed directly to this UPI Virtual Payment Address.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-3 px-5 rounded-xl text-xs shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isSavingSettings ? 'Saving Settings...' : 'Save Paywall Configuration'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
