import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const awardsApi = createApi({
  reducerPath: "awards",
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
  tagTypes: ["Awards"],
  endpoints: (builder) => ({
    getAwards: builder.query({
      query: (requested) => ({
        url: "/awards",
        params: { requested: requested },
      }),
      providesTags: ["Awards"],
    }),
    getAwardsDepartment: builder.query({
      query: (id) => `/awards/department/${id}`,
      providesTags: ["Awards"],
    }),
    getAwardById: builder.query({
      query: (id) => `/awards/${id}`,
      providesTags: ["Awards"],
    }),
    postAwards: builder.mutation({
      query: (awardsData) => ({
        url: "/awards",
        method: "POST",
        body: awardsData,
      }),
      invalidatesTags: ["Awards"],
    }),
    updateAwards: builder.mutation({
      query: ({ id, ...awardsData }) => ({
        url: `/awards/${id}`,
        method: "PATCH",
        body: awardsData,
      }),
      invalidatesTags: ["Awards"],
    }),
    deleteAwards: builder.mutation({
      query: (id) => ({
        url: `/awards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Awards"],
    }),
  }),
});

export const {
  useGetAwardsQuery,
  useGetAwardsDepartmentQuery,
  useGetAwardByIdQuery,
  usePostAwardsMutation,
  useUpdateAwardsMutation,
  useDeleteAwardsMutation,
} = awardsApi;
