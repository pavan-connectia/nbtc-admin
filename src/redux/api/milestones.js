import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const milestonesApi = createApi({
  reducerPath: "milestones",
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
  tagTypes: ["Milestones"],
  endpoints: (builder) => ({
    getMilestones: builder.query({
      query: () => "/milestones",
      providesTags: ["Milestones"],
    }),
    postMilestones: builder.mutation({
      query: (milestonesData) => ({
        url: "/milestones",
        method: "POST",
        body: milestonesData,
      }),
      invalidatesTags: ["Milestones"],
    }),
    updateMilestones: builder.mutation({
      query: ({ id, ...milestonesData }) => ({
        url: `/milestones/${id}`,
        method: "PATCH",
        body: milestonesData,
      }),
      invalidatesTags: ["Milestones"],
    }),
    deleteMilestones: builder.mutation({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Milestones"],
    }),
  }),
});

export const {
  useGetMilestonesQuery,
  usePostMilestonesMutation,
  useUpdateMilestonesMutation,
  useDeleteMilestonesMutation,
} = milestonesApi;
