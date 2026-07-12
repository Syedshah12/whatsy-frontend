

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layers,
  UploadCloud,
  FileSpreadsheet,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Smartphone,
  Info,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { socket } from '../../socket';
import { useGetTemplatesQuery, useSendBulkTemplateMutation,useCancelBulkCampaignMutation  } from '../../features/messages/messagesApi';

// ─── Persistence Keys ──────────────────────────────────────────────────────────
const STORAGE_KEY_CAMPAIGN  = 'broadcast_activeCampaign';
const STORAGE_KEY_PROGRESS  = 'broadcast_progressData';
const STORAGE_KEY_COMPLETED = 'broadcast_isCompleted';

const DEFAULT_PROGRESS = { total: 0, sent: 0, failed: 0, percentage: 0 };

// ─── Helpers ───────────────────────────────────────────────────────────────────
const saveToStorage = (campaignId, progress, isCompleted) => {
  try {
    localStorage.setItem(STORAGE_KEY_CAMPAIGN,  campaignId ?? '');
    localStorage.setItem(STORAGE_KEY_PROGRESS,  JSON.stringify(progress));
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(isCompleted));
  } catch (_) {}
};

const loadFromStorage = () => {
  try {
    const campaignId  = localStorage.getItem(STORAGE_KEY_CAMPAIGN)  || null;
    const progress    = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS)  || 'null');
    const isCompleted = JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLETED) || 'false');
    return {
      campaignId:  campaignId || null,
      progress:    progress   || DEFAULT_PROGRESS,
      isCompleted: !!isCompleted,
    };
  } catch (_) {
    return { campaignId: null, progress: DEFAULT_PROGRESS, isCompleted: false };
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_CAMPAIGN);
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    localStorage.removeItem(STORAGE_KEY_COMPLETED);
  } catch (_) {}
};

// ─── Component ─────────────────────────────────────────────────────────────────
const BroadcastTemplate = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedFile,     setSelectedFile]     = useState(null);
  const [variableInput, setVariableInput] = useState('');
  const [headerType, setHeaderType] = useState('none');
  const [headerMediaId, setHeaderMediaId] = useState('');
  const [headerMediaLink, setHeaderMediaLink] = useState('');
  const fileInputRef = useRef(null);
const [cancelBulkCampaign, { isLoading: isCancelling }] = useCancelBulkCampaignMutation();
const [isCancelled, setIsCancelled] = useState(false);
  // Restored from localStorage on first mount
  const [activeCampaign, setActiveCampaign] = useState(() => loadFromStorage().campaignId);
  const [progressData,   setProgressData]   = useState(() => loadFromStorage().progress);
  const [isCompleted,    setIsCompleted]    = useState(() => loadFromStorage().isCompleted);

  // RTK Query
  const { data: templatesResponse, isLoading: isTemplatesLoading } = useGetTemplatesQuery();
  const [sendBulkTemplate, { isLoading: isSubmitting }]           = useSendBulkTemplateMutation();
  const templates = templatesResponse?.data || [];

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);


  const handleCancelCampaign = async () => {
  if (!activeCampaign) return;
  try {
    await cancelBulkCampaign(activeCampaign).unwrap();
    toast.success('Cancel requested — stopping after the current message.');
  } catch (err) {
    toast.error(err?.data?.message || 'Failed to cancel campaign.');
  }
};
  // ── Keep localStorage in sync whenever state changes ──────────────────────
  useEffect(() => {
    if (activeCampaign) {
      saveToStorage(activeCampaign, progressData, isCompleted);
    }
  }, [activeCampaign, progressData, isCompleted]);

  // ── Socket listener — re-attaches on mount AND whenever activeCampaign changes
  //    This means a refresh mid-campaign immediately re-subscribes ─────────────
useEffect(() => {
    if (!activeCampaign) return;

    const joinRoom = () => {
      socket.emit('join_campaign', String(activeCampaign));
      console.log('📡 Joined campaign room:', activeCampaign);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.connect();
    }

    // Rejoin room on every reconnect (handles mid-campaign refresh)
    socket.on('connect', joinRoom);

    const handleProgress = (data) => {
      if (String(data.campaignId) !== String(activeCampaign)) return;

      const percentage = data.total > 0
        ? Math.round((data.sent / data.total) * 100)
        : 0;

      const next = {
        total:      data.total,
        sent:       data.sent,
        failed:     data.failed,
        percentage,
      };

      setProgressData(next);
      saveToStorage(activeCampaign, next, false);

      if (data.phone) {
        toast.success(`Sent to +${data.phone}`);
      }

      const done = data.total > 0 && (data.sent + data.failed >= data.total);
      if (done) {
        setIsCompleted(true);
        saveToStorage(activeCampaign, next, true);
        toast.success('Broadcast campaign completed!');
      }
    };

    socket.on('bulk_progress', handleProgress);


const handleStatusChanged = (data) => {
  if (String(data.campaignId) !== String(activeCampaign)) return;
  if (data.status === 'cancelled') {
    setIsCancelled(true);
    setIsCompleted(true); // reuse completed UI state to stop showing "in progress"
    toast('Campaign cancelled.');
  }
};

socket.on('campaign_status_changed', handleStatusChanged);
// remember to also add: socket.off('campaign_status_changed', handleStatusChanged); in cleanup

    return () => {
      socket.off('connect', joinRoom);       // ← new cleanup
      socket.off('bulk_progress', handleProgress);
      socket.off('campaign_status_changed', handleStatusChanged);
    };
  }, [activeCampaign]);

  // ── File selection ─────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const valid = file && (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    if (valid) {
      setSelectedFile(file);
      toast.success('Workbook uploaded successfully!');
    } else {
      toast.error('Please upload a valid Excel file (.xlsx).');
    }
  };

  // ── Launch campaign ────────────────────────────────────────────────────────
  const handleLaunchCampaign = async () => {
    if (!selectedTemplate) return toast.error('Please select a template.');
    if (!selectedFile)     return toast.error('Please upload a recipient file.');

    try {
      const variableColumns = variableInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await sendBulkTemplate({
        file:         selectedFile,
        templateName: selectedTemplate.name,
        langCode:     selectedTemplate.language || 'en_US',
        variableColumns,
        headerType,
        headerMediaId: headerMediaId.trim(),
        headerMediaLink: headerMediaLink.trim(),
      }).unwrap();

      if (response?.success) {
        const campaignId = response.campaignId;
        toast.success(response.message || 'Campaign started!');
        // Persist before setting state so the socket useEffect has data immediately
        saveToStorage(campaignId, DEFAULT_PROGRESS, false);
        setActiveCampaign(campaignId);
        setProgressData(DEFAULT_PROGRESS);
        setIsCompleted(false);
      }
    } catch (err) {
      toast.error(err?.data?.error || err?.message || 'Failed to start broadcast.');
    }
  };

  // ── Reset / start new campaign ─────────────────────────────────────────────
  const handleReset = () => {
    clearStorage();
    setActiveCampaign(null);
    setProgressData(DEFAULT_PROGRESS);
    setIsCompleted(false);
    setSelectedFile(null);
    setVariableInput('');
    setHeaderType('none');
    setHeaderMediaId('');
    setHeaderMediaLink('');
    setIsCancelled(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isResumingCampaign = !!activeCampaign && !isCompleted && !isSubmitting;

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-[#f8f9fa] font-sans antialiased text-slate-700 overflow-hidden">

      {/* LEFT: TEMPLATES */}
      <div className="w-full md:w-[380px] xl:w-[420px] bg-white border-r border-slate-200 flex flex-col h-1/2 md:h-full shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-[#04432e]">
            <Layers className="h-5 w-5" />
            <h1 className="text-sm font-bold tracking-tight text-slate-800">WhatsApp Templates</h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Select a Meta-approved template to broadcast.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isTemplatesLoading ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin text-[#04432e]" />
              <span className="text-xs">Loading templates...</span>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center p-6 text-xs text-slate-400 italic">
              No templates found on this account.
            </div>
          ) : (
            templates.map((template) => {
              const isSelected = selectedTemplate?.name === template.name;
              return (
                <div
                  key={template.id || template.name}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-xl border cursor-pointer transition relative overflow-hidden ${
                    isSelected
                      ? 'border-[#04432e] bg-emerald-50/20 ring-1 ring-[#04432e]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {template.category}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {template.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-800 truncate mb-1">{template.name}</h3>
                  <div className="flex gap-3 text-[10px] text-slate-400 font-medium">
                    <span>Lang: <b className="text-slate-600">{template.language}</b></span>
                    <span>Format: <b className="text-slate-600">{template.parameter_format}</b></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: WORKSPACE */}
      <div className="flex-1 flex flex-col h-1/2 md:h-full overflow-hidden">

        <div className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Broadcast Console</h2>
          </div>

          {/* Show "Start New" button when a campaign is active or completed */}
          {activeCampaign && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              <RotateCcw className="h-3 w-3" />
              Start New Campaign
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

            {/* LEFT STACK: CONTROLS */}
            <div className="xl:col-span-7 space-y-5">

              {/* Restored session banner */}
              {isResumingCampaign && (
                <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                  <div className="text-xs text-amber-800">
                    <span className="font-semibold">Campaign in progress.</span> Your broadcast is still running in the background — progress is shown below.
                  </div>
                </div>
              )}

              {/* File Upload — hidden when campaign is running */}
              {!activeCampaign && (
                <>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      1. Upload Recipient File
                    </h3>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                        selectedFile
                          ? 'border-[#04432e] bg-emerald-50/10'
                          : 'border-slate-200 hover:border-[#04432e] hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx, .xls"
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                          <UploadCloud className="h-5 w-5" />
                        </div>
                        {selectedFile ? (
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{selectedFile.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB • Click to replace</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-medium text-slate-600">Click to upload recipient list</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Supports .xlsx files only</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200/60 p-3 flex gap-2.5 items-start">
                      <Info className="h-4 w-4 text-[#04432e] shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed text-slate-500">
                        <span className="font-semibold text-slate-700 block mb-0.5">Required column headers:</span>
                        <div className="flex flex-wrap gap-1 mt-1.5 font-mono text-[10px]">
                          {['Name', 'RollNumber', 'WhatsappNumber', 'FatherName', 'ObtainedMarks', 'Totalmarks','TestName','Date'].map(col => (
                            <span key={col} className="bg-white px-1.5 py-0.5 border border-slate-200 rounded text-[#04432e] font-semibold">{col}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <a
  href="/sample-template.xlsx"
  download
  className="mt-3 w-full flex items-center justify-center gap-2 
  bg-emerald-50 hover:bg-emerald-100 
  border border-emerald-200 
  text-[#04432e] 
  text-xs font-semibold 
  py-2.5 rounded-xl 
  transition active:scale-95"
>
  <FileSpreadsheet className="h-4 w-4" />
  Download Sample Excel Template
</a>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">2. Template Variables / Header Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-semibold text-slate-500">Body variable columns (optional, comma separated)</label>
                        <input
                          value={variableInput}
                          onChange={(e) => setVariableInput(e.target.value)}
                          placeholder="Example: Name, RollNumber, __marks__, TestName"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#04432e]"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Leave blank for existing result/attendance templates. Use __marks__ for ObtainedMarks/Totalmarks.</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Template header media type</label>
                        <select
                          value={headerType}
                          onChange={(e) => setHeaderType(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#04432e]"
                        >
                          <option value="none">No media header</option>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="document">Document</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Header media ID</label>
                        <input
                          value={headerMediaId}
                          onChange={(e) => setHeaderMediaId(e.target.value)}
                          placeholder="Meta media id"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#04432e]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-semibold text-slate-500">Or header public media link</label>
                        <input
                          value={headerMediaLink}
                          onChange={(e) => setHeaderMediaLink(e.target.value)}
                          placeholder="https://..."
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#04432e]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Launch button */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">3. Launch Campaign</h4>
                      <p className="text-[10px] text-slate-400">Sends to all rows in the uploaded file.</p>
                    </div>
                    <button
                      onClick={handleLaunchCampaign}
                      disabled={isSubmitting || !selectedFile || !selectedTemplate}
                      className="flex items-center gap-2 bg-[#04432e] hover:bg-[#033424] text-white font-medium text-xs py-2 px-5 rounded-xl shadow-sm transition disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Starting...</>
                      ) : (
                        <><Play className="h-3.5 w-3.5 fill-current" /> Execute Broadcast</>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* LIVE PROGRESS MONITOR */}
              {activeCampaign && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        {isCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                        )}
                        {isCompleted ? 'Campaign Complete' : 'Live Progress'}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Campaign ID: <span className="font-mono bg-slate-50 px-1 border rounded text-slate-600">{activeCampaign}</span>
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      isCompleted
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                        : 'text-[#04432e] bg-emerald-50 border-emerald-100'
                    }`}>
                      {progressData.percentage}%
                    </span>


                        {!isCompleted && (
      <button
        onClick={handleCancelCampaign}
        disabled={isCancelling}
        className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 border border-rose-200 hover:border-rose-300 px-3 py-1.5 rounded-lg transition disabled:opacity-40"
      >
        {isCancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
        Cancel
      </button>
    )}
                  </div>

                  {/* Counters */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center">
                      <span className="text-[10px] font-medium text-slate-400 block uppercase">Total</span>
                      <span className="text-base font-bold text-slate-800 mt-0.5 block">{progressData.total}</span>
                    </div>
                    <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl text-center">
                      <span className="text-[10px] font-medium text-emerald-600 block uppercase flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Sent
                      </span>
                      <span className="text-base font-bold text-[#04432e] mt-0.5 block">{progressData.sent}</span>
                    </div>
                    <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-xl text-center">
                      <span className="text-[10px] font-medium text-rose-500 block uppercase flex items-center justify-center gap-1">
                        <XCircle className="h-3 w-3" /> Failed
                      </span>
                      <span className="text-base font-bold text-rose-700 mt-0.5 block">{progressData.failed}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-[#04432e]'}`}
                      style={{ width: `${progressData.percentage}%` }}
                    />
                  </div>

                  {/* Footer note */}
                  {!isCompleted ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>Messages are sending in the background. You can safely close or refresh this page — progress will resume when you return.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>All messages processed. Click <b>Start New Campaign</b> above to run another broadcast.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT STACK: PHONE PREVIEW */}
            <div className="xl:col-span-5 flex justify-center">
              <div className="w-full max-w-[290px] border-[6px] border-slate-800 rounded-[36px] shadow-xl bg-white relative overflow-hidden aspect-[9/18] flex flex-col shrink-0">
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 flex justify-center items-start z-30">
                  <div className="w-16 h-2 bg-slate-900 rounded-b-md" />
                </div>

                <div className="flex-1 flex flex-col pt-4 bg-[#efeae2] relative">
                  <div className="h-10 bg-[#04432e] px-3 flex items-center gap-2 text-white shadow-sm shrink-0">
                    <Smartphone className="h-3.5 w-3.5 opacity-70" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold leading-none truncate">Template Preview</p>
                      <p className="text-[7px] text-emerald-200/80 tracking-wide mt-0.5">Live render</p>
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-2">
                    {selectedTemplate ? (
                      <div className="max-w-[90%] bg-white rounded-xl shadow-sm border border-slate-200/40 p-2.5 space-y-1.5 relative">
                        {selectedTemplate.components?.find(c => c.type === 'HEADER') && (
                          <div className="text-[10px] font-bold text-slate-800 border-b border-slate-100 pb-1">
                            {selectedTemplate.components.find(c => c.type === 'HEADER').text}
                          </div>
                        )}
                        {selectedTemplate.components?.find(c => c.type === 'BODY') && (
                          <div className="text-[9px] leading-relaxed text-slate-600 whitespace-pre-wrap">
                            {selectedTemplate.name === '3p_direct_integration_test_template' ? (
                              selectedTemplate.components.find(c => c.type === 'BODY').text
                            ) : (
                              <>
                                Result for <span className="bg-amber-100 text-amber-800 font-mono px-0.5 rounded text-[8px]">{'{{Name}}'}</span>.<br />
                                Roll: <span className="bg-amber-100 text-amber-800 font-mono px-0.5 rounded text-[8px]">{'{{RollNumber}}'}</span>.<br />
                                Father: <span className="bg-amber-100 text-amber-800 font-mono px-0.5 rounded text-[8px]">{'{{FatherName}}'}</span>.<br />
                                Marks: <span className="bg-amber-100 text-amber-800 font-mono px-0.5 rounded text-[8px]">{'{{ObtainedMarks}}'}</span> / <span className="bg-amber-100 text-amber-800 font-mono px-0.5 rounded text-[8px]">{'{{TotalMarks}}'}</span>.
                              </>
                            )}
                          </div>
                        )}
                        {selectedTemplate.components?.find(c => c.type === 'FOOTER') && (
                          <div className="text-[7.5px] font-medium text-slate-400 uppercase tracking-tight pt-0.5">
                            {selectedTemplate.components.find(c => c.type === 'FOOTER').text}
                          </div>
                        )}
                        <div className="absolute left-[-4px] top-2.5 w-0 h-0 border-t-[4px] border-t-transparent border-r-[5px] border-r-white border-b-[4px] border-b-transparent" />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center p-4 text-[10px] text-slate-400 italic">
                        Select a template to preview it here.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastTemplate;