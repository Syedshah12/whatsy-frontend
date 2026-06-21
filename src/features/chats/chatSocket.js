

import { socket } from "../../socket";
import { chatApi } from "./chatsApi";

export const initChatSocket = (dispatch) => {
 
socket.on("new_message", (data) => {
  const { conversationId, message,contact  } = data;

  // Update conversation list
  dispatch(
    chatApi.util.updateQueryData(
      "getConversations",
      { page: 1, limit: 20 },
      (draft) => {
        const index = draft.data.findIndex(c => c._id === conversationId);
        if (index !== -1) {
          const conversation = draft.data[index];
          conversation.lastMessageBody = message.body;
          conversation.lastMessageDirection = message.direction;
          conversation.lastMessageStatus = message.status;
          conversation.lastMessageAt = message.createdAt;

          if (message.direction === 'inbound') {
            conversation.unreadCount = (conversation.unreadCount || 0) + 1;
          }

          draft.data.splice(index, 1);
          draft.data.unshift(conversation);
        }else {
          // ✅ Brand new conversation — push it to the top
          draft.data.unshift({
            _id: conversationId,
            contactId: contact,
            lastMessageBody: message.body,
            lastMessageDirection: message.direction,
            lastMessageStatus: message.status,
            lastMessageAt: message.createdAt,
            unreadCount: 1,
          });
        }
      }
    )
  );

  // ✅ Key matches exactly { id: selectedConversationId } used in ChatPage
  dispatch(
    chatApi.util.updateQueryData(
      "getConversationMessages",
      { id: conversationId }, // ← must match exactly
      (draft) => {
        const alreadyExists = draft.data.some(m => m._id === message._id);
        if (!alreadyExists) {
          draft.data.push(message);
        }
      }
    )
  );
});
  // MESSAGE STATUS UPDATE
  socket.on("message_status_update", (data) => {
    console.log("Status updated", data);

    const { messageId, conversationId, status } = data;

    // update conversation list tick
    dispatch(
      chatApi.util.updateQueryData(
        "getConversations",
        {
          page: 1,
          limit: 20,
        },

        (draft) => {
          const conversation = draft.data.find((c) => c._id === conversationId);

          if (conversation) {
            conversation.lastMessageStatus = status;
          }
        },
      ),
    );

    // update chat messages
   dispatch(
  chatApi.util.updateQueryData(
    "getConversationMessages",
    { id: conversationId }, // ← fixed
    (draft) => {
      const message = draft.data.find((m) => m._id === messageId);
      if (message) {
        message.status = status;
      }
    }
  )
);
  });
};
