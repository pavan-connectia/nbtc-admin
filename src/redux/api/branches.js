import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const branchesApi = createApi({
  reducerPath: "branches",
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
  tagTypes: ["Branches"],
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: () => "/branches",
      providesTags: ["Branches"],
    }),
    getBranchByName: builder.query({
      query: (id) => `/branches/${id}`,
      providesTags: ["Branches"],
    }),
    postBranches: builder.mutation({
      query: (branchesData) => ({
        url: "/branches",
        method: "POST",
        body: branchesData,
      }),
      invalidatesTags: ["Branches"],
    }),
    updateBranches: builder.mutation({
      query: ({ id, ...branchesData }) => ({
        url: `/branches/${id}`,
        method: "PATCH",
        body: branchesData,
      }),
      invalidatesTags: ["Branches"],
    }),
    deleteBranches: builder.mutation({
      query: ({ id }) => ({
        url: `/branches/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Branches"],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchByNameQuery,
  usePostBranchesMutation,
  useUpdateBranchesMutation,
  useDeleteBranchesMutation,
} = branchesApi;
