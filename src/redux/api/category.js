import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "category",
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
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: () => "/category",
      providesTags: ["Category"],
    }),
    postCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/category",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: ({ id, department }) => ({
        url: `/category/${id}`,
        method: "DELETE",
        params: {
          department: department,
        },
      }),
      invalidatesTags: ["Category"],
    }),
    getCategoryByDepartmentId: builder.query({
      query: (id) => `/category/department/${id}`,
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoryQuery,
  usePostCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByDepartmentIdQuery,
} = categoryApi;
