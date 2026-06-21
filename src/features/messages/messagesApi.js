import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://whatsy-backend-production.up.railway.app/api/messages";
// const BASE_URL = "http://localhost:3000/api/messages";

export const messageApi = createApi({
  reducerPath: "messageApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Messages", "Conversations"],

  endpoints: (builder) => ({
    // SEND TEXT MESSAGE
    sendMessage: builder.mutation({
      query: ({ phone, message }) => ({
        url: "/send",

        method: "POST",

        body: {
          phone,
          message,
        },
      }),

      invalidatesTags: ["Messages", "Conversations"],
    }),

  sendBulkTemplate: builder.mutation({
      query: ({ file, templateName, langCode }) => {

        const formData = new FormData();

        formData.append("file", file);
        formData.append("templateName", templateName);
        formData.append("langCode", langCode);


        return {
          url: "/bulk-template",
          method: "POST",
          body: formData,
        };
      },
    }),

// Get all templates
    getTemplates: builder.query({
  query: () => ({
    url: "/get-templates",
    method: "GET",
  }),

  providesTags: ["Templates"],
}),
    // SEND TEMPLATE MESSAGE
    sendTemplate: builder.mutation({
      query: ({
        phone,
        templateName,
        langCode = "en_US",
        components = [],
        previewBody,
      }) => ({
        url: "/send-template",

        method: "POST",

        body: {
          phone,
          templateName,
          langCode,
          components,
          previewBody,
        },
      }),

      invalidatesTags: ["Messages", "Conversations"],
    }),
  }),
});

export const { useSendMessageMutation, useSendTemplateMutation,  useSendBulkTemplateMutation,  useGetTemplatesQuery,
 } = messageApi;
