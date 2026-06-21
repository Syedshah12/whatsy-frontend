import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Loader2, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ArrowLeft,
  SlidersHorizontal,
  Send,
  Eye,
  Activity
} from 'lucide-react';
import { useGetAllCampaignsQuery } from '../../features/campaign/campaignAnalyticsApi';

const CampaignsList = () => {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetAllCampaignsQuery();
  const campaigns = response?.data || [];

  // Derived state analytics for context banner
  const totalCount = campaigns.length;
  const completedCount = campaigns.filter(c => c.status?.toLowerCase() === 'completed').length;
  const processingCount = campaigns.filter(c => ['processing', 'in flight', 'active'].includes(c.status?.toLowerCase())).length;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-200/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Completed
          </span>
        );
      case 'processing':
      case 'in flight':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-200/50">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            In Flight
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase text-rose-700 bg-rose-50/60 px-2 py-0.5 rounded-md border border-rose-200/50">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Terminated
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#f8f9fa] text-slate-400">
        <Loader2 className="h-7 w-7 animate-spin text-[#04432e]" />
        <span className="text-[11px] font-medium tracking-wider uppercase text-slate-500">Retrieving operational run history...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fcfdfe] font-sans antialiased text-slate-700 min-h-screen overflow-y-auto custom-scrollbar">
      
      {/* STICKY HEADER SYSTEM */}
      <div className="bg-white border-b border-slate-200/60 px-4 py-3.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500 hover:text-slate-800 transition active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-[#04432e]">
              <Layers className="h-4 w-4 stroke-[2.5]" />
              <h1 className="text-xs font-black tracking-wider text-slate-800 uppercase">Campaign Registry Matrix</h1>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Historical dispatch streams and system communication logs.</p>
          </div>
        </div>

        {/* Live Filter/Status Counters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 font-mono text-[10px]">
          <div className="bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1 flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-400 font-sans font-medium">All:</span>
            <span className="font-bold text-slate-700">{totalCount}</span>
          </div>
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-emerald-600 font-sans font-medium">Done:</span>
            <span className="font-bold text-emerald-700">{completedCount}</span>
          </div>
          {processingCount > 0 && (
            <div className="bg-amber-50/40 border border-amber-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-amber-600 font-sans font-medium">Active:</span>
              <span className="font-bold text-amber-700">{processingCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* CORE FRAME LAYOUT */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {campaigns.length === 0 ? (
          <div className="text-center bg-white border border-slate-200/60 rounded-2xl p-12 text-[11px] text-slate-400 italic shadow-sm">
            No documented campaign operations detected in this system partition.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => {
              // Internal percentage calculation safety
              const total = campaign.totalRecipients || 0;
              const delvPct = total > 0 ? Math.round((campaign.deliveredCount / total) * 100) : 0;
              const readPct = total > 0 ? Math.round((campaign.readCount / total) * 100) : 0;

              return (
                <div
                  key={campaign._id}
                  onClick={() => navigate(`/campaigns/${campaign._id}`)}
                  className="bg-white border border-slate-200/60 hover:border-[#04432e]/30 rounded-2xl p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(4,67,46,0.03)] transition-all duration-300 group cursor-pointer relative flex flex-col justify-between space-y-4 overflow-hidden"
                >
                  {/* Subtle top decoration bar line for active item styling */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100 group-hover:bg-[#04432e]/30 transition" />

                  <div className="space-y-2.5">
                    {/* Item Row Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-[11px] font-bold text-slate-800 leading-tight tracking-tight truncate group-hover:text-[#04432e] transition" title={campaign.templateName}>
                          {campaign.templateName}
                        </h3>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
                          <Calendar className="h-3 w-3 text-slate-300" />
                          <span>
                            {new Date(campaign.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">{getStatusBadge(campaign.status)}</div>
                    </div>

                    {/* Performance Visual Progression Trackers */}
                    <div className="space-y-1.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      {/* Delivery bar */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1"><Send className="h-2.5 w-2.5 text-indigo-400" /> Delivery</span>
                          <span className="text-slate-600 font-mono">{delvPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-1 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${delvPct}%` }} />
                        </div>
                      </div>

                      {/* Read Bar */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5 text-emerald-400" /> Read Conversion</span>
                          <span className="text-slate-600 font-mono">{readPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${readPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Micro Digital Metrics Matrix Grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-center font-mono border-t border-slate-100 pt-3">
                    <div className="bg-slate-50/30 p-1 border border-slate-200/40 rounded-lg">
                      <span className="text-[7.5px] text-slate-400 block font-sans uppercase font-bold tracking-wider">Scope</span>
                      <span className="text-xs font-extrabold text-slate-800">{campaign.totalRecipients}</span>
                    </div>
                    <div className="bg-indigo-50/[0.15] p-1 border border-indigo-100/40 rounded-lg">
                      <span className="text-[7.5px] text-indigo-500 block font-sans uppercase font-bold tracking-wider">Delv</span>
                      <span className="text-xs font-extrabold text-indigo-700">{campaign.deliveredCount}</span>
                    </div>
                    <div className="bg-emerald-50/[0.15] p-1 border border-emerald-100/40 rounded-lg">
                      <span className="text-[7.5px] text-emerald-500 block font-sans uppercase font-bold tracking-wider">Read</span>
                      <span className="text-xs font-extrabold text-emerald-700">{campaign.readCount}</span>
                    </div>
                    <div className="bg-rose-50/[0.15] p-1 border border-rose-100/40 rounded-lg">
                      <span className="text-[7.5px] text-rose-500 block font-sans uppercase font-bold tracking-wider">Drop</span>
                      <span className="text-xs font-extrabold text-rose-700">{campaign.failedCount}</span>
                    </div>
                  </div>

                  {/* Footer Interactive Hint Action */}
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 pt-2.5 group-hover:text-[#04432e] transition">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-slate-300 group-hover:text-[#04432e] transition" />
                    View Details
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition text-slate-300 group-hover:text-[#04432e]" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default CampaignsList;