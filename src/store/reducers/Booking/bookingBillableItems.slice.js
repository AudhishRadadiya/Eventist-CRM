import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { seterrorMassage, showMessage } from '../common.slice';

const initialState = {
  bookingBillableItemsList: [],
  bookingBillableItemsLoading: false,
  isBookingBillableItemsUpdated: false,
  bookingBillableItemsDetail: {},
};

export const getBookingBillableItemsListData = createAsyncThunk(
  'admin/get-booking-billable-items-list',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${booking_id}/billable_items`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            reject();
          }
        })
        .catch(error => {
          reject(error);
          dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const updateBookingBillableItems = createAsyncThunk(
  'admin/update-booking-billable-items',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { bookingId, booking } = props;
      axios
        .put(`admin/booking/${bookingId}/billable_items`, booking)
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
          dispatch(
            seterrorMassage({
              // message: `${
              //   error.response.data.msg?.msg
              // }\n${error.response.data.msg?.errorMessages?.join('\n')}`,
              message: error.response.data.msg,
            }),
          );
          reject(error);
        });
    });
  },
);

export const bookingBillableItemsSlice = createSlice({
  name: 'booking_billableItems',
  initialState,
  reducers: {
    setBookingBillableItemsLoading: (state, action) => {
      state.bookingBillableItemsLoading = action.payload;
    },
    setIsBookingBillableItemsUpdated: (state, action) => {
      state.isBookingBillableItemsUpdated = action.payload;
    },
    setBookingBillableItemsDetail: (state, action) => {
      state.bookingBillableItemsDetail = action.payload;
    },
  },
  extraReducers: {
    [getBookingBillableItemsListData.pending]: state => {
      state.bookingBillableItemsLoading = true;
    },
    [getBookingBillableItemsListData.rejected]: state => {
      state.bookingBillableItemsList = [];
      state.bookingBillableItemsLoading = false;
    },
    [getBookingBillableItemsListData.fulfilled]: (state, action) => {
      state.bookingBillableItemsList = action.payload || [];
      state.bookingBillableItemsLoading = false;
    },
    [updateBookingBillableItems.pending]: state => {
      state.isBookingBillableItemsUpdated = false;
      state.bookingBillableItemsLoading = true;
    },
    [updateBookingBillableItems.rejected]: state => {
      state.isBookingBillableItemsUpdated = false;
      state.bookingBillableItemsLoading = false;
    },
    [updateBookingBillableItems.fulfilled]: state => {
      state.isBookingBillableItemsUpdated = true;
      state.bookingBillableItemsLoading = false;
    },
  },
});

export const {
  setBookingBillableItemsLoading,
  setIsBookingBillableItemsUpdated,
  setBookingBillableItemsDetail,
} = bookingBillableItemsSlice.actions;

export default bookingBillableItemsSlice.reducer;
