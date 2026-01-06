import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const homeApi = createApi({
  reducerPath: "home",
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
  tagTypes: ["Home"],
  endpoints: (builder) => ({
    getHome: builder.query({
      query: () => "/home",
      providesTags: ["Home"],
    }),
    updateHome: builder.mutation({
      query: ({ id, ...homeData }) => ({
        url: `/home/${id}`,
        method: "PATCH",
        body: homeData,
      }),
      invalidatesTags: ["Home"],
    }),
  }),
});

export const { useGetHomeQuery, useUpdateHomeMutation } = homeApi;
