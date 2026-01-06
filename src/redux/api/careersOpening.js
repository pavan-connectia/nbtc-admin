import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const careersOpeningApi = createApi({
  reducerPath: "careersOpening",
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
  tagTypes: ["CareersOpening"],
  endpoints: (builder) => ({
    getCareersOpening: builder.query({
      query: () => "/careers/careers-opening",
      providesTags: ["CareersOpening"],
    }),
    getCareersOpeningById: builder.query({
      query: (id) => `/careers/careers-opening/${id}`,
      providesTags: ["CareersOpening"],
    }),
    getCareersOpeningByDepartment: builder.query({
      query: (id) => `/careers/careers-opening/department/${id}`,
      providesTags: ["CareersOpening"],
    }),
    postCareersOpening: builder.mutation({
      query: (careersOpeningData) => ({
        url: "/careers/careers-opening",
        method: "POST",
        body: careersOpeningData,
      }),
      invalidatesTags: ["CareersOpening"],
    }),
    updateCareersOpening: builder.mutation({
      query: ({ id, ...careersOpeningData }) => ({
        url: `/careers/careers-opening/${id}`,
        method: "PATCH",
        body: careersOpeningData,
      }),
      invalidatesTags: ["CareersOpening"],
    }),
    deleteCareersOpening: builder.mutation({
      query: (id) => ({
        url: `/careers/careers-opening/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CareersOpening"],
    }),
  }),
});

export const {
  useGetCareersOpeningQuery,
  useGetCareersOpeningByIdQuery,
  useGetCareersOpeningByDepartmentQuery,
  usePostCareersOpeningMutation,
  useUpdateCareersOpeningMutation,
  useDeleteCareersOpeningMutation,
} = careersOpeningApi;
