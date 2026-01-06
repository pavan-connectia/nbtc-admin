import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const regionAwardsApi = createApi({
  reducerPath: "regionAwards",
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
  tagTypes: ["RegionAwards"],
  endpoints: (builder) => ({
    getRegionAwards: builder.query({
      query: (requested) => ({
        url: "/region/region-awards",
        params: { requested: requested },
      }),
      providesTags: ["RegionAwards"],
    }),
    getRegionAwardsRegion: builder.query({
      query: (id) => `/region/region-awards/region/${id}`,
      providesTags: ["RegionAwards"],
    }),
    getAwardById: builder.query({
      query: (id) => `/region/region-awards/${id}`,
      providesTags: ["RegionAwards"],
    }),
    postRegionAwards: builder.mutation({
      query: (awardsData) => ({
        url: "/region/region-awards",
        method: "POST",
        body: awardsData,
      }),
      invalidatesTags: ["RegionAwards"],
    }),
    updateRegionAwards: builder.mutation({
      query: ({ id, ...awardsData }) => ({
        url: `/region/region-awards/${id}`,
        method: "PATCH",
        body: awardsData,
      }),
      invalidatesTags: ["RegionAwards"],
    }),
    deleteRegionAwards: builder.mutation({
      query: (id) => ({
        url: `/region/region-awards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RegionAwards"],
    }),
  }),
});

export const {
  useGetRegionAwardsQuery,
  useGetRegionAwardsRegionQuery,
  useGetAwardByIdQuery,
  usePostRegionAwardsMutation,
  useUpdateRegionAwardsMutation,
  useDeleteRegionAwardsMutation,
} = regionAwardsApi;
