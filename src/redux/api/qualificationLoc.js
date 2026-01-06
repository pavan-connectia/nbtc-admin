import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qualificationLocApi = createApi({
  reducerPath: "qualificationLoc",
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
  tagTypes: ["QualificationLoc"],
  endpoints: (builder) => ({
    getQualificationLoc: builder.query({
      query: () => "/qualification-loc",
      providesTags: ["QualificationLoc"],
    }),
    postQualificationLoc: builder.mutation({
      query: (qualificationLocData) => ({
        url: "/qualification-loc",
        method: "POST",
        body: qualificationLocData,
      }),
      invalidatesTags: ["QualificationLoc"],
    }),
    updateQualificationLoc: builder.mutation({
      query: ({ id, ...qualificationLocData }) => ({
        url: `/qualification-loc/${id}`,
        method: "PATCH",
        body: qualificationLocData,
      }),
      invalidatesTags: ["QualificationLoc"],
    }),
  }),
});

export const {
  useGetQualificationLocQuery,
  usePostQualificationLocMutation,
  useUpdateQualificationLocMutation,
} = qualificationLocApi;
