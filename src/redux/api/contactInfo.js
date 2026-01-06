import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactInfoApi = createApi({
  reducerPath: "contactInfo",
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
  tagTypes: ["ContactInfo"],
  endpoints: (builder) => ({
    getContactInfo: builder.query({
      query: () => "/contact/contact-info",
      providesTags: ["ContactInfo"],
    }),
    getContactInfoById: builder.query({
      query: (id) => `/contact/contact-info/${id}`,
      providesTags: ["ContactInfo"],
    }),
    postContactInfo: builder.mutation({
      query: (contactInfoData) => ({
        url: "/contact/contact-info",
        method: "POST",
        body: contactInfoData,
      }),
      invalidatesTags: ["ContactInfo"],
    }),
    updateContactInfo: builder.mutation({
      query: ({ id, ...contactInfoData }) => ({
        url: `/contact/contact-info/${id}`,
        method: "PATCH",
        body: contactInfoData,
      }),
      invalidatesTags: ["ContactInfo"],
    }),
    deleteContactInfo: builder.mutation({
      query: (id) => ({
        url: `/contact/contact-info/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContactInfo"],
    }),
  }),
});

export const {
  useGetContactInfoQuery,
  useGetContactInfoByIdQuery,
  usePostContactInfoMutation,
  useUpdateContactInfoMutation,
  useDeleteContactInfoMutation,
} = contactInfoApi;
