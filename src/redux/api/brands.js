import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandsApi = createApi({
  reducerPath: "brands",
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
  tagTypes: ["Brands"],
  endpoints: (builder) => ({
    getBrandsByDeptId: builder.query({
      query: (id) => ({
        url: `/brands/department/${id}`,
      }),
      providesTags: ["Brands"],
    }),
    getBrands: builder.query({
      query: () => "/brands",
      providesTags: ["Brands"],
    }),
    getBrandById: builder.query({
      query: (id) => `/brands/${id}`,
      providesTags: ["Brands"],
    }),
    postBrands: builder.mutation({
      query: (brandsData) => ({
        url: "/brands",
        method: "POST",
        body: brandsData,
      }),
      invalidatesTags: ["Brands"],
    }),
    updateBrands: builder.mutation({
      query: ({ id, ...brandsData }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        body: brandsData,
      }),
      invalidatesTags: ["Brands"],
    }),
    deleteBrands: builder.mutation({
      query: ({ id, department }) => ({
        url: `/brands/${id}`,
        method: "DELETE",
        params: {
          department: department,
        },
      }),
      invalidatesTags: ["Brands"],
    }),
  }),
});

export const {
  useGetBrandsByDeptIdQuery,
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  usePostBrandsMutation,
  useUpdateBrandsMutation,
  useDeleteBrandsMutation,
} = brandsApi;
