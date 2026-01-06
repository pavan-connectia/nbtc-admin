import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const affiliatesApi = createApi({
  reducerPath: "affiliates",
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
  tagTypes: ["Affiliates"],
  endpoints: (builder) => ({
    getAffiliates: builder.query({
      query: () => "/afflicates",
      providesTags: ["Affiliates"],
    }),
    getAffiliateById: builder.query({
      query: (id) => `/afflicates/${id}`,
      providesTags: ["Affiliates"],
    }),
    postAffiliates: builder.mutation({
      query: (affiliatesData) => ({
        url: "/afflicates",
        method: "POST",
        body: affiliatesData,
      }),
      invalidatesTags: ["Affiliates"],
    }),
    updateAffiliates: builder.mutation({
      query: ({ id, ...affiliatesData }) => ({
        url: `/afflicates/${id}`,
        method: "PATCH",
        body: affiliatesData,
      }),
      invalidatesTags: ["Affiliates"],
    }),
    deleteAffiliates: builder.mutation({
      query: (id) => ({
        url: `/afflicates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Affiliates"],
    }),
  }),
});

export const {
  useGetAffiliatesQuery,
  useGetAffiliateByIdQuery,
  usePostAffiliatesMutation,
  useUpdateAffiliatesMutation,
  useDeleteAffiliatesMutation,
} = affiliatesApi;
