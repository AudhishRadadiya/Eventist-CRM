import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  bookingCartList: [],
  bookingCartLoading: false,
};

export const bookingCart = createAsyncThunk(
  'admin/booking-cart/list',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      let res = {
        show_all: true, // set true if dev else false if staging
        // is_booked: true,
        // is_send: true,
      };
      axios
        .post('admin/booking_cart/list', res)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve(res.data.data);
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

export const bookingCartSlice = createSlice({
  name: 'booking_coupon',
  initialState,
  reducers: {},
  extraReducers: {
    [bookingCart.pending]: state => {
      state.bookingCartLoading = true;
    },
    [bookingCart.rejected]: state => {
      state.bookingCartList = [];
      state.bookingCartLoading = false;
    },
    [bookingCart.fulfilled]: (state, action) => {
      state.bookingCartList = action.payload || [];
      state.bookingCartLoading = false;
    },
  },
});

export const {} = bookingCartSlice.actions;

export default bookingCartSlice.reducer;
