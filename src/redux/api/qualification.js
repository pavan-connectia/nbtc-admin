import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qualificationApi = createApi({
  reducerPath: "qualification",
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
  tagTypes: ["Qualification"],
  endpoints: (builder) => ({
    getQualification: builder.query({
      query: () => "/qualification",
      providesTags: ["Qualification"],
    }),
    postQualification: builder.mutation({
      query: (qualificationData) => ({
        url: "/qualification",
        method: "POST",
        body: qualificationData,
      }),
      invalidatesTags: ["Qualification"],
    }),
    updateQualification: builder.mutation({
      query: ({ id, ...qualificationData }) => ({
        url: `/qualification/${id}`,
        method: "PATCH",
        body: qualificationData,
      }),
      invalidatesTags: ["Qualification"],
    }),
    deleteQualification: builder.mutation({
      query: (id) => ({
        url: `/qualification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Qualification"],
    }),
  }),
});

export const {
  useGetQualificationQuery,
  usePostQualificationMutation,
  useUpdateQualificationMutation,
  useDeleteQualificationMutation,
} = qualificationApi;
