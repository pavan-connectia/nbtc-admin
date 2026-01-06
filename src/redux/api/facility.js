import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const facilityApi = createApi({
  reducerPath: "facility",
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
  tagTypes: ["Facility"],
  endpoints: (builder) => ({
    getFacility: builder.query({
      query: () => "/facility",
      providesTags: ["Facility"],
    }),
    getFacilityByDepartmentId: builder.query({
      query: (id) => `/facility/department/${id}`,
      providesTags: ["Facility"],
    }),
    postFacility: builder.mutation({
      query: (facilityData) => ({
        url: "/facility",
        method: "POST",
        body: facilityData,
      }),
      invalidatesTags: ["Facility"],
    }),
    updateFacility: builder.mutation({
      query: ({ id, ...facilityData }) => ({
        url: `/facility/${id}`,
        method: "PATCH",
        body: facilityData,
      }),
      invalidatesTags: ["Facility"],
    }),
    deleteFacility: builder.mutation({
      query: ({ id }) => ({
        url: `/facility/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Facility"],
    }),
  }),
});

export const {
  useGetFacilityQuery,
  usePostFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useGetFacilityByDepartmentIdQuery,
} = facilityApi;
