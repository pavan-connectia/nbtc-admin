import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const regionApi = createApi({
  reducerPath: "region",
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
  tagTypes: ["Region"],
  endpoints: (builder) => ({
    getRegion: builder.query({
      query: (requested) => ({
        url: "/region/region-info",
        params: { requested: requested },
      }),
      providesTags: ["Region"],
    }),
    getRegionRegion: builder.query({
      query: (id) => `/region/region-info/region/${id}`,
      providesTags: ["Region"],
    }),
    getAwardById: builder.query({
      query: (id) => `/region/region-info/${id}`,
      providesTags: ["Region"],
    }),
    postRegion: builder.mutation({
      query: (awardsData) => ({
        url: "/region/region-info",
        method: "POST",
        body: awardsData,
      }),
      invalidatesTags: ["Region"],
    }),
    updateRegion: builder.mutation({
      query: ({ id, ...awardsData }) => ({
        url: `/region/region-info/${id}`,
        method: "PATCH",
        body: awardsData,
      }),
      invalidatesTags: ["Region"],
    }),
    deleteRegion: builder.mutation({
      query: (id) => ({
        url: `/region/region-info/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Region"],
    }),
  }),
});

export const {
  useGetRegionQuery,
  useGetRegionRegionQuery,
  useGetAwardByIdQuery,
  usePostRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
} = regionApi;
