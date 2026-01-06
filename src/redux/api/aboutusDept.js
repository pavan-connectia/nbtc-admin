import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aboutusDeptApi = createApi({
  reducerPath: "aboutusDept",
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
  tagTypes: ["AboutusDept"],
  endpoints: (builder) => ({
    getAboutusDept: builder.query({
      query: (id) => `/aboutus-department/${id}`,
      providesTags: ["AboutusDept"],
    }),
    updateAboutusDept: builder.mutation({
      query: ({ id, ...aboutusData }) => ({
        url: `/aboutus-department/${id}`,
        method: "PATCH",
        body: aboutusData,
      }),
      invalidatesTags: ["AboutusDept"],
    }),
  }),
});

export const { useGetAboutusDeptQuery, useUpdateAboutusDeptMutation } =
  aboutusDeptApi;
