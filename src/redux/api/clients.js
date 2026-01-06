import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const clientsApi = createApi({
  reducerPath: "clients",
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
  tagTypes: ["Clients"],
  endpoints: (builder) => ({
    getClients: builder.query({
      query: () => "/clients",
      providesTags: ["Clients"],
    }),
    postClients: builder.mutation({
      query: (clientsData) => ({
        url: "/clients",
        method: "POST",
        body: clientsData,
      }),
      invalidatesTags: ["Clients"],
    }),
    updateClients: builder.mutation({
      query: ({ id, ...clientsData }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: clientsData,
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteClients: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  usePostClientsMutation,
  useUpdateClientsMutation,
  useDeleteClientsMutation,
} = clientsApi;
