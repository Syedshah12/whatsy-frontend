import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const billingApi = createApi({
  reducerPath: "billingApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `https://whatsy-backend-production.up.railway.app/api`,
    // baseUrl: `http://localhost:3000/api`,
    credentials: "include",
  }),

  tagTypes: ["Billing"],

  endpoints: (builder) => ({

    // GET ALL BILLING
    getBillings: builder.query({
      query: ({ page = 1, limit = 20 }) =>
        `/billing?page=${page}&limit=${limit}`,

      providesTags: ["Billing"],
    }),

  // BILLING RECEIPT BY DATE RANGE
    getBillingReceipt: builder.mutation({
      query: ({ from, to }) => ({
        url: "/billing/receipt",
        method: "POST",
        body: {
          from,
          to,
        },
      }),
    }),
    // BILLING SUMMARY
    getBillingSummary: builder.query({
      query: () =>
        `/billing/summary`,

      providesTags: ["Billing"],
    }),


    // CAMPAIGN BILLING
    getCampaignBilling: builder.query({
      query: (campaignId) =>
        `/billing/campaign/${campaignId}`,

      providesTags: ["Billing"],
    }),


  }),
});


export const {
  useGetBillingsQuery,
  useGetBillingSummaryQuery,
  useGetCampaignBillingQuery,
   useGetBillingReceiptMutation,

} = billingApi;