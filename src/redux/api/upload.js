import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const uploadApi = createApi({
  reducerPath: "upload",
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
  tagTypes: ["Upload"],
  endpoints: (builder) => ({
    // redux/api/upload.js

postUpload: builder.mutation({
  // Destructure the object sent by the component
  query: ({ image, folder, title }) => ({
    url: `/upload`,
    method: "POST",
    // These are now strings extracted from the object
    params: {
      folder: folder,
      title: title
    },
    // This is the actual FormData object contained in the 'image' key
    body: image, 
  }),
  invalidatesTags: ["Upload"],
}),

    postUploadFile: builder.mutation({
      query: ({ image, folder }) => ({
        url: `/upload-file`,
        method: "POST",
        params: { folder },
        body: image,
      }),
    }),
  }),
});

export const { usePostUploadMutation, usePostUploadFileMutation } = uploadApi;
