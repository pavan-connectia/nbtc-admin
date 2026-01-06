import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const regionProjectsApi = createApi({
  reducerPath: "regionRegionProjects",
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
  tagTypes: ["RegionProjects"],
  endpoints: (builder) => ({
    getRegionProjects: builder.query({
      query: () => "/region/region-projects",
      providesTags: ["RegionProjects"],
    }),
    getRegionProjectsByRegion: builder.query({
      query: (id) => `/region/region-projects/region/${id}`,
      providesTags: ["RegionProjects"],
    }),
    postRegionProjects: builder.mutation({
      query: (projectsData) => ({
        url: "/region/region-projects",
        method: "POST",
        body: projectsData,
      }),
      invalidatesTags: ["RegionProjects"],
    }),
    updateRegionProjects: builder.mutation({
      query: ({ id, ...projectsData }) => ({
        url: `/region/region-projects/${id}`,
        method: "PATCH",
        body: projectsData,
      }),
      invalidatesTags: ["RegionProjects"],
    }),
    deleteRegionProjects: builder.mutation({
      query: ({ id }) => ({
        url: `/region/region-projects/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["RegionProjects"],
    }),
  }),
});

export const {
  useGetRegionProjectsQuery,
  usePostRegionProjectsMutation,
  useUpdateRegionProjectsMutation,
  useDeleteRegionProjectsMutation,
  useGetRegionProjectsByDepartmentIdQuery,
} = regionProjectsApi;
