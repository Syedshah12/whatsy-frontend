import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const BASE_URL = "https://whatsy-backend-production.up.railway.app/api/conversations";
// const BASE_URL = "http://localhost:3000/api/conversations";
// later:
// https://your-backend.up.railway.app/api/conversations


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


    // GET ALL CONVERSATIONS
    getConversations: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),

      providesTags: [
        "Conversations"
      ],

    }),



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