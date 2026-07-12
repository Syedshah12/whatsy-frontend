import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CAMPAIGN } from "../../config/api";

export const campaignAnalyticsApi = createApi({
  reducerPath: "campaignAnalyticsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_CAMPAIGN,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["CampaignAnalytics"],

  endpoints: (builder) => ({
    // GET /campaigns/dashboard
    getCampaignDashboard: builder.query({
      query: () => "/dashboard",

      providesTags: ["CampaignAnalytics"],
    }),

    // GET /campaigns/analytics/daily
    getDailyAnalytics: builder.query({
      query: () => "/analytics/daily",

      providesTags: ["CampaignAnalytics"],
    }),

 getAllCampaigns: builder.query({
      query: () => "/all-campaigns",

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((campaign) => ({
                type: "CampaignAnalytics",
                id: campaign._id,
              })),
              { type: "CampaignAnalytics", id: "LIST" },
            ]
          : [{ type: "CampaignAnalytics", id: "LIST" }],
    }),


    // GET /campaigns/:campaignId/stats
    getCampaignStats: builder.query({
      query: (campaignId) => `/${campaignId}/stats`,

      providesTags: (result, error, campaignId) => [
        { type: "CampaignAnalytics", id: campaignId },
      ],
    }),
  }),
});

export const {
  useGetCampaignDashboardQuery,
  useGetDailyAnalyticsQuery,
  useGetCampaignStatsQuery,
   useGetAllCampaignsQuery, // NEW
} = campaignAnalyticsApi;