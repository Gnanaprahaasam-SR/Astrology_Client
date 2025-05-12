import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null, // Will hold user info like { id, name, email, token }
    isAuthenticated: false,
    loading: false,
    error: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.user = action.payload; // User info from login response
            state.isAuthenticated = true;
            state.loading = false;
        },
        loginFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;

export default userSlice.reducer;