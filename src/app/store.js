import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"; // ← add this
import { authApi } from "../features/auth/authApi";
import { chatApi } from "../features/chats/chatsApi";
import { messageApi } from "../features/messages/messagesApi";
import { campaignAnalyticsApi } from "../features/campaign/campaignAnalyticsApi";
import { billingApi } from "../features/billing/billingApi";

export const store = configureStore({
  reducer: {
      auth: authReducer,  
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [campaignAnalyticsApi.reducerPath]: campaignAnalyticsApi.reducer,
    [billingApi.reducerPath]: billingApi.reducer,

    [messageApi.reducerPath]: messageApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      chatApi.middleware,
      billingApi.middleware,
      campaignAnalyticsApi.middleware,
      messageApi.middleware,
    ),
});