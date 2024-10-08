import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    location : ""
};

const LocationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            // console.log(action.payload,"ffsdf");
            
            state.location = action.payload;
          
        },
    },
});

export const {
    setLocation
} = LocationSlice.actions;

export default LocationSlice.reducer;
