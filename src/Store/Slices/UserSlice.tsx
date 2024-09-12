import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username : "",
    userid : "",
};

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload;
        },
    },
});

export const {
    setUser
} = UserSlice.actions;

export default UserSlice.reducer;
