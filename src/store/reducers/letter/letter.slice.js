import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../common.slice';
import axios from 'axios';

const initialState = {
  letterLoading: false,
  letterListLoading: false,
  isLetterUpdated: false,
};

export const createLetter = createAsyncThunk(
  'admin/create-letter',
  (letter, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/letter_tamplate/create', letter)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve(res.data);
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const letterSlice = createSlice({
  name: 'letter',
  initialState,
  reducers: {
    setLetterLoading: (state, action) => {
      state.letterLoading = action.payload;
    },
    setIsletterUpdated: (state, action) => {
      state.isLetterUpdated = action.payload;
    },
  },
  extraReducers: {
    [createLetter.pending]: state => {
      state.isLetterUpdated = false;
      state.letterListLoading = true;
    },
    [createLetter.rejected]: state => {
      state.isLetterUpdated = false;
      state.letterListLoading = false;
    },
    [createLetter.fulfilled]: state => {
      state.isletterUpdated = true;
      state.letterListLoading = false;
    },
  },
});

export const { setLetterLoading, setIsLetterUpdate } = letterSlice.actions;

export default letterSlice.reducer;
