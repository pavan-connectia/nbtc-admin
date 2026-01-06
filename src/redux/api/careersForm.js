import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const careersFormApi = createApi({
  reducerPath: "careersForm",
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
  tagTypes: ["CareersForm"],
  endpoints: (builder) => ({
    getCareersForm: builder.query({
      query: () => "/careers/-form",
      providesTags: ["CareersForm"],
    }),
    getCareersFormByDepartment: builder.query({
      query: (id) => `/careers/-form/department/${id}`,
      providesTags: ["CareersForm"],
    }),
    deleteCareersForm: builder.mutation({
      query: (id) => ({
        url: `/careers/-form/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CareersForm"],
    }),
  }),
});

export const {
  useGetCareersFormQuery,
  useGetCareersFormByDepartmentQuery,
  useDeleteCareersFormMutation,
} = careersFormApi;
