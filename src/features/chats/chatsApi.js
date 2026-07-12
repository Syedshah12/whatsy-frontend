import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


import { API_CONVERSATIONS } from "../../config/api";
const BASE_URL = API_CONVERSATIONS;


export const chatApi = createApi({

  reducerPath: "chatApi",

  baseQuery: fetchBaseQuery({

    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {

      const token = localStorage.getItem("token");

      if (token) {
        headers.set(
          "Authorization",
          `Bearer ${token}`
        );
      }

      return headers;
    },

  }),


  tagTypes: [
    "Conversations",
    "Messages"
  ],


  endpoints: (builder) => ({

getConversations: builder.query({
  query: ({ page, limit, search }) => ({
    url: "/",
    params: { page, limit, ...(search ? { search } : {}) },
  }),

  // Cache separately per search term (but still share cache across pages of the same search)
  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    return `${endpointName}-${queryArgs.search || ''}`;
  },

  merge: (currentCache, newItems) => {
    if (newItems?.pagination?.page === 1) {
      currentCache.data = newItems.data;
    } else {
      currentCache.data.push(...newItems.data);
    }
    currentCache.pagination = newItems.pagination;
  },

  // Refetch when page changes OR when search changes
  forceRefetch({ currentArg, previousArg }) {
    return (
      currentArg?.page !== previousArg?.page ||
      currentArg?.search !== previousArg?.search
    );
  },

  providesTags: ["Conversations"],
}),
// getConversations: builder.query({
//   query: ({ page, limit }) => ({
//     url: "/",
//     params: { page, limit },
//   }),

//   serializeQueryArgs: ({ endpointName }) => endpointName,

//   merge: (currentCache, newItems) => {
//     if (newItems?.pagination?.page === 1) {
//       currentCache.data = newItems.data;
//     } else {
//       currentCache.data.push(...newItems.data);
//     }
//     currentCache.pagination = newItems.pagination;
//   },

//   forceRefetch({ currentArg, previousArg }) {
//     return currentArg?.page !== previousArg?.page;
//   },

//   providesTags: ["Conversations"],
// }),










    // GET SINGLE CONVERSATION
    getConversationById: builder.query({
      query: (id) =>
        `/${id}`,

      providesTags: (result,error,id)=>[
        {
          type:"Conversations",
          id
        }
      ],

    }),




    // GET MESSAGES OF CONVERSATION
    getConversationMessages: builder.query({

      query: ({
        id,
        page = 1,
        limit = 30
      }) => ({
        url:`/${id}/messages`,
        params:{
          page,
          limit
        }
      }),

      providesTags:[
        "Messages"
      ],

    }),





    // UPDATE STATUS
    updateConversationStatus: builder.mutation({

      query: ({
        id,
        status
      }) => ({

        url:`/${id}/status`,

        method:"PATCH",

        body:{
          status
        }

      }),
      invalidatesTags:[
        "Conversations"
      ]

    }),




    // ASSIGN CONVERSATION
    assignConversation: builder.mutation({
      query: ({
        id,
        userId
      }) => ({
        url:`/${id}/assign`,

        method:"PATCH",

        body:{
          userId
        }
      }),
      invalidatesTags:[
        "Conversations"
      ]

    }),



  })

});





export const {
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useGetConversationMessagesQuery,
  useUpdateConversationStatusMutation,
  useAssignConversationMutation,
} = chatApi;