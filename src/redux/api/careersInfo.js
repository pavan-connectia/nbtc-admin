import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const careersInfoApi = createApi({
  reducerPath: "careersInfo",
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
  tagTypes: ["CareersInfo"],
  endpoints: (builder) => ({
    getCareersInfo: builder.query({
      query: () => "/careers/careers-info",
      providesTags: ["CareersInfo"],
    }),
    postCareersInfo: builder.mutation({
      query: (careersInfoData) => ({
        url: "/careers/careers-info",
        method: "POST",
        body: careersInfoData,
      }),
      invalidatesTags: ["CareersInfo"],
    }),
    updateCareersInfo: builder.mutation({
      query: ({ id, ...careersInfoData }) => ({
        url: `/careers/careers-info/${id}`,
        method: "PATCH",
        body: careersInfoData,
      }),
      invalidatesTags: ["CareersInfo"],
    }),
  }),
});

export const {
  useGetCareersInfoQuery,
  usePostCareersInfoMutation,
  useUpdateCareersInfoMutation,
} = careersInfoApi;
