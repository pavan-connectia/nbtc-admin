import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supportServiceApi = createApi({
  reducerPath: "supportService",
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
  tagTypes: ["SupportService"],
  endpoints: (builder) => ({
    getSupportService: builder.query({
      query: () => "/support-service",
      providesTags: ["SupportService"],
    }),
    updateSupportService: builder.mutation({
      query: ({ id, ...supportServiceData }) => ({
        url: `/support-service/${id}`,
        method: "PATCH",
        body: supportServiceData,
      }),
      invalidatesTags: ["SupportService"],
    }),
  }),
});

export const { useGetSupportServiceQuery, useUpdateSupportServiceMutation } =
  supportServiceApi;
