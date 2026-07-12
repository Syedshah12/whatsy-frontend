import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Loader2, MoreVertical, Paperclip, Search, Send, X } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useGetConversationsQuery, useGetConversationMessagesQuery } from "../../features/chats/chatsApi";
import { useSendMessageMutation, useSendMediaMutation } from "../../features/messages/messagesApi";
import { chatApi } from "../../features/chats/chatsApi";
import MessageStatus from "../../components/MessageStatus";
import { API_MESSAGES } from "../../config/api";

const getMediaUrl = (message) => {
  if (message?.media?.link) return message.media.link;
  if (message?.media?.id) return `${API_MESSAGES}/media/${message.media.id}/proxy`;
  return "";
};

const guessMediaType = (file) => {
  if (!file) return "document";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "document";
};

const ChatPage = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const limit = 20;

  const [sendMessage, { isLoading: isSendingText }] = useSendMessageMutation();
  const [sendMedia, { isLoading: isSendingMedia }] = useSendMediaMutation();
  const isSending = isSendingText || isSendingMedia;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: conversationsResponse,
    isLoading: isConversationsLoading,
    isFetching: isConversationsFetching,
    isError: isConversationsError,
  } = useGetConversationsQuery({ page, limit, search: debouncedSearch });

  const conversations = conversationsResponse?.data || [];
  const totalPages = conversationsResponse?.pagination?.pages || 1;

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  const {
    data: messagesResponse,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useGetConversationMessagesQuery({ id: selectedConversationId }, { skip: !selectedConversationId });

  const messages = messagesResponse?.data || [];
  const activeConversation = conversations.find((c) => c._id === selectedConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isConversationsError) toast.error("Failed to load conversations.");
    if (isMessagesError) toast.error("Failed to load chat messages.");
  }, [isConversationsError, isMessagesError]);

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDateLabel = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  const handleSelectChat = (id) => {
    setSelectedConversationId(id);
    setIsMobileChatOpen(true);
    dispatch(
      chatApi.util.updateQueryData("getConversations", { page, limit, search: debouncedSearch }, (draft) => {
        const conversation = draft?.data?.find((c) => c._id === id);
        if (conversation) conversation.unreadCount = 0;
      }),
    );
  };

  const activePhone = activeConversation?.contactId?.phone;

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!messageText.trim() && !selectedFile) || !activePhone) return;

    const text = messageText.trim();
    const file = selectedFile;
    setMessageText("");
    setSelectedFile(null);

    try {
      if (file) {
        await sendMedia({
          phone: activePhone,
          type: guessMediaType(file),
          file,
          caption: text,
          filename: file.name,
        }).unwrap();
      } else {
        await sendMessage({ phone: activePhone, message: text }).unwrap();
      }
    } catch (err) {
      toast.error(err?.data?.error?.error?.message || err?.data?.error || "Failed to send message.");
      setMessageText(text);
      setSelectedFile(file);
    }
  };

  const renderMessageBody = (message) => {
    const mediaUrl = getMediaUrl(message);
    const caption = message.media?.caption;

    if (message.type === "image" && mediaUrl) {
      return (
        <div className="space-y-2">
          <img src={mediaUrl} alt={caption || "WhatsApp image"} className="max-h-72 rounded-lg object-cover" />
          {caption && <p>{caption}</p>}
        </div>
      );
    }

    if (message.type === "video" && mediaUrl) {
      return (
        <div className="space-y-2">
          <video src={mediaUrl} controls className="max-h-72 rounded-lg" />
          {caption && <p>{caption}</p>}
        </div>
      );
    }

    if (message.type === "audio" && mediaUrl) {
      return <audio src={mediaUrl} controls className="w-64" />;
    }

    if (message.type === "document" && mediaUrl) {
      return (
        <a href={mediaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline">
          <FileText className="h-4 w-4" />
          {message.media?.filename || message.body || "Open document"}
        </a>
      );
    }

    return <span className="whitespace-pre-wrap break-words">{message.body}</span>;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] font-sans antialiased text-slate-700">
      <div className={`h-full w-full flex-col border-r border-slate-200/80 bg-white md:flex md:w-[340px] xl:w-[380px] shrink-0 ${isMobileChatOpen ? "hidden" : "flex"}`}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tight text-slate-800">Chats</h1>
            {conversations.length > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#04432e] px-1 text-[10px] font-medium text-white">{conversations.length}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchOpen((prev) => !prev)} className={`flex h-7 w-7 items-center justify-center rounded-full transition ${isSearchOpen ? "bg-[#04432e] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
              <Search className="h-4 w-4" />
            </button>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-4 w-4" /></button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="px-4 pb-2">
            <input type="text" autoFocus value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name, phone or roll no" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#04432e]" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
          {isConversationsLoading ? (
            <div className="flex h-full items-center justify-center text-slate-400 gap-2"><Loader2 className="h-4 w-4 animate-spin text-[#04432e]" /><span className="text-xs">Loading chats...</span></div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 italic">No conversations found.</div>
          ) : (
            conversations.map((chat) => {
              const isActive = chat._id === selectedConversationId;
              return (
                <button key={chat._id} onClick={() => handleSelectChat(chat._id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${isActive ? "bg-[#e9f5f0]" : "hover:bg-slate-50"}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#04432e] text-white font-semibold text-xs">
                    {(chat.contactId?.profileName || chat.contactId?.name || chat.contactId?.phone || "WA").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-xs font-semibold text-slate-800">{chat.contactId?.profileName || chat.contactId?.name || chat.contactId?.phone || "Unknown"}</h3>
                      <span className={`shrink-0 text-[9px] ${chat.unreadCount > 0 ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>{formatDateLabel(chat.lastMessageAt)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] text-slate-500 flex items-center gap-1">
                        {chat.lastMessageDirection === "outbound" && <MessageStatus status={chat.lastMessageStatus} />}
                        <span>{chat.lastMessageBody || "Empty conversation"}</span>
                      </p>
                      {chat.unreadCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white">{chat.unreadCount}</span>}
                    </div>
                  </div>
                </button>
              );
            })
          )}

          {page < totalPages && (
            <div className="flex justify-center py-3">
              <button onClick={() => setPage((p) => p + 1)} disabled={isConversationsFetching} className="rounded-full border border-slate-200 px-4 py-1 text-[11px] text-slate-500 hover:bg-slate-50 disabled:opacity-50">
                {isConversationsFetching ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`h-full flex-1 flex-col bg-[#f8f9fa] relative ${isMobileChatOpen ? "flex" : "hidden md:flex"}`}>
        {activeConversation ? (
          <>
            <div className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-4 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileChatOpen(false)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 md:hidden transition"><ArrowLeft className="h-4 w-4" /></button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#04432e] text-white font-medium text-xs shadow-sm">
                  {(activeConversation.contactId?.profileName || activeConversation.contactId?.phone || "A").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-800 leading-tight">{activeConversation.contactId?.profileName || activeConversation.contactId?.name || activeConversation.contactId?.phone || "Anonymous User"}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{activeConversation.contactId?.phone ? `+${activeConversation.contactId.phone}` : "No phone linked"}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {isMessagesLoading ? (
                <div className="flex h-full items-center justify-center text-slate-400 gap-2"><Loader2 className="h-4 w-4 animate-spin text-[#04432e]" /><span className="text-xs">Loading messages...</span></div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400 italic">No messages yet. Start the conversation below.</div>
              ) : (
                messages.map((message) => {
                  const isInbound = message.direction === "inbound";
                  return (
                    <div key={message._id} className={`flex flex-col ${isInbound ? "items-start" : "items-end"} gap-1`}>
                      <div className={`max-w-[78%] px-4 py-2 text-[11px] shadow-sm ${isInbound ? "rounded-r-xl rounded-bl-xl bg-[#04432E] text-white" : "rounded-l-xl rounded-br-xl bg-slate-200/80 text-slate-700"}`}>
                        {renderMessageBody(message)}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 px-1">
                        <span>{formatTime(message.sentAt || message.createdAt)}</span>
                        {!isInbound && <MessageStatus status={message.status} />}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-3 border-t border-slate-200/80 z-10">
              {selectedFile && (
                <div className="mb-2 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] text-slate-600 max-w-4xl mx-auto">
                  <span className="truncate">Attached: {selectedFile.name}</span>
                  <button type="button" onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                </div>
              )}
              <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"><Paperclip className="h-4 w-4" /></button>
                <div className="flex-1 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#04432e]/10 focus-within:border-[#04432e] transition duration-150">
                  <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder={selectedFile ? "Caption optional..." : "Type your message..."} className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none" />
                </div>
                <button type="submit" disabled={isSending || (!messageText.trim() && !selectedFile)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#04432e] text-white hover:bg-[#033424] active:scale-95 transform transition shrink-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <span className="text-xs">Select a conversation to start messaging.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
