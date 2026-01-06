import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const videoGalleryApi = createApi({
  reducerPath: "videoGallery",
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
  tagTypes: ["VideoGallery"],
  endpoints: (builder) => ({
    getVideoGallery: builder.query({
      query: (requested) => ({
        url: "/news/video-gallery",
        params: { requested: requested },
      }),
      providesTags: ["VideoGallery"],
    }),
    getVideoGalleryByDepartment: builder.query({
      query: (id) => `/news/video-gallery/department/${id}`,
      providesTags: ["VideoGallery"],
    }),
    postVideoGallery: builder.mutation({
      query: (newsData) => ({
        url: "/news/video-gallery",
        method: "POST",
        body: newsData,
      }),
      invalidatesTags: ["VideoGallery"],
    }),
    updateVideoGallery: builder.mutation({
      query: ({ id, ...newsData }) => ({
        url: `/news/video-gallery/${id}`,
        method: "PATCH",
        body: newsData,
      }),
      invalidatesTags: ["VideoGallery"],
    }),
    deleteVideoGallery: builder.mutation({
      query: (id) => ({
        url: `/news/video-gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VideoGallery"],
    }),
  }),
});

export const {
  useGetVideoGalleryQuery,
  useGetVideoGalleryByDepartmentQuery,
  usePostVideoGalleryMutation,
  useUpdateVideoGalleryMutation,
  useDeleteVideoGalleryMutation,
} = videoGalleryApi;
