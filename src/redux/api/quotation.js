import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quotationApi = createApi({
  reducerPath: "quotation",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Quotation"],
  endpoints: (builder) => ({
    getQuotation: builder.query({
      query: () => "/quotation",
      providesTags: ["Quotation"],
    }),
    getQuotationByDepartmentId: builder.query({
      query: (id) => `/quotation/department/${id}`,
      providesTags: ["Quotation"],
    }),
    postQuotation: builder.mutation({
      query: (quotationData) => ({
        url: "/quotation",
        method: "POST",
        body: quotationData,
      }),
      invalidatesTags: ["Quotation"],
    }),
    updateQuotation: builder.mutation({
      query: ({ id, department, ...quotationData }) => ({
        url: `/quotation/${id}`,
        method: "PATCH",
        body: quotationData,
        params: {
          department: department,
        },
      }),
      invalidatesTags: ["Quotation"],
    }),
    deleteQuotation: builder.mutation({
      query: ({ id, department }) => ({
        url: `/quotation/${id}`,
        method: "DELETE",
        f,
      }),

      invalidatesTags: ["Quotation"],
    }),
  }),
});

export const {
  useGetQuotationQuery,
  usePostQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
  useGetQuotationByDepartmentIdQuery,
} = quotationApi;
