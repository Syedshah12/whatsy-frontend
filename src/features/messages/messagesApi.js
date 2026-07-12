import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_MESSAGES } from "../../config/api";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_MESSAGES,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Messages", "Conversations", "Templates", "Usage"],
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ phone, message, previewUrl = false }) => ({
        url: "/send",
        method: "POST",
        body: { phone, message, previewUrl },
      }),
      invalidatesTags: ["Messages", "Conversations", "Usage"],
    }),

    sendMedia: builder.mutation({
      query: ({ phone, type, file, mediaId, link, caption, filename }) => {
        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("type", type);
        if (file) formData.append("media", file);
        if (mediaId) formData.append("mediaId", mediaId);
        if (link) formData.append("link", link);
        if (caption) formData.append("caption", caption);
        if (filename) formData.append("filename", filename);
        return { url: "/send-media", method: "POST", body: formData };
      },
      invalidatesTags: ["Messages", "Conversations", "Usage"],
    }),

    uploadMedia: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("media", file);
        return { url: "/media/upload", method: "POST", body: formData };
      },
    }),

    sendBulkTemplate: builder.mutation({
      query: ({ file, templateName, langCode, variableColumns, headerType, headerMediaId, headerMediaLink, headerDocumentFilename }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("templateName", templateName);
        formData.append("langCode", langCode || "en_US");
        if (variableColumns?.length) formData.append("variableColumns", JSON.stringify(variableColumns));
        if (headerType) formData.append("headerType", headerType);
        if (headerMediaId) formData.append("headerMediaId", headerMediaId);
        if (headerMediaLink) formData.append("headerMediaLink", headerMediaLink);
        if (headerDocumentFilename) formData.append("headerDocumentFilename", headerDocumentFilename);
        return { url: "/bulk-template", method: "POST", body: formData };
      },
      invalidatesTags: ["Usage"],
    }),

    getTemplates: builder.query({
      query: () => ({ url: "/get-templates", method: "GET" }),
      providesTags: ["Templates"],
    }),

    getTodayUsage: builder.query({
      query: () => ({ url: "/usage/today", method: "GET" }),
      providesTags: ["Usage"],
    }),

    cancelBulkCampaign: builder.mutation({
      query: (campaignId) => ({ url: `/bulk-campaigns/${campaignId}/cancel`, method: "POST" }),
    }),

    sendTemplate: builder.mutation({
      query: ({ phone, templateName, langCode = "en_US", components = [], previewBody }) => ({
        url: "/send-template",
        method: "POST",
        body: { phone, templateName, langCode, components, previewBody },
      }),
      invalidatesTags: ["Messages", "Conversations", "Usage"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useSendMediaMutation,
  useUploadMediaMutation,
  useCancelBulkCampaignMutation,
  useSendTemplateMutation,
  useSendBulkTemplateMutation,
  useGetTemplatesQuery,
  useGetTodayUsageQuery,
} = messageApi;
