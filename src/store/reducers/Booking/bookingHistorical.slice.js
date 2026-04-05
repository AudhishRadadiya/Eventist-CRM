import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  bookingHistoricalData: {},
  bookingHistoricalLoading: false,
};

export const getHistoricalData = createAsyncThunk(
  'admin/historic_booking',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/historic_booking/${data}`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
              resolve(res.data?.data);
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

export const bookingHistoricalSlice = createSlice({
  name: 'booking_historical',
  initialState,
  reducers: {},
  extraReducers: {
    [getHistoricalData.pending]: state => {
      state.bookingHistoricalLoading = true;
    },
    [getHistoricalData.rejected]: state => {
      state.bookingHistoricalData = {};
      state.bookingHistoricalLoading = false;
    },
    [getHistoricalData.fulfilled]: (state, action) => {
      state.bookingHistoricalData = action.payload;
      state.bookingHistoricalLoading = false;
    },
  },
});

export default bookingHistoricalSlice.reducer;
