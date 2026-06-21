import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2, 
  TrendingUp, 
  UserCheck, 
  Hash, 
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useGetCampaignStatsQuery } from '../../features/campaign/campaignAnalyticsApi';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetCampaignStatsQuery(campaignId);

  // Search & Filter Local UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const campaign = response?.data?.campaign || {};
  const recipients = response?.data?.recipients || [];

  // Dynamic Filtering Computation Pipeline
  const filteredRecipients = useMemo(() => {
    return recipients.filter((recipient) => {
      const nameMatch = recipient.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const rollMatch = recipient.rollNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || rollMatch;

      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && recipient.status?.toLowerCase() === statusFilter.toLowerCase();
    });
  }, [recipients, searchTerm, statusFilter]);

  const getRecipientBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'read':
      case 'seen':
        return <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50/60 px-2 py-0.5 border border-emerald-200/40 rounded-md">Seen</span>;
      case 'delivered':
        return <span className="text-[9px] font-bold tracking-wider uppercase text-indigo-700 bg-indigo-50/60 px-2 py-0.5 border border-indigo-200/40 rounded-md">Delivered</span>;
      case 'sent':
        return <span className="text-[9px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50/60 px-2 py-0.5 border border-blue-200/40 rounded-md">Sent</span>;
      default:
        return <span className="text-[9px] font-bold tracking-wider uppercase text-rose-700 bg-rose-50/60 px-2 py-0.5 border border-rose-200/40 rounded-md">Failed</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#f8f9fa] text-slate-400">
        <Loader2 className="h-7 w-7 animate-spin text-[#04432e]" />
        <span className="text-[11px] font-medium tracking-wider uppercase text-slate-500">Deconstructing campaign telemetry...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fcfdfe] font-sans antialiased text-slate-700 min-h-screen overflow-y-auto">
      
      {/* STICKY HEADER SYSTEM */}
      <div className="bg-white border-b border-slate-200/60 px-4 py-3.5 sm:px-6 lg:px-8 flex items-center gap-3 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500 hover:text-slate-800 transition active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[#04432e]">
            <TrendingUp className="h-4 w-4 stroke-[2.5]" />
            <h1 className="text-xs font-black tracking-wider text-slate-800 uppercase truncate">
              Run Audit: {campaign.templateName}
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate font-mono">
            ID: {campaignId || campaign.id} • Run Matrix: {new Date(campaign.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* PREMIUM METRIC CARDS ARRAY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Gross Target Scope</span>
            <span className="text-lg font-black text-slate-800 mt-1 block font-mono">{campaign.totalRecipients || 0}</span>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-slate-400 h-full w-full" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider block">Delivered Confirmation</span>
            <span className="text-lg font-black text-indigo-700 mt-1 block font-mono">{campaign.deliveredCount || 0}</span>
            <div className="text-[9px] text-slate-400 mt-1 font-semibold flex justify-between">
              <span>Rate</span>
              <span className="text-indigo-600 font-mono">{campaign.deliveryRate || '0%'}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider block">Seen Conversion</span>
            <span className="text-lg font-black text-emerald-700 mt-1 block font-mono">{campaign.readCount || 0}</span>
            <div className="text-[9px] text-slate-400 mt-1 font-semibold flex justify-between">
              <span>Conversion</span>
              <span className="text-emerald-600 font-mono">{campaign.readRate || '0%'}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[8px] font-bold text-rose-500 uppercase tracking-wider block">Terminal Drop / Failures</span>
            <span className="text-lg font-black text-rose-700 mt-1 block font-mono">{campaign.failedCount || 0}</span>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-rose-400 h-full" style={{ width: `${campaign.totalRecipients ? (campaign.failedCount / campaign.totalRecipients) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        {/* LEDGER FILTERS & SEARCH CONTROL CONTROLLER PANEL */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] space-y-3.5">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 shrink-0">
              <UserCheck className="h-3.5 w-3.5 text-[#04432e] stroke-[2.5]" />
              Allocation Ledger Registry
            </h2>

            {/* Live Search Input Wrapper */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search recipient data by name or roll identity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/70 rounded-xl pl-9 pr-4 py-2 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#04432e]/40 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Quick Segment Status Filters Token Row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100 text-[10px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] mr-1 flex items-center gap-1">
              <Filter className="h-2.5 w-2.5" /> Segment View:
            </span>
            {[
              { id: 'all', label: 'All Targets', count: recipients.length, color: 'hover:bg-slate-100 text-slate-600 border-slate-200 bg-slate-50' },
              { id: 'read', label: 'Seen', count: recipients.filter(r => ['read', 'seen'].includes(r.status?.toLowerCase())).length, color: 'text-emerald-700 bg-emerald-50/50 border-emerald-100' },
              { id: 'delivered', label: 'Delivered', count: recipients.filter(r => r.status?.toLowerCase() === 'delivered').length, color: 'text-indigo-700 bg-indigo-50/50 border-indigo-100' },
              { id: 'sent', label: 'Sent', count: recipients.filter(r => r.status?.toLowerCase() === 'sent').length, color: 'text-blue-700 bg-blue-50/50 border-blue-100' },
              { id: 'failed', label: 'Failed', count: recipients.filter(r => !['read', 'seen', 'delivered', 'sent'].includes(r.status?.toLowerCase())).length, color: 'text-rose-700 bg-rose-50/50 border-rose-100' }
            ].map((token) => (
              <button
                key={token.id}
                onClick={() => setStatusFilter(token.id)}
                className={`px-2.5 py-1 rounded-lg border font-medium transition-all active:scale-95 ${
                  statusFilter === token.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm font-bold' 
                    : `${token.color}`
                }`}
              >
                {token.label} <span className={`ml-1 font-mono text-[9px] ${statusFilter === token.id ? 'text-white/80' : 'opacity-60'}`}>({token.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* LEDGER DATA TABLE CORE VIEW */}
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/60 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-4 sm:px-6">Identity Specs</th>
                  <th className="py-2.5 px-4">Contact Gateway</th>
                  <th className="py-2.5 px-4 hidden sm:table-cell">Academic Performance Records</th>
                  <th className="py-2.5 px-4 text-right">Status / Timestamps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {filteredRecipients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-400 italic font-medium text-[11px]">
                      No recipients matching your active criteria partition query.
                    </td>
                  </tr>
                ) : (
                  filteredRecipients.map((recipient) => (
                    <tr key={recipient._id} className="hover:bg-slate-50/40 transition duration-150">
                      
                      {/* Identity Details */}
                      <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                        <div className="font-bold text-slate-800 tracking-tight">{recipient.name}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                          <span className="flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                            <Hash className="h-2 w-2 text-slate-400" /> {recipient.rollNumber}
                          </span>
                          {recipient.fatherName && <span className="text-slate-300">| <span className="text-slate-400">S/O {recipient.fatherName}</span></span>}
                        </div>
                      </td>

                      {/* Connection Details */}
                      <td className="py-3 px-4 font-mono text-[10.5px] whitespace-nowrap">
                        <span className="text-slate-700 font-semibold">+{recipient.whatsappNumber}</span>
                        {recipient.messageId?.wamid && (
                          <div className="text-[8px] text-slate-400 font-sans tracking-tight max-w-[170px] truncate mt-0.5" title={recipient.messageId.wamid}>
                            {recipient.messageId.wamid}
                          </div>
                        )}
                      </td>

                      {/* Performance Scores Column */}
                      <td className="py-3 px-4 hidden sm:table-cell whitespace-nowrap">
                        <div className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1.5">
                          <span>Marks Secured:</span>
                          <span className="bg-slate-50 px-2 py-0.5 border border-slate-200/50 rounded text-[#04432e] font-mono font-bold">
                            {recipient.obtainedMarks}
                          </span>
                          <span className="text-slate-300">/</span>
                          <span className="text-slate-400 font-mono">{recipient.totalMarks}</span>
                        </div>
                        {recipient.messageId?.body && (
                          <div className="text-[9.5px] text-slate-400 flex items-center gap-1 mt-1 max-w-[240px]">
                            <MessageCircle className="h-2.5 w-2.5 text-slate-300 shrink-0" />
                            <span className="italic truncate" title={recipient.messageId.body}>{recipient.messageId.body}</span>
                          </div>
                        )}
                      </td>

                      {/* Interactive Tracing Time Details */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-block">{getRecipientBadge(recipient.status)}</div>
                        <div className="text-[9px] text-slate-400 mt-1 font-mono font-medium tracking-tight">
                          {recipient.readAt
                            ? `Seen ${new Date(recipient.readAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
                            : recipient.deliveredAt
                            ? `Delv ${new Date(recipient.deliveredAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
                            : recipient.sentAt
                            ? `Sent ${new Date(recipient.sentAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
                            : "—"
                          }
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};``

export default CampaignDetails;