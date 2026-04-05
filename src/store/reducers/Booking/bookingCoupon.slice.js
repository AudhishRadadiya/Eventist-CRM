import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  bookingCouponList: [],
  bookingCouponLoading: false,
  isBookingCouponUpdated: false,
  bookingCouponDetail: {},
};

export const getBookingCouponListData = createAsyncThunk(
  'admin/get-booking-coupon-list',
  ({ _id }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking_coupon/list/${_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
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
          // dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const updateBookingCoupon = createAsyncThunk(
  'admin/update-booking-coupon',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, bookingCoupon } = props;
      axios
        .put(`admin/booking_coupon/update/${_id}`, bookingCoupon)
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

export const createBookingCoupon = createAsyncThunk(
  'admin/create-booking-coupon',
  (bookingCoupon, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/booking_coupon/create', bookingCoupon)
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

export const processCoupon = createAsyncThunk(
  'admin/process-coupon-api',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/booking_coupon/process_coupon', booking_id)
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

export const deleteBookingCoupon = createAsyncThunk(
  'admin/booking_coupon',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`admin/booking_coupon/${_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res?.data)?.length > 0) {
              resolve(res?.data);
              dispatch(
                showMessage({ message: res.data.msg, varient: 'success' }),
              );
            } else {
              resolve([]);
            }
          } else {
            dispatch(showMessage({ message: res?.data?.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error?.response?.data?.msg }));
          reject(error);
        });
    });
  },
);

export const bookingCouponSlice = createSlice({
  name: 'booking_coupon',
  initialState,
  reducers: {
    setBookingCouponLoading: (state, action) => {
      state.bookingCouponLoading = action.payload;
    },
    setIsBookingCouponUpdated: (state, action) => {
      state.isBookingCouponUpdated = action.payload;
    },
    setBookingCouponDetail: (state, action) => {
      state.bookingCouponDetail = action.payload;
    },
  },
  extraReducers: {
    [getBookingCouponListData.fulfilled]: (state, action) => {
      state.bookingCouponList = action.payload || [];
    },
    [updateBookingCoupon.pending]: state => {
      state.isBookingCouponUpdated = false;
      state.bookingCouponLoading = true;
    },
    [updateBookingCoupon.rejected]: state => {
      state.isBookingCouponUpdated = false;
      state.bookingCouponLoading = false;
    },
    [updateBookingCoupon.fulfilled]: state => {
      state.isBookingCouponUpdated = true;
      state.bookingCouponLoading = false;
    },
    [createBookingCoupon.pending]: state => {
      state.isBookingCouponUpdated = false;
      state.bookingCouponLoading = true;
    },
    [createBookingCoupon.rejected]: state => {
      state.isBookingCouponUpdated = false;
      state.bookingCouponLoading = false;
    },
    [createBookingCoupon.fulfilled]: state => {
      state.isBookingCouponUpdated = true;
      state.bookingCouponLoading = false;
    },
    [processCoupon.pending]: state => {
      state.bookingCouponLoading = true;
    },
    [processCoupon.rejected]: state => {
      state.bookingCouponLoading = false;
    },
    [processCoupon.fulfilled]: state => {
      state.bookingCouponLoading = false;
    },
    [deleteBookingCoupon.pending]: state => {
      state.isBookingCouponUpdated = false;
      state.bookingCouponLoading = true;
    },
    [deleteBookingCoupon.rejected]: state => {
      state.isBookingCouponUpdated = false;
      state.bookingCouponLoading = false;
    },
    [deleteBookingCoupon.fulfilled]: state => {
      state.isBookingCouponUpdated = true;
      state.bookingCouponLoading = false;
    },
  },
});

export const {
  setBookingCouponLoading,
  setIsBookingCouponUpdated,
  setBookingCouponDetail,
} = bookingCouponSlice.actions;

export default bookingCouponSlice.reducer;
