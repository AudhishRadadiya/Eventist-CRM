import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  messageOptions: 'success added',
  varient: 'success',
  showMessage: false,
  errorMassage: [],
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    showMessage: (state, action) => {
      state.message = action.payload.message;
      state.varient = action.payload.varient;
      state.showMessage = true;
    },
    hideMessage: (state, action) => {
      state.showMessage = false;
    },
    seterrorMassage: (state, action) => {
      state.errorMassage = action.payload.message.errorMessages;
    },
  },
  extraReducers: {},
});
export const { showMessage, hideMessage, seterrorMassage } =
  commonSlice.actions;
export default commonSlice.reducer;
