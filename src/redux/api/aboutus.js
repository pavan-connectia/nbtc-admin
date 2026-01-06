import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aboutusApi = createApi({
  reducerPath: "aboutus",
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
  tagTypes: ["Aboutus"],
  endpoints: (builder) => ({
    getAboutus: builder.query({
      query: () => "/aboutus",
      providesTags: ["Aboutus"],
    }),
    updateAboutus: builder.mutation({
      query: ({ id, ...aboutusData }) => ({
        url: `/aboutus/${id}`,
        method: "PATCH",
        body: aboutusData,
      }),
      invalidatesTags: ["Aboutus"],
    }),
  }),
});

export const { useGetAboutusQuery, useUpdateAboutusMutation } = aboutusApi;
