// import React, { useState } from 'react';
// import { 
//   CreditCard, 
//   Layers, 
//   Coins, 
//   TrendingUp, 
//   Loader2, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight, 
//   FileText, 
//   Smartphone, 
//   Calendar,
//   X,
//   ArrowUpRight
// } from 'lucide-react';
// import { 
//   useGetBillingsQuery, 
//   useGetBillingSummaryQuery, 
//   useGetCampaignBillingQuery,

// } from '../../features/billing/billingApi'; // Adjust path based on your architecture
// import { 

//   useGetAllCampaignsQuery
// } from '../../features/campaign/campaignAnalyticsApi'; // Adjust path based on your architecture

// const BillingDashboard = () => {
//   // Navigation & Page Layout State
//   const [page, setPage] = useState(1);
//   const limit = 10; // Clean view footprint

//   // Filtering & Modal Focus Controls
//   const [selectedCampaignId, setSelectedCampaignId] = useState('');
//   const [activeModalId, setActiveModalId] = useState(null);

//   // Api Pipeline Invocations
//   const { data: summaryRes, isLoading: isSummaryLoading } = useGetBillingSummaryQuery();
//   const { data: listRes, isLoading: isListLoading } = useGetBillingsQuery({ page, limit });
//   const { data: campaignsRes } = useGetAllCampaignsQuery();
  
//   // Dynamic Target Drilldown Campaign Analytics Fetching
//   const { data: campaignBillingRes, isLoading: isCampaignDetailLoading } = useGetCampaignBillingQuery(
//     activeModalId, 
//     { skip: !activeModalId }
//   );

//   const summary = summaryRes?.data || { totalMessages: 0, totalAmount: 0 };
//   const billings = listRes?.data || [];
//   const totalPages = listRes?.pages || 1;
//   const campaignsList = campaignsRes?.data || [];

//   // Frontend filtering matching campaignId selection
//   const filteredBillings = selectedCampaignId 
//     ? billings.filter(b => b.campaignId?._id === selectedCampaignId)
//     : billings;

//   const getStatusBadge = (status) => {
//     return status?.toLowerCase() === 'charged' ? (
//       <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200/40 rounded-md">Charged</span>
//     ) : (
//       <span className="text-[9px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200/40 rounded-md">{status || 'Pending'}</span>
//     );
//   };

//   if (isSummaryLoading || isListLoading) {
//     return (
//       <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#fbfcfd] text-slate-400">
//         <Loader2 className="h-7 w-7 animate-spin text-[#04432e]" />
//         <span className="text-[11px] font-medium tracking-wider uppercase text-slate-500 font-sans">Compiling financial ledger pipelines...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 bg-[#fcfdfe] font-sans antialiased text-slate-700 min-h-screen pb-12 overflow-y-auto">
      
//       {/* HEADER SYSTEM */}
//       <div className="bg-white border-b border-slate-200/60 px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
//         <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <div className="flex items-center gap-2 text-[#04432e]">
//               <CreditCard className="h-4 w-4 stroke-[2.5]" />
//               <h1 className="text-xs font-black tracking-wider text-slate-800 uppercase">
//                 Enterprise Billing Ledger
//               </h1>
//             </div>
//             <p className="text-[10px] text-slate-400 font-medium mt-0.5 font-mono">
//               Real-time message routing cost tracking & auditing matrix.
//             </p>
//           </div>

//           {/* Quick Dropdown Campaign Global Filter */}
//           <div className="w-full sm:w-64">
//             <select
//               value={selectedCampaignId}
//               onChange={(e) => {
//                 setSelectedCampaignId(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#04432e]/40 focus:bg-white transition"
//             >
//               <option value="">Filter View: All Campaigns</option>
//               {campaignsList.map((camp) => (
//                 <option key={camp._id} value={camp._id}>
//                   {camp.templateName?.toUpperCase()} ({new Date(camp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
//         {/* PREMIUM METRIC SUMMARIES */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] relative overflow-hidden">
//             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Total Templates Send</span>
//             <span className="text-xl font-black text-slate-800 mt-1 block font-mono">{summary.totalMessages}</span>
//             <span className="text-[9px] font-medium text-slate-400 mt-1 block">Accumulated pipeline outbound attempts</span>
//             <Layers className="absolute right-4 bottom-4 h-8 w-8 text-slate-100 -z-0 pointer-events-none" />
//           </div>

//           <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] relative overflow-hidden">
//             <span className="text-[8px] font-bold text-[#04432e] uppercase tracking-wider block">Total Allocated Amount</span>
//             <span className="text-xl font-black text-slate-900 mt-1 block font-mono">₨ {summary.totalAmount?.toLocaleString()}</span>
//             <span className="text-[9px] font-medium text-slate-400 mt-1 block">Charged against live cloud WhatsApp tokens</span>
//             <Coins className="absolute right-4 bottom-4 h-8 w-8 text-[#04432e]/5 -z-0 pointer-events-none" />
//           </div>

//           <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] sm:col-span-2 lg:col-span-1 relative overflow-hidden">
//             <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider block">Average Campaign Surcharges</span>
//             <span className="text-xl font-black text-indigo-900 mt-1 block font-mono">
//               ₨ {summary.totalMessages ? (summary.totalAmount / summary.totalMessages).toFixed(2) : '0.00'}
//             </span>
//             <span className="text-[9px] font-medium text-slate-400 mt-1 block">Mean computation per payload delivery state</span>
//             <TrendingUp className="absolute right-4 bottom-4 h-8 w-8 text-indigo-500/5 -z-0 pointer-events-none" />
//           </div>
//         </div>

//         {/* DATA LEDGER BLOCK */}
//         <div className="space-y-3">
//           <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
//             <FileText className="h-3.5 w-3.5 text-slate-400" />
//             Chronological Transaction Records
//           </h2>

//           <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200/60 text-[9px] font-bold uppercase tracking-wider text-slate-400">
//                     <th className="py-3 px-4 sm:px-6">Campaign Source</th>
//                     <th className="py-3 px-4">Destination Gateway</th>
//                     <th className="py-3 px-4 hidden md:table-cell">Message Blueprint Frame</th>
//                     <th className="py-3 px-4 text-right">Debit Statement</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
//                   {filteredBillings.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="text-center py-12 text-slate-400 italic text-[11px]">
//                         No cross-referenced records matching specified lookup filters.
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredBillings.map((bill) => (
//                       <tr key={bill._id} className="hover:bg-slate-50/40 transition duration-150 group">
                        
//                         {/* Campaign Meta */}
//                         <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
//                           <button 
//                             onClick={() => setActiveModalId(bill.campaignId?._id)}
//                             className="font-bold text-slate-800 tracking-tight flex items-center gap-1 hover:text-[#04432e] text-left group-hover:underline decoration-[#04432e]/40"
//                           >
//                             {bill.templateName || bill.campaignId?.templateName}
//                             <ArrowUpRight className="h-2.5 w-2.5 text-slate-400 group-hover:text-[#04432e] opacity-0 group-hover:opacity-100 transition" />
//                           </button>
//                           <div className="text-[9px] text-slate-400 mt-0.5 font-mono flex items-center gap-1">
//                             <Calendar className="h-2 w-2" />
//                             {new Date(bill.createdAt).toLocaleDateString('en-GB')} {new Date(bill.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
//                           </div>
//                         </td>

//                         {/* WhatsApp Recipient Information */}
//                         <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
//                           <div className="flex items-center gap-1 font-semibold text-slate-700">
//                             <Smartphone className="h-2.5 w-2.5 text-slate-400 font-sans" />
//                             +{bill.whatsappNumber}
//                           </div>
//                           <div className="text-[8px] text-slate-400 truncate max-w-[150px] font-sans mt-0.5" title={bill.messageId?.wamid}>
//                             {bill.messageId?.wamid || '—'}
//                           </div>
//                         </td>

//                         {/* Inline Content Blueprint Spec */}
//                         <td className="py-3 px-4 hidden md:table-cell max-w-xs truncate text-[11px] font-medium text-slate-500">
//                           <span className="italic" title={bill.messageId?.body}>"{bill.messageId?.body || 'No metadata dynamic string content frame returned.'}"</span>
//                         </td>

//                         {/* Debit Unit Costs */}
//                         <td className="py-3 px-4 text-right whitespace-nowrap">
//                           <div className="font-mono font-black text-slate-900 text-[12px]">₨ {bill.amount}.00</div>
//                           <div className="mt-0.5">{getStatusBadge(bill.status)}</div>
//                         </td>

//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* INTEGRATED LEDGER PAGINATION FOOTER */}
//             {!selectedCampaignId && totalPages > 1 && (
//               <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
//                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Page {page} of {totalPages}</span>
//                 <div className="flex items-center gap-1">
//                   <button
//                     disabled={page === 1}
//                     onClick={() => setPage(p => Math.max(1, p - 1))}
//                     className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition active:scale-95"
//                   >
//                     <ChevronLeft className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     disabled={page === totalPages}
//                     onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                     className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition active:scale-95"
//                   >
//                     <ChevronRight className="h-3.5 w-3.5" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* CONTEXTUAL SLIDE DRAWER OVERLAY (DRILLDOWN MATRIX) */}
//       {activeModalId && (
//         <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
//           <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-slideLeft">
            
//             {/* Drawer Header */}
//             <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
//               <div>
//                 <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider block">Isolated Audit Context</span>
//                 <h3 className="text-xs font-black tracking-wider uppercase text-slate-800 mt-0.5">Campaign Isolation View</h3>
//               </div>
//               <button 
//                 onClick={() => setActiveModalId(null)}
//                 className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition"
//               >
//                 <X className="h-3.5 w-3.5" />
//               </button>
//             </div>

//             {/* Drawer Body Area */}
//             <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
//               {isCampaignDetailLoading ? (
//                 <div className="h-42 w-full flex flex-col items-center justify-center text-slate-400 gap-2">
//                   <Loader2 className="h-6 w-6 animate-spin text-[#04432e]" />
//                   <span className="text-[10px] font-semibold uppercase tracking-wider">Assembling dynamic cross reference vectors...</span>
//                 </div>
//               ) : (
//                 <>
//                   {/* Micro-scale Meta Data Metric Cards Layout */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="border border-slate-200/70 rounded-xl p-3 bg-slate-50/50">
//                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Total Dispatches</span>
//                       <span className="text-base font-black text-slate-800 font-mono mt-0.5 block">{campaignBillingRes?.totalMessages || 0}</span>
//                     </div>
//                     <div className="border border-slate-200/70 rounded-xl p-3 bg-[#04432e]/5">
//                       <span className="text-[8px] font-bold text-[#04432e] uppercase tracking-wider block">Campaign Total Sum</span>
//                       <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">₨ {campaignBillingRes?.totalAmount || 0}.00</span>
//                     </div>
//                   </div>

//                   {/* Micro Table List */}
//                   <div className="space-y-2">
//                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Associated Recipients Queue</span>
//                     <div className="border border-slate-200/60 rounded-xl overflow-hidden text-xs">
//                       <div className="bg-slate-50 border-b border-slate-200/60 px-3 py-2 grid grid-cols-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
//                         <span>Gateway Address</span>
//                         <span className="text-right">Disbursement</span>
//                       </div>
//                       <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
//                         {campaignBillingRes?.data?.map((item) => (
//                           <div key={item._id} className="px-3 py-2.5 grid grid-cols-2 items-center hover:bg-slate-50/40">
//                             <div>
//                               <span className="font-mono text-[11px] font-bold text-slate-700">+{item.whatsappNumber}</span>
//                               <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-tight mt-0.5">{item.templateName}</span>
//                             </div>
//                             <div className="text-right">
//                               <span className="font-mono font-black text-slate-800">₨ {item.amount}.00</span>
//                               <span className="block text-[8px] text-emerald-600 font-medium tracking-wide font-mono mt-0.5">{item.status?.toUpperCase()}</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BillingDashboard;
import React, { useState, useRef } from 'react';
import { 
  CreditCard, 
  Layers, 
  Coins, 
  TrendingUp, 
  Loader2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Smartphone, 
  Calendar,
  X,
  ArrowUpRight,
  Receipt,
  Download,
  Printer
} from 'lucide-react';
import { 
  useGetBillingsQuery, 
  useGetBillingSummaryQuery, 
  useGetCampaignBillingQuery,
  useGetBillingReceiptMutation,
} from '../../features/billing/billingApi';
import { 
  useGetAllCampaignsQuery
} from '../../features/campaign/campaignAnalyticsApi';

// ─── Receipt Print Modal ───────────────────────────────────────────────────────
const ReceiptModal = ({ onClose }) => {
  const today = new Date().toISOString().split('T')[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [receiptData, setReceiptData] = useState(null);
  const [getBillingReceipt, { isLoading }] = useGetBillingReceiptMutation();
  const printRef = useRef(null);

  const handleGenerate = async () => {
    try {
      const res = await getBillingReceipt({ from, to }).unwrap();
      setReceiptData(res);
    } catch {
      alert('Failed to generate receipt. Please try again.');
    }
  };

  const handlePrint = () => {
  const grouped = receiptData?.records?.reduce((acc, r) => {
    const key = r.campaignId?._id || 'unknown';
    const name = r.templateName || r.campaignId?.templateName || 'Unknown Campaign';
    if (!acc[key]) acc[key] = { name, records: [], total: 0 };
    acc[key].records.push(r);
    acc[key].total += r.amount || 0;
    return acc;
  }, {}) || {};

  const receiptNumber = `RCP-${new Date(receiptData.period?.from).getFullYear()}${String(new Date(receiptData.period?.from).getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const generatedAt = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-GB') + ' ' + new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const fmtLong = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  const campaignBlocks = Object.entries(grouped).map(([_, camp], gi) => `
    <div class="camp">
      <div class="camp-hd">
        <span class="camp-name"><span class="dot"></span>${camp.name.toUpperCase()}</span>
        <span class="camp-badge">${camp.records.length} msg · ₨ ${camp.total.toLocaleString()}</span>
      </div>
      <table>
        <thead><tr>
          <th style="width:36px">#</th>
          <th>WhatsApp number</th>
          <th>Date &amp; time</th>
          <th>Status</th>
          <th>Amount</th>
        </tr></thead>
        <tbody>
          ${camp.records.map((r, i) => `
            <tr class="${i % 2 === 1 ? 'alt' : ''}">
              <td class="idx">${String(i + 1).padStart(2, '0')}</td>
              <td class="mono">+${r.whatsappNumber}</td>
              <td class="muted">${fmtDate(r.createdAt)}</td>
              <td><span class="s-badge">${r.status}</span></td>
              <td class="amt">₨ ${r.amount}.00</td>
            </tr>
          `).join('')}
          <tr class="sub-row">
            <td colspan="4">Campaign subtotal</td>
            <td class="amt">₨ ${camp.total.toLocaleString()}.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Billing Receipt — ${receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; font-size: 12px; }
    .page { max-width: 820px; margin: 32px auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }

    /* ── Header ── */
    .top { background: #04432e; padding: 28px 32px 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-name { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 4px; }
    .brand-sub { font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1.2px; }
    .doc { text-align: right; }
    .doc-title { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 5px; }
    .doc-ref { font-size: 11px; color: rgba(255,255,255,0.5); font-family: monospace; }
    .doc-date { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 3px; }

    /* ── Period bar ── */
    .period { display: flex; border-bottom: 1px solid #e2e8f0; }
    .period-item { flex: 1; padding: 14px 20px; }
    .period-item + .period-item { border-left: 1px solid #e2e8f0; text-align: right; }
    .period-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .period-val { font-size: 13px; font-weight: 600; color: #1e293b; font-family: monospace; }
    .pill { display: inline-block; font-size: 10px; padding: 3px 10px; border-radius: 20px; background: #dcfce7; color: #14532d; font-weight: 600; }

    /* ── Stats ── */
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid #e2e8f0; }
    .stat { padding: 18px 20px; }
    .stat + .stat { border-left: 1px solid #e2e8f0; }
    .stat-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .stat-val { font-size: 22px; font-weight: 700; color: #1e293b; font-family: monospace; }
    .stat-sub { font-size: 10px; color: #94a3b8; margin-top: 3px; }
    .stat.accent .stat-val { color: #04432e; }

    /* ── Section ── */
    .section { padding: 20px 24px; }
    .section-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .section-title { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; white-space: nowrap; }
    .section-line { flex: 1; height: 1px; background: #e2e8f0; }

    /* ── Campaign block ── */
    .camp { border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px; overflow: hidden; }
    .camp-hd { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .camp-name { font-size: 12px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: #04432e; display: inline-block; }
    .camp-badge { font-size: 10px; color: #04432e; background: #dcfce7; padding: 2px 10px; border-radius: 20px; font-family: monospace; font-weight: 600; }

    /* ── Table ── */
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f8fafc; }
    th { padding: 8px 16px; font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th:last-child { text-align: right; }
    td { padding: 9px 16px; font-size: 11px; color: #475569; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    tr.alt td { background: #fafafa; }
    td.idx { color: #94a3b8; font-family: monospace; font-size: 10px; }
    td.mono { font-family: monospace; font-weight: 600; color: #1e293b; }
    td.muted { font-size: 10px; color: #94a3b8; }
    td.amt { text-align: right; font-family: monospace; font-weight: 700; color: #1e293b; }
    .s-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 2px 7px; border-radius: 4px; background: #dcfce7; color: #14532d; letter-spacing: 0.5px; }
    .sub-row td { background: #f0fdf4 !important; color: #04432e; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #bbf7d0; border-bottom: none; }

    /* ── Grand total ── */
    .grand { margin: 0 24px 24px; border: 1.5px solid #04432e; border-radius: 8px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; background: #f0fdf4; }
    .grand-label { font-size: 11px; font-weight: 700; color: #04432e; text-transform: uppercase; letter-spacing: 1px; }
    .grand-detail { font-size: 10px; color: #64748b; margin-top: 3px; }
    .grand-amt { font-size: 28px; font-weight: 800; color: #04432e; font-family: monospace; }

    /* ── Footer ── */
    .footer { padding: 18px 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-note { font-size: 10px; color: #94a3b8; line-height: 1.8; }
    .sig-line { width: 130px; height: 1px; background: #cbd5e1; margin: 0 0 6px auto; }
    .sig-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; text-align: right; }

    @media print {
      body { background: #fff; }
      .page { margin: 0; border: none; border-radius: 0; }
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div>
        <p class="brand-name">WhatsApp CRM</p>
        <p class="brand-sub">Enterprise messaging platform</p>
      </div>
      <div class="doc">
        <p class="doc-title">Receipt</p>
        <p class="doc-ref">${receiptNumber}</p>
        <p class="doc-date">Generated: ${generatedAt}</p>
      </div>
    </div>

    <div class="period">
      <div class="period-item">
        <p class="period-label">Billing period</p>
        <p class="period-val">${fmtLong(receiptData.period.from)} → ${fmtLong(receiptData.period.to)}</p>
      </div>
      <div class="period-item">
        <p class="period-label">Status</p>
        <span class="pill">Settled</span>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <p class="stat-label">Total messages</p>
        <p class="stat-val">${receiptData.totalMessages}</p>
        <p class="stat-sub">Dispatched</p>
      </div>
      <div class="stat accent">
        <p class="stat-label">Total charged</p>
        <p class="stat-val">₨ ${receiptData.totalAmount?.toLocaleString()}</p>
        <p class="stat-sub">All campaigns</p>
      </div>
      <div class="stat">
        <p class="stat-label">Campaigns</p>
        <p class="stat-val">${Object.keys(grouped).length}</p>
        <p class="stat-sub">Active in period</p>
      </div>
    </div>

    <div class="section">
      <div class="section-head">
        <span class="section-title">Campaign breakdown</span>
        <div class="section-line"></div>
      </div>
      ${campaignBlocks}
    </div>

    <div class="grand">
      <div>
        <p class="grand-label">Grand total</p>
        <p class="grand-detail">${receiptData.totalMessages} messages across ${Object.keys(grouped).length} campaign(s)</p>
      </div>
      <span class="grand-amt">₨ ${receiptData.totalAmount?.toLocaleString()}.00</span>
    </div>

    <div class="footer">
      <p class="footer-note">
        This is a system-generated receipt.<br>
        All charges reflect actual WhatsApp message deliveries.<br>
        For disputes, contact your account administrator.
      </p>
      <div>
        <div class="sig-line"></div>
        <p class="sig-label">Authorized signature</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=920,height=750');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
};

  // Group records by campaign
  const grouped = receiptData?.records?.reduce((acc, r) => {
    const key = r.campaignId?._id || 'unknown';
    const name = r.templateName || r.campaignId?.templateName || 'Unknown Campaign';
    if (!acc[key]) acc[key] = { name, records: [], total: 0 };
    acc[key].records.push(r);
    acc[key].total += r.amount || 0;
    return acc;
  }, {}) || {};

  const receiptNumber = receiptData
    ? `RCP-${new Date(receiptData.period?.from).getFullYear()}${String(new Date(receiptData.period?.from).getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200/60">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#04432e] flex items-center justify-center">
              <Receipt className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">Generate Billing Receipt</h2>
              <p className="text-[10px] text-slate-400 font-medium">Select a date range to generate a detailed PDF receipt</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-xl transition text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">From Date</label>
              <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#04432e]/50 focus:ring-2 focus:ring-[#04432e]/10 bg-slate-50 focus:bg-white transition"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">To Date</label>
              <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#04432e]/50 focus:ring-2 focus:ring-[#04432e]/10 bg-slate-50 focus:bg-white transition"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !from || !to}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#04432e] text-white text-xs font-bold hover:bg-[#033424] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm h-[34px]"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {!receiptData && !isLoading && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
              <Receipt className="h-8 w-8 text-slate-200" />
              <p className="text-[11px] font-medium text-slate-400">Select a date range and click Generate</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-[#04432e]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Compiling receipt data...</span>
            </div>
          )}

          {receiptData && !isLoading && (
            <>
              {/* Print Action Bar */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Receipt Preview
                </span>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#04432e] text-white text-[10px] font-bold hover:bg-[#033424] active:scale-95 transition shadow-sm"
                >
                  <Download className="h-3 w-3" />
                  Download PDF
                </button>
              </div>

              {/* ── PRINTABLE RECEIPT CONTENT ── */}
              <div ref={printRef} className="border border-slate-200 rounded-xl p-6 bg-white text-slate-800 shadow-inner">

                {/* Receipt Header */}
                <div className="r-header flex justify-between items-start pb-5 mb-6 border-b-2 border-[#04432e]">
                  <div>
                    <div className="r-brand-name text-xl font-black text-[#04432e] tracking-tight">WhatsApp CRM</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Messaging Platform</div>
                    <div className="text-[10px] text-slate-500 mt-2 font-mono">Generated: {new Date().toLocaleString('en-GB')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800 tracking-tight">RECEIPT</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Document No.</div>
                    <div className="text-[11px] font-bold font-mono text-slate-600">{receiptNumber}</div>
                  </div>
                </div>

                {/* Period Banner */}
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6">
                  <div>
                    <div className="text-[8px] font-black text-[#04432e] uppercase tracking-widest mb-0.5">Billing Period</div>
                    <div className="text-sm font-bold text-slate-800 font-mono">
                      {new Date(receiptData.period?.from).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                      &nbsp;→&nbsp;
                      {new Date(receiptData.period?.to).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Status</div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Settled</span>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="border border-slate-200 rounded-xl p-3">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Messages</div>
                    <div className="text-lg font-black font-mono text-slate-800">{receiptData.totalMessages}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Dispatched</div>
                  </div>
                  <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-3">
                    <div className="text-[8px] font-black text-[#04432e] uppercase tracking-widest mb-1">Total Charged</div>
                    <div className="text-lg font-black font-mono text-[#04432e]">₨ {receiptData.totalAmount?.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">All campaigns</div>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Campaigns</div>
                    <div className="text-lg font-black font-mono text-slate-800">{Object.keys(grouped).length}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Active in period</div>
                  </div>
                </div>

                {/* Campaign Breakdown */}
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Campaign Breakdown</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="space-y-4">
                    {Object.entries(grouped).map(([campId, camp]) => (
                      <div key={campId} className="border border-slate-200 rounded-xl overflow-hidden">
                        {/* Campaign Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#04432e]" />
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{camp.name}</span>
                          </div>
                          <span className="text-[9px] font-bold text-[#04432e] bg-emerald-100 px-2 py-0.5 rounded-lg font-mono">
                            {camp.records.length} msg · ₨ {camp.total.toLocaleString()}
                          </span>
                        </div>

                        {/* Records Table */}
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-100/60">
                              <th className="py-2 px-4 text-[8px] font-bold text-slate-400 uppercase tracking-wider">#</th>
                              <th className="py-2 px-4 text-[8px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                              <th className="py-2 px-4 text-[8px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                              <th className="py-2 px-4 text-[8px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                              <th className="py-2 px-4 text-[8px] font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {camp.records.map((r, i) => (
                              <tr key={r._id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                                <td className="py-2 px-4 text-[10px] text-slate-400 font-mono">{String(i + 1).padStart(2, '0')}</td>
                                <td className="py-2 px-4 text-[10px] font-semibold text-slate-700 font-mono">+{r.whatsappNumber}</td>
                                <td className="py-2 px-4 text-[10px] text-slate-500">
                                  {new Date(r.createdAt).toLocaleDateString('en-GB')} {new Date(r.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </td>
                                <td className="py-2 px-4">
                                  <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded uppercase tracking-wider">{r.status}</span>
                                </td>
                                <td className="py-2 px-4 text-right text-[10px] font-black font-mono text-slate-800">₨ {r.amount}.00</td>
                              </tr>
                            ))}
                            {/* Campaign subtotal */}
                            <tr className="bg-emerald-50 border-t border-emerald-100">
                              <td colSpan="4" className="py-2 px-4 text-[9px] font-black text-[#04432e] uppercase tracking-wider">Campaign Subtotal</td>
                              <td className="py-2 px-4 text-right text-[11px] font-black font-mono text-[#04432e]">₨ {camp.total.toLocaleString()}.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grand Total */}
                <div className="mt-6 border-2 border-[#04432e] rounded-xl px-5 py-4 bg-emerald-50 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-black text-[#04432e] uppercase tracking-widest mb-0.5">Grand Total</div>
                    <div className="text-[10px] text-slate-500">{receiptData.totalMessages} messages across {Object.keys(grouped).length} campaign(s)</div>
                  </div>
                  <div className="text-2xl font-black font-mono text-[#04432e]">₨ {receiptData.totalAmount?.toLocaleString()}.00</div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-5 border-t border-slate-200 flex justify-between items-end">
                  <div>
                    <div className="text-[9px] text-slate-400 font-medium leading-relaxed">
                      This receipt is a system-generated document.<br />
                      All charges reflect actual WhatsApp message deliveries.<br />
                      For disputes, contact your account administrator.
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-36 h-px bg-slate-300 mb-1.5 ml-auto" />
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signature</div>
                  </div>
                </div>

              </div>
              {/* End Printable */}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const BillingDashboard = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [activeModalId, setActiveModalId] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false); // ← NEW

  const { data: summaryRes, isLoading: isSummaryLoading } = useGetBillingSummaryQuery();
  const { data: listRes, isLoading: isListLoading } = useGetBillingsQuery({ page, limit });
  const { data: campaignsRes } = useGetAllCampaignsQuery();
  
  const { data: campaignBillingRes, isLoading: isCampaignDetailLoading } = useGetCampaignBillingQuery(
    activeModalId, 
    { skip: !activeModalId }
  );

  const summary = summaryRes?.data || { totalMessages: 0, totalAmount: 0 };
  const billings = listRes?.data || [];
  const totalPages = listRes?.pages || 1;
  const campaignsList = campaignsRes?.data || [];

  const filteredBillings = selectedCampaignId 
    ? billings.filter(b => b.campaignId?._id === selectedCampaignId)
    : billings;

  const getStatusBadge = (status) => {
    return status?.toLowerCase() === 'charged' ? (
      <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200/40 rounded-md">Charged</span>
    ) : (
      <span className="text-[9px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200/40 rounded-md">{status || 'Pending'}</span>
    );
  };

  if (isSummaryLoading || isListLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#fbfcfd] text-slate-400">
        <Loader2 className="h-7 w-7 animate-spin text-[#04432e]" />
        <span className="text-[11px] font-medium tracking-wider uppercase text-slate-500 font-sans">Compiling financial ledger pipelines...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fcfdfe] font-sans antialiased text-slate-700 min-h-screen pb-12 overflow-y-auto">
      
      {/* HEADER SYSTEM */}
      <div className="bg-white border-b border-slate-200/60 px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#04432e]">
              <CreditCard className="h-4 w-4 stroke-[2.5]" />
              <h1 className="text-xs font-black tracking-wider text-slate-800 uppercase">
                Enterprise Billing Ledger
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 font-mono">
              Real-time message routing cost tracking & auditing matrix.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* ── Receipt Button ── */}
            <button
              onClick={() => setShowReceiptModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#04432e] text-white text-[10px] font-bold hover:bg-[#033424] active:scale-95 transition shadow-sm shrink-0"
            >
              <Receipt className="h-3.5 w-3.5" />
              Generate Receipt
            </button>

            {/* Campaign Filter */}
            <div className="w-full sm:w-64">
              <select
                value={selectedCampaignId}
                onChange={(e) => {
                  setSelectedCampaignId(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#04432e]/40 focus:bg-white transition"
              >
                <option value="">Filter View: All Campaigns</option>
                {campaignsList.map((camp) => (
                  <option key={camp._id} value={camp._id}>
                    {camp.templateName?.toUpperCase()} ({new Date(camp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* PREMIUM METRIC SUMMARIES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] relative overflow-hidden">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Total Templates Send</span>
            <span className="text-xl font-black text-slate-800 mt-1 block font-mono">{summary.totalMessages}</span>
            <span className="text-[9px] font-medium text-slate-400 mt-1 block">Accumulated pipeline outbound attempts</span>
            <Layers className="absolute right-4 bottom-4 h-8 w-8 text-slate-100 -z-0 pointer-events-none" />
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] relative overflow-hidden">
            <span className="text-[8px] font-bold text-[#04432e] uppercase tracking-wider block">Total Allocated Amount</span>
            <span className="text-xl font-black text-slate-900 mt-1 block font-mono">₨ {summary.totalAmount?.toLocaleString()}</span>
            <span className="text-[9px] font-medium text-slate-400 mt-1 block">Charged against live cloud WhatsApp tokens</span>
            <Coins className="absolute right-4 bottom-4 h-8 w-8 text-[#04432e]/5 -z-0 pointer-events-none" />
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] sm:col-span-2 lg:col-span-1 relative overflow-hidden">
            <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider block">Average Campaign Surcharges</span>
            <span className="text-xl font-black text-indigo-900 mt-1 block font-mono">
              ₨ {summary.totalMessages ? (summary.totalAmount / summary.totalMessages).toFixed(2) : '0.00'}
            </span>
            <span className="text-[9px] font-medium text-slate-400 mt-1 block">Mean computation per payload delivery state</span>
            <TrendingUp className="absolute right-4 bottom-4 h-8 w-8 text-indigo-500/5 -z-0 pointer-events-none" />
          </div>
        </div>

        {/* DATA LEDGER BLOCK */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
           Transaction Records
          </h2>

          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4 sm:px-6">Template Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 hidden md:table-cell">Message Blueprint Frame</th>
                    <th className="py-3 px-4 text-right">Debit Statement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {filteredBillings.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-slate-400 italic text-[11px]">
                        No cross-referenced records matching specified lookup filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBillings.map((bill) => (
                      <tr key={bill._id} className="hover:bg-slate-50/40 transition duration-150 group">
                        
                        <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                          <button 
                            onClick={() => setActiveModalId(bill.campaignId?._id)}
                            className="font-bold text-slate-800 tracking-tight flex items-center gap-1 hover:text-[#04432e] text-left group-hover:underline decoration-[#04432e]/40"
                          >
                            {bill.templateName || bill.campaignId?.templateName}
                            <ArrowUpRight className="h-2.5 w-2.5 text-slate-400 group-hover:text-[#04432e] opacity-0 group-hover:opacity-100 transition" />
                          </button>
                          <div className="text-[9px] text-slate-400 mt-0.5 font-mono flex items-center gap-1">
                            <Calendar className="h-2 w-2" />
                            {new Date(bill.createdAt).toLocaleDateString('en-GB')} {new Date(bill.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1 font-semibold text-slate-700">
                            <Smartphone className="h-2.5 w-2.5 text-slate-400 font-sans" />
                            +{bill.whatsappNumber}
                          </div>
                          <div className="text-[8px] text-slate-400 truncate max-w-[150px] font-sans mt-0.5" title={bill.messageId?.wamid}>
                            {bill.messageId?.wamid || '—'}
                          </div>
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell max-w-xs truncate text-[11px] font-medium text-slate-500">
                          <span className="italic" title={bill.messageId?.body}>"{bill.messageId?.body || 'No metadata dynamic string content frame returned.'}"</span>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="font-mono font-black text-slate-900 text-[12px]">₨ {bill.amount}.00</div>
                          <div className="mt-0.5">{getStatusBadge(bill.status)}</div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!selectedCampaignId && totalPages > 1 && (
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Page {page} of {totalPages}</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition active:scale-95"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition active:scale-95"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CAMPAIGN DRILLDOWN DRAWER — unchanged */}
      {activeModalId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-slideLeft">
            
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider block">Isolated Audit Context</span>
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-800 mt-0.5">Campaign Isolation View</h3>
              </div>
              <button 
                onClick={() => setActiveModalId(null)}
                className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {isCampaignDetailLoading ? (
                <div className="h-42 w-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-[#04432e]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Assembling dynamic cross reference vectors...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-slate-200/70 rounded-xl p-3 bg-slate-50/50">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Total Dispatches</span>
                      <span className="text-base font-black text-slate-800 font-mono mt-0.5 block">{campaignBillingRes?.totalMessages || 0}</span>
                    </div>
                    <div className="border border-slate-200/70 rounded-xl p-3 bg-[#04432e]/5">
                      <span className="text-[8px] font-bold text-[#04432e] uppercase tracking-wider block">Campaign Total Sum</span>
                      <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">₨ {campaignBillingRes?.totalAmount || 0}.00</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Associated Recipients Queue</span>
                    <div className="border border-slate-200/60 rounded-xl overflow-hidden text-xs">
                      <div className="bg-slate-50 border-b border-slate-200/60 px-3 py-2 grid grid-cols-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Gateway Address</span>
                        <span className="text-right">Disbursement</span>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {campaignBillingRes?.data?.map((item) => (
                          <div key={item._id} className="px-3 py-2.5 grid grid-cols-2 items-center hover:bg-slate-50/40">
                            <div>
                              <span className="font-mono text-[11px] font-bold text-slate-700">+{item.whatsappNumber}</span>
                              <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-tight mt-0.5">{item.templateName}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-black text-slate-800">₨ {item.amount}.00</span>
                              <span className="block text-[8px] text-emerald-600 font-medium tracking-wide font-mono mt-0.5">{item.status?.toUpperCase()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RECEIPT MODAL ── */}
      {showReceiptModal && (
        <ReceiptModal onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};

export default BillingDashboard;