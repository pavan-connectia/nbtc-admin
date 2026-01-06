import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const milestonesDeptApi = createApi({
  reducerPath: "milestonesDept",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["MilestonesDept"],
  endpoints: (builder) => ({
    getMilestonesDeptById: builder.query({
      query: (departmentId) =>
        `/milestones-department/department/${departmentId}`,
      providesTags: ["MilestonesDept"],
    }),

    postMilestonesDept: builder.mutation({
      query: (milestonesData) => ({
        url: "/milestones-department",
        method: "POST",
        body: milestonesData,
      }),
      invalidatesTags: ["MilestonesDept"],
    }),

    updateMilestonesDept: builder.mutation({
      query: ({ id, ...milestonesData }) => ({
        url: `/milestones-department/${id}`,
        method: "PATCH",
        body: milestonesData,
      }),
      invalidatesTags: ["MilestonesDept"],
    }),

    deleteMilestonesDept: builder.mutation({
      query: (id) => ({
        url: `/milestones-department/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MilestonesDept"],
    }),
  }),
});

export const {
  useGetMilestonesDeptByIdQuery,
  usePostMilestonesDeptMutation,
  useUpdateMilestonesDeptMutation,
  useDeleteMilestonesDeptMutation,
} = milestonesDeptApi;
