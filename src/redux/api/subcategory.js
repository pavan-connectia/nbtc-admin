import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subcategoryApi = createApi({
  reducerPath: "subcategory",
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
  tagTypes: ["SubCategory"],
  endpoints: (builder) => ({
    getSubCategory: builder.query({
      query: () => "/sub-category",
      providesTags: ["SubCategory"],
    }),
    postSubCategory: builder.mutation({
      query: (subcategoryData) => ({
        url: "/sub-category",
        method: "POST",
        body: subcategoryData,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, ...subcategoryData }) => ({
        url: `/sub-category/${id}`,
        method: "PATCH",
        body: subcategoryData,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    deleteSubCategory: builder.mutation({
      query: ({ id, department }) => ({
        url: `/sub-category/${id}`,
        method: "DELETE",
        params: {
          department: department,
        },
      }),
      invalidatesTags: ["SubCategory"],
    }),
    getSubCategoryByDepartmentId: builder.query({
      query: (id) => `/sub-category/department/${id}`,
      providesTags: ["SubCategory"],
    }),
    getSubCategoryById: builder.query({
      query: (id) => `/sub-category/${id}`,
      providesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useGetSubCategoryQuery,
  usePostSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSubCategoryByDepartmentIdQuery,
  useGetSubCategoryByIdQuery,
} = subcategoryApi;
