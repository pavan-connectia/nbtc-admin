import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serviceApi = createApi({
  reducerPath: "service",
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
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getService: builder.query({
      query: () => "/service",
      providesTags: ["Service"],
    }),
    getServiceByDepartmentId: builder.query({
      query: (id) => `/service/department/${id}`,
      providesTags: ["Service"],
    }),
    postService: builder.mutation({
      query: (serviceData) => ({
        url: "/service",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...serviceData }) => ({
        url: `/service/${id}`,
        method: "PATCH",
        body: serviceData,
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation({
      query: ({ id }) => ({
        url: `/service/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useGetServiceQuery,
  usePostServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceByDepartmentIdQuery,
} = serviceApi;
