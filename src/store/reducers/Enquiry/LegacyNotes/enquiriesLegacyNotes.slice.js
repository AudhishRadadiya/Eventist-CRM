import axios from 'axios';
import { showMessage } from 'store/reducers/common.slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  emailLegacyNotesList: [],
  enquiriesLegacyNotesLoading: false,
};

export const getEmailListData = createAsyncThunk(
  'admin/get-email-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/email/list', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
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

export const enquiriesLegacyNotesSlice = createSlice({
  name: 'enquiries_legacyNotes',
  initialState,
  reducers: {
    setEnquiriesLegacyNotesLoading: (state, action) => {
      state.enquiriesLegacyNotesLoading = action.payload;
    },
  },
  extraReducers: {
    [getEmailListData.pending]: state => {
      state.enquiriesLegacyNotesLoading = true;
    },
    [getEmailListData.rejected]: state => {
      state.emailLegacyNotesList = [];
      state.enquiriesLegacyNotesLoading = false;
    },
    [getEmailListData.fulfilled]: (state, action) => {
      state.emailLegacyNotesList = action.payload || [];
      state.enquiriesLegacyNotesLoading = false;
    },
  },
});

export const { setEnquiriesLegacyNotesLoading } =
  enquiriesLegacyNotesSlice.actions;

export default enquiriesLegacyNotesSlice.reducer;
