import { socket } from "../../socket";
import { chatApi } from "./chatsApi";

const upsertConversation = (draft, { conversationId, message, contact }) => {
  if (!draft?.data) return;
  const index = draft.data.findIndex((c) => c._id === conversationId);
  const previewBody = message.body || message.media?.caption || `[${message.type}]`;

  if (index !== -1) {
    const conversation = draft.data[index];
    conversation.lastMessageBody = previewBody;
    conversation.lastMessageDirection = message.direction;
    conversation.lastMessageStatus = message.status;
    conversation.lastMessageAt = message.createdAt || message.sentAt || new Date().toISOString();
    if (message.direction === "inbound") conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    draft.data.splice(index, 1);
    draft.data.unshift(conversation);
  } else {
    draft.data.unshift({
      _id: conversationId,
      contactId: contact,
      lastMessageBody: previewBody,
      lastMessageDirection: message.direction,
      lastMessageStatus: message.status,
      lastMessageAt: message.createdAt || message.sentAt || new Date().toISOString(),
      unreadCount: message.direction === "inbound" ? 1 : 0,
    });
  }
};

export const initChatSocket = (dispatch) => {
  socket.off("new_message");
  socket.off("message_status_update");

  socket.on("new_message", (data) => {
    const { conversationId, message, contact } = data;

    dispatch(
      chatApi.util.updateQueryData("getConversations", { page: 1, limit: 20, search: "" }, (draft) => {
        upsertConversation(draft, { conversationId, message, contact });
      }),
    );

    dispatch(
      chatApi.util.updateQueryData("getConversationMessages", { id: conversationId }, (draft) => {
        if (!draft?.data) return;
        const alreadyExists = draft.data.some((m) => m._id === message._id);
        if (!alreadyExists) draft.data.push(message);
      }),
    );

    dispatch(chatApi.util.invalidateTags(["Conversations", "Messages"]));
  });

  socket.on("message_status_update", ({ messageId, conversationId, status }) => {
    dispatch(
      chatApi.util.updateQueryData("getConversationMessages", { id: conversationId }, (draft) => {
        const message = draft?.data?.find((m) => m._id === messageId);
        if (message) message.status = status;
      }),
    );
    dispatch(chatApi.util.invalidateTags(["Conversations"]));
  });
};
