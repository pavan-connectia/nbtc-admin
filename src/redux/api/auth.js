import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/user",
      providesTags: ["User"],
    }),
    getUserByDepartment: builder.query({
      query: () => "/user/department",
      providesTags: ["User"],
    }),
    login: builder.mutation({
      query: (formData) => ({
        url: "/user/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/user/forgot-password",
        method: "POST",
        body: email,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/user/reset-password/${token}`,
        method: "PUT",
        body: { password },
      }),
    }),
    createUser: builder.mutation({
      query: (formData) => ({
        url: "/user/create-user",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/user/update-user/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    getUserByToken: builder.query({
      query: () => `/user/token`,
      invalidatesTags: ["User"],
    }),
    updateUserByToken: builder.mutation({
      query: (formData) => ({
        url: `/user/token`,
        body: formData,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useGetUserByDepartmentQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByTokenQuery,
  useUpdateUserByTokenMutation,
} = authApi;
