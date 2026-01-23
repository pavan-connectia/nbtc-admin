import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const departmentLoginApi = createApi({
  reducerPath: "departmentLoginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["DepartmentLogin"],
  endpoints: (builder) => ({

    getAllDepartmentLogins: builder.query({
      query: () => "/loginURL",
      providesTags: ["DepartmentLogin"],
    }),

    addDepartmentLogin: builder.mutation({
      query: (payload) => ({
        url: "/loginURL",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DepartmentLogin"],
    }),

    updateDepartmentLogin: builder.mutation({
      query: (payload) => ({
        url: "/loginURL",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["DepartmentLogin"],
    }),
  }),
});

export const {
  useGetAllDepartmentLoginsQuery,
  useAddDepartmentLoginMutation,
  useUpdateDepartmentLoginMutation,
} = departmentLoginApi;
