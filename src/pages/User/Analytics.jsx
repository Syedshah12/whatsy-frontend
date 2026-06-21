import React, { useState } from 'react';

import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Loader2, 
  XCircle, 
  MessageSquare, 
  Eye, 
  Calendar, 
  RefreshCw,
  Clock,
  ChevronRight
} from 'lucide-react';
import { 
  useGetCampaignDashboardQuery, 
  useGetDailyAnalyticsQuery 
} from '../../features/campaign/campaignAnalyticsApi'; // Adjust this path according to your actual folder layout
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  // Pull core analytical queries
  const navigate=useNavigate()
  const { 
    data: dashboardResponse, 
    isLoading: isDashboardLoading, 
    isFetching: isDashboardFetching,
    refetch: refetchDashboard 
  } = useGetCampaignDashboardQuery();
  
  const { 
    data: dailyResponse, 
    isLoading: isDailyLoading,
    refetch: refetchDaily 
  } = useGetDailyAnalyticsQuery();

  const dashboard = dashboardResponse?.data || {};
  const dailyLogs = dailyResponse?.data || [];

  // Manual pull refresher handling context
  const handleRefreshAll = () => {
    refetchDashboard();
    refetchDaily();
  };

  // Safe percentage helper function
  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (isDashboardLoading || isDailyLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#f8f9fa] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-[#04432e]" />
        <span className="text-xs font-medium tracking-wide">Assembling performance graphs...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8f9fa] font-sans antialiased text-slate-700 min-h-screen overflow-y-auto custom-scrollbar">
      
      {/* HEADER BAR SYSTEM */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-10 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#04432e]">
            <BarChart3 className="h-5 w-5" />
            <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Messaging Matrix Analytics</h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time engagement analysis, message status metrics, and delivery performance metrics.</p>
        </div>

        <button
          onClick={handleRefreshAll}
          disabled={isDashboardFetching}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-[#04432e] hover:text-[#04432e] rounded-xl text-xs font-semibold text-slate-500 bg-white transition shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isDashboardFetching ? 'animate-spin text-[#04432e]' : ''}`} />
          Sync Metrics
        </button>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* ROW 1: CAMPAIGN LIFECYCLE MONITOR METRICS */}
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            Campaign Operational States
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Total Campaigns */}
            <div
            onClick={() => navigate('/campaigns')}

            className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[100px]">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Campaigns</span>
                <span className="text-xl sm:text-2xl font-black text-slate-800 mt-1 block">{dashboard.totalCampaigns || 0}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1">
                Campaign configurations created
              </span>
            </div>

            {/* Completed */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[100px]">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Completed
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#04432e] mt-1 block">{dashboard.completedCampaigns || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full" 
                  style={{ width: `${calculatePercentage(dashboard.completedCampaigns, dashboard.totalCampaigns)}%` }}
                />
              </div>
            </div>

            {/* Processing */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[100px]">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
                  <Clock className="h-3 w-3 animate-pulse" /> In Flight
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">{dashboard.processingCampaigns || 0}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-2">Active background thread streams</span>
            </div>

            {/* Failed Campaigns */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[100px]">
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Terminated
                </span>
                <span className="text-xl sm:text-2xl font-black text-rose-700 mt-1 block">{dashboard.failedCampaigns || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full" 
                  style={{ width: `${calculatePercentage(dashboard.failedCampaigns, dashboard.totalCampaigns)}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* ROW 2: DETAILED DELIVERY DISSECTION PATTERNS */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT INTERACTIVE DISSECTION BOX (7 COLS) */}
          <div className="xl:col-span-7 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
              Meta Delivery Pipeline Aggregations
            </h2>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-6">
              
              {/* Gross Total Badge Block */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Total Recipients Targeted</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Cumulative contacts passed across standard inputs matrix buffers.</p>
                </div>
                <div className="bg-[#04432e]/5 px-4 py-2 border border-[#04432e]/10 rounded-2xl text-center">
                  <span className="text-[9px] font-bold text-[#04432e] uppercase block tracking-wider">Total Recipients</span>
                  <span className="text-xl font-extrabold text-[#04432e]">{dashboard.totalRecipients || 0}</span>
                </div>
              </div>

              {/* Status Performance Bars Grid */}
              <div className="space-y-4">
                
                {/* Meta Handshake Sent */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500" /> Sent
                    </span>
                    <span className="text-slate-800">{dashboard.totalSent || 0} <b className="text-slate-400 font-normal text-[10px]">({calculatePercentage(dashboard.totalSent, dashboard.totalRecipients)}%)</b></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${calculatePercentage(dashboard.totalSent, dashboard.totalRecipients)}%` }} />
                  </div>
                </div>

                {/* Handset Delivered */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-indigo-500" /> Delivered
                    </span>
                    <span className="text-slate-800">{dashboard.totalDelivered || 0} <b className="text-slate-400 font-normal text-[10px]">({calculatePercentage(dashboard.totalDelivered, dashboard.totalRecipients)}%)</b></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${calculatePercentage(dashboard.totalDelivered, dashboard.totalRecipients)}%` }} style={{ width: `${calculatePercentage(dashboard.totalDelivered, dashboard.totalRecipients)}%` }} />
                  </div>
                </div>

                {/* Opened/Read */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />Seen
                    </span>
                    <span className="text-slate-800">{dashboard.totalRead || 0} <b className="text-slate-400 font-normal text-[10px]">({calculatePercentage(dashboard.totalRead, dashboard.totalRecipients)}%)</b></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${calculatePercentage(dashboard.totalRead, dashboard.totalRecipients)}%` }} />
                  </div>
                </div>

                {/* Failed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-rose-500" /> API / Payload Failures
                    </span>
                    <span className="text-slate-800">{dashboard.totalFailed || 0} <b className="text-slate-400 font-normal text-[10px]">({calculatePercentage(dashboard.totalFailed, dashboard.totalRecipients)}%)</b></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${calculatePercentage(dashboard.totalFailed, dashboard.totalRecipients)}%` }} />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* RIGHT CHRONOLOGICAL ACTIVITY TRACKER BLOCK (5 COLS) */}
          <div className="xl:col-span-5 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Daily Operational Event Logs
            </h2>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm overflow-hidden flex flex-col max-h-[360px]">
              <div className="overflow-y-auto custom-scrollbar space-y-3 flex-1 pr-1">
                {dailyLogs.length === 0 ? (
                  <div className="text-center p-8 text-xs text-slate-400 italic">
                    No timeline tracking events recorded for this parameter sequence.
                  </div>
                ) : (
                  dailyLogs.map((log, index) => {
                    const dateString = `${log._id.day}/${log._id.month}/${log._id.year}`;
                    return (
                      <div 
                        key={index}
                        className="p-3 border border-slate-100 hover:border-[#04432e]/20 bg-slate-50/50 rounded-xl transition flex flex-col gap-2"
                      >
                        {/* Log Row Header */}
                        <div className="flex items-center justify-between border-b border-slate-200/40 pb-1.5">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" /> {dateString}
                          </span>
                          <span className="text-[10px] font-semibold text-[#04432e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {log.campaigns} {log.campaigns === 1 ? 'Campaign' : 'Campaigns'}
                          </span>
                        </div>

                        {/* Distribution Metrics */}
                        <div className="grid grid-cols-4 gap-1 text-center font-mono">
                          <div className="bg-white p-1 border rounded">
                            <span className="text-[8px] text-slate-400 block uppercase font-sans">Recipients</span>
                            <span className="text-xs font-bold text-slate-700">{log.totalRecipients}</span>
                          </div>
                          <div className="bg-white p-1 border rounded">
                            <span className="text-[8px] text-indigo-500 block uppercase font-sans">Delv</span>
                            <span className="text-xs font-bold text-indigo-700">{log.delivered}</span>
                          </div>
                          <div className="bg-white p-1 border rounded">
                            <span className="text-[8px] text-emerald-500 block uppercase font-sans">Read</span>
                            <span className="text-xs font-bold text-emerald-700">{log.read}</span>
                          </div>
                          <div className="bg-white p-1 border rounded">
                            <span className="text-[8px] text-rose-500 block uppercase font-sans">Fail</span>
                            <span className="text-xs font-bold text-rose-700">{log.failed}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Analytics;