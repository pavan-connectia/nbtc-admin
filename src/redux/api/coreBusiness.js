import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const coreBusinessApi = createApi({
  reducerPath: "coreBusiness",
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
  tagTypes: ["CoreBusiness"],
  endpoints: (builder) => ({
    getCoreBusiness: builder.query({
      query: () => "/core-business",
      providesTags: ["CoreBusiness"],
    }),
    getCoreBusinessOptions: builder.query({
      query: () => "/core-business/navbar",
      providesTags: ["CoreBusiness"],
    }),
    getCoreBusinessById: builder.query({
      query: (id) => `/core-business/${id}`,
      providesTags: ["CoreBusiness"],
    }),
    postCoreBusiness: builder.mutation({
      query: (coreBusinessData) => ({
        url: "/core-business",
        method: "POST",
        body: coreBusinessData,
      }),
      invalidatesTags: ["CoreBusiness"],
    }),
    updateCoreBusiness: builder.mutation({
      query: ({ id, department, ...coreBusinessData }) => ({
        url: `/core-business/${id}`,
        method: "PATCH",
        body: coreBusinessData,
        params: {
          department: department,
        },
      }),
      invalidatesTags: ["CoreBusiness"],
    }),
    deleteCoreBusiness: builder.mutation({
      query: ({ id, department, role }) => ({
        url: `/core-business/${id}`,
        method: "DELETE",
        params: {
          department: department,
        },
      }),
      invalidatesTags: ["CoreBusiness"],
    }),
  }),
});

export const {
  useGetCoreBusinessQuery,
  useGetCoreBusinessOptionsQuery,
  useGetCoreBusinessByIdQuery,
  usePostCoreBusinessMutation,
  useUpdateCoreBusinessMutation,
  useDeleteCoreBusinessMutation,
} = coreBusinessApi;
