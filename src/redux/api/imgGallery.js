import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const imgGalleryApi = createApi({
  reducerPath: "imgGallery",
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
  tagTypes: ["ImgGallery"],
  endpoints: (builder) => ({
    getImgGallery: builder.query({
      query: (requested) => ({
        url: "/news/image-gallery",
        params: { requested: requested },
      }),
      providesTags: ["ImgGallery"],
    }),
    getImgGalleryByDepartment: builder.query({
      query: (id) => `/news/image-gallery/department/${id}`,
      providesTags: ["ImgGallery"],
    }),
    postImgGallery: builder.mutation({
      query: (imgGalleryData) => ({
        url: "/news/image-gallery",
        method: "POST",
        body: imgGalleryData,
      }),
      invalidatesTags: ["ImgGallery"],
    }),
    updateImgGallery: builder.mutation({
      query: ({ id, ...imgGalleryData }) => ({
        url: `/news/image-gallery/${id}`,
        method: "PATCH",
        body: imgGalleryData,
      }),
      invalidatesTags: ["ImgGallery"],
    }),
    deleteImgGallery: builder.mutation({
      query: ({ id, department }) => ({
        url: `/news/image-gallery/${id}`,
        method: "DELETE",
        params: {
          department: department,
        },
      }),
      invalidatesTags: ["ImgGallery"],
    }),
  }),
});

export const {
  useGetImgGalleryQuery,
  useGetImgGalleryByDepartmentQuery,
  usePostImgGalleryMutation,
  useUpdateImgGalleryMutation,
  useDeleteImgGalleryMutation,
} = imgGalleryApi;
