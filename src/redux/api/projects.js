import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
  reducerPath: "projects",
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
  tagTypes: ["Projects"],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    getProjectsByDepartmentId: builder.query({
      query: (id) => `/projects/department/${id}`,
      providesTags: ["Projects"],
    }),
    postProjects: builder.mutation({
      query: (projectsData) => ({
        url: "/projects",
        method: "POST",
        body: projectsData,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProjects: builder.mutation({
      query: ({ id, ...projectsData }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: projectsData,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProjects: builder.mutation({
      query: ({ id }) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  usePostProjectsMutation,
  useUpdateProjectsMutation,
  useDeleteProjectsMutation,
  useGetProjectsByDepartmentIdQuery,
} = projectsApi;
