import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicationApi = createApi({
  reducerPath: "publication",
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
  tagTypes: ["Publication"],
  endpoints: (builder) => ({
    getPublication: builder.query({
  query: (requested) => ({
    url: "/news/publication",
    params: { requested },
  }),
  providesTags: ["Publication"],
}),
    getPublicationByDepartment: builder.query({
      query: (id) => `/news/publication/department/${id}`,
      providesTags: ["Publication"],
    }),
    postPublication: builder.mutation({
      query: (newsData) => ({
        url: "/news/publication",
        method: "POST",
        body: newsData,
      }),
      invalidatesTags: ["Publication"],
    }),
    updatePublication: builder.mutation({
      query: ({ id, ...newsData }) => ({
        url: `/news/publication/${id}`,
        method: "PATCH",
        body: newsData,
      }),
      invalidatesTags: ["Publication"],
    }),
    deletePublication: builder.mutation({
      query: (id) => ({
        url: `/news/publication/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Publication"],
    }),
  }),
});

export const {
  useGetPublicationQuery,
  useGetPublicationByDepartmentQuery,
  usePostPublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
} = publicationApi;
