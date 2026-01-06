import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const homeDeptApi = createApi({
  reducerPath: "homeDept",
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
  tagTypes: ["HomeDept"],
  endpoints: (builder) => ({
    getHomeDeptById: builder.query({
      query: (id) => `/home-department/${id}`,
      providesTags: ["HomeDept"],
    }),
    updateHomeDept: builder.mutation({
      query: ({ id, ...homeDeptData }) => ({
        url: `/home-department/${id}`,
        method: "PATCH",
        body: homeDeptData,
      }),
      invalidatesTags: ["HomeDept"],
    }),
  }),
});

export const { useGetHomeDeptByIdQuery, useUpdateHomeDeptMutation } =
  homeDeptApi;
