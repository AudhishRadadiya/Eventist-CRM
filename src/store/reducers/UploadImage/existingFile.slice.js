import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  existingFileLoading: false,
  isExistingFileUpdated: false,
};

export const existingFileSlice = createSlice({
  name: 'existingFile',
  initialState,
  reducers: {
    setExistingFileLoading: (state, action) => {
      state.existingFileLoading = action.payload;
    },
    setIsExistingFileUpdated: (state, action) => {
      state.isExistingFileUpdated = action.payload;
    },
    setExistingFileDetail: (state, action) => {
      state.productCategoryDetail = action.payload;
    },
  },
  extraReducers: {},
});

export const {
  setExistingFileLoading,
  setIsExistingFileUpdated,
  setExistingFileDetail,
} = existingFileSlice.actions;

export default existingFileSlice.reducer;
