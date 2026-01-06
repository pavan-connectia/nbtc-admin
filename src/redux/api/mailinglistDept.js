import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mailinglistDeptApi = createApi({
  reducerPath: "mailinglistDept",
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
  tagTypes: ["mailinglistDept"],
  endpoints: (builder) => ({
    getMailingListDept: builder.query({
      query: (id) => `/mailinglist-department/department/${id}`,
      providesTags: ["mailinglistDept"],
    }),
    postMailingListDept: builder.mutation({
      query: (mailinglistData) => ({
        url: "/mailinglist-department",
        method: "POST",
        body: mailinglistData,
      }),
      invalidatesTags: ["mailinglistDept"],
    }),
    updateMailingListDept: builder.mutation({
      query: ({ id, ...mailinglistData }) => ({
        url: `/mailinglist-department/${id}`,
        method: "PATCH",
        body: mailinglistData,
      }),
      invalidatesTags: ["mailinglistDept"],
    }),
    deleteMailingListDept: builder.mutation({
      query: (id) => ({
        url: `/mailinglist-department/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["mailinglistDept"],
    }),
  }),
});

export const {
  useGetMailingListDeptQuery,
  usePostMailingListDeptMutation,
  useUpdateMailingListDeptMutation,
  useDeleteMailingListDeptMutation,
} = mailinglistDeptApi;
