import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  bookingPayment: [],
  bookingPaymentLoading: false,
  isBookingPaymentUpdated: false,
  bookingPaymentDetail: {},
  bookingPaymentInfoData: {},
};

export const getBookingPaymentList = createAsyncThunk(
  'admin/get-booking-payment-list-da',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${booking_id}/payment`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const updateBookingPayment = createAsyncThunk(
  'admin/update-booking-payment',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { booking_id, payment_id, value } = props;
      axios
        .put(`admin/booking/${booking_id}/payment/${payment_id}`, value)
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

export const updateBookingPaymentReverse = createAsyncThunk(
  'admin/update-booking-payment-reverse',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { booking_id, payment_id, value } = props;
      axios
        // .put(`admin/booking/${booking_id}/payment/${payment_id}`, value)
        .post(
          `admin/booking/${booking_id}/payment/${payment_id}/reverse`,
          value,
        )
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

export const getBookingPaymentData = createAsyncThunk(
  'admin/get-booking-payment-data',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { booking_id, payment_id } = props;
      axios
        .get(`admin/booking/${booking_id}/payment/${payment_id}`)
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
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const createBookingPayment = createAsyncThunk(
  'admin/create-booking-payment',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { booking_id, values } = props;
      axios
        .post(`admin/booking/${booking_id}/payment`, values)
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

export const bookingPaymentInfo = createAsyncThunk(
  'admin/booking-payment-info',
  (id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${id}/payment_info`)
        .then(res => {
          if (res.data.err === 0) resolve(res.data.data);
          else {
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

export const bookingPaymentSlice = createSlice({
  name: 'booking_payment',
  initialState,
  reducers: {
    setBookingPayment: (state, action) => {
      state.bookingPayment = action.payload;
    },
    setIsBookingPayment: (state, action) => {
      state.isBookingPaymentUpdated = action.payload;
    },
    setBookingPaymentDetails: (state, action) => {
      state.bookingPaymentDetail = action.payload;
    },
  },
  extraReducers: {
    [getBookingPaymentList.pending]: state => {
      state.bookingPaymentLoading = true;
    },
    [getBookingPaymentList.rejected]: state => {
      state.bookingPayment = [];
      state.bookingPaymentLoading = false;
    },
    [getBookingPaymentList.fulfilled]: (state, action) => {
      state.bookingPayment = action.payload || [];
      state.bookingPaymentLoading = false;
    },
    [updateBookingPayment.pending]: state => {
      state.isBookingPaymentUpdated = false;
      state.bookingPaymentLoading = true;
    },
    [updateBookingPayment.rejected]: state => {
      state.isBookingPaymentUpdated = false;
      state.bookingPaymentLoading = false;
    },
    [updateBookingPayment.fulfilled]: state => {
      state.isBookingPaymentUpdated = true;
      state.bookingPaymentLoading = false;
    },
    [updateBookingPaymentReverse.pending]: state => {
      state.isBookingPaymentUpdated = false;
      state.bookingPaymentLoading = true;
    },
    [updateBookingPaymentReverse.rejected]: state => {
      state.isBookingPaymentUpdated = false;
      state.bookingPaymentLoading = false;
    },
    [updateBookingPaymentReverse.fulfilled]: state => {
      state.isBookingPaymentUpdated = true;
      state.bookingPaymentLoading = false;
    },
    [getBookingPaymentData.pending]: state => {
      state.bookingPaymentLoading = true;
      state.bookingPaymentDetail = {};
    },
    [getBookingPaymentData.rejected]: state => {
      state.bookingPaymentLoading = false;
      state.bookingPaymentDetail = {};
    },
    [getBookingPaymentData.fulfilled]: (state, action) => {
      state.bookingPaymentLoading = false;
      state.bookingPaymentDetail = action.payload;
    },
    [createBookingPayment.pending]: state => {
      state.isBookingPaymentUpdated = false;
      state.bookingPaymentLoading = true;
    },
    [createBookingPayment.rejected]: state => {
      state.isBookingPaymentUpdated = false;
      state.bookingPaymentLoading = false;
    },
    [createBookingPayment.fulfilled]: state => {
      state.isBookingPaymentUpdated = true;
      state.bookingPaymentLoading = false;
    },
    [bookingPaymentInfo.pending]: (state, action) => {
      state.bookingPaymentInfoData = {};
    },
    [bookingPaymentInfo.rejected]: (state, action) => {
      state.bookingPaymentInfoData = {};
    },
    [bookingPaymentInfo.fulfilled]: (state, action) => {
      state.bookingPaymentInfoData = action.payload;
    },
  },
});

export const {
  setBookingPayment,
  setIsBookingPayment,
  setBookingPaymentDetails,
} = bookingPaymentSlice.actions;

export default bookingPaymentSlice.reducer;
