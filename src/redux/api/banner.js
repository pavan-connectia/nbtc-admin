import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Banner"],
  endpoints: (builder) => ({
    getBannerImages: builder.query({
      query: () => "/banner",
      providesTags: ["Banner"],
    }),

    updateBannerImages: builder.mutation({
      query: (payload) => ({
        url: "/banner",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetBannerImagesQuery,
  useUpdateBannerImagesMutation,
} = bannerApi;