import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactFormApi = createApi({
  reducerPath: "contactForm",
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
  tagTypes: ["ContactForm"],
  endpoints: (builder) => ({
    getContactForm: builder.query({
      query: () => "/contact/contact-form",
      providesTags: ["ContactForm"],
    }),
    deleteContactForm: builder.mutation({
      query: (id) => ({
        url: `/contact/contact-form/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContactForm"],
    }),
  }),
});

export const { useGetContactFormQuery, useDeleteContactFormMutation } =
  contactFormApi;
