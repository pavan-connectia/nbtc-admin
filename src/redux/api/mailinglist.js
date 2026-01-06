import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mailinglistApi = createApi({
  reducerPath: "mailinglist",
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
  tagTypes: ["MailingList"],
  endpoints: (builder) => ({
    getMailingList: builder.query({
      query: () => "/mailinglist",
      providesTags: ["MailingList"],
    }),
    postMailingList: builder.mutation({
      query: (mailinglistData) => ({
        url: "/mailinglist",
        method: "POST",
        body: mailinglistData,
      }),
      invalidatesTags: ["MailingList"],
    }),
    updateMailingList: builder.mutation({
      query: ({ id, ...mailinglistData }) => ({
        url: `/mailinglist/${id}`,
        method: "PATCH",
        body: mailinglistData,
      }),
      invalidatesTags: ["MailingList"],
    }),
    deleteMailingList: builder.mutation({
      query: (id) => ({
        url: `/mailinglist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MailingList"],
    }),
  }),
});

export const {
  useGetMailingListQuery,
  usePostMailingListMutation,
  useUpdateMailingListMutation,
  useDeleteMailingListMutation,
} = mailinglistApi;
