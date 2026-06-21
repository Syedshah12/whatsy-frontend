import React, { useState, useEffect,useRef } from 'react';

import { 
  Home, 
  CircleDot, 
  Video, 
  User, 
  Settings, 
  Search, 
  MoreVertical, 
  Smile, 
  Mic, 
  Send, 
  Plus, 
  ArrowLeft,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Import statements for your RTK Query hooks. Adjust paths to fit your API slice configuration.
import { useGetConversationsQuery, useGetConversationMessagesQuery } from '../../features/chats/chatsApi';
import { useSendMessageMutation  } from '../../features/messages/messagesApi';
import MessageStatus from '../../components/MessageStatus';
import {useDispatch} from "react-redux";
import { chatApi } from '../../features/chats/chatsApi';



const ChatPage = () => {
  // Navigation & Responsiveness State
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  // inside component:
const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  // 1. RTK Query API Call: Fetch all 1-to-1 conversations
  // Un-comment lines below once you compile the API slice in your environment
 const { 
  data: conversationsResponse,
  isLoading: isConversationsLoading,
  isError: isConversationsError

} = useGetConversationsQuery({
    page:1,
    limit:20
})// useGetConversationsQuery();



  const conversations = conversationsResponse?.data || [];

  // 2. Automatically select the first conversation when data loads
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  // 3. RTK Query API Call: Fetch precise text logs for the selected active conversation
  const { 
    data: messagesResponse, 
    isLoading: isMessagesLoading,
    isError: isMessagesError
  } = useGetConversationMessagesQuery({ id: selectedConversationId }, { skip: !selectedConversationId }); // useGetConversationMessagesQuery({ id: selectedConversationId }, { skip: !selectedConversationId });

  const messages = messagesResponse?.data || [];

  // Get active item properties safely for header rendering context
  const activeConversation = conversations.find(c => c._id === selectedConversationId);

//   const handleSelectChat = (id) => {
//     setSelectedConversationId(id);
//     setIsMobileChatOpen(true);
//   };


useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

const handleSelectChat = (id) => {
  setSelectedConversationId(id);
  setIsMobileChatOpen(true);

  // ✅ Clear unread count locally when opening chat
  dispatch(
    chatApi.util.updateQueryData(
      "getConversations",
      { page: 1, limit: 20 },
      (draft) => {
        const conversation = draft.data.find(c => c._id === id);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      }
    )
  );
};
//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!messageText.trim()) return;
    
//     // Placeholder configuration for your upcoming message mutation block
//     console.log(`Sending message: "${messageText}" to Conversation ID: ${selectedConversationId}`);
//     setMessageText('');
//   };

  // Helper logic to format localized timestamps safely
  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!messageText.trim() || !activeConversation) return;

  const phone = activeConversation.contactId?.phone;
  if (!phone) return toast.error('No phone number linked to this conversation.');

  const text = messageText;
  setMessageText(''); // clear input immediately

  try {
    await sendMessage({ phone, message: text }).unwrap();
    // socket will handle updating the conversation list + messages automatically
  } catch (err) {
    toast.error('Failed to send message.');
    setMessageText(text); // restore text if failed
  }
};
  
  
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDateLabel = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  // Error feedback notifications handled cleanly via Sonner
  useEffect(() => {
    if (isConversationsError) toast.error('Failed to load conversations.');
    if (isMessagesError) toast.error('Failed to sync live chat messages.');
  }, [isConversationsError, isMessagesError]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] font-sans antialiased text-slate-700">
      


      {/* 2. CONVERSATIONS SIDEBAR INDEX PANEL */}
      <div className={`h-full w-full flex-col border-r border-slate-200/80 bg-white md:flex md:w-[340px] xl:w-[380px] shrink-0 ${isMobileChatOpen ? 'hidden' : 'flex'}`}>
        
        {/* Header Content Counter Layout */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tight text-slate-800">Chats</h1>
            {conversations.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#04432e] text-[10px] font-medium text-white">
                {conversations.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
              <Search className="h-4 w-4" />
            </button>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Clean Static Context Category Filter Tab */}
        <div className="px-4 py-2">
          <span className="rounded-full bg-[#04432e] text-white px-4 py-1 text-[11px] font-medium shadow-sm">
            Conversations
          </span>
        </div>

        {/* Dynamic Chat Stack Render Feed */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 custom-scrollbar">
          {isConversationsLoading ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin text-[#04432e]" />
              <span className="text-xs">Fetching conversation data...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No active interactions tracked.
            </div>
          ) : (
            conversations.map((chat) => {
              // Graceful fallback structure handling instances where contactId returns null
              const contactName = chat.contactId?.name || chat.contactId?.name || chat.contactId?.phone || "Anonymous Workspace Session";
              const isSelected = selectedConversationId === chat._id;

              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat._id)}
                  className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer transition duration-150 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 border-l-[3px] border-[#04432e]' 
                      : 'hover:bg-slate-50 border-l-[3px] border-transparent'
                  }`}
                >
                  {/* Dynamic Graphic Initials Circle Avatar */}
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200/60 border border-slate-200/80 text-slate-600 font-medium text-xs shadow-inner">
                    {contactName.substring(0, 2).toUpperCase()}
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="truncate text-xs font-semibold text-slate-800">{contactName}</h4>
                      <span className={`text-[10px] shrink-0 ${chat.unreadCount > 0 ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                        {formatDateLabel(chat.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="truncate text-[11px] text-slate-500 flex items-center gap-1">
                    {chat.lastMessageDirection === "outbound" && (

<MessageStatus 
   status={chat.lastMessageStatus}
/>

)}
                        <span>{chat.lastMessageBody || 'Empty conversation'}</span>
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Context Trigger Action Control */}
        <div className="p-3 flex justify-end">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400 text-white shadow-md hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE ACTIVE CONVERSATION PANE AREA */}
      <div className={`h-full flex-1 flex-col bg-[#f8f9fa] relative ${isMobileChatOpen ? 'flex' : 'hidden md:flex'}`}>
        
        {activeConversation ? (
          <>
            {/* Thread Active Header Navigation View */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-4 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMobileChatOpen(false)}
                  className="p-1 rounded-full text-slate-500 hover:bg-slate-100 md:hidden transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#04432e] text-white font-medium text-xs shadow-sm">
                  {(activeConversation.contactId?.profileName || activeConversation.contactId?.phone || "A").substring(0,2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-800 leading-tight">
                    {activeConversation.contactId?.profileName || activeConversation.contactId?.name || activeConversation.contactId?.phone || "Anonymous User Session"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {activeConversation.contactId?.phone ? `+${activeConversation.contactId.phone}` : 'No phone linked'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                  <Search className="h-4 w-4" />
                </button>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Live Synchronized Messages Stream Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {isMessagesLoading ? (
                <div className="flex h-full items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#04432e]" />
                  <span className="text-xs">Streaming logs...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400 italic">
                  No text exchanges found inside this session. Start the conversation below.
                </div>
              ) : (
                messages.map((message) => {
                  const isInbound = message.direction === 'inbound';
                  
                  return (
                    <div 
                      key={message._id}
                      className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'} gap-1`}
                    >
                      <div className={`max-w-[75%] px-4 py-2 text-[11px] shadow-sm ${
                        isInbound 
                          ? 'rounded-r-xl rounded-bl-xl bg-[#04432E] text-white' 
                          : 'rounded-l-xl rounded-br-xl bg-slate-200/80 text-slate-700'
                      }`}>
                        {message.body}
                      </div>
                       {/* <div className="flex items-center gap-1 text-[9px] text-slate-400 px-1">
                        <span>{formatTime(message.sentAt || message.createdAt)}</span>
                        {!isInbound && (
                          <CheckCheck className={`h-3 w-3 ${message.status === 'read' ? 'text-sky-400' : 'text-slate-300'}`} />
                        )}
                      </div> */}
                     <div className="flex items-center gap-1 text-[9px] text-slate-400 px-1">

  <span>
    {formatTime(message.sentAt || message.createdAt)}
  </span>


  {!isInbound && (
    <MessageStatus 
      status={message.status}
    />
  )}

</div>
                    </div>
                  );
                })
              )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Dynamic Action Console Form */}
            <div className="bg-white p-3 border-t border-slate-200/80 z-10">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 max-w-4xl mx-auto"
              >
                <div className="flex-1 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#04432e]/10 focus-within:border-[#04432e] transition duration-150">
                  <button type="button" className="text-slate-400 hover:text-slate-600 focus:outline-none">
                    <Smile className="h-5 w-5" />
                  </button>
                  
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message.."
                    className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  
                  <button type="button" className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>

              <button 
  type="submit"
  disabled={isSending || !messageText.trim()}
  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#04432e] text-white hover:bg-[#033424] active:scale-95 transform transition shrink-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
</button>
              </form>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <svg className="h-12 w-12 text-slate-300 mb-2 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs">Select a conversation thread to initiate message streaming logs.</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatPage;