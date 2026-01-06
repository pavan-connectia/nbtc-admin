import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const csrApi = createApi({
  reducerPath: "csr",
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
  tagTypes: ["Csr"],
  endpoints: (builder) => ({
    getCsr: builder.query({
      query: () => "/news/csr",
      providesTags: ["Csr"],
    }),
    postCsr: builder.mutation({
      query: (csrData) => ({
        url: "/news/csr",
        method: "POST",
        body: csrData,
      }),
      invalidatesTags: ["Csr"],
    }),
    updateCsr: builder.mutation({
      query: ({ id, ...csrData }) => ({
        url: `/news/csr/${id}`,
        method: "PATCH",
        body: csrData,
      }),
      invalidatesTags: ["Csr"],
    }),
    deleteCsr: builder.mutation({
      query: (id) => ({
        url: `/news/csr/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Csr"],
    }),
  }),
});

export const {
  useGetCsrQuery,
  usePostCsrMutation,
  useUpdateCsrMutation,
  useDeleteCsrMutation,
} = csrApi;
