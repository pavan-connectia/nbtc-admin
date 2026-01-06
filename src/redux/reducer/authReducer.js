import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  role: null,
  department: null,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.department = action.payload.department;
    },
    logout: (state) => {
      state.role = null;
      state.token = null;
      state.department = null;
    },
  },
});

export const { login, logout } = authReducer.actions;
export default authReducer.reducer;
