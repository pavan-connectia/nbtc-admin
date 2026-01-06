import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const eventApi = createApi({
  reducerPath: "event",
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
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    postEvent: builder.mutation({
      query: (eventData) => ({
        url: "/event",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["Event"],
    }),
    getEvent: builder.query({
      query: () => "/event",
      providesTags: ["Event"],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `/event/${id}`,
        method: "PATCH",
        body: eventData,
      }),
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation({
      query: ({ id }) => ({
        url: `/event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  usePostEventMutation,
  useGetEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
