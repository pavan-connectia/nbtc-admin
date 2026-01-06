import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qhseApi = createApi({
  reducerPath: "qhse",
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
  tagTypes: ["Qhse"],
  endpoints: (builder) => ({
    getQhse: builder.query({
      query: () => "/qhse",
      providesTags: ["Qhse"],
    }),
    updateQhse: builder.mutation({
      query: ({ id, ...qhseData }) => ({
        url: `/qhse/${id}`,
        method: "PATCH",
        body: qhseData,
      }),
      invalidatesTags: ["Qhse"],
    }),
  }),
});

export const { useGetQhseQuery, useUpdateQhseMutation } = qhseApi;
