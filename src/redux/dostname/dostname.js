import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  id: ''
};

export const dostnameSlice = createSlice({
  name: 'dostname',
  initialState,
  reducers: {
    updatename: (state, action) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
    },
  },
});

export const { updatename } = dostnameSlice.actions;
export const dostnameReducer = dostnameSlice.reducer;
