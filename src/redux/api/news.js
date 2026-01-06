import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsApi = createApi({
  reducerPath: "news",
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
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getNews: builder.query({
      query: (requested) => ({
        url: "/news/news",
        params: { requested: requested },
      }),
      providesTags: ["News"],
    }),
    getNewsById: builder.query({
      query: (id) => `/news/news/${id}`,
      providesTags: ["News"],
    }),
    getNewsByDepartment: builder.query({
      query: (id) => `/news/news/department/${id}`,
      providesTags: ["News"],
    }),
    postNews: builder.mutation({
      query: (newsData) => ({
        url: "/news/news",
        method: "POST",
        body: newsData,
      }),
      invalidatesTags: ["News"],
    }),
    updateNews: builder.mutation({
      query: ({ id, ...newsData }) => ({
        url: `/news/news/${id}`,
        method: "PATCH",
        body: newsData,
      }),
      invalidatesTags: ["News"],
    }),
    deleteNews: builder.mutation({
      query: ({ id, department }) => ({
        url: `/news/news/${id}`,
        method: "DELETE",
        params: {
          department: department,
        },
      }),
      invalidatesTags: ["News"],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useGetNewsByDepartmentQuery,
  usePostNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
